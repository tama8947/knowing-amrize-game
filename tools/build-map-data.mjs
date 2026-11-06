#!/usr/bin/env node
/**
 * 🗺️ tools/build-map-data.mjs
 * Genera src/data/map/us-ca.json a partir de Natural Earth (10m admin-1).
 *
 * Uso:
 *   node tools/build-map-data.mjs [ruta/geojson] [tolerancia]
 *
 * Descarga por defecto:
 *   https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/
 *   10m/cultural/ne_10m_admin_1_states_provinces.json
 *
 * Salida: JSON compacto con anillos [lon, lat] por estado/provincia.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SOURCE_URL =
  'https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/10m/cultural/ne_10m_admin_1_states_provinces.json';

const sourceArg = process.argv[2];
const TOLERANCE = Number(process.argv[3] || 0.04); // grados (~4 km)

/** Douglas–Peucker: simplifica una línea. */
function simplify(points, tolerance) {
  if (points.length <= 3) return points;

  const sqTol = tolerance * tolerance;

  // punto a segmento (proyectado simple: lon*cos(lat) para no deformar)
  const sqSegDist = (p, a, b) => {
    let x = a[0];
    let y = a[1];
    let dx = b[0] - x;
    let dy = b[1] - y;
    if (dx !== 0 || dy !== 0) {
      const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) {
        x = b[0];
        y = b[1];
      } else if (t > 0) {
        x += dx * t;
        y += dy * t;
      }
    }
    dx = p[0] - x;
    dy = p[1] - y;
    return dx * dx + dy * dy;
  };

  const keep = new Array(points.length).fill(false);
  keep[0] = true;
  keep[points.length - 1] = true;

  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [first, last] = stack.pop();
    let maxDist = 0;
    let index = -1;
    for (let i = first + 1; i < last; i++) {
      const d = sqSegDist(points[i], points[first], points[last]);
      if (d > maxDist) {
        maxDist = d;
        index = i;
      }
    }
    if (maxDist > sqTol && index !== -1) {
      keep[index] = true;
      stack.push([first, index], [index, last]);
    }
  }

  return points.filter((_, i) => keep[i]);
}

function ringArea(ring) {
  let area = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    area += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  }
  return Math.abs(area / 2);
}

/** Quita anillos demasiado pequeños (islas). */
function cleanRing(ring, minArea) {
  if (ring.length < 4) return null;
  if (ringArea(ring) < minArea) return null;
  return ring;
}

async function loadSource() {
  if (sourceArg && fs.existsSync(sourceArg)) {
    console.log(`📂 Leyendo ${sourceArg}`);
    return JSON.parse(fs.readFileSync(sourceArg, 'utf8'));
  }
  console.log('⬇️  Descargando Natural Earth 10m admin-1...');
  const res = await fetch(SOURCE_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const geo = await loadSource();
const targets = new Set(['USA', 'CAN']);
const features = geo.features.filter((f) => targets.has(f.properties.adm0_a3));

const out = [];
for (const f of features) {
  const p = f.properties;
  const code = p.iso_3166_2 || p.adm1_code;
  const geom = f.geometry;
  const polygons = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;

  const rings = [];
  for (const poly of polygons) {
    for (const ring of poly) {
      const cleaned = cleanRing(ring, 0.02);
      if (!cleaned) continue;
      const simplified = simplify(cleaned, TOLERANCE);
      if (simplified.length >= 4) rings.push(simplified.map(([x, y]) => [+x.toFixed(4), +y.toFixed(4)]));
    }
  }

  if (!rings.length) continue;

  // centro del polígono principal (anillo exterior más grande)
  const outer = rings.reduce((a, b) => (ringArea(b) > ringArea(a) ? b : a));
  const xs = outer.map((c) => c[0]);
  const ys = outer.map((c) => c[1]);
  const center = [
    +(xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(3),
    +(ys.reduce((a, b) => a + b, 0) / ys.length).toFixed(3),
  ];

  out.push({
    code,
    name: p.name,
    nameEn: p.name_en || p.name,
    country: p.adm0_a3 === 'USA' ? 'US' : 'CA',
    type: p.type_en || p.type,
    center,
    rings,
  });
}

// Orden estable: primero US (alfabético), luego CA
out.sort((a, b) => (a.country === b.country ? a.name.localeCompare(b.name) : a.country === 'US' ? -1 : 1));

const dest = path.join(ROOT, 'src/data/map');
fs.mkdirSync(dest, { recursive: true });
const file = path.join(dest, 'us-ca.json');
fs.writeFileSync(file, JSON.stringify({ generated: new Date().toISOString().slice(0, 10), units: out }));

const kb = (fs.statSync(file).size / 1024).toFixed(1);
console.log(`✅ ${out.length} unidades (${out.filter((u) => u.country === 'US').length} US, ${out.filter((u) => u.country === 'CA').length} CA)`);
console.log(`📄 ${path.relative(ROOT, file)} — ${kb} KB`);
