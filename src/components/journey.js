/** Parcours : frise chronologique dont la ligne se remplit au fil du scroll. */
import { html, $, text } from '../core/dom.js';
import { chapter } from './chapter.js';
import { journey, journeyTypes } from '../data/journey.js';
import { clamp } from '../core/motion.js';

export const renderJourney = () => html`
  <section class="section journey" id="parcours" aria-labelledby="parcours-title" data-bp="section.journey">
    <div class="container">
      ${chapter('parcours')}
      <ol class="timeline" data-timeline>
        <span class="timeline__track" aria-hidden="true"><span class="timeline__fill" data-timeline-fill></span></span>
        ${journey.map(
          (step) => html`
            <li class="timeline__item" data-reveal data-type="${step.type}">
              <span class="timeline__dot" aria-hidden="true"></span>
              <div class="timeline__period">${text(step.period)}</div>
              <div class="timeline__card">
                <span class="timeline__type">${journeyTypes[step.type] ?? step.type}</span>
                <h3>${text(step.title)}</h3>
                <p class="timeline__place">${text(step.place)}</p>
                <p class="timeline__desc">${text(step.description)}</p>
              </div>
            </li>
          `,
        )}
      </ol>
    </div>
  </section>
`;

export const mountJourney = () => {
  const timeline = $('[data-timeline]');
  const fill = $('[data-timeline-fill]');
  let active = false;
  let ticking = false;

  const update = () => {
    ticking = false;
    const rect = timeline.getBoundingClientRect();
    const progress = clamp((innerHeight * 0.6 - rect.top) / rect.height, 0, 1);
    fill.style.transform = `scaleY(${progress})`;
  };
  const onScroll = () => {
    if (!active || ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  new IntersectionObserver(([entry]) => {
    active = entry.isIntersecting;
    if (active) update();
  }).observe(timeline);
  addEventListener('scroll', onScroll, { passive: true });
};
