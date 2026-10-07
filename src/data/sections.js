/**
 * Structure du site : ordre, libellés de navigation, numéros de chapitre
 * et titres. Dans `title`, le texte entre *astérisques* s'affiche en italique
 * serif. L'id correspond à l'id de la section dans le DOM.
 */
export const sections = [
  { id: 'accueil', label: 'Accueil', short: 'Index' },
  {
    id: 'apropos',
    label: 'À propos',
    short: 'Profil',
    title: 'Derrière *l’écran*',
  },
  {
    id: 'projets',
    label: 'Projets',
    short: 'Travaux',
    title: 'Travaux *sélectionnés*',
    intro: 'Une sélection de projets. Ouvrez une fiche pour découvrir le contexte, la démarche et le résultat.',
  },
  {
    id: 'competences',
    label: 'Compétences',
    short: 'Savoir-faire',
    title: 'Boîte *à outils*',
    intro: 'Choisissez un domaine pour voir le détail et les projets où chaque compétence a servi.',
  },
  {
    id: 'parcours',
    label: 'Parcours',
    short: 'Trajectoire',
    title: 'Le chemin *parcouru*',
  },
  {
    id: 'contact',
    label: 'Contact',
    short: 'Contact',
    title: 'Construisons *quelque chose.*',
  },
];
