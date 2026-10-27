/**
 * Assemble le site dans `docs/` à partir de `src/` : une mise en page commune
 * (`src/layout.mjs`), une feuille de style, les pages en français et en anglais.
 * Node 18 ou plus, aucune dépendance : `node build.mjs`.
 *
 * Une page = `src/pages/<lang>/<slug>.html`, qui commence par un bloc de métadonnées
 * (`<!-- clé: valeur … -->`), suivi du corps en HTML. Les pages françaises sortent à la
 * racine (`/cgu/`), les anglaises sous `/en/` (`/en/terms/`). Tous les liens sont relatifs,
 * le site marche à la racine d'un domaine comme sous un sous-dossier GitHub Pages.
 */
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import config from './site.config.mjs';
import { landing } from './src/landing.mjs';
import { layout } from './src/layout.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');
const OUT = join(ROOT, 'docs');

/** Les cinq pages, avec leur nom de fichier dans chaque langue (`home` = la landing). */
export const PAGES = [
  { key: 'home', fr: 'index', en: 'index' },
  { key: 'help', fr: 'aide', en: 'help' },
  { key: 'privacy', fr: 'confidentialite', en: 'privacy' },
  { key: 'terms', fr: 'cgu', en: 'terms' },
  { key: 'notice', fr: 'mentions-legales', en: 'legal-notice' },
];

/** Le chemin public d'une page (sans le domaine), avec la barre finale. */
function pathOf(lang, slug) {
  const dir = lang === 'fr' ? '' : 'en/';
  return slug === 'index' ? dir : `${dir}${slug}/`;
}

function parsePage(text) {
  const match = text.match(/^<!--([\s\S]*?)-->\s*/);
  if (!match) throw new Error('Page sans bloc de métadonnées');
  const meta = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^\s*([a-z]+):\s*(.*)$/);
    if (m) meta[m[1]] = m[2].trim();
  }
  return { meta, body: text.slice(match[0].length) };
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const APPLE =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>';

/** Le badge App Store de la landing : un lien dès que `appStoreUrl` est connu, sinon « Bientôt ». */
function storeBadge(lang) {
  const url = config.appStoreUrl;
  if (url) {
    const small = lang === 'fr' ? 'Télécharger dans l’' : 'Download on the';
    return `<a class="badge" href="${url}">${APPLE}<span class="t"><small>${small}</small><b>App Store</b></span></a>`;
  }
  const small = lang === 'fr' ? 'Bientôt sur l’' : 'Soon on the';
  return `<span class="badge soon-badge">${APPLE}<span class="t"><small>${small}</small><b>App Store</b></span></span>`;
}

/** Le sommaire, tiré des `<h2 id="…">` du corps. */
function tocOf(body) {
  const items = [];
  for (const m of body.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)) {
    items.push({ id: m[1], label: m[2].replace(/<[^>]+>/g, '') });
  }
  return items;
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(join(SRC, 'assets'), join(OUT, 'assets'), { recursive: true });
writeFileSync(join(OUT, '.nojekyll'), '');

let count = 0;
for (const lang of ['fr', 'en']) {
  const alt = lang === 'fr' ? 'en' : 'fr';
  for (const page of PAGES) {
    const slug = page[lang];
    const path = pathOf(lang, slug);
    const depth = path.split('/').filter(Boolean).length;
    const rel = '../'.repeat(depth);
    const { meta, body: raw } = parsePage(
      readFileSync(join(SRC, 'pages', lang, `${slug}.html`), 'utf8'),
    );
    const email = config.supportEmail;
    const soon = lang === 'fr' ? 'adresse à venir' : 'address coming soon';
    const links = Object.fromEntries(PAGES.map((p) => [p.key, rel + pathOf(lang, p[lang])]));
    const body = raw
      .replace(/\{\{link:(\w+)\}\}/g, (_, key) => {
        if (!links[key]) throw new Error(`Lien inconnu : ${key}`);
        return links[key];
      })
      .replace(/\{\{emailLink\}\}/g, () =>
        email
          ? `<a href="mailto:${email}">${escapeHtml(email)}</a>`
          : `<span class="soon">${soon}</span>`,
      )
      .replace(/\{\{email\}\}/g, () => (email ? escapeHtml(email) : soon))
      .replace(/\{\{publisher\}\}/g, escapeHtml(config.publisher))
      .replace(/\{\{app\}\}/g, escapeHtml(config.app))
      .replace(/\{\{updated\}\}/g, config.updated[lang])
      .replace(/\{\{site\}\}/g, config.baseUrl)
      .replace(/\{\{rel\}\}/g, rel)
      .replace(/\{\{badge\}\}/g, () => storeBadge(lang))
      .replace(/\{\{mailButton\}\}/g, () =>
        email
          ? `<a class="btn" href="mailto:${email}?subject=${encodeURIComponent(config.app)}">${lang === 'fr' ? 'Nous écrire' : 'Email us'}</a>`
          : `<span class="btn disabled" aria-disabled="true">${lang === 'fr' ? 'Nous écrire' : 'Email us'}</span>`,
      );
    const html = (meta.kind === 'landing' ? landing : layout)({
      lang,
      alt,
      rel,
      meta,
      body,
      toc: meta.kind === 'legal' ? tocOf(body) : [],
      links,
      altHref: rel + pathOf(alt, page[alt]),
      canonical: config.baseUrl + path,
      alternate: { fr: config.baseUrl + pathOf('fr', page.fr), en: config.baseUrl + pathOf('en', page.en) },
      current: page.key,
      email,
      config,
    });
    const file = join(OUT, path, 'index.html');
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html);
    count += 1;
  }
}

// Page 404 de GitHub Pages : la page d'aide, sans index.
const notFound = layout({
  lang: 'fr',
  alt: 'en',
  rel: config.baseUrl,
  meta: { title: 'Page introuvable', tag: '404', lead: 'Cette adresse ne mène nulle part. Les pages du site sont ci-dessous.', kind: 'support' },
  body: `<p><a class="btn" href="${config.baseUrl}">Retour à l'accueil</a> <a class="btn white" href="${config.baseUrl}aide/">Aide</a></p>`,
  toc: [],
  links: Object.fromEntries(PAGES.map((p) => [p.key, config.baseUrl + pathOf('fr', p.fr)])),
  altHref: config.baseUrl + 'en/',
  canonical: config.baseUrl + '404.html',
  alternate: null,
  current: null,
  email: config.supportEmail,
  config,
  robots: 'noindex',
});
writeFileSync(join(OUT, '404.html'), notFound);

// Domaine de GitHub Pages, et ce que Google doit trouver : chaque page avec sa traduction.
const { host } = new URL(config.baseUrl);
writeFileSync(join(OUT, 'CNAME'), `${host}\n`);
const urls = PAGES.flatMap((page) =>
  ['fr', 'en'].map((lang) => {
    const alternates = ['fr', 'en']
      .map(
        (l) =>
          `    <xhtml:link rel="alternate" hreflang="${l}" href="${config.baseUrl}${pathOf(l, page[l])}"/>`,
      )
      .join('\n');
    return `  <url>\n    <loc>${config.baseUrl}${pathOf(lang, page[lang])}</loc>\n${alternates}\n  </url>`;
  }),
);
writeFileSync(
  join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`,
);
writeFileSync(
  join(OUT, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${config.baseUrl}sitemap.xml\n`,
);

console.log(`${count} pages + 404, CNAME, sitemap et robots écrits dans docs/`);
