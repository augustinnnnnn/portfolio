/** Indicateur circulaire de progression d'exploration (réutilisé nav + dock). */
import { html } from '../core/dom.js';

export const xpRing = (className = '') => html`
  <button class="xp-ring ${className}" type="button" data-action="logbook" data-xp-ring data-cursor="Carnet"
    aria-label="Ouvrir le carnet d’exploration" style="--p: 0">
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <circle class="xp-ring__track" cx="18" cy="18" r="15.5" pathLength="100" />
      <circle class="xp-ring__value" cx="18" cy="18" r="15.5" pathLength="100" />
    </svg>
    <span class="xp-ring__value-text" data-xp-percent>0</span>
  </button>
`;

/** Met à jour tous les anneaux présents dans la page. */
export const updateXpRings = ({ percent, level }) => {
  document.querySelectorAll('[data-xp-ring]').forEach((ring) => {
    ring.style.setProperty('--p', percent);
    ring.querySelector('[data-xp-percent]').textContent = percent;
    ring.setAttribute('aria-label', `Carnet d’exploration — ${percent} % exploré, niveau ${level.title}`);
    ring.title = `${level.title} · ${percent} % exploré`;
  });
};
