/**
 * 🗺️ world/MapScene.js — Mapa 3D de Estados Unidos y Canadá
 *
 * Construye un diorama low-poly del continente:
 *   - Estados y provincias extruidos (bordes definidos)
 *   - Océano, lagos y Hudson como agua
 *   - Pines de planta por color de negocio
 *   - Etiquetas de texto (canvas sprites)
 */
import * as THREE from 'three';
import { albers, fitProjection } from './geoProjection.js';
import MAP_DATA from '../data/map/us-ca.json';
import { PLANTS } from '../data/plants.js';
import { getBusinesses } from '../data/plantInfo.js';

// ---------------------------------------------------------------
// Paleta
// ---------------------------------------------------------------
const COLORS = {
  US: { land: 0x9ec97a, landDark: 0x8bb566, edge: 0x6f9b4e },
  CA: { land: 0xa8cf92, landDark: 0x96c07e, edge: 0x79a366 },
  ocean: 0x3f9fd4,
  oceanDeep: 0x2b7fb5,
  border: 0xffffff,
};

/** Colores por negocio (pines). */
const BUSINESS_COLORS = {
  aggregates: 0x9a8b7a,
  cement: 0xff7a1a,
  concrete: 0x4a8fd4,
  asphalt: 0x3d3d44,
  roofing: 0xb5654a,
  logistics: 0x2f9a8c,
};

/**
 * Insets: Alaska y Hawái se dibujan aparte (fuera de escala), en recuadros
 * bajo el continente. Solo se usa su masa continental principal (las islas
 * dispersas romperían la escala). Anclas en unidades del mundo.
 */
const INSETS = {
  'US-AK': { scale: 0.26, x: -58, z: 74 },
  'US-HI': { scale: 0.55, x: -30, z: 80, allRings: true },
};

const MAP_WIDTH = 220;
const MAP_DEPTH = 130;

/**
 * @param {THREE.Scene} scene
 * @param {(plant: object) => void} onPlantClick
 * @returns {MapScene}
 */
export class MapScene {
  constructor(parent, onPlantClick) {
    this.scene = parent;
    this.onPlantClick = onPlantClick;
    this.group = new THREE.Group();
    this.group.name = 'map-scene';
    this.group.visible = false;
    parent.add(this.group);

    this.pins = new Map(); // id -> { group, mesh, sprite, plant }
    this.hovered = null;

    this.build();
  }

  // -------------------------------------------------------------
  // Construcción
  // -------------------------------------------------------------
  build() {
    this.projectAll();
    this.buildOcean();
    this.buildLand();
    this.buildPins();
  }

  /** Proyecta todos los anillos y calcula la escala global. */
  projectAll() {
    const mainPoints = [];
    for (const unit of MAP_DATA.units) {
      unit._projected = unit.rings.map((ring) => ring.map(([lng, lat]) => albers(lng, lat)));
      if (!INSETS[unit.code]) mainPoints.push(...unit._projected.flat());
    }

    const fit = fitProjection(mainPoints, MAP_WIDTH, MAP_DEPTH);
    this.fit = fit;

    // Límites reales del continente (en unidades del mundo)
    const west = fit.minX * fit.scale + fit.offsetX;
    const east = fit.maxX * fit.scale + fit.offsetX;
    const north = -fit.maxY * fit.scale + fit.offsetZ;
    const south = -fit.minY * fit.scale + fit.offsetZ;
    this.bounds = { west, east, north, south };

    for (const unit of MAP_DATA.units) {
      const inset = INSETS[unit.code];
      if (!inset) {
        unit._rings = unit._projected.map((ring) =>
          ring.map((p) => ({
            x: p.x * fit.scale + fit.offsetX,
            z: -(p.y * fit.scale) + fit.offsetZ,
          }))
        );
      } else {
        // Insets: Alaska usa solo su masa continental (las Aleutianas se
        // stretched); Hawái conserva todo su archipiélago.
        let ringsToUse = unit._projected;
        if (!inset.allRings) {
          let biggest = ringsToUse[0];
          let biggestArea = -1;
          for (const ring of ringsToUse) {
            const area = this.polyArea(ring);
            if (area > biggestArea) { biggestArea = area; biggest = ring; }
          }
          ringsToUse = [biggest];
        }
        const all = ringsToUse.flat();
        const cx = all.reduce((s, p) => s + p.x, 0) / all.length;
        const cy = all.reduce((s, p) => s + p.y, 0) / all.length;
        unit._rings = ringsToUse.map((ring) =>
          ring.map((p) => ({
            x: (p.x - cx) * fit.scale * inset.scale + inset.x,
            z: -((p.y - cy) * fit.scale * inset.scale) + inset.z,
          }))
        );
      }
      unit._center = this.ringCentroid(unit._rings[0]);
    }
  }

  ringCentroid(ring) {
    let x = 0, z = 0;
    for (const p of ring) { x += p.x; z += p.z; }
    return { x: x / ring.length, z: z / ring.length };
  }

  /** Área (con valor absoluto) de un anillo en el espacio de la proyección. */
  polyArea(ring) {
    let area = 0;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      area += (ring[j].x + ring[i].x) * (ring[j].y - ring[i].y);
    }
    return Math.abs(area / 2);
  }

  /** Oceano (base azul) + borde decorativo. */
  buildOcean() {
    const geo = new THREE.PlaneGeometry(MAP_WIDTH * 2.6, MAP_DEPTH * 2.4, 1, 1);
    geo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshStandardMaterial({
      color: COLORS.ocean,
      roughness: 0.35,
      metalness: 0.1,
      transparent: true,
      opacity: 0.96,
    });
    const ocean = new THREE.Mesh(geo, mat);
    ocean.position.y = -0.6;
    ocean.receiveShadow = true;
    this.group.add(ocean);

    // Brillo del sol sobre el agua
    const sun = new THREE.Mesh(
      new THREE.CircleGeometry(MAP_WIDTH * 0.75, 48),
      new THREE.MeshBasicMaterial({
        color: 0xbfe6ff,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
      })
    );
    sun.rotation.x = -Math.PI / 2;
    sun.position.set(-MAP_WIDTH * 0.3, -0.55, -MAP_DEPTH * 0.25);
    this.group.add(sun);
  }

  /** Estados y provincias extruidos. */
  buildLand() {
    const edgeMat = new THREE.LineBasicMaterial({
      color: COLORS.border,
      transparent: true,
      opacity: 0.55,
    });

    for (const unit of MAP_DATA.units) {
      const palette = COLORS[unit.country];
      const shape = new THREE.Shape();
      const rings = unit._rings;

      // Anillo exterior (la Z se nega para compensar la rotación de -90°)
      const outer = rings[0];
      shape.moveTo(outer[0].x, -outer[0].z);
      for (let i = 1; i < outer.length; i++) shape.lineTo(outer[i].x, -outer[i].z);
      shape.closePath();

      // Agujeros (lagos, bahías): los anillos siguientes más pequeños
      for (let r = 1; r < rings.length; r++) {
        const hole = rings[r];
        const path = new THREE.Path();
        path.moveTo(hole[0].x, -hole[0].z);
        for (let i = 1; i < hole.length; i++) path.lineTo(hole[i].x, -hole[i].z);
        path.closePath();
        shape.holes.push(path);
      }

      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: unit.country === 'US' ? 1.5 : 1.1,
        bevelEnabled: true,
        bevelThickness: 0.18,
        bevelSize: 0.18,
        bevelSegments: 1,
      });
      // ExtrudeGeometry extruye en +Z; al rotar -90° el eje Y del shape cae
      // en -Z, por eso el shape se construye con la Z negated.
      geo.rotateX(-Math.PI / 2);
      geo.computeVertexNormals();

      const mat = new THREE.MeshStandardMaterial({
        color: palette.land,
        roughness: 0.95,
        flatShading: true,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData.unit = unit;
      this.group.add(mesh);

      // Línea de frontera
      const pts = [];
      for (const ring of rings) {
        for (const p of ring) pts.push(new THREE.Vector3(p.x, unit.country === 'US' ? 1.5 : 1.1, p.z));
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      this.group.add(new THREE.Line(lineGeo, edgeMat));

      // Silueta exterior más marcada
      const outerPts = outer.map((p) => new THREE.Vector3(p.x, unit.country === 'US' ? 1.52 : 1.12, p.z));
      const outerGeo = new THREE.BufferGeometry().setFromPoints(outerPts);
      this.group.add(
        new THREE.Line(
          outerGeo,
          new THREE.LineBasicMaterial({ color: COLORS[unit.country].edge, transparent: true, opacity: 0.9 })
        )
      );
    }
  }

  /** Pines de planta. */
  buildPins() {
    const stemMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });

    for (const plant of PLANTS) {
      const p = albers(plant.lng, plant.lat);
      const x = p.x * this.fit.scale + this.fit.offsetX;
      const z = -(p.y * this.fit.scale) + this.fit.offsetZ;

      const color = BUSINESS_COLORS[plant.business] ?? 0xff7a1a;

      const g = new THREE.Group();
      g.position.set(x, 1.6, z);

      // Halo en el suelo
      const halo = new THREE.Mesh(new THREE.CircleGeometry(2.6, 24), glowMat.clone());
      halo.material.color.setHex(color);
      halo.rotation.x = -Math.PI / 2;
      halo.position.y = -1.5;
      g.add(halo);

      // Tallo
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 4.2, 8), stemMat);
      stem.position.y = 2.1;
      stem.castShadow = true;
      g.add(stem);

      // Cabeza: prisma con el color del negocio
      const head = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.35, 0),
        new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.5, emissive: color, emissiveIntensity: 0.25 })
      );
      head.position.y = 4.8;
      head.castShadow = true;
      g.add(head);

      // Icono (emoji) sobre el pin
      const biz = getBusinesses().find((b) => b.key === plant.business);
      const sprite = makeTextSprite(`${biz?.icon ?? '📍'}`, '#ffffff', 128);
      sprite.position.y = 6.6;
      setSpriteWidth(sprite, 3.4);
      g.add(sprite);

      // Etiqueta con el nombre de la ciudad
      const label = makeTextSprite(
        plant.name,
        '#ffffff',
        44,
        'rgba(43,43,51,0.72)',
        26
      );
      label.position.y = -0.6;
      setSpriteWidth(label, 7);
      g.add(label);

      // Esfera invisible para hacer clic fácil
      const hit = new THREE.Mesh(
        new THREE.SphereGeometry(3.4, 12, 10),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
      );
      hit.position.y = 4.4;
      g.add(hit);

      this.group.add(g);
      this.pins.set(plant.id, { group: g, head, halo, sprite, label, hit, plant, baseY: 1.6 });
    }
  }

  // -------------------------------------------------------------
  // Interacción
  // -------------------------------------------------------------
  /** Posición mundial de un pin. */
  getPinPosition(plantId) {
    const pin = this.pins.get(plantId);
    if (!pin) return null;
    const v = new THREE.Vector3();
    pin.group.getWorldPosition(v);
    return v;
  }

  /**
   * Calcula la posición de cámara para acercarse a una planta.
   * @returns {{ position: THREE.Vector3, target: THREE.Vector3 }}
   */
  focusOn(plantId, distance = 42) {
    const pin = this.pins.get(plantId);
    const target = this.getPinPosition(plantId) ?? new THREE.Vector3();
    // Encuadre desde el sur-oeste, mirando al norte
    const position = new THREE.Vector3(
      target.x - distance * 0.55,
      target.y + distance * 0.75,
      target.z + distance * 0.62
    );
    return { position, target };
  }

  /**
   * Destaca los pines que coinciden con la búsqueda.
   * @param {Set<string>} ids
   */
  setFilter(ids) {
    this.filteredIds = ids;
    for (const [id, pin] of this.pins) {
      const match = !ids || ids.has(id);
      pin.dimmed = !match;
      pin.group.visible = match || ids === null;
      // los no coincidentes se atenúan en vez de desaparecer
      if (!match) {
        pin.head.material.opacity = 0.25;
        pin.head.material.transparent = true;
        pin.label.material.opacity = 0.2;
        pin.sprite.material.opacity = 0.15;
        pin.halo.material.opacity = 0.05;
      } else {
        pin.head.material.opacity = 1;
        pin.head.material.transparent = false;
        pin.label.material.opacity = 0.95;
        pin.sprite.material.opacity = 1;
        pin.halo.material.opacity = 0.3;
      }
    }
  }

  /** Devuelve el pin más cercano al rayo de la cámara (si hay). */
  pick(raycaster) {
    const hits = raycaster.intersectObjects(
      [...this.pins.values()].map((p) => p.hit),
      false
    );
    if (!hits.length) return null;
    const hit = hits[0].object;
    for (const pin of this.pins.values()) if (pin.hit === hit) return pin;
    return null;
  }

  setHovered(pin) {
    if (this.hovered === pin) return;
    if (this.hovered) {
      this.hovered.head.scale.setScalar(1);
      this.hovered.label.material.opacity = 0.95;
    }
    this.hovered = pin;
    if (pin) {
      pin.head.scale.setScalar(1.35);
      pin.label.material.opacity = 1;
    }
  }

  /** Marca un pin como visitado. */
  markVisited(plantId) {
    const pin = this.pins.get(plantId);
    if (!pin) return;
    pin.head.material.emissiveIntensity = 0.9;
    pin.label.material.opacity = 1;
  }

  // -------------------------------------------------------------
  // Animación
  // -------------------------------------------------------------
  update(dt, elapsed) {
    for (const [, pin] of this.pins) {
      if (pin.dimmed) continue;
      // rebote suave
      pin.group.position.y = pin.baseY + Math.sin(elapsed * 1.6 + pin.group.position.x * 0.1) * 0.35;
      pin.halo.material.opacity = 0.25 + Math.sin(elapsed * 2 + pin.group.position.z * 0.2) * 0.12;
    }
  }
}

// ---------------------------------------------------------------
// Utilidad: sprite de texto con canvas
// ---------------------------------------------------------------
export function makeTextSprite(text, color = '#fff', fontSize = 64, bg = null, pad = 0) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const font = `bold ${fontSize}px "Segoe UI", system-ui, sans-serif`;

  ctx.font = font;
  const metrics = ctx.measureText(text);
  const w = Math.ceil(metrics.width) + pad * 2 + 20;
  const h = Math.ceil(fontSize * 1.4) + pad * 2;

  canvas.width = w;
  canvas.height = h;

  const c = canvas.getContext('2d');
  if (bg) {
    c.fillStyle = bg;
    const r = 10;
    c.beginPath();
    c.roundRect(0, 0, w, h, r);
    c.fill();
  }
  c.font = font;
  c.fillStyle = color;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText(text, w / 2, h / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.renderOrder = 10;
  sprite.userData.aspect = w / h;
  return sprite;
}

/** Ajusta el ancho de un sprite respetando su relación de aspecto. */
export function setSpriteWidth(sprite, width) {
  sprite.scale.set(width, width / (sprite.userData.aspect || 1), 1);
}
