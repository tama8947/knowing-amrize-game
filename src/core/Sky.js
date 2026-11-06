/**
 * 🌅 core/Sky.js — Cielo, sol y nubes estilizadas
 * Paleta cálida de "summer afternoon" (referencia: summer-afternoon.vlucendo.com)
 */
import * as THREE from 'three';

export function createSky(scene) {
  // ---------- Cielo con gradiente ----------
  const skyGeo = new THREE.SphereGeometry(480, 32, 18);
  const skyMat = new THREE.ShaderMaterial({
    uniforms: {
      topColor: { value: new THREE.Color(0x4aa8e8) },
      midColor: { value: new THREE.Color(0xa8d8f0) },
      bottomColor: { value: new THREE.Color(0xffd9a8) },
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorldPos;
      void main() {
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 topColor;
      uniform vec3 midColor;
      uniform vec3 bottomColor;
      varying vec3 vWorldPos;
      void main() {
        float h = normalize(vWorldPos).y;
        vec3 col = h > 0.18
          ? mix(midColor, topColor, smoothstep(0.18, 0.75, h))
          : mix(bottomColor, midColor, smoothstep(-0.05, 0.18, h));
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    side: THREE.BackSide,
    depthWrite: false,
  });
  scene.add(new THREE.Mesh(skyGeo, skyMat));

  // ---------- Luces ----------
  const hemi = new THREE.HemisphereLight(0xffe8c4, 0x7a9a55, 0.85);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xffd9a0, 1.6);
  sun.position.set(60, 70, 30);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -90;
  sun.shadow.camera.right = 90;
  sun.shadow.camera.top = 90;
  sun.shadow.camera.bottom = -90;
  sun.shadow.camera.far = 260;
  sun.shadow.bias = -0.0005;
  scene.add(sun);
  scene.add(sun.target);

  // Disco solar visible
  const sunDisc = new THREE.Mesh(
    new THREE.SphereGeometry(14, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xfff2cc, fog: false })
  );
  sunDisc.position.copy(sun.position).multiplyScalar(3.4);
  scene.add(sunDisc);

  // ---------- Nubes a la deriva ----------
  const clouds = [];
  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    flatShading: true,
    roughness: 1,
  });

  const addCloud = (x, y, z, scale) => {
    const group = new THREE.Group();
    const n = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      const puff = new THREE.Mesh(
        new THREE.IcosahedronGeometry(4 + Math.random() * 3, 1),
        cloudMat
      );
      puff.position.set(i * 5 - n * 2.2, Math.random() * 2.5, Math.random() * 4 - 2);
      puff.scale.y = 0.62;
      group.add(puff);
    }
    group.position.set(x, y, z);
    group.scale.setScalar(scale);
    scene.add(group);
    clouds.push(group);
  };

  addCloud(-90, 55, -110, 1.5);
  addCloud(80, 62, -130, 1.9);
  addCloud(20, 48, -170, 1.3);
  addCloud(-150, 58, -60, 1.6);

  // Movimiento de nubes
  let t = 0;
  return {
    sun,
    update(dt) {
      t += dt;
      clouds.forEach((c, i) => {
        c.position.x += dt * (1.1 + i * 0.22);
        if (c.position.x > 220) c.position.x = -220;
      });
    },
  };
}
