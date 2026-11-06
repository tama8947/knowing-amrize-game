/**
 * ⚫ world/plants/AsphaltPlant.js — Planta de Asfalto (mezcla en caliente)
 */
import * as THREE from 'three';
import { terrainHeight } from '../Terrain.js';
import { MAT, box, building, silo, conveyor, truck, stack, tank, stockpile, fence } from './PlantKit.js';

export function createAsphaltPlant(scene, register) {
  const group = new THREE.Group();
  group.name = 'asphalt-plant';
  group.position.set(-4, 0, -6);
  scene.add(group);

  const H = (x, z) => terrainHeight(x - 4, z - 6);
  const add = (mesh, stationId) => {
    group.add(mesh);
    register(mesh, stationId);
    return mesh;
  };

  // ---- Secado de agregados: tambor secador + torre de elevación ----
  const dryer = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 11, 12), MAT.metal);
  dryer.rotation.z = Math.PI / 2;
  dryer.position.set(-20, H(-20, -4) + 3.4, -4);
  dryer.rotation.x = 0.08;
  add(dryer, 'as-secado');

  const elevator = building(4, 12, 4, -26, H(-26, -4), -4, MAT.concrete, MAT.metalDark);
  add(elevator, 'as-secado');

  // ---- Tambor mezclador (asphalt drum mixer) ----
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 9, 14), MAT.orange);
  drum.rotation.x = Math.PI / 2;
  drum.position.set(-8, H(-8, -2) + 8, -2);
  add(drum, 'as-mezcla');

  const mixerTower = building(9, 14, 8, -8, H(-8, -2), -2, MAT.concrete, MAT.metalDark);
  group.add(mixerTower);

  // ---- Chimenea y secretos de combustible ----
  const flue = stack(1.1, 1.4, 15, 0, H(0, -6), -6, MAT.metalDark);
  add(flue, 'as-mezcla');

  const fuelTank = tank(1.6, 5, -14, H(-14, 6), 6, MAT.red, Math.PI / 2);
  group.add(fuelTank);

  // ---- Almacén de asfalto (RAP) y agregados ----
  const rapPile = stockpile(3.6, 2.4, 10, H(10, 6), 6, MAT.asphalt);
  add(rapPile, 'as-rap');

  const aggPile = stockpile(4.0, 3.2, 18, H(18, 4), 4, MAT.gravel);
  group.add(aggPile);

  // ---- Cinta de transporte al tambor ----
  const belt = conveyor(13, 0.5, -14, H(-14, -2) + 6, -2, Math.PI / 2);
  group.add(belt);

  // ---- Zona de carga de camiones ----
  const loadZone = box(8, 4.5, 4, 4, H(4, -6) + 6, -6, MAT.metal);
  group.add(loadZone);

  const hotTruck = truck({ x: 8, y: H(8, 0), z: 0, rotY: 0.5, color: MAT.metalDark });
  group.add(hotTruck);
  register(hotTruck, 'as-transporte');

  const secondTruck = truck({ x: 14, y: H(14, 6), z: 6, rotY: -0.3, color: MAT.metalDark });
  group.add(secondTruck);

  // ---- Extendedora (carretera de prueba) ----
  const road = box(26, 0.3, 7, 4, H(4, 18) + 0.15, 18, MAT.asphalt);
  add(road, 'as-extendido');

  const paver = box(4, 1.8, 2.4, -2, H(-2, 18) + 1.1, 18, MAT.yellow);
  add(paver, 'as-extendido');

  const roller = box(3, 1.6, 2, 6, H(6, 18) + 1, 18, MAT.orange);
  add(roller, 'as-compactado');

  group.add(fence(44, -2, H(-2, -12) + 0.1, -12));

  // Humo/calor
  const heat = [];
  for (let i = 0; i < 5; i++) {
    const p = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.3, 1),
      new THREE.MeshStandardMaterial({ color: 0xd8d2c4, transparent: true, opacity: 0.4, flatShading: true, depthWrite: false })
    );
    group.add(p);
    heat.push(p);
  }

  const update = (dt, elapsed) => {
    dryer.rotation.y += dt * 0.6;
    drum.rotation.z += dt * 0.9;
    heat.forEach((p, i) => {
      const cycle = (elapsed * 1.4 + i * 2.1) % 13;
      p.position.set(0, H(0, -6) + 16 + cycle, -6);
      p.scale.setScalar(0.7 + cycle * 0.1);
      p.material.opacity = Math.max(0, 0.4 - cycle * 0.03);
    });
  };

  return { group, update };
}
