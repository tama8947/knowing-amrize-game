/**
 * 🚂 world/plants/LogisticsPlant.js — Centro de Distribución y Logística
 */
import * as THREE from 'three';
import { terrainHeight } from '../Terrain.js';
import { MAT, box, building, truck, fence, tree, conveyor } from './PlantKit.js';

export function createLogisticsPlant(scene, register) {
  const group = new THREE.Group();
  group.name = 'logistics-plant';
  group.position.set(-4, 0, -6);
  scene.add(group);

  const H = (x, z) => terrainHeight(x - 4, z - 6);
  const add = (mesh, stationId) => {
    group.add(mesh);
    register(mesh, stationId);
    return mesh;
  };

  // ---- Oficina de despacho ----
  const office = building(12, 8, 8, -18, H(-18, -4), -4, MAT.concrete, MAT.metalDark);
  add(office, 'lo-pedido');

  // ---- Almacén central ----
  const warehouse = building(18, 9, 14, 0, H(0, -4), -4, MAT.white, MAT.metalDark);
  add(warehouse, 'lo-despacho');

  // Muelle de carga
  const dock = box(16, 1.2, 3, 2, H(2, 4) + 0.6, 4, MAT.metalDark);
  group.add(dock);

  // ---- Camiones y remolques ----
  const trucks = [];
  for (let i = 0; i < 5; i++) {
    const t = truck({ x: -8 + i * 6, y: H(-8 + i * 6, 10), z: 10, rotY: 0, color: i % 2 ? MAT.orange : MAT.blue });
    group.add(t);
    trucks.push(t);
    if (i === 1) register(t, 'lo-entrega');
  }

  // ---- Vagón de tren ----
  const railCar = new THREE.Group();
  railCar.add(box(12, 3.2, 2.8, 0, 2.4, 0, MAT.metalDark));
  railCar.add(box(11, 0.4, 2.6, 0, 1.0, 0, MAT.metal));
  for (const wx of [-4, 4]) {
    for (const wz of [-1.4, 1.4]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.3, 10), MAT.metalDark);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(wx, 0.6, wz);
      railCar.add(wheel);
    }
  }
  railCar.position.set(-16, H(-16, -14), -14);
  group.add(railCar);
  register(railCar, 'lo-planificacion');

  // Vías
  for (const wz of [-15.4, -12.6]) {
    const rail = box(46, 0.16, 0.3, -6, H(-6, wz) + 0.1, wz, MAT.metal);
    group.add(rail);
  }

  // ---- Contenedores ----
  const colors = [MAT.orange, MAT.blue, MAT.green, MAT.red];
  let container = null;
  for (let i = 0; i < 8; i++) {
    const c = box(4.4, 2.6, 2.4, 8 + (i % 4) * 5, H(8, -10) + 1.3 + Math.floor(i / 4) * 2.7, -10, colors[i % 4]);
    group.add(c);
    if (i === 0) container = c;
  }
  register(container, 'lo-planificacion');

  // ---- Área de reciclaje de envases ----
  const recycle = box(6, 2.4, 4, -8, H(-8, -12) + 1.2, -12, MAT.green);
  add(recycle, 'lo-reciclaje');

  const pallets = box(4, 1.2, 3, -14, H(-14, -12) + 0.6, -12, MAT.gravel);
  group.add(pallets);

  // ---- Callejón de carga ----
  const lane = box(34, 0.2, 6, 0, H(0, 6) + 0.1, 6, MAT.metalDark);
  group.add(lane);

  group.add(fence(48, -4, H(-4, -18) + 0.1, -18));
  group.add(tree(20, 12, 1.1));
  group.add(tree(24, 16, 0.9));
  group.add(tree(-22, 10, 1.0));

  const update = (dt, elapsed) => {
    // los camiones avanzan por el callejón en bucle
    trucks.forEach((t, i) => {
      const speed = 3 + i * 0.4;
      const span = 40;
      let x = ((elapsed * speed + i * 9) % span) - span / 2;
      t.position.x = x;
      t.position.y = H(x, 10);
      t.rotation.y = x > 0 ? 0 : Math.PI;
    });
  };

  return { group, update };
}
