/**
 * Navigation : barre supérieure (desktop), dock inférieur + menu plein écran (mobile),
 * détection de la section active et indicateur de progression du scroll.
 */
import { html, $, $$, pad } from '../core/dom.js';
import { icon } from './icons.js';
import { xpRing } from './xpRing.js';
import { profile } from '../data/profile.js';
import { sections } from '../data/sections.js';
import { game } from '../core/game.js';
import { registerAction } from '../core/actions.js';
import { lockScroll, unlockScroll } from '../core/scrollLock.js';
import { trapFocus } from '../core/focusTrap.js';

const links = sections.slice(1);

export const renderNav = () => html`
  <header class="nav" data-nav data-bp="nav">
    <div class="nav__inner">
      <a class="nav__logo" href="#accueil" data-logo data-cursor="Accueil" aria-label="Retour à l’accueil">
        <span class="nav__mark">${profile.initials}</span>
        <span class="nav__name">${profile.firstName} ${profile.lastName}</span>
      </a>

      <nav class="nav__links" aria-label="Navigation principale">
        <span class="nav__indicator" aria-hidden="true"></span>
        ${links.map(
          (s, i) => html`
            <a href="#${s.id}" data-link="${s.id}">
              <span class="nav__num">${pad(i + 1)}</span>
              <span class="nav__label">${s.label}</span>
            </a>
          `,
        )}
      </nav>

      <div class="nav__tools">
        <button class="tool tool--search" type="button" data-action="palette" aria-label="Rechercher (Ctrl + K)">
          ${icon('search')}<kbd data-shortcut>Ctrl K</kbd>
        </button>
        <button class="tool" type="button" data-action="theme" aria-label="Changer de thème">
          ${icon('sun', 'icon icon--sun')}${icon('moon', 'icon icon--moon')}
        </button>
        ${xpRing()}
      </div>
    </div>
    <span class="nav__progress" aria-hidden="true"></span>
  </header>

  <div class="dock" data-dock>
    <a class="dock__home" href="#accueil" data-logo aria-label="Accueil">${profile.initials}</a>
    <button class="dock__current" type="button" data-action="menu" aria-label="Ouvrir le menu">
      <span class="dock__num" data-dock-num>00</span>
      <span class="dock__label" data-dock-label>${sections[0].short}</span>
    </button>
    <button class="dock__icon" type="button" data-action="palette" aria-label="Rechercher">${icon('search')}</button>
    ${xpRing('xp-ring--dock')}
    <button class="dock__menu" type="button" data-action="menu" aria-expanded="false" aria-controls="menu" aria-label="Menu">
      <span></span><span></span>
    </button>
  </div>

  <div class="menu" id="menu" data-menu role="dialog" aria-modal="true" aria-label="Menu" hidden>
    <nav class="menu__links" aria-label="Navigation mobile">
      ${sections.map(
        (s, i) => html`
          <a href="#${s.id}" data-link="${s.id}" style="--i: ${i}">
            <span class="menu__num">${pad(i)}</span>
            <span class="menu__label">${s.label}</span>
            ${icon('arrowRight')}
          </a>
        `,
      )}
    </nav>
    <div class="menu__foot">
      <button type="button" class="chip" data-action="theme">${icon('sun', 'icon icon--sun')}${icon('moon', 'icon icon--moon')} Thème</button>
      <button type="button" class="chip" data-action="logbook">${icon('compass')} Carnet</button>
      <button type="button" class="chip" data-action="close-menu">${icon('close')} Fermer</button>
    </div>
  </div>
`;

export const mountNav = () => {
  const nav = $('[data-nav]');
  const linksBox = $('.nav__links', nav);
  const indicator = $('.nav__indicator', nav);
  const progress = $('.nav__progress', nav);
  const menu = $('[data-menu]');
  const menuButton = $('.dock__menu');
  let active = 'accueil';

  if (/Mac|iPhone|iPad/.test(navigator.platform)) $('[data-shortcut]', nav).textContent = '⌘K';

  /* Indicateur glissant : suit le survol, revient sur la section active. */
  const moveIndicator = (link) => {
    if (!link) {
      indicator.style.opacity = '0';
      return;
    }
    indicator.style.opacity = '1';
    indicator.style.transform = `translateX(${link.offsetLeft}px)`;
    indicator.style.width = `${link.offsetWidth}px`;
  };
  const activeLink = () => $(`[data-link="${active}"]`, linksBox);
  linksBox.addEventListener('pointerover', (e) => moveIndicator(e.target.closest('a') ?? activeLink()));
  linksBox.addEventListener('pointerleave', () => moveIndicator(activeLink()));
  window.addEventListener('resize', () => moveIndicator(activeLink()));
  document.fonts?.ready.then(() => moveIndicator(activeLink()));

  /* Section active (ligne de détection au milieu de l'écran). */
  const setActive = (id) => {
    if (id === active) return;
    active = id;
    $$('[data-link]').forEach((a) => a.toggleAttribute('aria-current', a.dataset.link === id));
    moveIndicator(activeLink());
    const index = sections.findIndex((s) => s.id === id);
    $('[data-dock-num]').textContent = pad(index);
    $('[data-dock-label]').textContent = sections[index].short;
    if (id !== 'accueil') game.unlock(`section:${id}`);
  };

  const spy = new IntersectionObserver(
    (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
    { rootMargin: '-48% 0px -48% 0px' },
  );
  sections.forEach((s) => {
    const el = document.getElementById(s.id);
    if (el) spy.observe(el);
  });

  /* État compact + barre de progression, calculés une fois par frame. */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const y = scrollY;
      nav.toggleAttribute('data-compact', y > 40);
      progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Menu mobile. */
  let releaseFocus = null;
  const openMenu = () => {
    menu.hidden = false;
    lockScroll();
    menuButton.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('menu-open');
    requestAnimationFrame(() => menu.classList.add('is-open'));
    releaseFocus = trapFocus(menu);
    $('a', menu).focus({ preventScroll: true });
  };
  const closeMenu = () => {
    if (menu.hidden) return;
    menu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('menu-open');
    unlockScroll();
    releaseFocus?.();
    setTimeout(() => (menu.hidden = true), 350);
  };

  registerAction('menu', () => (menu.hidden ? openMenu() : closeMenu()));
  registerAction('close-menu', closeMenu);
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a, [data-action="logbook"]')) closeMenu();
  });
  menu.addEventListener('keydown', (e) => e.key === 'Escape' && closeMenu());
  matchMedia('(min-width: 900px)').addEventListener('change', closeMenu);

  return { closeMenu };
};
