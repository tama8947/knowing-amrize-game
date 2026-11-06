/**
 * 🔵 world/plants/ConcretePlant.js — Planta de Concreto (Ready-Mix)
 */
import * as THREE from 'three';
import { terrainHeight } from '../Terrain.js';
import { MAT, box, building, silo, conveyor, truck, stack, fence, tree } from './PlantKit.js';

export function createConcretePlant(scene, register) {
  const group = new THREE.Group();
  group.name = 'concrete-plant';
  group.position.set(-4, 0, -6);
  scene.add(group);

  const H = (x, z) => terrainHeight(x - 4, z - 6);
  const add = (mesh, stationId) => {
    group.add(mesh);
    register(mesh, stationId);
    return mesh;
  };

  // ---- Silos de cemento y agregados ----
  const cementSilo = silo(2.4, 14, -18, H(-18, -2), -2, MAT.concrete);
  add(cementSilo, 'co-dosificacion');

  const aggSilo = silo(2.0, 11, -13, H(-13, -2), -2, MAT.blue);
  group.add(aggSilo);

  // Tolva de dosificación (embudo)
  const hopper = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 0.9, 3.4, 4), MAT.metal);
  hopper.rotation.y = Math.PI / 4;
  hopper.position.set(-6, H(-6, -2) + 8, -2);
  add(hopper, 'co-dosificacion');

  // ---- Edificio de mezclado ----
  const mixer = building(12, 9, 9, 0, H(0, 0), 0, MAT.concrete, MAT.metalDark);
  add(mixer, 'co-mezclado');

  const belt = conveyor(10, 0.4, 8, H(8, 0) + 5, 0, Math.PI / 2);
  group.add(belt);

  // ---- Laboratorio de control de calidad ----
  const lab = building(7, 4, 6, -8, H(-8, 12), 12, MAT.orange, MAT.metalDark);
  add(lab, 'co-calidad');

  // ---- Zona de carga yilities ----
  const chute = box(5, 4, 3, 10, H(10, 10) + 6, 10, MAT.metal);
  group.add(chute);

  const mixerTruck = truck({ x: 12, y: H(12, 8), z: 8, rotY: 0.4, mixer: true });
  group.add(mixerTruck);
  register(mixerTruck.userData.mixer, 'co-transporte');

  const secondTruck = truck({ x: -2, y: H(-2, 14), z: 14, rotY: -0.6, mixer: true, color: MAT.blue });
  group.add(secondTruck);

  // ---- Pumping / colocación ----
  const slab = box(12, 0.4, 9, 16, H(16, 14) + 0.2, 14, MAT.concrete);
  add(slab, 'co-colocacion');

  const pump = box(2.4, 1.4, 8, 20, H(20, 8) + 0.9, 8, MAT.orange);
  group.add(pump);

  group.add(fence(40, -4, H(-4, -12) + 0.1, -12));
  group.add(tree(20, -10, 1.0));
  group.add(tree(24, 18, 0.9));

  // Humo de la tolva
  const puffs = [];
  for (let i = 0; i < 3; i++) {
    const p = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.9, 1),
      new THREE.MeshStandardMaterial({ color: 0xefe6d6, transparent: true, opacity: 0.4, flatShading: true, depthWrite: false })
    );
    group.add(p);
    puffs.push(p);
  }

  const update = (dt, elapsed) => {
    mixerTruck.userData.mixer.rotation.z += dt * 1.1;
    secondTruck.userData.mixer.rotation.z += dt * 1.1;
    puffs.forEach((p, i) => {
      const cycle = (elapsed * 1.2 + i * 2.6) % 10;
      p.position.set(-6, H(-6, -2) + 11 + cycle, -2);
      p.scale.setScalar(0.6 + cycle * 0.09);
      p.material.opacity = Math.max(0, 0.4 - cycle * 0.04);
    });
  };

  return { group, update };
}
