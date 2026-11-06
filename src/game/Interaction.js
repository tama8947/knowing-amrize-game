/**
 * 🔍 game/Interaction.js — Interacción por proximidad
 * El jugador se acerca a un equipo y aparece un letrero con la tecla "E".
 */
import * as THREE from 'three';

const REACH = 6.5; // distancia máxima para interactuar

export class Interaction {
  /**
   * @param {THREE.Scene} scene
   * @param {{ showPrompt: Function, hidePrompt: Function, showInfo: Function }} ui
   */
  constructor(scene, ui) {
    this.scene = scene;
    this.ui = ui;
    this.items = [];        // { object, stationId }
    this.hovered = null;    // ítem más cercano
    this._tmp = new THREE.Vector3();
  }

  /**
   * Registra un objeto interactuable.
   * @param {THREE.Object3D} object
   * @param {string} stationId  clave del contenido en i18n (p.ej. 'horno')
   */
  register(object, stationId) {
    this.items.push({ object, stationId });
  }

  /** Limpia los interactuables (al cambiar de planta). */
  clear() {
    this.items = [];
    this.hovered = null;
    this.ui.hidePrompt();
  }

  /** Distancia del jugador al objeto (en planta XZ). */
  distanceTo(item, playerPos) {
    item.object.getWorldPosition(this._tmp);
    const dx = this._tmp.x - playerPos.x;
    const dz = this._tmp.z - playerPos.z;
    return Math.hypot(dx, dz);
  }

  /**
   * Actualiza el objetivo más cercano y el letrero.
   * @param {THREE.Vector3} playerPos
   */
  update(playerPos) {
    let best = null;
    let bestDist = REACH;

    for (const item of this.items) {
      const d = this.distanceTo(item, playerPos);
      if (d < bestDist) {
        bestDist = d;
        best = item;
      }
    }

    // Si la tarjeta está abierta, el letrero se oculta (y vuelve al cerrarse)
    const target = this.ui.isInfoOpen ? null : best;

    if (target !== this.hovered) {
      this.hovered = target;
      if (target) {
        // Se pasa la clave: la UI la resuelve en el idioma activo
        this.ui.showPrompt(target.stationId);
      } else {
        this.ui.hidePrompt();
      }
    }

    return best;
  }

  /** Activa la interacción con el elemento más cercano. Devuelve true si hubo interacción. */
  activate() {
    if (!this.hovered) return false;
    this.ui.showInfo(this.hovered.stationId);
    return true;
  }
}
