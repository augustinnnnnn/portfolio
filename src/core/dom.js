/** Petits utilitaires DOM et de rendu HTML sécurisé. */

const RAW = Symbol('raw');

/** Marque une chaîne comme HTML de confiance (non échappée). */
export const raw = (value) => ({ [RAW]: true, value: String(value) });

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);

const serialize = (value) => {
  if (value == null || value === false) return '';
  if (Array.isArray(value)) return value.map(serialize).join('');
  if (value[RAW]) return value.value;
  return esc(value);
};

/**
 * Template tag : échappe automatiquement les valeurs interpolées.
 * Les tableaux sont concaténés, `raw()` et les résultats de `html` passent tels quels.
 */
export const html = (strings, ...values) =>
  raw(strings.reduce((out, str, i) => out + str + (i < values.length ? serialize(values[i]) : ''), ''));

/**
 * Texte de contenu : échappé, avec les [PLACEHOLDERS] mis en évidence
 * et le *texte entre astérisques* rendu en italique.
 */
export const text = (value) =>
  raw(
    esc(value)
      .replace(/\[[^\]]+\]/g, (m) => `<span class="ph">${m}</span>`)
      .replace(/\*([^*]+)\*/g, '<em>$1</em>'),
  );

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

/** Insère un fragment HTML et retourne le premier élément créé. */
export const mount = (parent, markup, position = 'beforeend') => {
  parent.insertAdjacentHTML(position, serialize(markup));
  return position === 'beforeend' ? parent.lastElementChild : parent.firstElementChild;
};

/** Normalise une chaîne pour la recherche (minuscules, sans accents). */
export const normalize = (value) =>
  String(value).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

export const pad = (n, size = 2) => String(n).padStart(size, '0');
