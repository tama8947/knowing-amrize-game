/**
 * 🌍 i18n/index.js — Motor de internacionalización
 *
 * 5 idiomas: Español (es), English (en), Français (fr), Deutsch (de),
 * Schweiz/Swiss German (ch).
 *
 * Uso:
 *   import { t, setLocale, getLocale } from '../i18n/index.js';
 *   setLocale('fr');
 *   t('ui.start.begin');   // → "Commencer le voyage →"
 *
 * Los textos se resuelven por clave con dots. Si falta una clave en el idioma
 * activo, se recurre al español (base) y se avisa por consola en desarrollo.
 */
import es from './locales/es.js';
import en from './locales/en.js';
import fr from './locales/fr.js';
import de from './locales/de.js';
import ch from './locales/ch.js';
// Textos de los minijuegos: van en ficheros aparte para no mezclar
// el contenido de juego con el de la interfaz general.
import esMini from './locales/es.minigames.js';
import enMini from './locales/en.minigames.js';
import frMini from './locales/fr.minigames.js';
import deMini from './locales/de.minigames.js';
import chMini from './locales/ch.minigames.js';

/** Une los textos generales con los de minijuegos (fusión superficial por bloque). */
function mergeLocale(base, extra) {
  if (!extra) return base;
  return {
    ...base,
    ui: {
      ...base.ui,
      card: { ...base.ui?.card, ...extra.ui?.card },
      hud: { ...base.ui?.hud, ...extra.ui?.hud },
    },
    games: extra.games,
  };
}

const STORAGE_KEY = 'amrize-game-locale';

/** Registro de idiomas disponibles. */
export const LOCALES = {
  es: { name: 'Español', flag: '🇨🇴', locale: 'es-CO', file: mergeLocale(es, esMini) },
  en: { name: 'English', flag: '🇺🇸', locale: 'en-US', file: mergeLocale(en, enMini) },
  fr: { name: 'Français', flag: '🇨🇦', locale: 'fr-CA', file: mergeLocale(fr, frMini) },
  de: { name: 'Deutsch', flag: '🇩🇪', locale: 'de-DE', file: mergeLocale(de, deMini) },
  ch: { name: 'Schweizerdeutsch', flag: '🇨🇭', locale: 'de-CH', file: mergeLocale(ch, chMini) },
};

let current = 'es';
const listeners = new Set();

/** Idiomas que el navegador del jugador prefiere, en orden. */
export function detectLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LOCALES[saved]) return saved;
  } catch (e) {
    /* sin localStorage */
  }

  const langs = navigator.languages?.length ? navigator.languages : [navigator.language || 'es'];
  for (const lang of langs) {
    const code = String(lang).toLowerCase();
    if (code.startsWith('es')) return 'es';
    if (code.startsWith('en')) return 'en';
    if (code.startsWith('fr')) return 'fr';
    // alemán: distinguishendo Suiza (de-CH) de Alemania (de-DE)
    if (code.startsWith('de')) return code.includes('ch') ? 'ch' : 'de';
  }
  return 'es';
}

/** Idioma activo. */
export function getLocale() {
  return current;
}

/** Cambia el idioma y notifica a los suscriptores. */
export function setLocale(code) {
  if (!LOCALES[code] || code === current) return;
  current = code;
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch (e) {
    /* sin localStorage */
  }
  listeners.forEach((fn) => fn(code));
}

/** Se suscribe a los cambios de idioma. Devuelve la función para cancelar. */
export function onLocaleChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Resuelve una clave con dots, con fallback al español. */
export function t(key, fallback = '') {
  const resolve = (obj) =>
    key.split('.').reduce((acc, part) => (acc == null ? undefined : acc[part]), obj);

  const value = resolve(LOCALES[current].file);
  if (typeof value === 'string') return value;

  const base = resolve(es);
  if (typeof base === 'string') {
    if (import.meta.env?.DEV && current !== 'es') {
      console.warn(`[i18n] Falta la clave "${key}" en "${current}"`);
    }
    return base;
  }

  return fallback || key;
}

/** Traduce un objeto de la forma { title, text, fact } de una estación. */
export function tStation(id) {
  return {
    icon: t(`stations.${id}.icon`),
    title: t(`stations.${id}.title`),
    text: t(`stations.${id}.text`),
    fact: t(`stations.${id}.fact`),
  };
}

/** Nombre traducido de un negocio. */
export function tBusiness(key) {
  return {
    key,
    icon: t(`biz.${key}.icon`),
    name: t(`biz.${key}.name`),
    tagline: t(`biz.${key}.tagline`),
  };
}

/** Traduce una lista de claves. */
export function tAll(keys) {
  return keys.map((k) => t(k));
}
