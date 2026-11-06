/**
 * 🎮 ui/minigames/MinigameManager.js — Marco común de los minijuegos
 *
 * Gestiona el ciclo de vida del overlay: montar un juego por estación,
 * mostrar el botón de validación, el feedback, la pantalla de éxito con
 * los puntos y el re-traducido en caliente al cambiar de idioma.
 *
 * Contrato de un juego (ver games/*.js):
 *   createXGame(body, ctx, opts) → { destroy?() }
 *   ctx.t(key)        → traduce
 *   ctx.feedback(msg, kind)  → 'ok' | 'bad' | '' (oculta)
 *   ctx.validate(label, fn)  → botón de validación con su manejador
 *   ctx.progress(text) → texto del pie
 *   ctx.win()          → pantalla de éxito (llama a onComplete una sola vez)
 */
import { t } from '../../i18n/index.js';
import { GAME_FOR_STATION } from '../../data/plantInfo.js';
import { GAME_TYPES, GAME_ICONS } from './games/index.js';

export class MinigameManager {
  /**
   * @param {{ onComplete: (stationId: string) => {first: boolean, points: number},
   *           onClose: () => void }} handlers
   */
  constructor({ onComplete, onClose } = {}) {
    this.onComplete = onComplete ?? (() => ({ first: false, points: 0 }));
    this.onClose = onClose ?? (() => {});

    this.root = document.getElementById('minigame');
    this.badgeEl = document.getElementById('mg-badge');
    this.titleEl = document.getElementById('mg-title');
    this.descEl = document.getElementById('mg-desc');
    this.bodyEl = document.getElementById('mg-body');
    this.feedbackEl = document.getElementById('mg-feedback');
    this.progressEl = document.getElementById('mg-progress');
    this.validateEl = document.getElementById('mg-validate');
    this.successEl = document.getElementById('mg-success');
    this.successTitleEl = document.getElementById('mg-success-title');
    this.successTextEl = document.getElementById('mg-success-text');
    this.pointsValueEl = document.getElementById('mg-points-value');
    this.pointsLabelEl = document.getElementById('mg-points-label');
    this.repeatNoteEl = document.getElementById('mg-repeat-note');
    this.retryEl = document.getElementById('mg-retry');
    this.continueEl = document.getElementById('mg-continue');

    this.stationId = null;
    this.type = null;
    this.won = false;
    this.lastResult = null;
    this.active = null;
    this._validateHandler = null;

    document.getElementById('mg-close').addEventListener('click', () => this.onClose());
    this.continueEl.addEventListener('click', () => this.onClose());
    this.retryEl.addEventListener('click', () => this.open(this.stationId));
    // El botón de validación lo define cada juego (ctx.validate)
    this.validateEl.addEventListener('click', () => this._validateHandler?.());

    // El contexto que reciben los juegos (se crea una vez)
    this.ctx = {
      t: (key) => t(key),
      feedback: (msg, kind = '') => this.showFeedback(msg, kind),
      validate: (label, fn) => this.setValidate(label, fn),
      progress: (text) => { this.progressEl.textContent = text; },
      win: () => this.win(),
    };
  }

  get isOpen() {
    return !this.root.classList.contains('hidden');
  }

  /**
   * Abre el minijuego asociado a una estación.
   * @param {string} stationId
   * @returns {boolean} false si la estación no tiene reto
   */
  open(stationId) {
    const spec = GAME_FOR_STATION[stationId];
    if (!spec || !GAME_TYPES[typeof spec === 'string' ? spec : spec.type]) return false;
    this.stationId = stationId;
    this.type = typeof spec === 'string' ? spec : spec.type;
    this.sequence = spec.sequence;
    this.mount();
    this.root.classList.remove('hidden');
    return true;
  }

  /** Cierra el overlay y libera animaciones. */
  close() {
    this.active?.destroy?.();
    this.active = null;
    this.root.classList.add('hidden');
    this.stationId = null;
    this.type = null;
    this.won = false;
    this.lastResult = null;
  }

  /** Re-monta el juego (para el botón «Jugar de nuevo»). */
  retry() {
    if (this.stationId) this.open(this.stationId);
  }

  /** Monta el juego desde cero y limpia el overlay. */
  mount() {
    const factory = GAME_TYPES[this.type];
    this.active?.destroy?.();
    this.active = null;
    this.won = false;
    this.lastResult = null;

    this.successEl.classList.add('hidden');
    this.feedbackEl.classList.add('hidden');
    this.validateEl.classList.add('hidden');
    this._validateHandler = null;
    this.progressEl.textContent = '';
    this.bodyEl.innerHTML = '';

    this.badgeEl.textContent = GAME_ICONS[this.type] ?? '🎮';
    this.titleEl.textContent = t(`games.${this.type}.title`);
    this.descEl.textContent = t(`games.${this.type}.desc`);
    this.retryEl.textContent = t('games.shell.retry');
    this.continueEl.textContent = t('games.shell.continue');

    this.active = factory(this.bodyEl, this.ctx, { sequence: this.sequence }) ?? null;
  }

  /**
   * Re-traduce todo al cambiar de idioma.
   * Si el reto ya estaba superado, se vuelve a montar y se recupera la
   * pantalla de éxito (el progreso a medias se reinicia: es el precio
   * de mantener el overlay abierto durante el cambio).
   */
  refresh() {
    if (!this.isOpen || !this.type) return;
    const result = this.won ? this.lastResult : null;
    this.mount();
    if (result) {
      this.won = true;
      this.lastResult = result;
      this.showSuccess(result);
    }
  }

  showFeedback(msg, kind) {
    if (!msg) {
      this.feedbackEl.classList.add('hidden');
      return;
    }
    this.feedbackEl.textContent = msg;
    this.feedbackEl.className = `mg-feedback ${kind}`;
  }

  setValidate(label, fn) {
    this.validateEl.textContent = label;
    this.validateEl.classList.remove('hidden');
    this._validateHandler = fn;
  }

  /** El juego avisa de que se ha superado. Solo cuenta la primera vez. */
  win() {
    if (this.won) return;
    this.won = true;
    const result = this.onComplete(this.stationId) ?? { first: false, points: 0 };
    this.lastResult = result;
    this.showSuccess(result);
  }

  showSuccess(result) {
    this.successTitleEl.textContent = t('games.shell.success');
    this.successTextEl.textContent = t(`games.${this.type}.success`);
    this.pointsValueEl.textContent = `+${result.points}`;
    this.pointsLabelEl.textContent = t('games.shell.points');
    this.repeatNoteEl.textContent = result.first ? '' : t('games.shell.again');
    this.repeatNoteEl.classList.toggle('hidden', result.first);
    this.successEl.classList.remove('hidden');
  }
}
