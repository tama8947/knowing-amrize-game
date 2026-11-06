#!/usr/bin/env node
/**
 * 🌎 tools/build-plants.mjs
 * Genera src/data/plants.js con el catálogo curado de plantas de Amrize.
 *
 * Fuente: datos de ubicaciones públicas de amrize.com (locations page).
 * Uso:  node tools/build-plants.mjs [ruta/amrize_locations.json]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const source = process.argv[2] || '/tmp/amrize_locations.json';

const all = JSON.parse(fs.readFileSync(source, 'utf8'));

/** Clasifica una ubicación en una de las 6 líneas de negocio del juego. */
function classify(loc) {
  const a = loc.activity || '';
  if (/TPO|EPDM|PVC|Shingle|Spray Foam|Adhesive|Sealant|Coating|Sheathing|Wrap|Insulat|Gypsum|Wallboard/i.test(a)) {
    return 'roofing';
  }
  if (/Asphalt/i.test(a)) return 'asphalt';
  if (/Cement/i.test(a)) return 'cement';
  if (/Aggregates/i.test(a)) return 'aggregates';
  if (/Concrete/i.test(a)) return 'concrete';
  if (/Warehouse|Business Services/i.test(a)) return 'logistics';
  return null;
}

const candidates = all
  .map((loc) => ({ loc, business: classify(loc) }))
  .filter((x) => x.business && x.loc.coordsLat && x.loc.coordsLng);

/** Punto medio aproximado para etiquetas. */
function cleanName(loc) {
  let n = loc.locationName
    .replace(/,\s*[A-Z][a-z]+,\s*[A-Z][a-z]+$/, '') // quita ", City, State"
    .replace(/^\s*(Aggregates|Asphalt|Cement|Concrete)\s*,\s*/i, '') // quita prefijo de actividad
    .replace(/\s*-\s*.*$/, '') // quita sufijos
    .trim();

  // Si sigue siendo genérico ("Aggregates", "Duro"), usamos la ciudad
  const generic = /^(aggregates|asphalt|cement|concrete|duro|gaco|elevate|ox|iso)$/i;
  if (generic.test(n) && loc.locality) n = loc.locality;
  return n;
}

/** Nombre de la ciudad (si existe). */
function city(loc) {
  return loc.locality || cleanName(loc);
}

/** Normaliza "TX, Texas" -> "TX". */
function stateCode(loc) {
  const parts = String(loc.administrativeArea || '').split(',');
  return parts[parts.length - 1].trim();
}

/**
 * Selección curada: plantas icónicas de Amrize (sedes de cemento y highlights
 * de cada negocio), priorizando cobertura geográfica.
 *
 * La selección es DETERMINISTA: el desempate usa un hash del id, no números
 * aleatorios, para que el catálogo sea reproducible entre ejecuciones.
 */
function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Construye el catálogo final. */
const TARGET_PER_BUSINESS = {
  aggregates: 7,
  cement: 7,
  concrete: 7,
  asphalt: 6,
  roofing: 6,
  logistics: 5,
};

const byBusiness = {};
for (const x of candidates) {
  (byBusiness[x.business] ||= []).push(x);
}

// Prioriza diversidad: primero por país, luego por estado/provincia, luego región.
function score(x, used) {
  const st = stateCode(x.loc);
  const country = x.loc.country === 'Canada' ? 'CA' : 'US';
  let s = 0;
  if (!used.states.has(`${country}-${st}`)) s -= 40; // nuevo estado
  if (!used.countries.has(country)) s -= 30; // nuevo país
  if (!used.regions.has(x.loc.region)) s -= 20; // nueva región
  s += (hashCode(x.loc.id) % 100) / 100; // desempate determinista
  return s;
}

const used = { states: new Set(), countries: new Set(), regions: new Set() };
const selected = [];

for (const [business, target] of Object.entries(TARGET_PER_BUSINESS)) {
  const pool = (byBusiness[business] || []).slice().sort((a, b) => score(a, used) - score(b, used));
  const picked = [];

  for (const x of pool) {
    if (picked.length >= target) break;
    const st = stateCode(x.loc);
    const country = x.loc.country === 'Canada' ? 'CA' : 'US';
    const key = `${country}-${st}`;
    // máximo 2 plantas por estado/provincia
    if (picked.filter((p) => `${p.loc.country === 'Canada' ? 'CA' : 'US'}-${stateCode(p.loc)}` === key).length >= 2) continue;
    picked.push(x);
    used.states.add(key);
    used.countries.add(country);
    used.regions.add(x.loc.region);
  }

  selected.push(...picked.map((x) => ({ ...x, stateCode: stateCode(x.loc) })));
}

const plants = selected.map((x) => {
  const country = x.loc.country === 'Canada' ? 'CA' : 'US';
  return {
    id: x.loc.id,
    name: city(x.loc),
    site: cleanName(x.loc),
    brand: x.loc.brand,
    activity: x.loc.activity,
    business: x.business,
    locality: x.loc.locality,
    region: x.loc.region,
    state: x.stateCode,
    country,
    lat: +x.loc.coordsLat.toFixed(4),
    lng: +x.loc.coordsLng.toFixed(4),
    address: [x.loc.addr1, x.loc.addr2].filter(Boolean).join(', '),
  };
});

// Orden estable por país y negocio
const order = { cement: 0, aggregates: 1, concrete: 2, asphalt: 3, roofing: 4, logistics: 5 };
plants.sort((a, b) =>
  a.country.localeCompare(b.country) ||
  order[a.business] - order[b.business] ||
  a.state.localeCompare(b.state)
);

const out = `/**
 * 📍 data/plants.js — Catálogo de plantas de Amrize
 *
 * Generado por tools/build-plants.mjs a partir de los datos públicos de
 * ubicaciones de amrize.com. No editar a mano: editar el script y regenerar.
 *
 * ${plants.length} plantas · ${new Set(plants.map((p) => p.country)).size} países
 */
export const PLANTS = ${JSON.stringify(plants, null, 2)};

/** Plantas agrupadas por negocio. */
export const PLANTS_BY_BUSINESS = ${JSON.stringify(
  plants.reduce((acc, p) => {
    (acc[p.business] ||= []).push(p.id);
    return acc;
  }, {}),
  null, 2
)};

/** Helper: obtener una planta por id. */
export const getPlant = (id) => PLANTS.find((p) => p.id === id);
`;

const dest = path.join(ROOT, 'src/data/plants.js');
fs.writeFileSync(dest, out);

const stats = plants.reduce((a, p) => ({ ...a, [p.business]: (a[p.business] || 0) + 1 }), {});
console.log('✅ Catálogo generado:', plants.length, 'plantas');
console.table(stats);
console.log('   países:', [...new Set(plants.map((p) => p.country))].join(', '));
console.log('   estados/provincias:', new Set(plants.map((p) => `${p.country}-${p.state}`)).size);
console.log('📄', path.relative(ROOT, dest));
