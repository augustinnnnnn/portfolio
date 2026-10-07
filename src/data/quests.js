/**
 * ─────────────────────────────────────────────────────────────
 *  GAMIFICATION — « Carnet d'exploration »
 *  Les objectifs « zones » et « projets » sont générés automatiquement
 *  à partir de sections.js et projects.js. Ici, tu règles les points,
 *  les niveaux, les défis et les secrets.
 * ─────────────────────────────────────────────────────────────
 */
export const xp = {
  section: 10,
  project: 20,
};

/** Niveaux atteints selon le pourcentage d'exploration. */
export const levels = [
  { at: 0, title: 'Visiteur' },
  { at: 20, title: 'Explorateur' },
  { at: 45, title: 'Initié' },
  { at: 75, title: 'Expert' },
  { at: 100, title: 'Archiviste' },
];

/** Défis visibles : ils encouragent à utiliser les fonctionnalités du site. */
export const challenges = [
  { id: 'filter', title: 'Trieur', description: 'Filtrer les projets par catégorie.', xp: 10 },
  { id: 'skills', title: 'Polyvalent', description: 'Parcourir tous les domaines de compétences.', xp: 15 },
  { id: 'palette', title: 'Raccourci', description: 'Ouvrir la palette de commandes (Ctrl/⌘ + K).', xp: 10 },
  { id: 'email', title: 'Prise de contact', description: 'Copier mon adresse e-mail.', xp: 15 },
];

/** Secrets : masqués tant qu'ils ne sont pas trouvés, seul l'indice est visible. */
export const secrets = [
  { id: 'logo', title: 'Insistant', hint: 'Le logo cache un tempérament.', description: 'Cliquer 5 fois sur le logo.', xp: 25 },
  { id: 'glyph', title: 'Œil de lynx', hint: 'Un astérisque discret se cache dans mon profil.', description: 'Trouver le glyphe caché.', xp: 25 },
  { id: 'konami', title: 'Old school', hint: '↑ ↑ ↓ ↓ …', description: 'Saisir le Konami code.', xp: 25 },
  { id: 'sudo', title: 'Root', hint: 'La console du navigateur a un message pour vous.', description: 'Exécuter la commande secrète.', xp: 25 },
];

/** Récompense débloquée à 100 % d'exploration. */
export const reward = {
  title: 'Mode Blueprint débloqué',
  description: 'Vous avez tout exploré. Le site révèle maintenant sa structure : activez le mode Blueprint (touche B) pour voir l’envers du décor.',
};

/** Commande secrète à taper dans la palette (indice donné dans la console). */
export const secretCommand = 'sudo hire';
