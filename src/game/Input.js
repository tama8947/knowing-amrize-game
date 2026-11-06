/**
 * ⌨️ game/Input.js — Teclado (flechas / WASD) y acciones
 */
export class Input {
  constructor(target = window) {
    this.keys = new Set();
    this.pressed = new Set(); // pulsaciones de este frame
    this.enabled = false;

    this._onKeyDown = (e) => {
      const k = e.key.toLowerCase();

      // Evita que la página haga scroll con las flechas / espacio
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) {
        e.preventDefault();
      }

      if (!this.keys.has(k)) this.pressed.add(k);
      this.keys.add(k);
    };

    this._onKeyUp = (e) => {
      this.keys.delete(e.key.toLowerCase());
    };

    this._onBlur = () => this.keys.clear();

    target.addEventListener('keydown', this._onKeyDown);
    target.addEventListener('keyup', this._onKeyUp);
    window.addEventListener('blur', this._onBlur);
  }

  /** ¿La tecla está mantenida? */
  isDown(...keys) {
    if (!this.enabled) return false;
    return keys.some((k) => this.keys.has(k));
  }

  /** ¿La tecla fue pulsada en este frame? */
  wasPressed(...keys) {
    if (!this.enabled) return false;
    return keys.some((k) => this.pressed.has(k));
  }

  /** Vector de movimiento normalizado (-1..1 en x/z). */
  getMoveVector() {
    let x = 0;
    let z = 0;
    if (this.isDown('arrowup', 'w')) z += 1;
    if (this.isDown('arrowdown', 's')) z -= 1;
    if (this.isDown('arrowright', 'd')) x += 1;
    if (this.isDown('arrowleft', 'a')) x -= 1;
    const len = Math.hypot(x, z);
    if (len > 1) { x /= len; z /= len; }
    return { x, z };
  }

  /** Llamar al final de cada frame para limpiar las pulsaciones. */
  endFrame() {
    this.pressed.clear();
  }

  dispose() {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    window.removeEventListener('blur', this._onBlur);
  }
}
