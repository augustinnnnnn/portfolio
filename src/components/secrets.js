/** Easter eggs : Konami code, logo insistant, message console. */
import { $$ } from '../core/dom.js';
import { game } from '../core/game.js';
import { secretCommand } from '../data/quests.js';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

const mountKonami = () => {
  let position = 0;
  addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    position = key === KONAMI[position] ? position + 1 : key === KONAMI[0] ? 1 : 0;
    if (position === KONAMI.length) {
      position = 0;
      document.documentElement.classList.add('is-glitch');
      setTimeout(() => document.documentElement.classList.remove('is-glitch'), 900);
      game.unlock('secret:konami');
    }
  });
};

const mountLogo = () => {
  let clicks = 0;
  let timer = 0;
  $$('[data-logo]').forEach((logo) => logo.addEventListener('click', () => {
    clicks += 1;
    clearTimeout(timer);
    timer = setTimeout(() => (clicks = 0), 1200);
    logo.classList.remove('is-poked');
    void logo.offsetWidth; /* relance l'animation */
    logo.classList.add('is-poked');
    if (clicks >= 5) {
      clicks = 0;
      logo.classList.add('is-spin');
      setTimeout(() => logo.classList.remove('is-spin'), 900);
      game.unlock('secret:logo');
    }
  }));
};

const greetConsole = () => {
  const style = 'font: 600 13px/1.6 ui-monospace, monospace; color: #ff5b2e;';
  console.log('%c┌─ Bonjour, curieux·se.', style);
  console.log(`%c│ Ce site est fait main, sans framework.\n│ Ouvrez la palette (Ctrl/⌘ + K) et tapez : ${secretCommand}\n└─`, style);
};

export const mountSecrets = () => {
  mountKonami();
  mountLogo();
  greetConsole();
};
