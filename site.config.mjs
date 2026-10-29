/**
 * Ce qui change d'une édition à l'autre du site. Tout le reste (textes, mise en page)
 * est dans `src/`. Après une modification : `node build.mjs` (sortie dans `docs/`).
 */
export default {
  /** Le nom de l'app, tel qu'il apparaît dans les textes. */
  app: 'Dartumo',
  /** L'éditeur (personne physique, à titre non professionnel). */
  publisher: 'Quentin Fonkenell',
  /**
   * L'adresse de support, affichée sur toutes les pages (bouton « Nous écrire », politique,
   * CGU, mentions légales). `null` = les pages affichent « adresse à venir » et le bouton
   * est inactif. Boîte IONOS créée le 2026-10-27.
   */
  supportEmail: 'contact@dartumo.com',
  /**
   * La fiche App Store. `null` tant que l'app n'est pas en ligne : le badge de la page
   * d'accueil dit « Bientôt sur l'App Store » et n'est pas un lien.
   */
  appStoreUrl: null,
  /**
   * L'adresse publique du site (liens canoniques, hreflang, sitemap). Le domaine (IONOS,
   * 2026-10-27) devient aussi le fichier `CNAME` de GitHub Pages ; dartumo.fr y redirige.
   */
  baseUrl: 'https://dartumo.com/',
  /** La date affichée en tête des documents légaux. */
  updated: { fr: '29 octobre 2026', en: 'October 29, 2026' },
  /** L'année du copyright, en pied de page. */
  year: '2026',
};
