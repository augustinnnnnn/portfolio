/** Jeu d'icônes SVG inline (trait 1.5px, héritent de currentColor). */
import { raw } from '../core/dom.js';

const paths = {
  arrowRight: '<path d="M4 12h16M14 6l6 6-6 6"/>',
  arrowLeft: '<path d="M20 12H4M10 6l-6 6 6 6"/>',
  arrowUpRight: '<path d="M7 17 17 7M8 7h9v9"/>',
  arrowUp: '<path d="M12 20V4M6 10l6-6 6 6"/>',
  arrowDown: '<path d="M12 4v16M6 14l6 6 6-6"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z"/>',
  menu: '<path d="M4 8h16M4 16h16"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  spark: '<path d="M12 3v6M12 15v6M3 12h6M15 12h6M6.3 6.3l3.5 3.5M14.2 14.2l3.5 3.5M6.3 17.7l3.5-3.5M14.2 9.8l3.5-3.5"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
  list: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  blueprint: '<path d="M4 4h16v16H4zM4 9h16M9 4v16"/>',
  command: '<path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3Z"/>',
};

export const icon = (name, className = 'icon') =>
  raw(
    `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name]}</svg>`,
  );
