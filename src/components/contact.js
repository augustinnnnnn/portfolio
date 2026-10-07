/** Contact + pied de page : e-mail copiable, réseaux, statut d'exploration. */
import { html, $, text } from '../core/dom.js';
import { icon } from './icons.js';
import { chapter } from './chapter.js';
import { profile } from '../data/profile.js';
import { game } from '../core/game.js';
import { registerAction } from '../core/actions.js';
import { showToast } from './toast.js';

export const renderContact = () => html`
  <section class="section contact" id="contact" aria-labelledby="contact-title" data-bp="section.contact">
    <div class="container">
      ${chapter('contact')}

      <div class="contact__grid">
        <div class="contact__main" data-reveal>
          <p class="contact__lead">Une idée, un projet, une opportunité ? Écrivez-moi, je réponds rapidement.</p>
          <button class="mail" type="button" data-action="copy-email" data-cursor="Copier" data-magnetic>
            <span class="mail__label">${icon('mail')} E-mail</span>
            <span class="mail__address">${profile.email}</span>
            <span class="mail__hint"><span data-copy-label>Cliquer pour copier</span> ${icon('copy')}</span>
          </button>
          <div class="contact__actions">
            <a class="btn btn--primary" href="mailto:${profile.email}" data-magnetic>
              <span class="btn__label">Écrire un message</span>${icon('arrowUpRight', 'icon icon--diag')}
            </a>
            ${profile.resumeUrl
              ? html`<a class="btn btn--ghost" href="${profile.resumeUrl}" target="_blank" rel="noopener" data-magnetic><span class="btn__label">Télécharger le CV</span>${icon('arrowDown', 'icon icon--down')}</a>`
              : ''}
          </div>
        </div>

        <ul class="socials" data-reveal aria-label="Réseaux">
          ${profile.socials.map(
            (s, i) => html`
              <li style="--d: ${i * 70}ms">
                <a href="${s.url}" target="_blank" rel="noopener noreferrer" data-cursor="Ouvrir">
                  <span class="socials__name">${s.label}</span>
                  <span class="socials__handle">${text(s.handle)}</span>
                  ${icon('arrowUpRight')}
                </a>
              </li>
            `,
          )}
        </ul>
      </div>
    </div>
  </section>

  <footer class="footer" data-bp="footer">
    <div class="container footer__inner">
      <span>© ${new Date().getFullYear()} ${text(profile.firstName)} ${text(profile.lastName)} — Conçu &amp; développé à la main.</span>
      <button class="footer__status" type="button" data-action="logbook">
        ${icon('compass')} <span data-footer-status>Exploration 0 %</span>
      </button>
      <a class="footer__top" href="#accueil" data-cursor="Haut">Retour en haut ${icon('arrowUp')}</a>
    </div>
  </footer>
`;

export const updateFooterStatus = ({ percent, level }) => {
  const el = $('[data-footer-status]');
  if (el) el.textContent = `Exploration ${percent} % · ${level.title}`;
};

export const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(profile.email);
  } catch {
    /* Presse-papiers indisponible : on sélectionne l'adresse pour une copie manuelle. */
    const range = document.createRange();
    range.selectNodeContents($('.mail__address'));
    getSelection().removeAllRanges();
    getSelection().addRange(range);
  }
  const label = $('[data-copy-label]');
  const button = $('.mail');
  button.classList.add('is-copied');
  label.textContent = 'Copié !';
  setTimeout(() => {
    button.classList.remove('is-copied');
    label.textContent = 'Cliquer pour copier';
  }, 2200);
  if (!game.unlock('challenge:email')) showToast({ title: 'Adresse copiée', text: profile.email, icon: 'check' });
};

export const mountContact = () => registerAction('copy-email', copyEmail);
