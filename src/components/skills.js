/**
 * Compétences : onglets par domaine, jauges de niveau, liens directs vers
 * les projets concernés, et radar SVG des moyennes par domaine.
 */
import { html, $, $$, mount, pad, text } from '../core/dom.js';
import { chapter } from './chapter.js';
import { skillDomains, skillLevels } from '../data/skills.js';
import { projects } from '../data/projects.js';
import { game } from '../core/game.js';
import { storage } from '../core/storage.js';

const average = (domain) => domain.skills.reduce((sum, s) => sum + s.level, 0) / (domain.skills.length || 1);
const projectNumber = (slug) => pad(projects.findIndex((p) => p.slug === slug) + 1);

/* ── Radar ─────────────────────────────────────────────── */
const SIZE = 260;
const CENTER = SIZE / 2;
const RADIUS = 92;
const point = (i, ratio) => {
  const angle = (Math.PI * 2 * i) / skillDomains.length - Math.PI / 2;
  return [CENTER + Math.cos(angle) * RADIUS * ratio, CENTER + Math.sin(angle) * RADIUS * ratio];
};
const polygon = (ratioFor) => skillDomains.map((d, i) => point(i, ratioFor(d)).map((n) => n.toFixed(1)).join(',')).join(' ');

const radar = () => html`
  <svg class="radar" viewBox="0 0 ${SIZE} ${SIZE}" role="img" aria-label="Niveau moyen par domaine">
    ${[0.25, 0.5, 0.75, 1].map((r) => html`<polygon class="radar__ring" points="${polygon(() => r)}" />`)}
    ${skillDomains.map((d, i) => {
      const [x, y] = point(i, 1);
      return html`<line class="radar__axis" x1="${CENTER}" y1="${CENTER}" x2="${x}" y2="${y}" />`;
    })}
    <polygon class="radar__shape" points="${polygon((d) => average(d) / skillLevels.length)}" />
    ${skillDomains.map((d, i) => {
      const [x, y] = point(i, average(d) / skillLevels.length);
      const [lx, ly] = point(i, 1.24);
      return html`
        <g class="radar__node" data-radar="${d.id}">
          <circle cx="${x}" cy="${y}" r="3.5" />
          <text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle">${pad(i + 1)}</text>
        </g>
      `;
    })}
  </svg>
`;

/* ── Panneau d'un domaine ─────────────────────────────── */
const domainPanel = (domain) => html`
  <div class="skills__head">
    <h3>${domain.title}</h3>
    <p>${text(domain.description)}</p>
  </div>
  <ul class="skills__list">
    ${domain.skills.map(
      (skill, i) => html`
        <li class="skill" style="--i: ${i}">
          <span class="skill__name">${text(skill.name)}</span>
          <span class="skill__meter" role="meter" aria-valuemin="1" aria-valuemax="${skillLevels.length}"
            aria-valuenow="${skill.level}" aria-label="Niveau : ${skillLevels[skill.level - 1]}">
            ${skillLevels.map((_, n) => html`<span class="${n < skill.level ? 'is-on' : ''}" style="--n: ${n}"></span>`)}
          </span>
          <span class="skill__level">${skillLevels[skill.level - 1]}</span>
          <span class="skill__projects">
            ${skill.projects.map(
              (slug) => html`<a href="#projet/${slug}" data-cursor="Voir" aria-label="Voir le projet ${projectNumber(slug)}">P${projectNumber(slug)}</a>`,
            )}
          </span>
        </li>
      `,
    )}
  </ul>
`;

export const renderSkills = () => html`
  <section class="section skills-section" id="competences" aria-labelledby="competences-title" data-bp="section.skills">
    <div class="container">
      ${chapter('competences')}

      <div class="skills" data-reveal>
        <div class="skills__tabs" role="tablist" aria-label="Domaines de compétences" aria-orientation="vertical">
          ${skillDomains.map(
            (d, i) => html`
              <button class="skills__tab" type="button" role="tab" id="tab-${d.id}" data-domain="${d.id}"
                aria-controls="skills-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">
                <span class="skills__tab-num">${pad(i + 1)}</span>
                <span class="skills__tab-title">${d.title}</span>
                <span class="skills__tab-count">${d.skills.length}</span>
              </button>
            `,
          )}
        </div>

        <div class="skills__panel" id="skills-panel" role="tabpanel" aria-labelledby="tab-${skillDomains[0].id}" data-skills-panel>
          ${domainPanel(skillDomains[0])}
        </div>

        <aside class="skills__radar" aria-label="Vue d’ensemble">
          ${radar()}
          <p class="skills__legend">Niveau moyen par domaine <span class="dim">/ ${skillLevels.length}</span></p>
        </aside>
      </div>
    </div>
  </section>
`;

export const mountSkills = () => {
  const root = $('.skills');
  const panel = $('[data-skills-panel]', root);
  const tabs = $$('[data-domain]', root);
  let seen = new Set(storage.get('skills-seen', []));
  game.on('reset', () => (seen = new Set()));

  const markSeen = (id) => {
    seen.add(id);
    storage.set('skills-seen', [...seen]);
    if (skillDomains.every((d) => seen.has(d.id))) game.unlock('challenge:skills');
  };

  const select = (id, focus = false) => {
    const domain = skillDomains.find((d) => d.id === id);
    tabs.forEach((tab) => {
      const active = tab.dataset.domain === id;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    $$('[data-radar]', root).forEach((n) => n.classList.toggle('is-active', n.dataset.radar === id));
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panel.innerHTML = '';
    mount(panel, domainPanel(domain));
    markSeen(id);
  };

  root.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-domain], [data-radar]');
    if (trigger) select(trigger.dataset.domain ?? trigger.dataset.radar);
  });

  /* Navigation clavier entre onglets (flèches, Début, Fin). */
  root.querySelector('[role="tablist"]').addEventListener('keydown', (e) => {
    const index = tabs.indexOf(document.activeElement);
    if (index === -1) return;
    const moves = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next = null;
    if (e.key in moves) next = (index + moves[e.key] + tabs.length) % tabs.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = tabs.length - 1;
    if (next === null) return;
    e.preventDefault();
    select(tabs[next].dataset.domain, true);
  });

  $$('[data-radar]', root)[0]?.classList.add('is-active');

  /* Le premier domaine compte comme vu dès que la section est réellement consultée. */
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    markSeen(skillDomains[0].id);
    observer.disconnect();
  }, { threshold: 0.5 });
  observer.observe(panel);
};
