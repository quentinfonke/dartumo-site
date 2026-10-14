/**
 * Ce qui change d'une édition à l'autre du site. Tout le reste (textes, mise en page)
 * est dans `src/`. Après une modification : `node build.mjs` (sortie dans `docs/`).
 */
export default {
  /** Le nom de l'app, tel qu'il apparaît dans les textes. */
  app: 'DuoDarts',
  /** L'éditeur (personne physique, à titre non professionnel). */
  publisher: 'Quentin Fonkenell',
  /**
   * L'adresse de support, affichée sur toutes les pages (bouton « Nous écrire », politique,
   * CGU, mentions légales). `null` tant qu'elle n'est pas choisie : les pages affichent
   * « adresse à venir » et le bouton est inactif. À renseigner avant la mise en ligne.
   */
  supportEmail: null,
  /** L'adresse publique du site (liens canoniques et hreflang). Sans domaine : GitHub Pages. */
  baseUrl: 'https://quentinfonke.github.io/duodarts-site/',
  /** La date affichée en tête des documents légaux. */
  updated: { fr: '14 octobre 2026', en: 'October 14, 2026' },
  /** L'année du copyright, en pied de page. */
  year: '2026',
};
