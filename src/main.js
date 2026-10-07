/**
 * Point d'entrée : assemble les sections, puis active les comportements.
 * Pour modifier le contenu, voir uniquement le dossier src/data/.
 */
import './styles/index.css';

import { html, mount } from './core/dom.js';
import { game } from './core/game.js';
import { registerAction } from './core/actions.js';
import { toggleTheme } from './core/theme.js';
import { initBlueprint, toggleBlueprint, isBlueprint } from './core/blueprint.js';
import { mountReveal } from './core/reveal.js';

import { renderNav, mountNav } from './components/nav.js';
import { renderHero, mountHero, updateHeroQuest } from './components/hero.js';
import { renderAbout, mountAbout } from './components/about.js';
import { renderProjects, mountProjects } from './components/projects.js';
import { renderPanel, mountPanel } from './components/projectPanel.js';
import { renderSkills, mountSkills } from './components/skills.js';
import { renderJourney, mountJourney } from './components/journey.js';
import { renderContact, mountContact, updateFooterStatus } from './components/contact.js';
import { renderLogbook, mountLogbook } from './components/logbook.js';
import { renderPalette, mountPalette } from './components/palette.js';
import { renderToasts, showToast } from './components/toast.js';
import { updateXpRings } from './components/xpRing.js';
import { mountCursor } from './components/cursor.js';
import { mountSecrets } from './components/secrets.js';
import { reward } from './data/quests.js';
import { profile } from './data/profile.js';

const app = document.getElementById('app');
document.title = `${profile.firstName} ${profile.lastName} — Portfolio`;

mount(
  app,
  html`
    <a class="skip-link" href="#main">Aller au contenu</a>
    ${renderNav()}
    <main id="main" tabindex="-1">
      ${renderHero()} ${renderAbout()} ${renderProjects()} ${renderSkills()} ${renderJourney()} ${renderContact()}
    </main>
    ${renderPanel()} ${renderLogbook()} ${renderPalette()} ${renderToasts()}
  `,
);

/* Actions globales. */
registerAction('theme', ({ trigger } = {}) => toggleTheme(trigger));
const switchBlueprint = () => {
  if (toggleBlueprint()) showToast({ title: `Mode Blueprint ${isBlueprint() ? 'activé' : 'désactivé'}`, text: 'Touche B pour basculer.', icon: 'blueprint' });
};
registerAction('blueprint', switchBlueprint);

/* Comportements. */
mountNav();
mountHero();
mountAbout();
mountProjects();
mountPanel();
mountSkills();
mountJourney();
mountContact();
mountLogbook();
mountPalette();
mountSecrets();
mountCursor();
initBlueprint();
mountReveal();

/* Gamification ↔ interface. */
const syncProgress = (stats) => {
  updateXpRings(stats);
  updateHeroQuest(stats);
  updateFooterStatus(stats);
};
syncProgress(game.stats());
game.on('change', syncProgress);
game.on('unlock', ({ quest }) =>
  showToast({
    title: quest.secret ? `Secret trouvé : ${quest.title}` : quest.title,
    text: quest.secret ? quest.description : 'Objectif accompli',
    xp: quest.xp,
    tone: quest.secret ? 'accent' : 'default',
    duration: quest.group === 'zones' ? 2600 : 3800,
  }),
);
game.on('level', ({ level }) => setTimeout(() => showToast({ title: `Niveau atteint : ${level.title}`, text: 'Ouvrez le carnet pour voir la suite.', icon: 'compass', tone: 'accent' }), 500));
game.on('complete', () => setTimeout(() => showToast({ title: reward.title, text: 'Appuyez sur B pour l’essayer.', icon: 'blueprint', tone: 'accent' }), 1000));

addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'b' && !e.metaKey && !e.ctrlKey && !e.target.matches('input, textarea')) switchBlueprint();
});

document.documentElement.classList.add('is-ready');
