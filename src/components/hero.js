/**
 * Hero : nom en très grand, et une « lentille » qui suit le curseur pour révéler
 * la face cachée du site (version plan / code du même titre).
 * Sur écran tactile, la lentille dérive seule et suit le doigt.
 */
import { html, $, text } from '../core/dom.js';
import { icon } from './icons.js';
import { profile } from '../data/profile.js';
import { projects } from '../data/projects.js';
import { prefersReducedMotion, hasFinePointer, lerp, createLoop } from '../core/motion.js';

/** Découpe un mot en lettres animables (l'index pilote le décalage d'animation). */
const letters = (word, offset) =>
  [...word].map((char, i) => html`<span class="char" style="--i: ${offset + i}">${char}</span>`);

const nameMarkup = (blueprint = false) => html`
  <span class="hero__line"><span class="hero__word">${letters(profile.firstName, 0)}</span></span>
  <span class="hero__line hero__line--indent">
    ${blueprint ? html`<span class="hero__tag" aria-hidden="true">&lt;h1&gt;</span>` : ''}
    <span class="hero__word">${letters(profile.lastName, profile.firstName.length)}</span>
  </span>
`;

export const renderHero = () => html`
  <section class="hero" id="accueil" aria-labelledby="hero-title" data-bp="section.hero">
    <div class="hero__meta" data-bp="meta">
      <span class="hero__meta-item">Portfolio <span class="dim">— Éd. ${new Date().getFullYear()}</span></span>
      <span class="hero__meta-item hero__meta-item--center">
        <span>${text(profile.location)}</span><span class="dim">·</span><time data-clock>--:--</time>
      </span>
      ${profile.availability.open
        ? html`<span class="hero__meta-item status"><span class="status__dot"></span><span>${text(profile.availability.label)}</span></span>`
        : ''}
    </div>

    <div class="hero__stage" data-lens>
      <h1 class="hero__name" id="hero-title" aria-label="${profile.firstName} ${profile.lastName}">${nameMarkup()}</h1>
      <div class="hero__blueprint" aria-hidden="true">
        <div class="hero__name hero__name--outline">${nameMarkup(true)}</div>
        <span class="hero__note hero__note--a">font-size: clamp(4rem, 15vw, 15rem)</span>
        <span class="hero__note hero__note--b">letter-spacing: -0.045em</span>
        <span class="hero__note hero__note--c" data-coords>x: 0 · y: 0</span>
      </div>
      <span class="hero__hint" aria-hidden="true">${hasFinePointer() ? 'Survolez le titre' : 'Glissez sur le titre'} — l’envers du décor</span>
    </div>

    <div class="hero__bottom">
      <div class="hero__intro" data-bp="intro">
        <p class="hero__role">${text(profile.role)}</p>
        <p class="hero__lead">
          Je conçois des
          <span class="rotator" data-rotator aria-hidden="true">
            ${profile.heroKeywords.map((word, i) => html`<span class="rotator__word" ${i === 0 ? 'data-active' : ''}>${word}</span>`)}
          </span>
          <span class="sr-only">${profile.heroKeywords.join(', ')}</span>
        </p>
        <p class="hero__tagline">${text(profile.tagline)}</p>
      </div>

      <div class="hero__actions">
        <a class="btn btn--primary" href="#projets" data-magnetic data-cursor="Go">
          <span class="btn__label">Explorer les projets</span>
          <span class="btn__count">${String(projects.length).padStart(2, '0')}</span>
          ${icon('arrowDown', 'icon icon--down')}
        </a>
        <a class="btn btn--ghost" href="#contact" data-magnetic>
          <span class="btn__label">Me contacter</span>
        </a>
      </div>

      <button class="hero__quest" type="button" data-action="logbook" data-cursor="Carnet">
        <span class="hero__quest-label">${icon('compass')} Mission : explorer le portfolio</span>
        <span class="hero__quest-bar"><span data-quest-bar></span></span>
        <span class="hero__quest-value" data-quest-value>0 %</span>
      </button>
    </div>

    <a class="hero__scroll" href="#apropos" aria-label="Défiler vers la suite">
      <span>Défiler</span><span class="hero__scroll-line"></span>
    </a>
  </section>
`;

const mountClock = () => {
  const clock = $('[data-clock]');
  const format = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: profile.timeZone });
  const tick = () => (clock.textContent = format.format(new Date()));
  tick();
  setInterval(tick, 15_000);
};

const mountRotator = () => {
  const words = [...document.querySelectorAll('.rotator__word')];
  if (words.length < 2 || prefersReducedMotion()) return;
  let index = 0;
  setInterval(() => {
    if (document.hidden) return;
    words[index].removeAttribute('data-active');
    words[index].setAttribute('data-leaving', '');
    const leaving = words[index];
    setTimeout(() => leaving.removeAttribute('data-leaving'), 600);
    index = (index + 1) % words.length;
    words[index].setAttribute('data-active', '');
  }, 2600);
};

const mountLens = () => {
  const stage = $('[data-lens]');
  const coords = $('[data-coords]');
  const reduced = prefersReducedMotion();
  const target = { x: 0, y: 0 };
  const pos = { x: 0, y: 0 };
  let userDriven = false;
  let visible = true;

  const setVars = () => {
    stage.style.setProperty('--lx', `${pos.x}px`);
    stage.style.setProperty('--ly', `${pos.y}px`);
    coords.textContent = `x: ${Math.round(pos.x)} · y: ${Math.round(pos.y)}`;
  };

  const loop = createLoop((time) => {
    if (!userDriven && !hasFinePointer()) {
      /* Dérive automatique (Lissajous) quand personne ne pilote la lentille. */
      const { width, height } = stage.getBoundingClientRect();
      target.x = width * (0.5 + 0.34 * Math.sin(time / 2100));
      target.y = height * (0.5 + 0.3 * Math.sin(time / 1500 + 1));
    }
    pos.x = lerp(pos.x, target.x, reduced ? 1 : 0.14);
    pos.y = lerp(pos.y, target.y, reduced ? 1 : 0.14);
    setVars();
    const settled = Math.abs(pos.x - target.x) < 0.3 && Math.abs(pos.y - target.y) < 0.3;
    if (!visible || (settled && (userDriven || hasFinePointer()))) return false;
  });

  const follow = (event) => {
    const rect = stage.getBoundingClientRect();
    target.x = event.clientX - rect.left;
    target.y = event.clientY - rect.top;
    loop.start();
  };

  stage.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'mouse') {
      follow(e);
      pos.x = target.x;
      pos.y = target.y;
    }
    stage.classList.add('is-lens');
  });
  stage.addEventListener('pointermove', (e) => {
    userDriven = e.pointerType !== 'mouse';
    follow(e);
  });
  stage.addEventListener('pointerleave', (e) => {
    if (e.pointerType === 'mouse') stage.classList.remove('is-lens');
    userDriven = false;
    if (!hasFinePointer()) loop.start();
  });

  /* Sur tactile, la lentille est visible en permanence et se promène. */
  if (!hasFinePointer() && !reduced) {
    stage.classList.add('is-lens', 'is-auto');
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) loop.start();
    }).observe(stage);
  }
};

/** Barre de mission du Hero, synchronisée avec la progression. */
export const updateHeroQuest = ({ percent }) => {
  const bar = $('[data-quest-bar]');
  if (!bar) return;
  bar.style.transform = `scaleX(${percent / 100})`;
  $('[data-quest-value]').textContent = `${percent} %`;
};

export const mountHero = () => {
  mountClock();
  mountRotator();
  mountLens();
};
