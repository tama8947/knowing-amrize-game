/**
 * 🛠️ tools/devServer.mjs — Arranca el servidor de Vite para las pruebas
 *
 * Usa el binario local de node_modules (compatible con pnpm, npm y yarn)
 * en lugar de `npx`, para no depender del gestor de paquetes del sistema.
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '..');

/** Ruta del binario de vite en node_modules/.bin (con extensión en Windows). */
function viteBin() {
  const name = process.platform === 'win32' ? 'vite.cmd' : 'vite';
  const local = path.join(ROOT, 'node_modules', '.bin', name);
  if (existsSync(local)) return local;
  // fallback: binario global
  return name;
}

/**
 * @param {number} port
 * @returns {import('node:child_process').ChildProcess}
 */
export function startDevServer(port) {
  return spawn(viteBin(), ['--port', String(port), '--host', '127.0.0.1'], {
    cwd: ROOT,
    stdio: 'ignore',
  });
}

/** Espera a que el servidor responda. */
export async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok) return true;
    } catch (e) {
      /* aún no levanta */
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  return false;
}
