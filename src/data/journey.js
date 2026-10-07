/**
 * ─────────────────────────────────────────────────────────────
 *  PARCOURS — du plus récent au plus ancien.
 *  type : 'formation' | 'experience' | 'projet' (change l'icône et le libellé)
 * ─────────────────────────────────────────────────────────────
 */
export const journeyTypes = {
  formation: 'Formation',
  experience: 'Expérience',
  projet: 'Projet',
};

export const journey = [
  {
    period: '[ANNÉE] — Aujourd’hui',
    type: 'formation',
    title: '[FORMATION]',
    place: '[ÉTABLISSEMENT]',
    description: '[DESCRIPTION — spécialité, matières clés, projets marquants.]',
  },
  {
    period: '[ANNÉE]',
    type: 'experience',
    title: '[EXPÉRIENCE / STAGE]',
    place: '[ENTREPRISE]',
    description: '[DESCRIPTION — missions, responsabilités, résultats.]',
  },
  {
    period: '[ANNÉE]',
    type: 'projet',
    title: '[PROJET MARQUANT]',
    place: '[CONTEXTE]',
    description: '[DESCRIPTION]',
  },
  {
    period: '[ANNÉE]',
    type: 'formation',
    title: '[FORMATION PRÉCÉDENTE]',
    place: '[ÉTABLISSEMENT]',
    description: '[DESCRIPTION]',
  },
];
