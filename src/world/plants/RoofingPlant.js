/**
 * 🟤 world/plants/RoofingPlant.js — Planta de Roofing / Building Envelope
 */
import * as THREE from 'three';
import { terrainHeight } from '../Terrain.js';
import { MAT, box, building, conveyor, silo, truck, stack, fence, tank } from './PlantKit.js';

export function createRoofingPlant(scene, register) {
  const group = new THREE.Group();
  group.name = 'roofing-plant';
  group.position.set(-4, 0, -6);
  scene.add(group);

  const H = (x, z) => terrainHeight(x - 4, z - 6);
  const add = (mesh, stationId) => {
    group.add(mesh);
    register(mesh, stationId);
    return mesh;
  };

  // ---- Nave de fabricación ----
  const factory = building(20, 10, 12, -12, H(-12, -2), -2, MAT.concrete, MAT.metalDark);
  add(factory, 'ro-fabricacion');

  // Extrusora (líneas de película)
  const extruder = box(7, 3, 4, -14, H(-14, 2) + 1.6, 2, MAT.blue);
  add(extruder, 'ro-fabricacion');

  // Rolls de membrana apilados
  for (let i = 0; i < 5; i++) {
    const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 4.5, 14), MAT.white);
    roll.rotation.z = Math.PI / 2;
    roll.position.set(-20 + (i % 3) * 2.4, H(-20 + (i % 3) * 2.4, 10) + 0.9 + Math.floor(i / 3) * 1.6, 10);
    roll.castShadow = true;
    add(roll, 'ro-fabricacion');
  }

  // ---- Almacén de accesorios y aislantes ----
  const warehouse = building(12, 7, 10, 4, H(4, -4), -4, MAT.white, MAT.metalDark);
  add(warehouse, 'ro-accesorios');

  const insulation = box(6, 2.2, 4, 6, H(6, 4) + 1.1, 4, MAT.yellow);
  add(insulation, 'ro-accesorios');

  const adhesives = tank(1.4, 4, 12, H(12, 2), 2, MAT.red, Math.PI / 2);
  add(adhesives, 'ro-accesorios');

  // ---- Zona deAIT装 / demostración de instalación ----
  const demoRoof = box(14, 0.6, 10, -6, H(-6, 14) + 4.5, 14, MAT.white);
  add(demoRoof, 'ro-instalacion');

  // Membrana tendida
  const membrane = box(13, 0.2, 9, -6, H(-6, 14) + 4.9, 14, MAT.asphalt);
  add(membrane, 'ro-instalacion');

  // Taller de instalación (personajes de roofing)
  const crew = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const w = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.6, 4, 8), MAT.orange);
    w.position.set(i * 1.6 - 1.6, 0.6, -1 + (i % 2) * 1.6);
    w.castShadow = true;
    crew.add(w);
  }
  crew.position.set(-6, H(-6, 14) + 5.2, 14);
  add(crew, 'ro-instalacion');

  // ---- Prueba de impermeabilización ----
  const pool = box(6, 0.3, 4, 8, H(8, 16) + 0.15, 16, MAT.blue);
  add(pool, 'ro-impermeabilidad');

  const ladder = box(0.3, 5, 0.3, 12, H(12, 16) + 2.5, 16, MAT.metal);
  group.add(ladder);

  // ---- Expedición ----
  const truckOut = truck({ x: 16, y: H(16, -4), z: -4, rotY: 1.1, color: MAT.blue });
  group.add(truckOut);
  register(truckOut, 'ro-fabricacion');

  const belt = conveyor(9, 0.35, 0, H(0, -4) + 4, -4, Math.PI / 2);
  group.add(belt);

  group.add(fence(40, -6, H(-6, -12) + 0.1, -12));

  const update = (dt, elapsed) => {
    crew.children.forEach((c, i) => {
      c.position.z = -1 + Math.sin(elapsed * 1.2 + i) * 1.4;
    });
  };

  return { group, update };
}
