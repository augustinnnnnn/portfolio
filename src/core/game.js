/**
 * Moteur de gamification : catalogue d'objectifs, XP, niveaux, persistance.
 * Le catalogue est dérivé des données (sections, projets, défis, secrets).
 */
import { sections } from '../data/sections.js';
import { projects } from '../data/projects.js';
import { xp, levels, challenges, secrets } from '../data/quests.js';
import { storage } from './storage.js';
import { createEmitter } from './emitter.js';

export const GROUPS = [
  { id: 'zones', title: 'Zones' },
  { id: 'projects', title: 'Projets' },
  { id: 'challenges', title: 'Défis' },
  { id: 'secrets', title: 'Secrets' },
];

const catalog = [
  ...sections
    .filter((s) => s.id !== 'accueil')
    .map((s) => ({
      id: `section:${s.id}`,
      group: 'zones',
      title: s.label,
      description: `Découvrir la section ${s.label}.`,
      xp: xp.section,
      href: `#${s.id}`,
    })),
  ...projects.map((p) => ({
    id: `project:${p.slug}`,
    group: 'projects',
    title: p.title,
    description: p.category,
    xp: xp.project,
    href: `#projet/${p.slug}`,
  })),
  ...challenges.map((c) => ({ ...c, id: `challenge:${c.id}`, group: 'challenges' })),
  ...secrets.map((s) => ({ ...s, id: `secret:${s.id}`, group: 'secrets', secret: true })),
];

const byId = new Map(catalog.map((q) => [q.id, q]));
const totalXp = catalog.reduce((sum, q) => sum + q.xp, 0);
const events = createEmitter();

let unlocked = storage.get('progress', {});

const levelFor = (percent) => {
  let index = 0;
  levels.forEach((l, i) => {
    if (percent >= l.at) index = i;
  });
  return { index, ...levels[index], next: levels[index + 1] ?? null };
};

const computeStats = () => {
  const earned = catalog.filter((q) => unlocked[q.id]);
  const xpEarned = earned.reduce((sum, q) => sum + q.xp, 0);
  const percent = totalXp ? Math.round((xpEarned / totalXp) * 100) : 0;
  return {
    xp: xpEarned,
    totalXp,
    percent,
    done: earned.length,
    count: catalog.length,
    level: levelFor(percent),
    complete: earned.length === catalog.length,
  };
};

export const game = {
  catalog,
  on: events.on,

  has: (id) => Boolean(unlocked[id]),
  get: (id) => byId.get(id),
  stats: computeStats,

  /** Débloque un objectif. Retourne true s'il vient d'être obtenu. */
  unlock(id) {
    const quest = byId.get(id);
    if (!quest || unlocked[id]) return false;

    const before = computeStats();
    unlocked = { ...unlocked, [id]: Date.now() };
    storage.set('progress', unlocked);
    const after = computeStats();

    events.emit('unlock', { quest, stats: after });
    if (after.level.index > before.level.index) events.emit('level', after);
    if (after.complete) events.emit('complete', after);
    events.emit('change', after);
    return true;
  },

  reset() {
    unlocked = {};
    storage.remove('progress');
    storage.remove('skills-seen');
    events.emit('reset');
    events.emit('change', computeStats());
  },
};
