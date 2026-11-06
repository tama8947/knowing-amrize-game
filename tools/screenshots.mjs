#!/usr/bin/env node
/**
 * 📸 tools/screenshots.mjs — Genera las capturas del proyecto
 */
import { chromium } from 'playwright';
import path from 'node:path';
import { ROOT, startDevServer, waitForServer } from './devServer.mjs';

const PORT = 4198;
const server = startDevServer(PORT);
await waitForServer(`http://127.0.0.1:${PORT}/`);

const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const shot = (n) => path.join(ROOT, 'docs', n);

await page.goto(`http://127.0.0.1:${PORT}/?lowfx=1`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.screenshot({ path: shot('screenshot-menu.png') });

await page.locator('#player-name-input').fill('Sandra');
await page.locator('#start-btn').click();
await page.waitForTimeout(4000);
await page.screenshot({ path: shot('screenshot-mapa.png') });

// Buscador abierto con resultados
await page.locator('#search-input').fill('cemento');
await page.waitForTimeout(900);
await page.screenshot({ path: shot('screenshot-buscador.png') });
await page.locator('#search-clear').click();

// Planta
await page.evaluate(() => {
  const g = window.__amrize;
  g.visitPlant([...g.mapScene.pins.values()].find((x) => x.plant.business === 'cement').plant);
});
await page.waitForTimeout(3500);
await page.screenshot({ path: shot('screenshot-planta.png') });

console.log('📸 Capturas generadas en docs/');
await browser.close();
server.kill();
