/** En-tête de chapitre commun à toutes les sections. */
import { html, text, pad } from '../core/dom.js';
import { sections } from '../data/sections.js';

export const chapter = (id, extra = '') => {
  const index = sections.findIndex((s) => s.id === id);
  const section = sections[index];
  return html`
    <header class="chapter" data-reveal data-bp="chapter">
      <div class="chapter__rail">
        <span class="chapter__index">${pad(index)}</span>
        <span class="chapter__line"></span>
        <span class="chapter__label">${section.short}</span>
      </div>
      <h2 class="chapter__title" id="${id}-title">${text(section.title)}</h2>
      ${section.intro ? html`<p class="chapter__intro">${text(section.intro)}</p>` : ''}
      ${extra}
    </header>
  `;
};
