/**
 * 🏭 world/plants/index.js — Factory de plantas por línea de negocio
 */
import { createCementPlant } from './CementPlant.js';
import { createAggregatesPlant } from './AggregatesPlant.js';
import { createConcretePlant } from './ConcretePlant.js';
import { createAsphaltPlant } from './AsphaltPlant.js';
import { createRoofingPlant } from './RoofingPlant.js';
import { createLogisticsPlant } from './LogisticsPlant.js';

const FACTORIES = {
  cement: createCementPlant,
  aggregates: createAggregatesPlant,
  concrete: createConcretePlant,
  asphalt: createAsphaltPlant,
  roofing: createRoofingPlant,
  logistics: createLogisticsPlant,
};

/**
 * Crea la planta correspondiente al negocio.
 * @param {string} business  clave del negocio (cement, aggregates, ...)
 * @param {THREE.Scene} scene
 * @param {(obj: THREE.Object3D, info: object, label: string) => void} register
 * @returns {{ group: THREE.Group, update: Function } | null}
 */
export function createPlantByBusiness(business, scene, register) {
  const factory = FACTORIES[business] ?? FACTORIES.cement;
  return factory(scene, register);
}

export { FACTORIES };
