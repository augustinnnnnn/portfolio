/**
 * Visuel d'un projet : l'image fournie, ou à défaut un visuel génératif
 * (teinte `hue` du projet) clairement identifié comme placeholder.
 */
import { html, pad } from '../core/dom.js';

export const cover = (project, index, { eager = false } = {}) =>
  project.cover
    ? html`<img class="cover__img" src="${project.cover}" alt="" ${eager ? '' : 'loading="lazy"'} decoding="async" />`
    : html`
        <div class="cover cover--v${index % 3}" style="--h: ${project.hue}" aria-hidden="true">
          <span class="cover__shape"></span>
          <span class="cover__num">${pad(index + 1)}</span>
          <span class="cover__label">[IMAGE ${project.title}]</span>
        </div>
      `;
