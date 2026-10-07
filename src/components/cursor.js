/**
 * Curseur personnalisé (pointeur fin uniquement) : un point précis + un anneau
 * qui s'agrandit et affiche un libellé sur les éléments `data-cursor`.
 * Inclut l'effet « magnétique » des boutons `data-magnetic`.
 */
import { html, mount } from '../core/dom.js';
import { hasFinePointer, prefersReducedMotion, lerp, createLoop } from '../core/motion.js';

const INTERACTIVE = 'a, button, [role="tab"], [data-cursor], input, label';

const mountMagnetic = () => {
  if (prefersReducedMotion()) return;
  document.addEventListener('pointermove', (e) => {
    const el = e.target.closest?.('[data-magnetic]');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.22;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.32;
    el.style.transform = `translate(${x}px, ${y}px)`;
  });
  document.addEventListener('pointerout', (e) => {
    const el = e.target.closest?.('[data-magnetic]');
    if (el && !el.contains(e.relatedTarget)) el.style.transform = '';
  });
};

export const mountCursor = () => {
  if (!hasFinePointer()) return;
  mountMagnetic();

  const cursor = mount(
    document.body,
    html`<div class="cursor" aria-hidden="true"><span class="cursor__ring"><span class="cursor__label"></span></span><span class="cursor__dot"></span></div>`,
  );
  const ring = cursor.querySelector('.cursor__ring');
  const dot = cursor.querySelector('.cursor__dot');
  const label = cursor.querySelector('.cursor__label');
  const reduced = prefersReducedMotion();
  const target = { x: -100, y: -100 };
  const pos = { x: -100, y: -100 };

  const loop = createLoop(() => {
    pos.x = lerp(pos.x, target.x, reduced ? 1 : 0.2);
    pos.y = lerp(pos.y, target.y, reduced ? 1 : 0.2);
    ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    if (Math.abs(pos.x - target.x) < 0.1 && Math.abs(pos.y - target.y) < 0.1) return false;
  });

  document.documentElement.classList.add('has-cursor');

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    target.x = e.clientX;
    target.y = e.clientY;
    dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
    cursor.classList.add('is-visible');
    loop.start();
  }, { passive: true });

  document.addEventListener('pointerover', (e) => {
    const el = e.target.closest?.(INTERACTIVE);
    const text = el?.closest('[data-cursor]')?.dataset.cursor ?? '';
    cursor.classList.toggle('is-hover', Boolean(el));
    cursor.classList.toggle('has-label', Boolean(text));
    cursor.classList.toggle('is-text', Boolean(e.target.closest?.('input, textarea')));
    label.textContent = text;
  });
  document.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
  document.addEventListener('pointerup', () => cursor.classList.remove('is-down'));
  document.documentElement.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
};
