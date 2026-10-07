/**
 * Fiche projet détaillée, ouverte via l'URL (#projet/slug) : partageable,
 * compatible avec le bouton Retour, transition « morphing » depuis la carte.
 */
import { html, $, $$, mount, pad, text } from '../core/dom.js';
import { icon } from './icons.js';
import { cover } from './cover.js';
import { projects } from '../data/projects.js';
import { game } from '../core/game.js';
import { withViewTransition } from '../core/motion.js';
import { lockScroll, unlockScroll } from '../core/scrollLock.js';
import { trapFocus } from '../core/focusTrap.js';

const PREFIX = '#projet/';
const indexOf = (slug) => projects.findIndex((p) => p.slug === slug);

export const renderPanel = () => html`
  <div class="panel" data-panel role="dialog" aria-modal="true" aria-labelledby="panel-title" hidden>
    <div class="panel__backdrop" data-panel-close></div>
    <article class="panel__sheet" data-panel-sheet></article>
  </div>
`;

const panelContent = (project, index) => {
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  return html`
    <header class="panel__bar">
      <span class="panel__crumb"><span class="accent">P/${pad(index + 1)}</span> ${project.category}</span>
      <div class="panel__controls">
        <a class="tool" href="${PREFIX}${prev.slug}" data-panel-nav aria-label="Projet précédent">${icon('arrowLeft')}</a>
        <span class="panel__count">${pad(index + 1)} / ${pad(projects.length)}</span>
        <a class="tool" href="${PREFIX}${next.slug}" data-panel-nav aria-label="Projet suivant">${icon('arrowRight')}</a>
        <button class="tool tool--close" type="button" data-panel-close aria-label="Fermer la fiche (Échap)">${icon('close')}</button>
      </div>
      <span class="panel__progress" data-panel-progress></span>
    </header>

    <div class="panel__scroll" data-panel-scroll>
      <div class="panel__media">${cover(project, index, { eager: true })}</div>

      <div class="panel__inner">
        <div class="panel__head">
          <h2 class="panel__title" id="panel-title">${text(project.title)}</h2>
          <p class="panel__summary">${text(project.summary)}</p>
          <div class="panel__links">
            ${project.links.map(
              (link, i) => html`
                <a class="btn ${i === 0 ? 'btn--primary' : 'btn--ghost'}" href="${link.url}" target="_blank" rel="noopener noreferrer">
                  <span class="btn__label">${link.label}</span>${icon('arrowUpRight', 'icon icon--diag')}
                </a>
              `,
            )}
          </div>
        </div>

        <dl class="panel__meta">
          <div><dt>Année</dt><dd>${text(project.year)}</dd></div>
          ${project.meta.map((m) => html`<div><dt>${m.label}</dt><dd>${text(m.value)}</dd></div>`)}
        </dl>

        <div class="panel__sections">
          ${project.sections.map(
            (s, i) => html`
              <section class="panel__section">
                <h3><span class="dim">${pad(i + 1)}</span> ${s.title}</h3>
                <p>${text(s.body)}</p>
              </section>
            `,
          )}
        </div>

        <div class="panel__stack">
          <h3>Stack &amp; outils</h3>
          <ul class="card__tags">${project.tags.map((t) => html`<li>${text(t)}</li>`)}</ul>
        </div>

        <div class="panel__gallery">
          ${project.gallery.map(
            (src, i) => html`
              <figure>
                ${src
                  ? html`<img src="${src}" alt="${project.title} — visuel ${i + 1}" loading="lazy" decoding="async" />`
                  : html`<div class="panel__placeholder"><span class="ph">[VISUEL ${pad(i + 1)}]</span></div>`}
              </figure>
            `,
          )}
        </div>

        <a class="panel__next" href="${PREFIX}${next.slug}" data-panel-nav>
          <span class="panel__next-label">Projet suivant ${icon('arrowRight')}</span>
          <span class="panel__next-title">${text(next.title)}</span>
        </a>
      </div>
    </div>
  `;
};

export const mountPanel = () => {
  const panel = $('[data-panel]');
  const sheet = $('[data-panel-sheet]', panel);
  let current = null;
  let returnUrl = '#projets';
  let releaseFocus = null;

  const cardMedia = (slug) => $(`.card[data-project="${slug}"]:not([hidden]) [data-media]`);

  const fill = (slug) => {
    const index = indexOf(slug);
    sheet.innerHTML = '';
    mount(sheet, panelContent(projects[index], index));
    current = slug;
    const scroller = $('[data-panel-scroll]', sheet);
    const bar = $('[data-panel-progress]', sheet);
    scroller.addEventListener('scroll', () => {
      const max = scroller.scrollHeight - scroller.clientHeight;
      bar.style.transform = `scaleX(${max > 0 ? scroller.scrollTop / max : 0})`;
    }, { passive: true });
    game.unlock(`project:${slug}`);
  };

  const open = (slug) => {
    if (current === slug) return;
    if (current) {
      withViewTransition(() => {
        fill(slug);
        $('.tool--close', sheet).focus({ preventScroll: true });
      }, { types: ['project-swap'] });
      return;
    }
    const source = cardMedia(slug);
    source?.style.setProperty('view-transition-name', 'project-media');
    withViewTransition(() => {
      source?.style.removeProperty('view-transition-name');
      fill(slug);
      panel.hidden = false;
      panel.classList.add('is-open');
      lockScroll();
      releaseFocus = trapFocus(panel);
      $('.tool--close', sheet).focus({ preventScroll: true });
    }, { types: ['project-open'] });
  };

  const close = () => {
    if (!current) return;
    const slug = current;
    current = null;
    releaseFocus?.();
    withViewTransition(() => {
      panel.classList.remove('is-open');
      panel.hidden = true;
      unlockScroll();
      cardMedia(slug)?.style.setProperty('view-transition-name', 'project-media');
    }, { types: ['project-close'] }).then(() => {
      cardMedia(slug)?.style.removeProperty('view-transition-name');
      sheet.innerHTML = '';
    });
  };

  /** Routeur minimal basé sur le hash. */
  const route = (previousUrl) => {
    const slug = location.hash.startsWith(PREFIX) ? decodeURIComponent(location.hash.slice(PREFIX.length)) : null;
    if (slug && indexOf(slug) !== -1) {
      if (!current) {
        const previous = previousUrl ? new URL(previousUrl) : null;
        returnUrl = previous && !previous.hash.startsWith(PREFIX) ? previous.hash || ' ' : '#projets';
      }
      open(slug);
    } else {
      close();
    }
  };

  /* On restaure l'URL d'avant l'ouverture sans naviguer (pas de saut de scroll). */
  const requestClose = () => {
    history.replaceState(null, '', `${location.pathname}${location.search}${returnUrl.trim()}`);
    close();
  };

  addEventListener('hashchange', (e) => route(e.oldURL));
  route(null);

  panel.addEventListener('click', (e) => {
    if (e.target.closest('[data-panel-close]')) requestClose();
    const navLink = e.target.closest('[data-panel-nav]');
    if (navLink) {
      e.preventDefault();
      location.replace(navLink.getAttribute('href'));
    }
  });
  /* Écouté sur le document : le focus peut être perdu lors d'un changement de projet. */
  document.addEventListener('keydown', (e) => {
    if (!current || e.defaultPrevented) return;
    if (e.key === 'Escape') requestClose();
    if (e.target.matches('input, textarea')) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const links = $$('.panel__controls [data-panel-nav]', panel);
      links[e.key === 'ArrowLeft' ? 0 : 1]?.click();
    }
  });
};
