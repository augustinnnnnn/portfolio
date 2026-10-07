/**
 * Registre d'actions globales. Tout élément portant `data-action="nom"`
 * déclenche l'action correspondante au clic — les composants restent découplés.
 */
const registry = new Map();

export const registerAction = (name, handler) => registry.set(name, handler);
export const runAction = (name, detail) => registry.get(name)?.(detail);
export const hasAction = (name) => registry.has(name);

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-action]');
  if (!trigger || !registry.has(trigger.dataset.action)) return;
  event.preventDefault();
  runAction(trigger.dataset.action, { trigger, event });
});
