/**
 * ─────────────────────────────────────────────────────────────
 *  COMPÉTENCES
 *  level : 1 (notions) → 5 (maîtrise)
 *  projects : slugs des projets où la compétence a été utilisée
 *             (crée un lien cliquable « voir les projets »).
 * ─────────────────────────────────────────────────────────────
 */
export const skillLevels = ['Notions', 'Bases', 'Intermédiaire', 'Avancé', 'Maîtrise'];

const skill = (n, level, projects = []) => ({ name: `[COMPÉTENCE ${n}]`, level, projects });

export const skillDomains = [
  {
    id: 'web',
    title: 'Développement web',
    description: '[COURTE DESCRIPTION DU DOMAINE]',
    skills: [skill('01', 4, ['projet-01', 'projet-04']), skill('02', 4, ['projet-01']), skill('03', 3, ['projet-04']), skill('04', 2)],
  },
  {
    id: 'design',
    title: 'Design',
    description: '[COURTE DESCRIPTION DU DOMAINE]',
    skills: [skill('01', 4, ['projet-03', 'projet-06']), skill('02', 3, ['projet-06']), skill('03', 3)],
  },
  {
    id: 'uiux',
    title: 'UI / UX',
    description: '[COURTE DESCRIPTION DU DOMAINE]',
    skills: [skill('01', 4, ['projet-02', 'projet-05']), skill('02', 3, ['projet-02']), skill('03', 3), skill('04', 2)],
  },
  {
    id: 'tools',
    title: 'Outils',
    description: '[COURTE DESCRIPTION DU DOMAINE]',
    skills: [skill('01', 4), skill('02', 3), skill('03', 3)],
  },
  {
    id: 'software',
    title: 'Logiciels',
    description: '[COURTE DESCRIPTION DU DOMAINE]',
    skills: [skill('01', 3), skill('02', 3), skill('03', 2)],
  },
  {
    id: 'other',
    title: 'Autres',
    description: '[COURTE DESCRIPTION DU DOMAINE]',
    skills: [skill('01', 3), skill('02', 2)],
  },
];
