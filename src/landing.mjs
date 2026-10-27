/**
 * La coquille de la page d'accueil (landing) : bandeau d'annonce, en-tête avec les ancres
 * de la page, le corps (les sections, écrites dans `src/pages/<lang>/index.html`), le pied
 * à trois colonnes. Les pages de documents gardent `layout.mjs`.
 */

const T = {
  fr: {
    teaser: 'Psst… <strong>Dartumo</strong> arrive sur l’App Store · iPhone et iPad · gratuit',
    teaserLink: 'voir ce qu’il y a dedans',
    nav: [
      ['#dedans', 'Dedans'],
      ['#comment', 'Comment ça marche'],
      ['#bande', 'La bande'],
      ['help', 'Aide'],
    ],
    cta: 'Bientôt',
    ctaReady: 'Télécharger',
    switchTo: 'English',
    switchTitle: 'Read this page in English',
    tagline: 'L’entraînement aux fléchettes en petites unités, tous les jours.',
    cols: {
      explore: 'Explorer',
      docs: 'Documents',
      more: 'Et aussi',
    },
    explore: [
      ['#dedans', 'Ce qu’il y a dedans'],
      ['#comment', 'Comment ça marche'],
      ['#bande', 'La bande'],
      ['#apres', 'Ce qui arrive ensuite'],
    ],
    docs: [
      ['help', 'Aide et contact'],
      ['privacy', 'Confidentialité'],
      ['terms', 'Conditions d’utilisation'],
      ['notice', 'Mentions légales'],
    ],
    note: 'Site sans cookies ni mesure d’audience. Polices embarquées, aucune requête vers un tiers.',
    rights: 'Tous droits réservés.',
    made: 'Fait à la main, entre deux volées.',
  },
  en: {
    teaser: 'Psst… <strong>Dartumo</strong> is coming to the App Store · iPhone and iPad · free',
    teaserLink: 'see what’s inside',
    nav: [
      ['#inside', 'Inside'],
      ['#how', 'How it works'],
      ['#crew', 'The crew'],
      ['help', 'Help'],
    ],
    cta: 'Soon',
    ctaReady: 'Download',
    switchTo: 'Français',
    switchTitle: 'Lire cette page en français',
    tagline: 'Darts practice in small daily units.',
    cols: {
      explore: 'Explore',
      docs: 'Documents',
      more: 'Also',
    },
    explore: [
      ['#inside', 'What’s inside'],
      ['#how', 'How it works'],
      ['#crew', 'The crew'],
      ['#next', 'What’s next'],
    ],
    docs: [
      ['help', 'Help & contact'],
      ['privacy', 'Privacy'],
      ['terms', 'Terms of use'],
      ['notice', 'Legal notice'],
    ],
    note: 'No cookies, no analytics. Fonts are self-hosted: this site makes no third-party requests.',
    rights: 'All rights reserved.',
    made: 'Handmade, between two throws.',
  },
};

export function landing(p) {
  const t = T[p.lang];
  const href = (target) => (target.startsWith('#') ? target : p.links[target]);
  const list = (items) =>
    items.map(([target, label]) => `<a href="${href(target)}">${label}</a>`).join('');
  const desc = (p.meta.description ?? '').replace(/"/g, '&quot;');
  const title = `${p.config.app} · ${p.meta.title}`;
  const store = p.config.appStoreUrl;
  const cta = store
    ? `<a class="btn small" href="${store}">${t.ctaReady}</a>`
    : `<a class="btn small yellow" href="#${p.lang === 'fr' ? 'telecharger' : 'download'}">${t.cta}</a>`;
  const alternate = p.alternate
    ? `<link rel="alternate" hreflang="fr" href="${p.alternate.fr}">\n  <link rel="alternate" hreflang="en" href="${p.alternate.en}">\n  <link rel="alternate" hreflang="x-default" href="${p.alternate.fr}">`
    : '';

  return `<!doctype html>
<html lang="${p.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <meta name="color-scheme" content="light">
  <meta name="theme-color" content="#111111">
  <link rel="canonical" href="${p.canonical}">
  ${alternate}
  <link rel="icon" type="image/svg+xml" href="${p.rel}assets/mascot.svg">
  <link rel="stylesheet" href="${p.rel}assets/style.css">
  <link rel="stylesheet" href="${p.rel}assets/landing.css">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="${p.config.baseUrl}assets/og.png">
  <meta name="twitter:card" content="summary_large_image">
  <script>document.documentElement.className += ' js';</script>
</head>
<body class="landing">
  <a class="skip" href="#main">${p.lang === 'fr' ? 'Aller au contenu' : 'Skip to content'}</a>
  <div class="teaser"><div class="wrap">${t.teaser} · <a href="${t.nav[0][0]}">${t.teaserLink}</a></div></div>
  <header class="top">
    <div class="wrap">
      <a class="brand" href="${p.links.home}"><img src="${p.rel}assets/mascot.svg" alt="" width="40" height="36">${p.config.app}</a>
      <nav class="nav" aria-label="${p.lang === 'fr' ? 'Sections' : 'Sections'}">${list(t.nav)}</nav>
      <a class="lang" href="${p.altHref}" hreflang="${p.alt}" lang="${p.alt}" title="${t.switchTitle}">${t.switchTo}</a>
      ${cta}
    </div>
  </header>

  <main id="main">
${p.body}
  </main>

  <footer class="foot">
    <div class="wrap">
      <div class="fbrand">
        <a class="brand" href="${p.links.home}"><img src="${p.rel}assets/mascot.svg" alt="" width="40" height="36">${p.config.app}</a>
        <p>${t.tagline}</p>
        <p class="made">${t.made}</p>
      </div>
      <div class="fcol"><p class="k">${t.cols.explore}</p>${list(t.explore)}</div>
      <div class="fcol"><p class="k">${t.cols.docs}</p>${list(t.docs)}</div>
      <div class="fcol"><p class="k">${t.cols.more}</p><a href="${p.altHref}" hreflang="${p.alt}" lang="${p.alt}">${t.switchTo}</a></div>
      <p class="who">© ${p.config.year} ${p.config.publisher} · ${p.config.app}. ${t.rights}</p>
      <p class="note">${t.note}</p>
    </div>
  </footer>
  <script>
    (function () {
      var items = document.querySelectorAll('.rv');
      if (!('IntersectionObserver' in window)) { items.forEach(function (el) { el.classList.add('in'); }); return; }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      items.forEach(function (el) { io.observe(el); });
    })();
  </script>
</body>
</html>
`;
}
