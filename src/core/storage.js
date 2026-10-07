/** Accès au localStorage tolérant aux erreurs (navigation privée, stockage bloqué). */
const PREFIX = 'portfolio:';

export const storage = {
  get(key, fallback) {
    try {
      const value = localStorage.getItem(PREFIX + key);
      return value == null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* stockage indisponible : l'état reste en mémoire */
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch {
      /* ignoré */
    }
  },
};
