/**
 * 📚 data/plantInfo.js — Estructura de las líneas de negocio
 *
 * El contenido educativo vive ahora en `src/i18n/locales/*` para poder
 * cambiar de idioma en caliente. Aquí solo queda la estructura: qué negocio
 * existe, qué estaciones tiene y en qué orden aparecen.
 */
import { t, tBusiness } from '../i18n/index.js';

/** Claves de las 6 líneas de negocio de Amrize. */
export const BUSINESS_KEYS = ['cement', 'aggregates', 'concrete', 'asphalt', 'roofing', 'logistics'];

/** Estaciones de cada negocio, en orden de recorrido. */
export const STATIONS_BY_BUSINESS = {
  aggregates: ['ag-extraccion', 'ag-trituracion', 'ag-zarandeo', 'ag-lavado', 'ag-almacen'],
  cement: ['cantera', 'trituracion', 'prehorno', 'horno', 'molino', 'silos', 'calidad', 'sostenibilidad'],
  concrete: ['co-dosificacion', 'co-mezclado', 'co-transporte', 'co-colocacion', 'co-calidad'],
  asphalt: ['as-secado', 'as-mezcla', 'as-transporte', 'as-extendido', 'as-compactado', 'as-rap'],
  roofing: ['ro-fabricacion', 'ro-accesorios', 'ro-instalacion', 'ro-impermeabilidad'],
  logistics: ['lo-pedido', 'lo-planificacion', 'lo-despacho', 'lo-entrega', 'lo-reciclaje'],
};

/** Catálogo de negocios con los textos ya traducidos. */
export function getBusinesses() {
  return BUSINESS_KEYS.map((key) => tBusiness(key));
}

/** Etiqueta corta de un negocio (ya traducida). */
export function businessLabel(key) {
  return t(`biz.${key}.name`);
}

export { t };
