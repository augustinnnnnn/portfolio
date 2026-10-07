/**
 * ─────────────────────────────────────────────────────────────
 *  PROJETS
 *  Ajoute, supprime ou réordonne les objets ci-dessous : la grille,
 *  les filtres, la fiche détaillée, la palette de commandes et la
 *  gamification s'adaptent automatiquement.
 *
 *  Champs :
 *   slug        identifiant unique (utilisé dans l'URL : #projet/slug)
 *   title       titre du projet
 *   category    catégorie principale (génère les filtres automatiquement)
 *   year        année
 *   summary     phrase courte affichée sur la carte
 *   cover       image de couverture ('/projects/mon-image.jpg' dans /public) — vide = visuel généré
 *   hue         teinte (0-360) du visuel généré quand il n'y a pas d'image
 *   featured    true = mis en avant en grand en tête de section
 *   tags        technologies / outils
 *   meta        informations de la fiche (libre : ajoute ou retire des lignes)
 *   sections    blocs de texte de la fiche détaillée
 *   gallery     images supplémentaires (vide = cadres placeholders)
 *   links       liens externes
 * ─────────────────────────────────────────────────────────────
 */

/** Gabarit commun aux placeholders — à supprimer une fois tes projets ajoutés. */
const placeholder = (n, overrides) => ({
  slug: `projet-${n}`,
  title: `[PROJET ${n}]`,
  category: 'Web',
  year: '[ANNÉE]',
  summary: '[DESCRIPTION COURTE DU PROJET]',
  cover: '',
  hue: 20,
  featured: false,
  tags: ['[TECHNO]', '[TECHNO]', '[OUTIL]'],
  meta: [
    { label: 'Rôle', value: '[MON RÔLE]' },
    { label: 'Durée', value: '[DURÉE]' },
    { label: 'Équipe', value: '[ÉQUIPE]' },
    { label: 'Contexte', value: '[CONTEXTE : cours, perso, client…]' },
  ],
  sections: [
    { title: 'Contexte', body: '[DESCRIPTION DU PROJET — le point de départ, le problème à résoudre.]' },
    { title: 'Objectifs', body: '[OBJECTIFS — ce que le projet devait accomplir.]' },
    { title: 'Démarche', body: '[DÉMARCHE — recherche, conception, choix techniques.]' },
    { title: 'Résultat', body: '[RÉSULTAT — ce qui a été livré, les chiffres, ce que j’ai appris.]' },
  ],
  gallery: ['', ''],
  links: [
    { label: 'Voir le projet', url: '#' },
    { label: 'Code source', url: '#' },
  ],
  ...overrides,
});

export const projects = [
  placeholder('01', { category: 'Web', hue: 14, featured: true }),
  placeholder('02', { category: 'UI/UX', hue: 210 }),
  placeholder('03', { category: 'Design', hue: 48 }),
  placeholder('04', { category: 'Web', hue: 160 }),
  placeholder('05', { category: 'UI/UX', hue: 280 }),
  placeholder('06', { category: 'Design', hue: 340 }),
];
