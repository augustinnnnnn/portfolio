/** Notifications discrètes (succès débloqués, confirmations). */
import { html, $, mount } from '../core/dom.js';
import { icon } from './icons.js';

const compact = matchMedia('(max-width: 899px)');

export const renderToasts = () => html`<div class="toasts" data-toasts role="status" aria-live="polite"></div>`;

/**
 * @param {{ title: string, text?: string, xp?: number, icon?: string, tone?: 'accent'|'default', duration?: number }} toast
 */
export const showToast = ({ title, text = '', xp, icon: iconName = 'spark', tone = 'default', duration = 3800 }) => {
  const container = $('[data-toasts]');
  /* Sur mobile, une seule notification à la fois pour ne pas masquer le contenu. */
  const max = compact.matches ? 1 : 3;
  while (container.children.length >= max) container.firstElementChild.remove();

  const toast = mount(
    container,
    html`
      <div class="toast toast--${tone}">
        <span class="toast__icon">${icon(iconName)}</span>
        <span class="toast__body">
          <strong>${title}</strong>
          ${text ? html`<span>${text}</span>` : ''}
        </span>
        ${xp ? html`<span class="toast__xp">+${xp} XP</span>` : ''}
      </div>
    `,
  );
  requestAnimationFrame(() => toast.classList.add('is-in'));
  setTimeout(() => {
    toast.classList.remove('is-in');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    setTimeout(() => toast.remove(), 600);
  }, duration);
};
