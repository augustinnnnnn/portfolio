/** Section « À propos » : présentation, portrait, repères et centres d'intérêt. */
import { html, text } from '../core/dom.js';
import { chapter } from './chapter.js';
import { about, profile } from '../data/profile.js';
import { game } from '../core/game.js';
import { registerAction } from '../core/actions.js';

export const renderAbout = () => html`
  <section class="section about" id="apropos" aria-labelledby="apropos-title" data-bp="section.about">
    <div class="container">
      ${chapter('apropos')}

      <div class="about__grid">
        <figure class="portrait" data-reveal data-bp="figure.portrait">
          <div class="portrait__frame">
            ${about.photo
              ? html`<img src="${about.photo}" alt="Portrait de ${profile.firstName} ${profile.lastName}" loading="lazy" decoding="async" />`
              : html`<div class="portrait__placeholder"><span class="ph">[PHOTO]</span><small>Format conseillé 4:5</small></div>`}
          </div>
          <figcaption class="portrait__caption">
            <span>${text(profile.firstName)} ${text(profile.lastName)}</span>
            <span class="dim">${text(profile.location)}</span>
          </figcaption>
        </figure>

        <div class="about__content">
          <p class="about__statement" data-reveal>${text(about.statement)}</p>
          <div class="about__body" data-reveal>
            ${about.paragraphs.map((p) => html`<p>${text(p)}</p>`)}
          </div>

          <dl class="facts" data-reveal>
            ${about.facts.map(
              (fact, i) => html`
                <div class="facts__item" style="--d: ${i * 60}ms">
                  <dt>${fact.label}</dt>
                  <dd>${text(fact.value)}${i === about.facts.length - 1
                    ? html`<button class="glyph" type="button" data-action="glyph" aria-label="Élément caché">✳</button>`
                    : ''}</dd>
                </div>
              `,
            )}
          </dl>

          <div class="interests" data-reveal>
            <span class="interests__label">Centres d’intérêt</span>
            <ul class="interests__list">
              ${about.interests.map((item) => html`<li>${text(item)}</li>`)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
`;

export const mountAbout = () => {
  registerAction('glyph', ({ trigger }) => {
    trigger.classList.add('is-found');
    game.unlock('secret:glyph');
  });
};

