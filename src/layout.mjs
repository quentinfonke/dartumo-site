/** La coquille commune des pages : en-tête, bandeau titre, sommaire, corps, pied. */

const T = {
  fr: {
    nav: { help: 'Aide', privacy: 'Confidentialité', terms: 'CGU', notice: 'Mentions légales' },
    switchTo: 'English',
    switchTitle: 'Read this page in English',
    toc: 'Sommaire',
    updated: 'Mise à jour le',
    write: 'Nous écrire',
    footer: 'Site sans cookies ni mesure d’audience. Polices embarquées, aucune requête vers un tiers.',
    rights: 'Tous droits réservés.',
  },
  en: {
    nav: { help: 'Help', privacy: 'Privacy', terms: 'Terms', notice: 'Legal notice' },
    switchTo: 'Français',
    switchTitle: 'Lire cette page en français',
    toc: 'Contents',
    updated: 'Last updated',
    write: 'Email us',
    footer: 'No cookies, no analytics. Fonts are self-hosted: this site makes no third-party requests.',
    rights: 'All rights reserved.',
  },
};

export function layout(p) {
  const t = T[p.lang];
  const nav = Object.entries(t.nav)
    .map(
      ([key, label]) =>
        `<a href="${p.links[key]}"${key === p.current ? ' class="on" aria-current="page"' : ''}>${label}</a>`,
    )
    .join('');
  const toc = p.toc.length
    ? `<nav class="toc box" aria-label="${t.toc}"><p class="k">${t.toc}</p><ol>${p.toc
        .map((i) => `<li><a href="#${i.id}">${i.label}</a></li>`)
        .join('')}</ol></nav>`
    : '';
  const legal = p.meta.kind === 'legal';
  const updated = legal
    ? `<p class="sticker">${t.updated} ${p.config.updated[p.lang]}</p>`
    : '';
  const alternate = p.alternate
    ? `<link rel="alternate" hreflang="fr" href="${p.alternate.fr}">\n  <link rel="alternate" hreflang="en" href="${p.alternate.en}">\n  <link rel="alternate" hreflang="x-default" href="${p.alternate.fr}">`
    : '';
  const robots = p.robots ? `<meta name="robots" content="${p.robots}">` : '';
  const desc = (p.meta.description ?? p.meta.lead ?? '').replace(/"/g, '&quot;');
  const title = `${p.meta.title} · ${p.config.app}`;
  const mail = p.email
    ? `<a class="btn" href="mailto:${p.email}">${t.write}</a>`
    : `<span class="btn disabled" aria-disabled="true">${t.write}</span>`;

  return `<!doctype html>
<html lang="${p.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <meta name="color-scheme" content="light">
  <meta name="theme-color" content="#F7F5EF">
  <link rel="canonical" href="${p.canonical}">
  ${alternate}
  ${robots}
  <link rel="icon" type="image/svg+xml" href="${p.rel}assets/mascot.svg">
  <link rel="stylesheet" href="${p.rel}assets/style.css">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:type" content="website">
</head>
<body>
  <header class="top">
    <div class="wrap">
      <a class="brand" href="${p.links.home}"><img src="${p.rel}assets/mascot.svg" alt="" width="40" height="36">${p.config.app}</a>
      <nav class="nav" aria-label="Pages">${nav}</nav>
      <a class="lang" href="${p.altHref}" hreflang="${p.alt}" lang="${p.alt}" title="${t.switchTitle}">${t.switchTo}</a>
    </div>
  </header>

  <main class="wrap">
    <section class="hero">
      <p class="tag">${p.meta.tag ?? ''}</p>
      <h1>${p.meta.title}</h1>
      ${p.meta.lead ? `<p class="lead">${p.meta.lead}</p>` : ''}
      ${updated}
    </section>
    ${toc}
    ${legal ? `<article class="doc box">${p.body}</article>` : `<div class="support">${p.body}</div>`}
  </main>

  <footer>
    <div class="wrap">
      <p class="who">© ${p.config.year} ${p.config.publisher} · ${p.config.app}. ${t.rights}</p>
      <nav class="flinks" aria-label="Documents">${nav}</nav>
      <p class="note">${t.footer}</p>
      <div class="mail">${mail}</div>
    </div>
  </footer>
</body>
</html>
`;
}
