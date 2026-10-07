/**
 * Palette de commandes (Ctrl/⌘ + K ou « / ») : navigation rapide vers les sections,
 * les projets et les actions du site. Recherche insensible aux accents.
 */
import { html, $, $$, mount, normalize, pad } from '../core/dom.js';
import { icon } from './icons.js';
import { sections } from '../data/sections.js';
import { projects } from '../data/projects.js';
import { secretCommand } from '../data/quests.js';
import { game } from '../core/game.js';
import { registerAction, runAction } from '../core/actions.js';
import { lockScroll, unlockScroll } from '../core/scrollLock.js';
import { trapFocus } from '../core/focusTrap.js';
import { getTheme } from '../core/theme.js';
import { canUseBlueprint, isBlueprint } from '../core/blueprint.js';
import { showToast } from './toast.js';

const go = (hash) => () => {
  location.hash = hash;
};

/** Liste des commandes, construite à l'ouverture pour refléter l'état courant. */
const buildCommands = () => [
  ...sections.map((s, i) => ({
    group: 'Navigation',
    label: s.label,
    hint: pad(i),
    icon: 'arrowRight',
    run: go(s.id),
  })),
  ...projects.map((p, i) => ({
    group: 'Projets',
    label: p.title,
    hint: `${p.category} · ${game.has(`project:${p.slug}`) ? 'exploré' : 'nouveau'}`,
    icon: 'arrowUpRight',
    keywords: p.tags.join(' '),
    run: go(`projet/${p.slug}`),
    index: i,
  })),
  { group: 'Actions', label: 'Ouvrir le carnet d’exploration', hint: `${game.stats().percent} %`, icon: 'compass', run: () => runAction('logbook') },
  { group: 'Actions', label: 'Copier mon adresse e-mail', icon: 'copy', run: () => runAction('copy-email') },
  {
    group: 'Actions',
    label: getTheme() === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre',
    icon: getTheme() === 'dark' ? 'sun' : 'moon',
    keywords: 'theme mode clair sombre',
    run: () => runAction('theme'),
  },
  ...(canUseBlueprint()
    ? [{ group: 'Actions', label: `${isBlueprint() ? 'Désactiver' : 'Activer'} le mode Blueprint`, hint: 'B', icon: 'blueprint', run: () => runAction('blueprint') }]
    : []),
];

const secretItem = {
  group: 'Terminal',
  label: `Exécuter « ${secretCommand} »`,
  hint: 'root',
  icon: 'command',
  run: () => {
    if (!game.unlock('secret:sudo')) showToast({ title: 'Accès root déjà accordé', text: 'Vous connaissez la maison.', icon: 'command' });
  },
};

export const renderPalette = () => html`
  <div class="palette" data-palette role="dialog" aria-modal="true" aria-label="Palette de commandes" hidden>
    <div class="palette__backdrop" data-palette-close></div>
    <div class="palette__box">
      <label class="palette__field">
        ${icon('search')}
        <input type="text" data-palette-input placeholder="Rechercher une section, un projet, une action…"
          role="combobox" aria-expanded="true" aria-controls="palette-list" aria-autocomplete="list" autocomplete="off" spellcheck="false" />
        <kbd>Échap</kbd>
      </label>
      <ul class="palette__list" id="palette-list" role="listbox" data-palette-list></ul>
      <footer class="palette__foot">
        <span><kbd>↑</kbd><kbd>↓</kbd> naviguer</span>
        <span><kbd>↵</kbd> ouvrir</span>
        <span class="palette__tip">Astuce : <kbd>/</kbd> ouvre aussi la palette</span>
      </footer>
    </div>
  </div>
`;

export const mountPalette = () => {
  const palette = $('[data-palette]');
  const input = $('[data-palette-input]', palette);
  const list = $('[data-palette-list]', palette);
  let commands = [];
  let results = [];
  let active = 0;
  let release = null;

  const filter = (query) => {
    const q = normalize(query);
    if (q === normalize(secretCommand)) return [secretItem];
    if (!q) return commands;
    const terms = q.split(/\s+/);
    return commands.filter((c) => {
      const haystack = normalize(`${c.label} ${c.group} ${c.hint ?? ''} ${c.keywords ?? ''}`);
      return terms.every((t) => haystack.includes(t));
    });
  };

  const render = () => {
    list.innerHTML = '';
    if (!results.length) {
      mount(list, html`<li class="palette__empty">Aucun résultat pour « ${input.value} »</li>`);
      input.removeAttribute('aria-activedescendant');
      return;
    }
    let lastGroup = null;
    results.forEach((cmd, i) => {
      if (cmd.group !== lastGroup) {
        mount(list, html`<li class="palette__group" role="presentation">${cmd.group}</li>`);
        lastGroup = cmd.group;
      }
      mount(
        list,
        html`
          <li class="palette__item" role="option" id="cmd-${i}" data-index="${i}" aria-selected="${i === active}">
            ${icon(cmd.icon)}<span class="palette__label">${cmd.label}</span>
            ${cmd.hint ? html`<span class="palette__hint">${cmd.hint}</span>` : ''}
          </li>
        `,
      );
    });
    input.setAttribute('aria-activedescendant', `cmd-${active}`);
  };

  const setActive = (index) => {
    active = (index + results.length) % results.length;
    $$('.palette__item', list).forEach((el) => el.setAttribute('aria-selected', String(Number(el.dataset.index) === active)));
    input.setAttribute('aria-activedescendant', `cmd-${active}`);
    $(`#cmd-${active}`, list)?.scrollIntoView({ block: 'nearest' });
  };

  const open = () => {
    if (!palette.hidden) return;
    commands = buildCommands();
    results = commands;
    active = 0;
    input.value = '';
    render();
    palette.hidden = false;
    lockScroll();
    requestAnimationFrame(() => palette.classList.add('is-open'));
    release = trapFocus(palette);
    input.focus();
    game.unlock('challenge:palette');
  };

  const close = () => {
    if (palette.hidden) return;
    palette.classList.remove('is-open');
    unlockScroll();
    release?.();
    setTimeout(() => (palette.hidden = true), 200);
  };

  const execute = (index) => {
    const cmd = results[index];
    if (!cmd) return;
    close();
    /* Laisse le scroll se déverrouiller avant de naviguer. */
    requestAnimationFrame(() => cmd.run());
  };

  registerAction('palette', open);

  input.addEventListener('input', () => {
    results = filter(input.value);
    active = 0;
    render();
  });
  palette.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowDown') (e.preventDefault(), setActive(active + 1));
    else if (e.key === 'ArrowUp') (e.preventDefault(), setActive(active - 1));
    else if (e.key === 'Enter') (e.preventDefault(), execute(active));
  });
  list.addEventListener('click', (e) => {
    const item = e.target.closest('.palette__item');
    if (item) execute(Number(item.dataset.index));
  });
  list.addEventListener('pointermove', (e) => {
    const item = e.target.closest('.palette__item');
    if (item && Number(item.dataset.index) !== active) setActive(Number(item.dataset.index));
  });
  palette.addEventListener('click', (e) => e.target.closest('[data-palette-close]') && close());

  /* Raccourcis globaux. */
  addEventListener('keydown', (e) => {
    const typing = e.target.matches?.('input, textarea, [contenteditable="true"]');
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      palette.hidden ? open() : close();
    } else if (e.key === '/' && !typing && palette.hidden) {
      e.preventDefault();
      open();
    }
  });
};
