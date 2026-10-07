/** Préférences de mouvement, helpers d'animation et View Transitions. */

const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
const finePointerQuery = matchMedia('(hover: hover) and (pointer: fine)');

export const prefersReducedMotion = () => reducedQuery.matches;
export const hasFinePointer = () => finePointerQuery.matches;

export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/**
 * Exécute une mise à jour du DOM dans une View Transition si le navigateur
 * la supporte et que l'utilisateur accepte les animations.
 * @returns {Promise<void>} résolue quand la transition est terminée
 */
export const withViewTransition = (update, { types } = {}) => {
  if (!document.startViewTransition || prefersReducedMotion()) {
    update();
    return Promise.resolve();
  }
  let transition;
  try {
    transition = types ? document.startViewTransition({ update, types }) : document.startViewTransition(update);
  } catch {
    transition = document.startViewTransition(update);
  }
  /* Classe utilitaire : permet de neutraliser les animations CSS concurrentes. */
  const root = document.documentElement;
  root.classList.add('is-vt');
  return transition.finished.catch(() => {}).finally(() => root.classList.remove('is-vt'));
};

/** Boucle rAF qui ne tourne que lorsque `isActive()` est vrai. */
export const createLoop = (tick) => {
  let frame = 0;
  const run = (time) => {
    frame = tick(time) === false ? 0 : requestAnimationFrame(run);
  };
  return {
    start() {
      if (!frame) frame = requestAnimationFrame(run);
    },
    stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    },
  };
};
