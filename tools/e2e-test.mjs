#!/usr/bin/env node
/**
 * 🧪 tools/e2e-test.mjs
 * Prueba end-to-end con Chromium headless:
 *   1. El juego carga sin errores de consola
 *   2. El menú aparece y se puede elegir personaje
 *   3. Al empezar, se muestra el mapa de Norteamérica
 *   4. Se puede hacer clic en un pin y viajar a una planta
 *   5. En la planta, el jugador camina, salta e interactúa con la tecla E
 *
 * Uso: node tools/e2e-test.mjs
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PORT = 4188;
const URL = `http://127.0.0.1:${PORT}/`;

const errors = [];
const results = [];

function check(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`${ok ? '✅' : '❌'} ${name}${detail ? ' — ' + detail : ''}`);
}

// --- Servidor de desarrollo ---
const server = spawn('npx', ['vite', '--port', String(PORT), '--host', '127.0.0.1'], {
  cwd: ROOT,
  stdio: 'ignore',
});

const cleanup = () => { try { server.kill('SIGTERM'); } catch {} };
process.on('exit', cleanup);

await new Promise((r) => setTimeout(r, 3500));

const browser = await chromium.launch({
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1100, height: 700 } });

page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});
page.on('pageerror', (err) => errors.push(`PAGEERROR: ${err.message}`));

// ---------------------------------------------------------------
// 1. Carga
// ---------------------------------------------------------------
await page.goto(URL + '?lowfx=1', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

check('Página carga', await page.locator('#start-screen').isVisible());
check('Canvas WebGL creado', (await page.locator('#game-canvas').count()) === 1);

// ---------------------------------------------------------------
// 2. Selección de personaje y nombre personalizado
// ---------------------------------------------------------------
await page.locator('.char-option[data-gender="female"]').click();
check('Seleccionar constructora', await page.locator('.char-option[data-gender="female"]').getAttribute('class').then((c) => c.includes('selected')));

await page.locator('#player-name-input').fill('Sandra');
await page.waitForTimeout(300);
check('Campo de nombre editable', (await page.locator('#player-name-input').inputValue()) === 'Sandra');

await page.locator('#name-random').click();
await page.waitForTimeout(300);
const randomName = await page.locator('#player-name-input').inputValue();
check('Nombre aleatorio', randomName.length > 2, randomName);

await page.locator('#player-name-input').fill('Sandra');
await page.waitForTimeout(200);

// ---------------------------------------------------------------
// 3. Inicio → modo mapa
// ---------------------------------------------------------------
await page.locator('#start-btn').click();
await page.waitForTimeout(3000);

const mode = await page.evaluate(() => {
  const g = window.__amrize;
  return {
    mapVisible: g.mapScene.group.visible,
    mapChildren: g.mapScene.group.children.length,
    pins: g.mapScene.pins.size,
    hudVisible: !document.getElementById('hud').classList.contains('hidden'),
    playerName: document.getElementById('player-name').textContent,
  };
});

check('Modo mapa activo', mode.mapVisible);
check('Mapa con geometría', mode.mapChildren > 60, `${mode.mapChildren} objetos`);
check('Pines de plantas en el mapa', mode.pins === 38, `${mode.pins} pines`);
check('HUD visible', mode.hudVisible);
check('Nombre del jugador actualizado', /Sandra/.test(mode.playerName), mode.playerName);

// ---------------------------------------------------------------
// 4. Vuelo a una planta
// ---------------------------------------------------------------
await page.evaluate(() => {
  const g = window.__amrize;
  const pin = [...g.mapScene.pins.values()].find((p) => p.plant.business === 'cement');
  g.visitPlant(pin.plant);
});
await page.waitForTimeout(2800);

const inPlant = await page.evaluate(() => {
  const g = window.__amrize;
  return {
    mapVisible: g.mapScene.group.visible,
    playerVisible: g.player.group.visible,
    interactables: g.interaction.items.length,
    pos: g.player.group.position.toArray().map((n) => +n.toFixed(2)),
  };
});

check('Mapa oculto al entrar a planta', !inPlant.mapVisible);
check('Jugador visible en la planta', inPlant.playerVisible);
check('Equipos interactuables registrados', inPlant.interactables > 3, `${inPlant.interactables} equipos`);

// ---------------------------------------------------------------
// 5. Caminar con las flechas
// ---------------------------------------------------------------
const before = await page.evaluate(() => window.__amrize.player.group.position.toArray());
await page.keyboard.down('ArrowUp');
await page.waitForTimeout(2500);
const mid = await page.evaluate(() => ({
  vel: window.__amrize.player.velocity.toArray(),
  pos: window.__amrize.player.group.position.toArray(),
}));
await page.keyboard.up('ArrowUp');
await page.waitForTimeout(300);
const after = await page.evaluate(() => window.__amrize.player.group.position.toArray());
const walked = Math.hypot(after[0] - before[0], after[2] - before[2]);
const speed = Math.hypot(mid.vel[0], mid.vel[2]);
check('Caminar con flechas', walked > 1 && speed > 3, `${walked.toFixed(2)} u, vel ${speed.toFixed(2)}`);

// ---------------------------------------------------------------
// 6. Saltar
// ---------------------------------------------------------------
const groundY = await page.evaluate(() => window.__amrize.player.group.position.y);
await page.keyboard.press('Space');
await page.waitForTimeout(200);
const peakY = await page.evaluate(() => window.__amrize.player.group.position.y);
check('Salto (Espacio)', peakY > groundY + 0.5, `sube de ${groundY.toFixed(2)} a ${peakY.toFixed(2)}`);
await page.waitForTimeout(1500);
const landedY = await page.evaluate(() => window.__amrize.player.group.position.y);
check('Aterriza tras el salto', Math.abs(landedY - groundY) < 1.5, `y=${landedY.toFixed(2)}`);

// ---------------------------------------------------------------
// 7. Interacción con E (letrero)
// ---------------------------------------------------------------
const interaction = await page.evaluate(() => {
  const g = window.__amrize;
  // mover al jugador junto a un equipo interactuable
  const item = g.interaction.items[0];
  const pos = new g.THREE.Vector3();
  item.object.getWorldPosition(pos);
  g.player.group.position.set(pos.x + 2, pos.y, pos.z + 2);
  return { stationId: item.stationId };
});
await page.waitForTimeout(700);

const promptVisible = await page.locator('#interact-prompt').isVisible();
check('Letrero de proximidad visible', promptVisible, interaction.stationId);

await page.keyboard.press('e');
await page.waitForTimeout(600);
const cardVisible = await page.locator('#info-card').isVisible();
const cardTitle = await page.locator('#info-title').textContent();
check('Tecla E abre la explicación', cardVisible, cardTitle);

const stampUnlocked = await page.evaluate(() =>
  document.querySelectorAll('.stamp.unlocked').length > 0
);
check('Sello del pasaporte obtenido', stampUnlocked);

// ---------------------------------------------------------------
// 8. Volver al mapa
// ---------------------------------------------------------------
await page.keyboard.press('Escape');
await page.locator('#back-to-map').click();
await page.waitForTimeout(2500);
const backToMap = await page.evaluate(() => window.__amrize.mapScene.group.visible);
check('Volver al mapa', backToMap);

// ---------------------------------------------------------------
// 9. Buscador de plantas
// ---------------------------------------------------------------
// (ya estamos en modo mapa tras el paso 8)
await page.waitForTimeout(1200);

await page.locator('#search-input').fill('cement');
await page.waitForTimeout(600);
const resultCount = await page.locator('.result-item').count();
check('Buscador devuelve resultados', resultCount > 0, `${resultCount} resultados para "cement"`);

const filtered = await page.evaluate(() => {
  const g = window.__amrize;
  let dimmed = 0;
  for (const [, pin] of g.mapScene.pins) if (pin.dimmed) dimmed++;
  return { dimmed, total: g.mapScene.pins.size };
});
check('Filtro atenúa los pines no coincidentes', filtered.dimmed > 0, `${filtered.dimmed}/${filtered.total} atenuados`);

// Click en un resultado → la cámara vuela a la planta
const camBefore = await page.evaluate(() => window.__amrize.engine.camera.position.toArray());
await page.locator('.result-item').first().click();
await page.waitForTimeout(2200);
const camAfter = await page.evaluate(() => window.__amrize.engine.camera.position.toArray());
const moved = Math.hypot(camAfter[0] - camBefore[0], camAfter[1] - camBefore[1], camAfter[2] - camBefore[2]);
check('Animación de vuelo hacia la planta', moved > 10, `cámara movió ${moved.toFixed(1)} u`);

const cardAfterSearch = await page.locator('#plant-card').isVisible();
check('Tarjeta de la planta mostrada', cardAfterSearch);

// Búsqueda en otro idioma (el juego puede estar en inglés y buscar "cemento")
await page.locator('#search-input').fill('cemento');
await page.waitForTimeout(600);
const crossLang = await page.locator('.result-item').count();
check('Búsqueda multiplataforma (nombre en otro idioma)', crossLang > 0, `${crossLang} resultados para "cemento"`);

// ---------------------------------------------------------------
// 10. Filtro por tipo de planta
// ---------------------------------------------------------------
await page.locator('#search-clear').click();
await page.locator('.chip[data-filter="aggregates"]').click();
await page.waitForTimeout(500);
const aggResults = await page.evaluate(() => ({
  count: document.querySelectorAll('.result-item').length,
  allAggregate: [...document.querySelectorAll('.result-item small')].every((el) =>
    /Agregados|Aggregates|Agregate/i.test(el.textContent)
  ),
}));
check(
  'Filtro por tipo de planta',
  aggResults.count > 0 && aggResults.allAggregate,
  `${aggResults.count} resultados de agregados`
);
await page.locator('.chip[data-filter="all"]').click();

// ---------------------------------------------------------------
// 11. Multiidioma
// ---------------------------------------------------------------
// Cambio de idioma CON la tarjeta educativa abierta → debe cambiar todo
await page.evaluate(() => {
  const g = window.__amrize;
  g.visitPlant([...g.mapScene.pins.values()].find((x) => x.plant.business === 'cement').plant);
});
await page.waitForTimeout(2600);
await page.evaluate(() => {
  const g = window.__amrize;
  const item = g.interaction.items[0];
  const pos = new g.THREE.Vector3();
  item.object.getWorldPosition(pos);
  g.player.group.position.set(pos.x + 2, pos.y, pos.z + 2);
});
await page.waitForTimeout(800);
await page.keyboard.press('e');
await page.waitForTimeout(600);

const titleES = await page.locator('#info-title').textContent();
await page.locator('#lang-picker-hud .lang-btn[data-locale="fr"]').click();
await page.waitForTimeout(600);
const titleFR = await page.locator('#info-title').textContent();
const textFR = await page.locator('#info-text').textContent();
const factFR = await page.locator('#info-fact span').textContent();
check(
  'Tarjeta abierta se re-traduce al cambiar de idioma',
  titleFR !== titleES && titleFR.length > 3 && textFR.length > 10 && factFR.length > 5,
  `ES "${titleES}" → FR "${titleFR}"`
);

const promptFR = await page.locator('#interact-prompt').textContent();
check('Letrero de proximidad re-traducido', /Inspecter/i.test(promptFR), promptFR.trim().slice(0, 40));

await page.keyboard.press('Escape');
await page.waitForTimeout(300);

for (const [code, expected] of [['de', 'Wähle'], ['ch', 'Wähle'], ['en', 'Choose']]) {
  await page.locator(`#lang-picker-hud .lang-btn[data-locale="${code}"]`).click();
  await page.waitForTimeout(400);
  const text = await page.locator('[data-i18n="ui.start.choose"]').textContent();
  check(`Idioma ${code.toUpperCase()} aplicado`, text.includes(expected), text.trim());
}

// Tarjeta de planta en el mapa también se re-traduce
await page.locator('#back-to-map').click();
await page.waitForTimeout(2400);
await page.evaluate(() => {
  const g = window.__amrize;
  const pin = [...g.mapScene.pins.values()][0];
  g.mapScene.setHovered(pin);
  g.ui?.showPlantCard?.(pin.plant, pin.plant.business);
});
await page.waitForTimeout(400);
const plantCardText = await page.locator('#plant-details').textContent();
check('Tarjeta de planta traducida', /Región|Region|Région/i.test(plantCardText), plantCardText.slice(0, 40).trim());

await page.locator('#lang-picker-hud .lang-btn[data-locale="es"]').click();
await page.waitForTimeout(400);

// ---------------------------------------------------------------
// 12. Errores de consola
// ---------------------------------------------------------------
const realErrors = errors.filter((e) => !/favicon|404/i.test(e));
check('Sin errores de consola', realErrors.length === 0, realErrors.slice(0, 3).join(' | '));

// ---------------------------------------------------------------
await page.screenshot({ path: path.join(ROOT, 'docs/screenshot-mapa.png') });
console.log('\n📸 Captura guardada en docs/screenshot-mapa.png');

await browser.close();
cleanup();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} pruebas superadas`);
process.exit(failed.length ? 1 : 0);
