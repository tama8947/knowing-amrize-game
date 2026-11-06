/**
 * 🧱 world/plants/PlantKit.js — Piezas reutilizables para construir plantas
 * Evita duplicar geometría: cada helper devuelve mallas con estilo coherente.
 */
import * as THREE from 'three';
import { terrainHeight } from '../Terrain.js';

export const MAT = {
  concrete: new THREE.MeshStandardMaterial({ color: 0xd8d2c4, flatShading: true, roughness: 0.95 }),
  concreteDark: new THREE.MeshStandardMaterial({ color: 0xa9a396, flatShading: true, roughness: 0.95 }),
  metal: new THREE.MeshStandardMaterial({ color: 0xb8b2a6, flatShading: true, roughness: 0.7, metalness: 0.35 }),
  metalDark: new THREE.MeshStandardMaterial({ color: 0x5c5750, flatShading: true, roughness: 0.9 }),
  orange: new THREE.MeshStandardMaterial({ color: 0xff7a1a, flatShading: true, roughness: 0.8 }),
  blue: new THREE.MeshStandardMaterial({ color: 0x4a8fd4, flatShading: true, roughness: 0.8 }),
  green: new THREE.MeshStandardMaterial({ color: 0x4e9a4e, flatShading: true, roughness: 0.9 }),
  yellow: new THREE.MeshStandardMaterial({ color: 0xffc233, flatShading: true, roughness: 0.8 }),
  gravel: new THREE.MeshStandardMaterial({ color: 0x9c9186, flatShading: true, roughness: 1 }),
  sand: new THREE.MeshStandardMaterial({ color: 0xd8c49a, flatShading: true, roughness: 1 }),
  rock: new THREE.MeshStandardMaterial({ color: 0xa89b8a, flatShading: true, roughness: 1 }),
  asphalt: new THREE.MeshStandardMaterial({ color: 0x3d3d44, flatShading: true, roughness: 0.95 }),
  white: new THREE.MeshStandardMaterial({ color: 0xf4f1ea, flatShading: true, roughness: 0.8 }),
  red: new THREE.MeshStandardMaterial({ color: 0xc0392b, flatShading: true, roughness: 0.8 }),
};

/** Sombra y recepción activadas por defecto. */
function prep(mesh) {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/** Caja con posición. */
export function box(w, h, d, x, y, z, mat, rotY = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.rotation.y = rotY;
  return prep(m);
}

/** Edificio rectangular con techo a dos aguas (opcional). */
export function building(w, h, d, x, y, z, mat = MAT.concrete, roofMat = MAT.metalDark) {
  const g = new THREE.Group();
  g.add(box(w, h, d, 0, h / 2, 0, mat));
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(d * 0.62, d * 0.62, w, 3, 1), roofMat);
  roof.rotation.z = Math.PI / 2;
  roof.rotation.y = Math.PI / 6;
  roof.position.y = h + d * 0.12;
  roof.scale.set(1, 1, 0.55);
  g.add(prep(roof));
  g.position.set(x, y, z);
  return g;
}

/** Silo vertical con cono superior. */
export function silo(radius, height, x, y, z, mat = MAT.concrete) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 14), mat);
  body.position.y = height / 2;
  g.add(prep(body));
  const cap = new THREE.Mesh(new THREE.ConeGeometry(radius * 1.08, radius * 0.7, 14), MAT.metal);
  cap.position.y = height + radius * 0.35;
  g.add(prep(cap));
  const band = new THREE.Mesh(new THREE.TorusGeometry(radius * 1.02, 0.12, 6, 16), MAT.metalDark);
  band.rotation.x = Math.PI / 2;
  band.position.y = height * 0.6;
  g.add(band);
  g.position.set(x, y, z);
  return g;
}

/** Torre / prehorno. */
export function tower(w, h, d, x, y, z, mat = MAT.concrete) {
  const g = new THREE.Group();
  g.add(box(w, h, d, 0, h / 2, 0, mat));
  for (let i = 1; i <= 3; i++) {
    const band = new THREE.Mesh(new THREE.TorusGeometry(w * 0.62, 0.16, 6, 14), MAT.metal);
    band.rotation.x = Math.PI / 2;
    band.position.y = (h * i) / 4;
    g.add(band);
  }
  g.position.set(x, y, z);
  return g;
}

/** Cinta transportadora inclinada. */
export function conveyor(length, angle, x, y, z, rotY = 0) {
  const g = new THREE.Group();
  const belt = box(length, 0.6, 2, 0, 0, 0, MAT.metalDark);
  g.add(belt);
  // soportes
  const legs = Math.max(2, Math.round(length / 6));
  for (let i = 0; i < legs; i++) {
    const t = -length / 2 + (length / legs) * (i + 0.5);
    const leg = box(0.4, Math.abs(Math.sin(angle)) * length * 0.5 + 1, 0.4, t, -1.2, 0, MAT.metal);
    g.add(leg);
  }
  g.rotation.z = angle;
  g.rotation.y = rotY;
  g.position.set(x, y, z);
  return g;
}

/** Chimenea / ducto. */
export function stack(rBottom, rTop, height, x, y, z, mat = MAT.concrete) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBottom, height, 12), mat);
  m.position.set(x, y + height / 2, z);
  return prep(m);
}

/** Tanque horizontal (líquidos, asfalto). */
export function tank(radius, length, x, y, z, mat = MAT.metal, rotY = 0) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 14), mat);
  body.rotation.z = Math.PI / 2;
  g.add(prep(body));
  for (const s of [-1, 1]) {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(radius, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat);
    cap.position.x = (s * length) / 2;
    cap.rotation.z = s > 0 ? -Math.PI / 2 : Math.PI / 2;
    g.add(prep(cap));
  }
  g.position.set(x, y + radius, z);
  g.rotation.y = rotY;
  return g;
}

/** Camión (carga seca o mezclador). */
export function truck({ x, y, z, rotY = 0, color = MAT.orange, mixer = false } = {}) {
  const g = new THREE.Group();
  const cab = box(1.6, 1.7, 1.8, 1.0, 1.5, 0, color);
  g.add(cab);
  g.add(box(1.7, 0.7, 1.9, 1.0, 0.85, 0, MAT.metalDark));

  if (mixer) {
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 0.85, 2.8, 12), MAT.concrete);
    drum.rotation.x = Math.PI / 2;
    drum.rotation.z = 0.45;
    drum.position.set(-1.0, 2.1, 0);
    g.add(prep(drum));
    g.userData.mixer = drum;
  } else {
    g.add(box(3.4, 1.4, 1.9, -1.2, 1.5, 0, MAT.metalDark));
  }

  for (const wx of [-1.6, 1.2]) {
    for (const wz of [-1, 1]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.36, 10), MAT.metalDark);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(wx, 0.55, wz);
      g.add(wheel);
    }
  }

  g.position.set(x, y, z);
  g.rotation.y = rotY;
  return g;
}

/** Excavadora / cargadora (orugas simplificadas). */
export function excavator({ x, y, z, rotY = 0 } = {}) {
  const g = new THREE.Group();
  g.add(box(3.2, 0.7, 2.4, 0, 0.35, 0, MAT.metalDark));
  g.add(box(2.0, 1.3, 1.8, -0.3, 1.3, 0, MAT.yellow));
  const arm = box(0.5, 0.5, 2.6, 1.4, 1.9, 0, MAT.yellow);
  arm.rotation.z = 0.5;
  g.add(arm);
  const bucket = box(1.0, 0.9, 1.6, 2.4, 1.1, 0, MAT.metalDark);
  bucket.rotation.z = -0.3;
  g.add(bucket);
  g.position.set(x, y, z);
  g.rotation.y = rotY;
  return g;
}

/** Pila de material (cono). */
export function stockpile(radius, height, x, y, z, mat = MAT.gravel) {
  const m = new THREE.Mesh(new THREE.ConeGeometry(radius, height, 12), mat);
  m.position.set(x, y + height / 2, z);
  return prep(m);
}

/** Valla perimetral. */
export function fence(len, x, y, z, rotY = 0) {
  const g = new THREE.Group();
  const posts = Math.max(2, Math.round(len / 4));
  for (let i = 0; i <= posts; i++) {
    const p = box(0.2, 2.2, 0.2, -len / 2 + (len / posts) * i, 1.1, 0, MAT.metal);
    g.add(p);
  }
  g.add(box(len, 0.15, 0.12, 0, 1.9, 0, MAT.metal));
  g.add(box(len, 0.15, 0.12, 0, 1.1, 0, MAT.metal));
  g.position.set(x, y, z);
  g.rotation.y = rotY;
  return g;
}

/** Árbol decorativo (reutilizado del scenery). */
export function tree(x, z, s = 1) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.5, 3.2, 6), MAT.gravel);
  trunk.position.y = 1.6;
  g.add(prep(trunk));
  const leaf = new THREE.Mesh(new THREE.ConeGeometry(2.4, 3.4, 7), MAT.green);
  leaf.position.y = 4.1;
  g.add(prep(leaf));
  g.position.set(x, terrainHeight(x, z), z);
  g.scale.setScalar(s);
  return g;
}

/** Altura del terreno (para colocar objetos). */
export { terrainHeight };
