/**
 * 🎮 core/Engine.js — Motor del juego
 * Gestiona renderer, escena, cámara, controles y el bucle de animación.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class Engine {
  constructor(canvas) {
    this.canvas = canvas;
    this.clock = new THREE.Clock();
    this.updaters = new Set();

    // Modo de bajo impacto: para móviles, laptops modestas o ?lowfx=1
    const params = new URLSearchParams(window.location.search);
    this.lowFx =
      params.get('lowfx') === '1' ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (navigator.hardwareConcurrency || 8) <= 4;

    // ---------- Renderer ----------
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: !this.lowFx });
    this.renderer.setPixelRatio(this.lowFx ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = !this.lowFx;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    // ---------- Escena ----------
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0xffd9a8, 90, 330);

    // ---------- Cámara ----------
    this.camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 88, 95);

    // ---------- Controles orbitales ----------
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 2);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.maxPolarAngle = Math.PI * 0.49;
    this.controls.minDistance = 10;
    this.controls.maxDistance = 260;
    this.controls.enablePan = false;

    // ---------- Resize ----------
    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /** Registra una función que se ejecuta cada frame. Devuelve un "unsubscribe". */
  onUpdate(fn) {
    this.updaters.add(fn);
    return () => this.updaters.delete(fn);
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      const dt = Math.min(this.clock.getDelta(), 0.05);
      const elapsed = this.clock.elapsedTime;

      for (const fn of this.updaters) fn(dt, elapsed);

      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    });
  }
}
