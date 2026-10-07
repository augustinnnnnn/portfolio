/**
 * Mode Blueprint (récompense à 100 %) : révèle la structure du site —
 * grilles, contours et noms des composants.
 */
import { game } from './game.js';
import { storage } from './storage.js';
import { createEmitter } from './emitter.js';

const root = document.documentElement;
const events = createEmitter();

export const isBlueprint = () => root.classList.contains('is-blueprint');
export const canUseBlueprint = () => game.stats().complete;
export const onBlueprintChange = events.on.bind(null, 'change');

const set = (on) => {
  root.classList.toggle('is-blueprint', on);
  storage.set('blueprint', on);
  events.emit('change', on);
};

export const toggleBlueprint = () => {
  if (!canUseBlueprint()) return false;
  set(!isBlueprint());
  return true;
};

export const initBlueprint = () => {
  if (canUseBlueprint() && storage.get('blueprint', false)) set(true);
  game.on('reset', () => set(false));
};
