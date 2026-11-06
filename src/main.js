/**
 * 🎮 main.js — Punto de entrada
 * Amrize: Ruta de Constructores
 *
 * Arquitectura:
 *   core/   → motor (Engine, Sky)
 *   world/  → terreno, scenery, mapa, plantas
 *   game/   → jugador, input, interacción, estado
 *   ui/     → interfaz DOM
 *   data/   → contenido educativo y catálogo de plantas
 *
 * Modos: 'menu' → 'map' → 'plant' → 'map' …
 */
import * as THREE from 'three';
import { Engine } from './core/Engine.js';
import { createSky } from './core/Sky.js';
import { createTerrain } from './world/Terrain.js';
import { createScenery } from './world/Scenery.js';
import { MapScene } from './world/MapScene.js';
import { createPlantByBusiness } from './world/plants/index.js';
import { Player } from './game/Player.js';
import { Input } from './game/Input.js';
import { Interaction } from './game/Interaction.js';
import { GameState } from './game/GameState.js';
import { UI } from './ui/UI.js';
import { getBusinesses } from './data/plantInfo.js';
import { t, tStation } from './i18n/index.js';

// ---------------------------------------------------------------
// Inicialización
// ---------------------------------------------------------------
const canvas = document.getElementById('game-canvas');
const engine = new Engine(canvas);
const state = new GameState();
const ui = new UI();

const sky = createSky(engine.scene);

// --- Grupos por modo (se activan/desactivan) ---
const mapGroup = new THREE.Group();
mapGroup.name = 'map-root';
engine.scene.add(mapGroup);

const worldGroup = new THREE.Group();
worldGroup.name = 'world-root';
worldGroup.visible = false;
engine.scene.add(worldGroup);

createTerrain(worldGroup);
createScenery(worldGroup);

const player = new Player(engine.scene, state.gender);
player.group.visible = false;

const input = new Input();
const interaction = new Interaction(engine.scene, ui);
const mapScene = new MapScene(mapGroup, (plant) => visitPlant(plant));

// ---------------------------------------------------------------
// Estado de la aplicación
// ---------------------------------------------------------------
let mode = 'menu';           // 'menu' | 'map' | 'plant'
let currentPlant = null;     // planta visitada
let plantInstance = null;    // { group, update }

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// ---------------------------------------------------------------
// Vuelo de cámara
// ---------------------------------------------------------------
const flight = {
  active: false,
  t: 0,
  duration: 1.6,
  fromPos: new THREE.Vector3(),
  toPos: new THREE.Vector3(),
  fromTarget: new THREE.Vector3(),
  toTarget: new THREE.Vector3(),
};

function flyTo(position, target, duration = 1.6) {
  flight.active = true;
  flight.t = 0;
  flight.duration = duration;
  flight.fromPos.copy(engine.camera.position);
  flight.toPos.copy(position);
  flight.fromTarget.copy(engine.controls.target);
  flight.toTarget.copy(target);
}

// ---------------------------------------------------------------
// Cambio de modo
// ---------------------------------------------------------------
function goToMap(animate = true) {
  mode = 'map';
  ui.setMode('map');
  ui.hidePrompt();
  ui.hideInfo();
  ui.hidePlantCard();
  ui.closeGame(false); // cierra un minijuego abierto, sin reabrir la tarjeta

  mapScene.group.visible = true;
  mapGroup.visible = true;
  worldGroup.visible = false;
  player.group.visible = false;
  if (plantInstance) plantInstance.group.visible = false;

  if (animate) {
    flyTo(new THREE.Vector3(0, 88, 95), new THREE.Vector3(0, 0, 2), 1.8);
  } else {
    engine.camera.position.set(0, 88, 95);
    engine.controls.target.set(0, 0, 2);
  }
}

function goToPlant(plant) {
  mode = 'plant';
  ui.setMode('plant');
  ui.hidePlantCard();
  ui.hidePrompt();

  mapScene.group.visible = false;
  mapGroup.visible = false;
  worldGroup.visible = true;
  player.group.visible = true;
  if (plantInstance) plantInstance.group.visible = true;

  // Construye la planta correspondiente al negocio
  if (plantInstance) {
    engine.scene.remove(plantInstance.group);
    disposeGroup(plantInstance.group);
    plantInstance = null;
  }
  interaction.clear();

  plantInstance = createPlantByBusiness(plant.business, engine.scene, (obj, info, label) => {
    interaction.register(obj, info, label);
  });

  // El jugador aparece junto a la planta, mirando hacia ella
  player.setPosition(6, 14);
  player.faceTowards(-4, -6);
  player.group.visible = true;

  flyTo(new THREE.Vector3(26, 20, 40), new THREE.Vector3(4, 3, 6), 1.8);
}

/** Libera la memoria de un grupo y sus hijos. */
function disposeGroup(group) {
  group.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((m) => {
        if (m.map) m.map.dispose();
        m.dispose();
      });
    }
  });
}

// ---------------------------------------------------------------
// Viaje a una planta concreta
// ---------------------------------------------------------------
function visitPlant(plant) {
  currentPlant = plant;
  goToPlant(plant);
  const biz = getBusinesses().find((b) => b.key === plant.business);
  ui.showToast(`${t('ui.toast.travelling')} ${plant.name} — ${biz?.name ?? ''}`, '🚗');
}

// ---------------------------------------------------------------
// UI ↔ juego
// ---------------------------------------------------------------
ui.onGenderChange = (gender) => {
  state.gender = gender;
  state.save();
};

ui.onStart = (gender, customName = '') => {
  state.phase = 'playing';
  state.gender = gender;
  state.playerName = customName?.trim() || '';
  state.save();
  player.setGender(gender);
  ui.showGame();
  ui.setPlayer(gender, state.rank, state.playerName);
  ui.syncProgress(state);
  input.enabled = true;
  goToMap(true);
};

ui.onVisitPlant = (plant) => visitPlant(plant);

ui.onBackToMap = () => goToMap(true);

// --- Buscador: al elegir un resultado, la cámara vuela hasta la planta ---
ui.onSearchSelect = (plant) => {
  const { position, target } = mapScene.focusOn(plant.id, 46);
  flyTo(position, target, 1.6);
  mapScene.setHovered(mapScene.pins.get(plant.id));
  setTimeout(() => ui.showPlantCard(plant, plant.business), 900);
};

// --- Filtro: resalta en el mapa los pines que coinciden ---
ui.onFilterChange = (ids) => {
  mapScene.setFilter(ids.size ? ids : null);
};

ui.syncProgress(state);

// Marcar en el mapa las plantas ya visitadas
state.visited.forEach((id) => mapScene.markVisited(id));

// ---------------------------------------------------------------
// Ratón: hover y clic sobre los pines del mapa
// ---------------------------------------------------------------
function updatePointer(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

let downPos = null;

canvas.addEventListener('pointermove', (event) => {
  if (mode !== 'map') return;
  updatePointer(event);
  raycaster.setFromCamera(pointer, engine.camera);
  mapScene.setHovered(mapScene.pick(raycaster));
  canvas.style.cursor = mapScene.hovered ? 'pointer' : 'grab';
});

canvas.addEventListener('pointerdown', (event) => {
  downPos = { x: event.clientX, y: event.clientY };
});

canvas.addEventListener('pointerup', (event) => {
  if (mode !== 'map' || !downPos) return;
  const moved = Math.hypot(event.clientX - downPos.x, event.clientY - downPos.y);
  downPos = null;
  if (moved > 6) return; // fue un arrastre de cámara, no un clic

  updatePointer(event);
  raycaster.setFromCamera(pointer, engine.camera);
  const pin = mapScene.pick(raycaster);
  if (pin) {
    ui.showPlantCard(pin.plant, pin.plant.business);
  }
});

// ---------------------------------------------------------------
// Bucle de juego
// ---------------------------------------------------------------
const camTarget = new THREE.Vector3();

engine.onUpdate((dt, elapsed) => {
  // --- Vuelo de cámara ---
  if (flight.active) {
    flight.t = Math.min(flight.t + dt / flight.duration, 1);
    const ease = flight.t < 0.5
      ? 4 * flight.t ** 3
      : 1 - Math.pow(-2 * flight.t + 2, 3) / 2; // easeInOutCubic
    engine.camera.position.lerpVectors(flight.fromPos, flight.toPos, ease);
    engine.controls.target.lerpVectors(flight.fromTarget, flight.toTarget, ease);
    if (flight.t >= 1) flight.active = false;
  }

  // --- Animación del mundo ---
  sky.update(dt);

  if (mode === 'map') {
    mapScene.update(dt, elapsed);

    // E selecciona el pin resaltado
    if (input.wasPressed('e') && mapScene.hovered) {
      ui.showPlantCard(mapScene.hovered.plant, mapScene.hovered.plant.business);
    }
    if (input.wasPressed('escape')) ui.hidePlantCard();
  }

  if (mode === 'plant') {
    plantInstance?.update(dt, elapsed);

    // Mientras un minijuego está abierto, el jugador queda quieto
    // (tampoco salta ni corre): el foco es el reto.
    const frozen = ui.gameOpen;

    // --- Jugador ---
    const move = frozen ? { x: 0, z: 0 } : input.getMoveVector();
    const running = !frozen && input.isDown('shift');
    const wantJump = !frozen && input.wasPressed(' ');

    player.update(dt, move, engine.camera, wantJump, running);

    // Interacción por proximidad → muestra el letrero
    interaction.update(player.group.position);

    // E: inspeccionar equipo / cerrar tarjeta (no mientras hay un reto abierto)
    if (!frozen && input.wasPressed('e')) {
      if (ui.isInfoOpen) {
        ui.hideInfo();
      } else if (interaction.activate()) {
        const item = interaction.hovered;
        state.visit(item.stationId, currentPlant?.business);
        ui.setPlayer(state.gender, state.rank, state.playerName);
        ui.unlockStamp(currentPlant?.business);
        ui.syncPoints();
        mapScene.markVisited(currentPlant?.id);
        ui.showToast(`${t('ui.toast.inspected')}: ${tStation(item.stationId).title}`, '🔍');
      }
    }

    // Esc: cierra la capa superior (minijuego → tarjeta)
    if (input.wasPressed('escape')) {
      if (ui.gameOpen) ui.closeGame();
      else ui.hideInfo();
    }

    // La cámara sigue al jugador suavemente
    if (!flight.active) {
      camTarget.set(
        player.group.position.x,
        player.group.position.y + 2,
        player.group.position.z
      );
      engine.controls.target.lerp(camTarget, 1 - Math.pow(0.001, dt));
    }
  }

  input.endFrame();
});

// ---------------------------------------------------------------
// Arranque
// ---------------------------------------------------------------
state.phase = 'menu';
engine.start();

// Enter para empezar desde el menú
window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && mode === 'menu') ui.onStart(state.gender, ui.playerNameValue);
});

// Depuración
window.__amrize = { engine, player, state, interaction, mapScene, goToMap, visitPlant, THREE, ui };
