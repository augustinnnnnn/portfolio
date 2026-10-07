/** Verrouillage du scroll de la page, compatible avec plusieurs calques ouverts. */
let locks = 0;

export const lockScroll = () => {
  if (locks++ === 0) document.documentElement.classList.add('is-locked');
};

export const unlockScroll = () => {
  locks = Math.max(0, locks - 1);
  if (locks === 0) document.documentElement.classList.remove('is-locked');
};
