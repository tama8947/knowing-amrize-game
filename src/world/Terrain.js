/**
 * 🏞️ world/Terrain.js — Terreno low-poly con relieve suave
 * Exporta `terrainHeight(x, z)` para que el jugador se adapte al suelo.
 */
import * as THREE from 'three';

/** Altura del terreno en coordenadas del mundo. */
export function terrainHeight(x, z) {
  return (
    Math.sin(x * 0.045) * 1.5 +
    Math.cos(z * 0.055) * 1.3 +
    Math.sin((x + z) * 0.022) * 2.0 +
    Math.cos((x - z) * 0.013) * 1.1
  );
}

export const WORLD = {
  size: 360,
  segments: 110,
  /** Radio jugable: keeps the player inside the diorama. */
  playableRadius: 165,
};

export function createTerrain(parent) {
  const scene = parent;
  const geo = new THREE.PlaneGeometry(
    WORLD.size,
    WORLD.size,
    WORLD.segments,
    WORLD.segments
  );
  geo.rotateX(-Math.PI / 2);

  const pos = geo.attributes.position;
  const colors = [];
  const cGrass1 = new THREE.Color(0x8fc262);
  const cGrass2 = new THREE.Color(0x6da84c);
  const cDirt = new THREE.Color(0xc9a86a);

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const y = terrainHeight(x, z);
    pos.setY(i, y);

    const t = THREE.MathUtils.clamp((y + 4) / 9, 0, 1);
    const c = cGrass1.clone().lerp(cGrass2, Math.random() * 0.55 + t * 0.3);
    if (y < -1.2) c.lerp(cDirt, 0.45);
    colors.push(c.r, c.g, c.b);
  }

  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();

  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      roughness: 1,
    })
  );
  mesh.receiveShadow = true;
  mesh.userData.isTerrain = true;
  mesh.name = 'terrain';
  scene.add(mesh);

  return mesh;
}
