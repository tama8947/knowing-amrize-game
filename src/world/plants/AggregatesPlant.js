/**
 * 🪨 world/plants/AggregatesPlant.js — Planta de Agregados (cantera)
 */
import * as THREE from 'three';
import { terrainHeight } from '../Terrain.js';
import { MAT, box, building, conveyor, stockpile, excavator, truck, tree, fence, tank } from './PlantKit.js';

export function createAggregatesPlant(scene, register) {
  const group = new THREE.Group();
  group.name = 'aggregates-plant';
  group.position.set(-4, 0, -6);
  scene.add(group);

  const H = (x, z) => terrainHeight(x - 4, z - 6);
  const add = (mesh, stationId) => {
    group.add(mesh);
    register(mesh, stationId);
    return mesh;
  };

  // ---- Zona de extracción (bancos de roca escalonados) ----
  for (let i = 0; i < 4; i++) {
    const bench = box(26 - i * 4, 2.4, 5, -26, H(-26, -6) + 1.2 + i * 1.9, -10 + i * 5, MAT.rock);
    group.add(bench);
  }

  const digger = excavator({ x: -24, y: H(-24, -8), z: -8, rotY: 0.6 });
  group.add(digger);

  // Rocas sueltas
  for (let i = 0; i < 8; i++) {
    const lx = -30 + Math.random() * 14;
    const lz = -12 + Math.random() * 12;
    const r = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9 + Math.random(), 0), MAT.rock);
    r.position.set(lx, H(lx, lz) + 0.5, lz);
    r.castShadow = true;
    add(r, 'ag-extraccion');
  }

  // ---- Trituración ----
  const crusher = building(10, 7, 8, -14, H(-14, 0), 0, MAT.concrete, MAT.metalDark);
  group.add(crusher);
  register(crusher, 'ag-trituracion');

  const belt1 = conveyor(14, 0.45, -6, H(-6, 0) + 5, 0, Math.PI / 2);
  group.add(belt1);
  register(belt1, 'ag-trituracion');

  // ---- Zarandeo (cribas vibratorias) ----
  const screen = building(8, 6, 6, 4, H(4, 0), 0, MAT.blue, MAT.metalDark);
  group.add(screen);
  register(screen, 'ag-zarandeo');

  const belt2 = conveyor(12, 0.35, 14, H(14, 0) + 4.5, 0, Math.PI / 2);
  group.add(belt2);
  register(belt2, 'ag-zarandeo');

  // ---- Lavado de arena (tanques de agua) ----
  const washTank = tank(2.2, 6, 20, H(20, 0), 2, MAT.blue, Math.PI / 2);
  group.add(washTank);
  register(washTank, 'ag-lavado');

  // ---- Almacenamiento: pilas por tamaño ----
  const piles = [
    { r: 4.2, h: 3.6, mat: MAT.gravel, label: 'Pila de grava 3/4"' },
    { r: 3.4, h: 2.8, mat: MAT.gravel, label: 'Pila de grava 1/2"' },
    { r: 3.0, h: 2.2, mat: MAT.sand, label: 'Pila de arena' },
  ];
  piles.forEach((p, i) => {
    const pile = stockpile(p.r, p.h, -10 + i * 11, H(-10 + i * 11, 14), 14, p.mat);
    add(pile, 'ag-almacen');
  });

  // ---- Despacho: rutas y camión ----
  const loader = truck({ x: 2, y: H(2, 12), z: 12, rotY: 1.2, color: MAT.yellow });
  group.add(loader);

  group.add(fence(46, -2, H(-2, -14) + 0.1, -14));
  group.add(tree(22, -12, 1.1));

  // Humo/polvo sutil sobre las pilas
  const dust = [];
  for (let i = 0; i < 4; i++) {
    const puff = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.2, 1),
      new THREE.MeshStandardMaterial({ color: 0xe8dcc4, transparent: true, opacity: 0.35, flatShading: true, depthWrite: false })
    );
    group.add(puff);
    dust.push(puff);
  }

  const update = (dt, elapsed) => {
    dust.forEach((p, i) => {
      const cycle = (elapsed * 0.7 + i * 3.3) % 12;
      p.position.set(-24 + i * 9, H(-24 + i * 9, -8) + 2 + cycle, -8);
      p.scale.setScalar(0.7 + cycle * 0.1);
      p.material.opacity = Math.max(0, 0.35 - cycle * 0.028);
    });
  };

  return { group, update };
}
