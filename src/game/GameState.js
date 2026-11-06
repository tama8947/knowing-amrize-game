/**
 * 🛂 game/GameState.js — Estado global del juego
 * Menú ⇄ Jugando, con progreso persistente en localStorage.
 */
const STORAGE_KEY = 'amrize-game-progress-v1';

export class GameState {
  constructor() {
    this.phase = 'menu'; // 'menu' | 'playing'
    this.gender = 'male';
    this.playerName = ''; // nombre personalizado (opcional)
    this.visited = new Set();  // ids de estaciones visitadas
    this.stamps = new Set();    // negocios con sello obtenido
    this.games = new Set();     // ids de minijuegos superados
    this.sustainability = 0;    // puntos de sostenibilidad
    this.load();
  }

  /** Marcar una estación como visitada. Devuelve true si es nueva. */
  visit(stationId, businessKey) {
    let isNew = false;
    if (!this.visited.has(stationId)) {
      this.visited.add(stationId);
      isNew = true;
      this.sustainability += 10;
    }
    if (businessKey && !this.stamps.has(businessKey)) {
      this.stamps.add(businessKey);
      this.sustainability += 50;
    }
    this.save();
    return isNew;
  }

  /**
   * Completa un minijuego.
   * @param {string} gameId — id de la estación del reto (p.ej. 'horno')
   * @returns {{ first: boolean, points: number }} la primera vez suma 20 puntos
   */
  completeGame(gameId) {
    const first = !this.games.has(gameId);
    if (first) {
      this.games.add(gameId);
      this.sustainability += 20;
      this.save();
    }
    return { first, points: first ? 20 : 0 };
  }

  /** Rango del jugador según progreso. */
  get rank() {
    const n = this.stamps.size;
    if (n >= 6) return 'Embajador Amrize';
    if (n >= 4) return 'Experto';
    if (n >= 2) return 'Constructor';
    if (n >= 1) return 'Aprendiz';
    return 'Nuevo ingreso';
  }

  save() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          visited: [...this.visited],
          stamps: [...this.stamps],
          games: [...this.games],
          sustainability: this.sustainability,
          gender: this.gender,
          playerName: this.playerName,
        })
      );
    } catch (e) {
      /* almacenamiento no disponible (modo privado) — se ignora */
    }
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      this.visited = new Set(data.visited || []);
      this.stamps = new Set(data.stamps || []);
      this.games = new Set(data.games || []);
      this.sustainability = data.sustainability || 0;
      if (data.gender) this.gender = data.gender;
      if (data.playerName) this.playerName = data.playerName;
    } catch (e) {
      /* datos corruptos: se empieza de cero */
    }
  }

  reset() {
    this.visited.clear();
    this.stamps.clear();
    this.games.clear();
    this.sustainability = 0;
    this.save();
  }
}
