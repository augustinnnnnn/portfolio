/** « Carnet d'exploration » : tiroir listant progression, objectifs, secrets et récompense. */
import { html, $, mount } from '../core/dom.js';
import { icon } from './icons.js';
import { game, GROUPS } from '../core/game.js';
import { levels, reward } from '../data/quests.js';
import { registerAction } from '../core/actions.js';
import { lockScroll, unlockScroll } from '../core/scrollLock.js';
import { trapFocus } from '../core/focusTrap.js';
import { isBlueprint } from '../core/blueprint.js';

export const renderLogbook = () => html`
  <div class="drawer" data-logbook role="dialog" aria-modal="true" aria-labelledby="logbook-title" hidden>
    <div class="drawer__backdrop" data-logbook-close></div>
    <aside class="drawer__sheet">
      <div class="drawer__grip" aria-hidden="true"></div>
      <div class="drawer__content" data-logbook-content></div>
    </aside>
  </div>
`;

const item = (quest) => {
  const done = game.has(quest.id);
  const hidden = quest.secret && !done;
  const iconName = done ? 'check' : hidden ? 'lock' : null;
  const body = html`
    <span class="quest__icon">${iconName ? icon(iconName) : ''}</span>
    <span class="quest__text">
      <strong>${hidden ? '???' : quest.title}</strong>
      <span>${hidden ? quest.hint : quest.description}</span>
    </span>
    <span class="quest__xp">${quest.xp} XP</span>
  `;
  const className = `quest ${done ? 'is-done' : ''} ${hidden ? 'is-secret' : ''}`;
  return quest.href && !done
    ? html`<li><a class="${className}" href="${quest.href}" data-logbook-close>${body}</a></li>`
    : html`<li><div class="${className}">${body}</div></li>`;
};

const content = () => {
  const stats = game.stats();
  const { level } = stats;
  return html`
    <header class="logbook__head">
      <div class="logbook__top">
        <span class="eyebrow">${icon('compass')} Carnet d’exploration</span>
        <button class="tool" type="button" data-logbook-close aria-label="Fermer le carnet">${icon('close')}</button>
      </div>
      <div class="logbook__level">
        <div>
          <span class="logbook__rank">Niveau ${level.index + 1} / ${levels.length}</span>
          <h2 id="logbook-title">${level.title}</h2>
        </div>
        <span class="logbook__percent">${stats.percent}<small>%</small></span>
      </div>
      <div class="logbook__bar" style="--p: ${stats.percent}">
        <span class="logbook__fill"></span>
        ${levels.slice(1).map((l) => html`<span class="logbook__tick ${stats.percent >= l.at ? 'is-on' : ''}" style="--at: ${l.at}" title="${l.title} — ${l.at} %"></span>`)}
      </div>
      <p class="logbook__meta">
        <span>${stats.xp} / ${stats.totalXp} XP</span>
        <span>${stats.done} / ${stats.count} objectifs</span>
        ${level.next ? html`<span>Prochain : <b>${level.next.title}</b> à ${level.next.at} %</span>` : html`<span>Niveau maximal atteint</span>`}
      </p>
    </header>

    <div class="logbook__body">
      ${stats.complete
        ? html`
            <div class="reward">
              <span class="reward__icon">${icon('blueprint')}</span>
              <div>
                <strong>${reward.title}</strong>
                <p>${reward.description}</p>
                <button class="btn btn--primary btn--sm" type="button" data-action="blueprint">
                  <span class="btn__label">${isBlueprint() ? 'Désactiver' : 'Activer'} le mode Blueprint</span>
                </button>
              </div>
            </div>
          `
        : html`
            <div class="reward is-locked">
              <span class="reward__icon">${icon('lock')}</span>
              <div>
                <strong>Récompense à 100 %</strong>
                <p>Explorez tout le portfolio pour débloquer une fonctionnalité cachée.</p>
              </div>
            </div>
          `}

      ${GROUPS.map((group) => {
        const quests = game.catalog.filter((q) => q.group === group.id);
        const done = quests.filter((q) => game.has(q.id)).length;
        return html`
          <section class="logbook__group">
            <h3>${group.title} <span class="dim">${done}/${quests.length}</span></h3>
            <ul class="quests">${quests.map(item)}</ul>
          </section>
        `;
      })}
    </div>

    <footer class="logbook__foot">
      <span class="dim">Progression enregistrée sur cet appareil.</span>
      <button class="link-btn" type="button" data-logbook-reset>Réinitialiser</button>
    </footer>
  `;
};

export const mountLogbook = () => {
  const drawer = $('[data-logbook]');
  const target = $('[data-logbook-content]', drawer);
  let release = null;
  let confirmReset = false;

  const render = () => {
    const scroll = $('.logbook__body', target)?.scrollTop ?? 0;
    target.innerHTML = '';
    mount(target, content());
    $('.logbook__body', target).scrollTop = scroll;
  };

  const open = () => {
    if (!drawer.hidden) return;
    render();
    drawer.hidden = false;
    lockScroll();
    requestAnimationFrame(() => drawer.classList.add('is-open'));
    release = trapFocus(drawer);
    $('[data-logbook-close].tool', drawer).focus({ preventScroll: true });
  };

  const close = () => {
    if (drawer.hidden) return;
    drawer.classList.remove('is-open');
    unlockScroll();
    release?.();
    confirmReset = false;
    setTimeout(() => (drawer.hidden = true), 380);
  };

  registerAction('logbook', open);
  game.on('change', () => !drawer.hidden && render());

  drawer.addEventListener('click', (e) => {
    if (e.target.closest('[data-logbook-close]')) close();
    const reset = e.target.closest('[data-logbook-reset]');
    if (reset) {
      if (!confirmReset) {
        confirmReset = true;
        reset.textContent = 'Confirmer la réinitialisation ?';
        return;
      }
      game.reset();
    }
  });
  drawer.addEventListener('keydown', (e) => e.key === 'Escape' && close());
};
