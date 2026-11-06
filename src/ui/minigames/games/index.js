/**
 * 📦 games/index.js — Registro de minijuegos disponibles
 * Para añadir uno nuevo: crea el fichero, expórtalo aquí y asócialo a
 * una estación en `GAME_FOR_STATION` (src/data/plantInfo.js).
 */
import { createKilnGame } from './KilnGame.js';
import { createDosingGame } from './DosingGame.js';
import { createScreenGame } from './ScreenGame.js';
import { createPavingGame } from './PavingGame.js';
import { createOrderGame } from './OrderGame.js';

export const GAME_TYPES = {
  kiln: createKilnGame,
  dosing: createDosingGame,
  screen: createScreenGame,
  paving: createPavingGame,
  order: createOrderGame,
};

export const GAME_ICONS = {
  kiln: '🔥',
  dosing: '🧱',
  screen: '🪨',
  paving: '🛣️',
  order: '🧩',
};
