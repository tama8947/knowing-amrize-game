/**
 * 🗺️ world/geoProjection.js — Proyección Albers Equal Area Conic
 *
 * Proyección estándar para Norteamérica (USGS): es la que usan los mapas
 * oficiales de EE.UU. y Canadá. Convierte lon/lat → coordenadas planas.
 *
 * Parámetros: parallels 29.5° y 45.5°, origen 40°N / 96°O.
 */
const DEG = Math.PI / 180;

const PHI1 = 29.5 * DEG;
const PHI2 = 45.5 * DEG;
const PHI0 = 40.0 * DEG;
const LAMBDA0 = -96.0 * DEG;

const N = (Math.sin(PHI1) + Math.sin(PHI2)) / 2;
const C = Math.cos(PHI1) ** 2 + 2 * N * Math.sin(PHI1);
const RHO0 = Math.sqrt(C - 2 * N * Math.sin(PHI0)) / N;

/** Proyecta un par (lon, lat) a un punto en el plano de la proyección. */
export function albers(lng, lat) {
  const phi = lat * DEG;
  const lambda = lng * DEG;

  const rho = Math.sqrt(C - 2 * N * Math.sin(phi)) / N;
  const theta = N * (lambda - LAMBDA0);

  return {
    x: rho * Math.sin(theta),
    y: RHO0 - rho * Math.cos(theta),
  };
}

/**
 * Calcula escala y desplazamiento para encajar un conjunto de puntos
 * dentro de un rectángulo de tamaño `width` × `depth`.
 *
 * @param {Array<{x:number,y:number}>} points
 * @param {number} width  ancho deseado en unidades de mundo
 * @param {number} depth  profundidad deseada (eje Z)
 */
export function fitProjection(points, width, depth) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }

  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const scale = Math.min(width / spanX, depth / spanY);

  const offsetX = -((minX + maxX) / 2) * scale;
  // invertimos Y (en Three.js, +Z es "sur")
  const offsetZ = ((minY + maxY) / 2) * scale;

  return { scale, offsetX, offsetZ, minX, maxX, minY, maxY, spanX, spanY };
}
