/**
 * ─────────────────────────────────────────────────────────────
 *  PROFIL — informations personnelles
 *  Remplace chaque [PLACEHOLDER] par ton contenu.
 * ─────────────────────────────────────────────────────────────
 */
export const profile = {
  firstName: '[PRÉNOM]',
  lastName: '[NOM]',
  /** Initiales affichées dans le logo (2 caractères conseillés). */
  initials: 'XX',
  role: '[MON MÉTIER / PROFIL]',
  /** Phrase courte du Hero (1 à 2 lignes). */
  tagline: '[MA PRÉSENTATION COURTE — une phrase qui dit ce que je fais et pour qui.]',
  /** Mots qui défilent dans le Hero : « Je conçois des … ». */
  heroKeywords: ['interfaces', 'expériences', 'produits numériques'],
  location: '[VILLE], [PAYS]',
  /** Fuseau horaire utilisé pour l'horloge du Hero. */
  timeZone: 'Europe/Paris',
  availability: {
    open: true,
    label: 'Disponible — [STAGE / ALTERNANCE / FREELANCE]',
  },
  email: 'contact@exemple.fr',
  /** Lien vers ton CV (PDF dans /public ou URL externe). Laisser vide pour masquer. */
  resumeUrl: '',
  socials: [
    { label: 'GitHub', url: '#', handle: '[LIEN]' },
    { label: 'LinkedIn', url: '#', handle: '[LIEN]' },
    { label: 'Dribbble', url: '#', handle: '[LIEN]' },
  ],
};

/**
 * À PROPOS — chaque bloc est optionnel : supprime ceux dont tu n'as pas besoin.
 */
export const about = {
  /** Phrase d'accroche en grand. */
  statement: '[MA PRÉSENTATION — 2 à 3 phrases fortes sur qui je suis et ce qui me motive.]',
  /** Paragraphes complémentaires. */
  paragraphs: [
    '[PARAGRAPHE 01 — mon parcours en quelques lignes.]',
    '[PARAGRAPHE 02 — ma manière de travailler, ce que j’aime construire.]',
  ],
  /** Chemin d'une photo (ex. '/photo.jpg' placée dans /public). Vide = cadre placeholder. */
  photo: '',
  facts: [
    { label: 'Basé à', value: '[VILLE]' },
    { label: 'Études', value: '[FORMATION ACTUELLE]' },
    { label: 'Langues', value: '[LANGUES]' },
    { label: 'En ce moment', value: '[CE SUR QUOI JE TRAVAILLE]' },
  ],
  interests: ['[CENTRE D’INTÉRÊT 01]', '[CENTRE D’INTÉRÊT 02]', '[CENTRE D’INTÉRÊT 03]', '[CENTRE D’INTÉRÊT 04]'],
};
