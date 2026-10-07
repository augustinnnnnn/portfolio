/** Thème clair / sombre avec transition circulaire depuis le bouton cliqué. */
import { storage } from './storage.js';
import { withViewTransition } from './motion.js';
import { createEmitter } from './emitter.js';

const root = document.documentElement;
const events = createEmitter();

export const getTheme = () => root.dataset.theme || 'dark';

const apply = (theme) => {
  root.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#ece8de' : '#0c0c0b');
  storage.set('theme', theme);
  events.emit('change', theme);
};

export const onThemeChange = events.on.bind(null, 'change');

/** @param {HTMLElement} [origin] élément depuis lequel la transition se propage */
export const toggleTheme = (origin) => {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  if (origin) {
    const rect = origin.getBoundingClientRect();
    root.style.setProperty('--vt-x', `${rect.left + rect.width / 2}px`);
    root.style.setProperty('--vt-y', `${rect.top + rect.height / 2}px`);
  }
  return withViewTransition(() => apply(next), { types: ['theme'] });
};
