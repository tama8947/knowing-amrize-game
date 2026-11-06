/**
 * 🌲 world/Scenery.js — Vegetación, rocas y caminos
 */
import * as THREE from 'three';
import { terrainHeight } from './Terrain.js';

const trunkMat = new THREE.MeshStandardMaterial({
  color: 0x8a5a33,
  flatShading: true,
  roughness: 1,
});
const leafMats = [
  new THREE.MeshStandardMaterial({ color: 0x4e9a4e, flatShading: true, roughness: 1 }),
  new THREE.MeshStandardMaterial({ color: 0x3f7f42, flatShading: true, roughness: 1 }),
  new THREE.MeshStandardMaterial({ color: 0x63ab55, flatShading: true, roughness: 1 }),
];
export const rockMat = new THREE.MeshStandardMaterial({
  color: 0xa89b8a,
  flatShading: true,
  roughness: 1,
});

/** Área reservada para la planta (sin vegetación). */
export const PLANT_CLEARING = { x: 42, z: 34 };

function isClear(x, z, margin = 6) {
  return (
    Math.abs(x) < PLANT_CLEARING.x + margin &&
    Math.abs(z) < PLANT_CLEARING.z + margin
  );
}

function makeTree(x, z, s = 1) {
  const g = new THREE.Group();

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.5, 3.2, 6), trunkMat);
  trunk.position.y = 1.6;
  trunk.castShadow = true;
  g.add(trunk);

  const leafMat = leafMats[Math.floor(Math.random() * leafMats.length)];
  for (let i = 0; i < 3; i++) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(2.4 - i * 0.55, 3.1, 7), leafMat);
    cone.position.y = 3.4 + i * 1.7;
    cone.castShadow = true;
    g.add(cone);
  }

  g.position.set(x, terrainHeight(x, z), z);
  g.scale.setScalar(s);
  g.rotation.y = Math.random() * Math.PI;
  return g;
}

export function createScenery(parent) {
  const scene = parent;
  const group = new THREE.Group();
  group.name = 'scenery';

  // Árboles
  for (let i = 0; i < 95; i++) {
    const x = (Math.random() - 0.5) * 300;
    const z = (Math.random() - 0.5) * 300;
    if (isClear(x, z)) continue;
    if (Math.random() > 0.22) {
      group.add(makeTree(x, z, 0.8 + Math.random() * 0.9));
    }
  }

  // Rocas
  for (let i = 0; i < 26; i++) {
    const x = (Math.random() - 0.5) * 280;
    const z = (Math.random() - 0.5) * 280;
    if (isClear(x, z)) continue;
    const rock = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.1, 0),
      rockMat
    );
    rock.position.set(x, terrainHeight(x, z) + 0.5, z);
    rock.scale.setScalar(0.6 + Math.random() * 1.4);
    rock.rotation.set(Math.random(), Math.random() * Math.PI, Math.random() * 0.4);
    rock.castShadow = true;
    rock.receiveShadow = true;
    group.add(rock);
  }

  // Camino de acceso (segmentos que se solapan para no dejar huecos)
  const roadMat = new THREE.MeshStandardMaterial({
    color: 0x6f6a63,
    flatShading: true,
    roughness: 1,
  });
  for (let i = 0; i < 26; i++) {
    const x = -120 + i * 9;
    const z = 26 + Math.sin(i * 0.35) * 7;
    const seg = new THREE.Mesh(new THREE.BoxGeometry(10.4, 0.6, 6.5), roadMat);
    seg.position.set(x, terrainHeight(x, z) - 0.1, z);
    seg.rotation.y = Math.sin(i * 0.35) * 0.28;
    seg.receiveShadow = true;
    group.add(seg);
  }

  scene.add(group);
  return group;
}
