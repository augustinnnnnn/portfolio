/** Garde le focus clavier à l'intérieur d'un calque (dialogue, menu, tiroir). */
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])';

export const trapFocus = (container) => {
  const previous = document.activeElement;

  const onKeydown = (event) => {
    if (event.key !== 'Tab') return;
    const items = [...container.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  container.addEventListener('keydown', onKeydown);
  return () => {
    container.removeEventListener('keydown', onKeydown);
    if (previous instanceof HTMLElement) previous.focus({ preventScroll: true });
  };
};
