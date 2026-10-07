/**
 * Section Projets : filtres générés depuis les catégories, deux vues
 * (grille interactive / index typographique avec aperçu flottant),
 * carrousel tactile sur mobile et marqueurs d'exploration.
 */
import { html, $, $$, mount, pad, text } from '../core/dom.js';
import { icon } from './icons.js';
import { cover } from './cover.js';
import { chapter } from './chapter.js';
import { projects } from '../data/projects.js';
import { xp } from '../data/quests.js';
import { game } from '../core/game.js';
import { storage } from '../core/storage.js';
import { withViewTransition, prefersReducedMotion, hasFinePointer, lerp, createLoop, clamp } from '../core/motion.js';

const ALL = 'Tous';
const categories = [ALL, ...new Set(projects.map((p) => p.category))];
const countFor = (category) => (category === ALL ? projects.length : projects.filter((p) => p.category === category).length);

const stateLabel = (slug) => (game.has(`project:${slug}`) ? 'Exploré' : `Nouveau · +${xp.project} XP`);

const card = (project, index) => html`
  <article class="card ${project.featured ? 'card--featured' : ''}" data-project="${project.slug}"
    data-category="${project.category}" style="--vt: vt-${project.slug}" data-bp="article.card">
    <a class="card__link" href="#projet/${project.slug}" data-cursor="Voir" aria-label="${project.title} — ouvrir la fiche">
      <div class="card__media" data-media>${cover(project, index)}</div>
      <div class="card__body">
        <div class="card__top">
          <span class="card__index">P/${pad(index + 1)}</span>
          <span>${project.category}</span>
          <span>${text(project.year)}</span>
        </div>
        <h3 class="card__title">${text(project.title)}</h3>
        <p class="card__summary">${text(project.summary)}</p>
        <ul class="card__tags" aria-label="Technologies">
          ${project.tags.map((tag) => html`<li>${text(tag)}</li>`)}
        </ul>
      </div>
      <span class="badge-state" data-state="${project.slug}">${stateLabel(project.slug)}</span>
      <span class="card__cta" aria-hidden="true">Ouvrir ${icon('arrowUpRight')}</span>
    </a>
  </article>
`;

const row = (project, index) => html`
  <li class="row" data-project="${project.slug}" data-category="${project.category}" style="--vt: vt-row-${project.slug}">
    <a class="row__link" href="#projet/${project.slug}" data-cursor="Voir" data-index="${index}">
      <span class="row__num">${pad(index + 1)}</span>
      <span class="row__thumb">${cover(project, index)}</span>
      <span class="row__title">${text(project.title)}</span>
      <span class="row__cat">${project.category}</span>
      <span class="row__year">${text(project.year)}</span>
      <span class="badge-state" data-state="${project.slug}">${stateLabel(project.slug)}</span>
      ${icon('arrowUpRight', 'icon row__arrow')}
    </a>
  </li>
`;

export const renderProjects = () => html`
  <section class="section projects" id="projets" aria-labelledby="projets-title" data-bp="section.projects">
    <div class="container">
      ${chapter('projets')}

      <div class="toolbar" data-reveal>
        <div class="filters" role="group" aria-label="Filtrer par catégorie">
          ${categories.map(
            (cat) => html`
              <button class="filter" type="button" data-filter="${cat}" aria-pressed="${cat === ALL}">
                ${cat}<sup>${countFor(cat)}</sup>
              </button>
            `,
          )}
        </div>
        <div class="view-toggle" role="group" aria-label="Mode d’affichage">
          <button type="button" data-view="grid" aria-pressed="true">${icon('grid')}<span>Grille</span></button>
          <button type="button" data-view="index" aria-pressed="false">${icon('list')}<span>Index</span></button>
        </div>
      </div>

      <div class="projects__stage" data-view-mode="grid">
        <div class="projects__grid" data-grid>${projects.map(card)}</div>
        <ol class="projects__index" data-index-list>${projects.map(row)}</ol>
        <div class="carousel-meter" aria-hidden="true">
          <span data-carousel-current>01</span><span class="carousel-meter__bar"><span data-carousel-bar></span></span><span data-carousel-total>${pad(projects.length)}</span>
        </div>
      </div>
    </div>
    <div class="preview" data-preview aria-hidden="true"></div>
  </section>
`;

/** Inclinaison 3D légère des cartes, pilotée par CSS custom properties. */
const mountTilt = (grid) => {
  if (!hasFinePointer() || prefersReducedMotion()) return;
  grid.addEventListener('pointermove', (e) => {
    const target = e.target.closest('.card');
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    target.style.setProperty('--mx', `${x * 100}%`);
    target.style.setProperty('--my', `${y * 100}%`);
    target.style.setProperty('--ry', `${(x - 0.5) * 6}deg`);
    target.style.setProperty('--rx', `${(0.5 - y) * 6}deg`);
  });
  grid.addEventListener('pointerout', (e) => {
    const target = e.target.closest('.card');
    if (target && !target.contains(e.relatedTarget)) {
      target.style.setProperty('--rx', '0deg');
      target.style.setProperty('--ry', '0deg');
    }
  });
};

/** Aperçu flottant qui suit le curseur dans la vue Index. */
const mountPreview = (list, preview) => {
  if (!hasFinePointer()) return;
  const pos = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  let current = -1;
  const reduced = prefersReducedMotion();

  const loop = createLoop(() => {
    pos.x = lerp(pos.x, target.x, reduced ? 1 : 0.18);
    pos.y = lerp(pos.y, target.y, reduced ? 1 : 0.18);
    const tilt = clamp((target.x - pos.x) * 0.05, -8, 8);
    preview.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) rotate(${tilt}deg)`;
    if (Math.abs(pos.x - target.x) < 0.2 && Math.abs(pos.y - target.y) < 0.2) return false;
  });

  list.addEventListener('pointermove', (e) => {
    const link = e.target.closest('.row__link');
    target.x = e.clientX;
    target.y = e.clientY;
    if (!preview.classList.contains('is-visible')) {
      pos.x = target.x;
      pos.y = target.y;
    }
    if (link && Number(link.dataset.index) !== current) {
      current = Number(link.dataset.index);
      preview.innerHTML = '';
      mount(preview, cover(projects[current], current, { eager: true }));
    }
    preview.classList.toggle('is-visible', Boolean(link));
    loop.start();
  });
  list.addEventListener('pointerleave', () => {
    preview.classList.remove('is-visible');
    current = -1;
  });
};

/** Compteur du carrousel mobile. */
const mountCarousel = (grid) => {
  const current = $('[data-carousel-current]');
  const bar = $('[data-carousel-bar]');
  let ticking = false;
  const update = () => {
    ticking = false;
    const visible = $$('.card:not([hidden])', grid);
    const max = grid.scrollWidth - grid.clientWidth;
    const ratio = max > 0 ? grid.scrollLeft / max : 0;
    const index = Math.round(ratio * (visible.length - 1));
    current.textContent = pad(index + 1);
    $('[data-carousel-total]').textContent = pad(visible.length);
    bar.style.transform = `scaleX(${visible.length ? (index + 1) / visible.length : 0})`;
  };
  grid.addEventListener('scroll', () => {
    if (!ticking) requestAnimationFrame(update);
    ticking = true;
  }, { passive: true });
  update();
  return update;
};

export const mountProjects = () => {
  const section = $('#projets');
  const stage = $('.projects__stage', section);
  const grid = $('[data-grid]', section);
  const list = $('[data-index-list]', section);
  let filter = ALL;

  mountTilt(grid);
  mountPreview(list, $('[data-preview]', section));
  const updateCarousel = mountCarousel(grid);

  const applyFilter = (next) => {
    filter = next;
    $$('[data-filter]', section).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === next)));
    stage.classList.add('is-filtering');
    withViewTransition(() => {
      $$('[data-project]', stage).forEach((el) => {
        el.hidden = next !== ALL && el.dataset.category !== next;
      });
      grid.scrollLeft = 0;
      updateCarousel();
    }, { types: ['filter'] }).then(() => stage.classList.remove('is-filtering'));
  };

  section.addEventListener('click', (e) => {
    const filterButton = e.target.closest('[data-filter]');
    if (filterButton && filterButton.dataset.filter !== filter) {
      applyFilter(filterButton.dataset.filter);
      if (filterButton.dataset.filter !== ALL) game.unlock('challenge:filter');
    }
    const viewButton = e.target.closest('[data-view]');
    if (viewButton) setView(viewButton.dataset.view, true);
  });

  const setView = (view, animate) => {
    const update = () => {
      stage.dataset.viewMode = view;
      $$('[data-view]', section).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
    };
    animate ? withViewTransition(update) : update();
    storage.set('projects-view', view);
  };
  setView(storage.get('projects-view', 'grid'), false);

  /* Marqueurs « Nouveau / Exploré » synchronisés avec la progression. */
  const refreshStates = () =>
    $$('[data-state]', section).forEach((el) => {
      el.textContent = stateLabel(el.dataset.state);
      el.classList.toggle('is-done', game.has(`project:${el.dataset.state}`));
    });
  refreshStates();
  game.on('change', refreshStates);
};
