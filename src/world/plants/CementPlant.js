/**
 * 🏭 world/plants/CementPlant.js — Planta de Cemento (nivel jugable)
 * Cada equipo registra un "interactuable" con su explicación educativa.
 */
import * as THREE from 'three';
import { terrainHeight } from '../Terrain.js';

const concreteMat = new THREE.MeshStandardMaterial({ color: 0xd8d2c4, flatShading: true, roughness: 0.95 });
const metalMat = new THREE.MeshStandardMaterial({ color: 0xb8b2a6, flatShading: true, roughness: 0.7, metalness: 0.35 });
const darkMat = new THREE.MeshStandardMaterial({ color: 0x5c5750, flatShading: true, roughness: 0.9 });
const orangeMat = new THREE.MeshStandardMaterial({ color: 0xff7a1a, flatShading: true, roughness: 0.8 });
const rockMat = new THREE.MeshStandardMaterial({ color: 0xa89b8a, flatShading: true, roughness: 1 });

/**
 * @param {THREE.Scene} scene
 * @param {Function} registerInteractable  (object3D, info, label) => void
 * @returns {{ group: THREE.Group, update: Function }}
 */
export function createCementPlant(scene, registerInteractable) {
  const group = new THREE.Group();
  group.name = 'cement-plant';
  group.position.set(-4, 0, -6);
  scene.add(group);

  // Coordenadas locales -> el grupo está en (-4, 0, -6)
  const H = (x, z) => terrainHeight(x - 4, z - 6);

  /** Añade una caja con sombra + registro de interacción. */
  const addBox = (w, h, d, x, y, z, mat, stationId) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
    if (stationId) registerInteractable(m, stationId);
    return m;
  };

  // ------------------------------------------------------------------
  // 1. Cantera (rocas de caliza)
  // ------------------------------------------------------------------
  for (let i = 0; i < 7; i++) {
    const lx = -24 + (Math.random() - 0.5) * 10;
    const lz = 8 + (Math.random() - 0.5) * 8;
    const r = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.6 + Math.random() * 1.2, 0),
      rockMat
    );
    r.position.set(lx, H(lx, lz) + 0.8, lz);
    r.castShadow = true;
    group.add(r);
    registerInteractable(r, 'cantera');
  }

  // ------------------------------------------------------------------
  // 2. Edificio de trituración + molienda de crudo
  // ------------------------------------------------------------------
  addBox(11, 8, 9, -16, H(-16, -2) + 4, -2, concreteMat, 'trituracion');
  addBox(4, 3, 4, -16, H(-16, -2) + 9.5, -2, darkMat, 'trituracion');

  // Cinta transportadora inclinada
  const conveyor = new THREE.Mesh(new THREE.BoxGeometry(16, 0.8, 2.2), darkMat);
  conveyor.position.set(-7, H(-12, -2) + 6.5, -2);
  conveyor.rotation.z = 0.42;
  conveyor.castShadow = true;
  group.add(conveyor);
  registerInteractable(conveyor, 'trituracion');

  // ------------------------------------------------------------------
  // 3. Prehorno (torre de ciclones)
  // ------------------------------------------------------------------
  addBox(7, 22, 7, 2, H(2, -4) + 11, -4, concreteMat, 'prehorno');
  for (let i = 0; i < 4; i++) {
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 4, 8), metalMat);
    cyl.position.set(6.4, H(2, -4) + 5 + i * 5, -4);
    cyl.castShadow = true;
    group.add(cyl);
    registerInteractable(cyl, 'prehorno');
  }

  // ------------------------------------------------------------------
  // 4. Horno rotativo (gira)
  // ------------------------------------------------------------------
  const kilnGroup = new THREE.Group();
  kilnGroup.position.set(14, H(14, -4) + 3.2, -4);

  const kiln = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 17, 12), metalMat);
  kiln.rotation.z = Math.PI / 2;
  kiln.castShadow = true;
  kilnGroup.add(kiln);
  registerInteractable(kiln, 'horno');

  for (let i = -2; i <= 2; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.35, 0.22, 8, 18), darkMat);
    ring.position.x = i * 3.4;
    ring.rotation.y = Math.PI / 2;
    kilnGroup.add(ring);
    registerInteractable(ring, 'horno');
  }
  kilnGroup.rotation.z = -0.1;
  kilnGroup.rotation.x = 0.04;
  group.add(kilnGroup);

  // ------------------------------------------------------------------
  // 5. Chimenea + humo
  // ------------------------------------------------------------------
  const chimney = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.5, 16, 10), concreteMat);
  chimney.position.set(24, H(24, -4) + 8, -4);
  chimney.castShadow = true;
  group.add(chimney);
  registerInteractable(chimney, 'sostenibilidad');

  const smokePuffs = [];
  const smokeMat = new THREE.MeshStandardMaterial({
    color: 0xf2f2f2,
    transparent: true,
    opacity: 0.55,
    flatShading: true,
    depthWrite: false,
  });
  for (let i = 0; i < 6; i++) {
    const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 1), smokeMat.clone());
    puff.userData.offset = i * 2.4;
    group.add(puff);
    smokePuffs.push(puff);
  }

  // ------------------------------------------------------------------
  // 6. Molino de cemento
  // ------------------------------------------------------------------
  const mill = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 11, 12), metalMat);
  mill.rotation.z = Math.PI / 2;
  mill.position.set(12, H(12, 8) + 2.6, 12);
  mill.castShadow = true;
  group.add(mill);
  registerInteractable(mill, 'molino');

  // ------------------------------------------------------------------
  // 7. Silos de almacenamiento
  // ------------------------------------------------------------------
  const siloPositions = [[-2, 14], [3, 14], [8, 14]];
  siloPositions.forEach(([x, z]) => {
    const silo = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 13, 12), concreteMat);
    silo.position.set(x, H(x, z) + 6.5, z);
    silo.castShadow = true;
    silo.receiveShadow = true;
    group.add(silo);
    registerInteractable(silo, 'silos');

    const cap = new THREE.Mesh(new THREE.ConeGeometry(2.8, 1.8, 12), metalMat);
    cap.position.set(x, H(x, z) + 13.9, z);
    group.add(cap);
    registerInteractable(cap, 'silos');
  });

  // ------------------------------------------------------------------
  // 8. Laboratorio de calidad
  // ------------------------------------------------------------------
  addBox(9, 5, 7, -4, H(-4, 18) + 2.5, 18, orangeMat, 'calidad');

  const labRoof = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.2, 9.4, 3), darkMat);
  labRoof.rotation.z = Math.PI / 2;
  labRoof.rotation.y = Math.PI / 6;
  labRoof.position.set(-4, H(-4, 18) + 5.6, 18);
  labRoof.castShadow = true;
  group.add(labRoof);
  registerInteractable(labRoof, 'calidad');

  // ------------------------------------------------------------------
  // 9. Bandera Amrize
  // ------------------------------------------------------------------
  const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 7, 8), metalMat);
  flagPole.position.set(-4, H(-4, 23) + 3.5, 23);
  group.add(flagPole);

  const flag = new THREE.Mesh(new THREE.BoxGeometry(3, 1.8, 0.08), orangeMat);
  flag.position.set(-2.4, H(-4, 23) + 6.2, 23);
  flag.castShadow = true;
  group.add(flag);

  // ------------------------------------------------------------------
  // 10. Camión mezclador
  // ------------------------------------------------------------------
  const truck = new THREE.Group();
  const truckBody = new THREE.Mesh(new THREE.BoxGeometry(3, 1.6, 1.8), orangeMat);
  truckBody.position.y = 1.4;
  truckBody.castShadow = true;
  truck.add(truckBody);

  const drum = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 2.6, 10), concreteMat);
  drum.rotation.x = Math.PI / 2;
  drum.rotation.z = 0.5;
  drum.position.set(-1.6, 2.2, 0);
  drum.castShadow = true;
  truck.add(drum);
  registerInteractable(drum, 'camon');

  for (const wx of [-1.6, 1.2]) {
    for (const wz of [-0.95, 0.95]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.35, 10), darkMat);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(wx, 0.55, wz);
      truck.add(wheel);
    }
  }
  truck.position.set(-26, terrainHeight(-30, 22), 28);
  truck.rotation.y = 0.35;
  group.add(truck);

  // ------------------------------------------------------------------
  // Animación
  // ------------------------------------------------------------------
  const update = (dt, elapsed) => {
    kilnGroup.rotation.x += dt * 0.25;

    smokePuffs.forEach((puff, i) => {
      const cycle = (elapsed * 1.6 + puff.userData.offset) % 14;
      puff.position.set(
        chimney.position.x + Math.sin(elapsed * 0.6 + i) * 1.2,
        chimney.position.y + 8 + cycle,
        chimney.position.z + Math.cos(elapsed * 0.5 + i) * 1.2
      );
      puff.scale.setScalar(0.6 + cycle * 0.12);
      puff.material.opacity = Math.max(0, 0.55 - cycle * 0.035);
    });

    drum.rotation.z += dt * 1.2;
  };

  return { group, update };
}
