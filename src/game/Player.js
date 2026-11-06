/**
 * 🚶 game/Player.js — Personaje jugable
 * - Camina con flechas / WASD (relativo a la cámara)
 * - Salta con Espacio
 * - Se adapta al relieve del terreno
 */
import * as THREE from 'three';
import { terrainHeight, WORLD } from '../world/Terrain.js';

const WALK_SPEED = 8.5;
const RUN_SPEED = 14;
const JUMP_FORCE = 11.5;
const GRAVITY = -30;

export class Player {
  /**
   * @param {THREE.Scene} scene
   * @param {'male'|'female'} gender
   */
  constructor(scene, gender = 'male') {
    this.scene = scene;
    this.gender = gender;
    this.velocity = new THREE.Vector3();
    this.onGround = true;
    this.walkPhase = 0;
    this.speedRatio = 0;

    this.group = this.build(gender);
    // Punto de inicio: junto a los silos, para que el primer letrero aparezca rápido
    this.group.position.set(6, terrainHeight(6, 14), 14);
    this.group.rotation.y = Math.PI;
    this.group.scale.setScalar(1.25);
    scene.add(this.group);
  }

  /** Construye el modelo low-poly del personaje. */
  build(gender) {
    const g = new THREE.Group();

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xe8b48c, flatShading: true, roughness: 0.9 });
    const vestMat = new THREE.MeshStandardMaterial({ color: 0xff4412, flatShading: true, roughness: 0.85 });
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xf5f9ff, flatShading: true, roughness: 0.4, emissive: 0x9fc4ff, emissiveIntensity: 0.25 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x3a4a63, flatShading: true, roughness: 0.9 });
    const bootMat = new THREE.MeshStandardMaterial({ color: 0x3a3630, flatShading: true, roughness: 0.9 });
    const helmetMat = new THREE.MeshStandardMaterial({
      color: gender === 'female' ? 0xffd23f : 0xf2f2f2,
      flatShading: true,
      roughness: 0.6,
    });
    const hairMat = new THREE.MeshStandardMaterial({
      color: gender === 'female' ? 0x4a2c17 : 0x2e2018,
      flatShading: true,
      roughness: 1,
    });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x2b2b33, flatShading: true, roughness: 0.4 });

    // ---------------------------------------------------------
    // Piernas (pivote en la cadera)
    // ---------------------------------------------------------
    const legs = [];
    for (const side of [-1, 1]) {
      const hip = new THREE.Group();
      hip.position.set(side * 0.25, 1.35, 0);

      const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.19, 0.62, 4, 8), pantsMat);
      leg.position.y = -0.42;
      leg.castShadow = true;
      hip.add(leg);

      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.22, 0.52), bootMat);
      boot.position.set(0, -1.06, 0.1); // la punta mira al frente (+Z)
      boot.castShadow = true;
      hip.add(boot);

      g.add(hip);
      legs.push(hip);
    }

    // ---------------------------------------------------------
    // Torso con chaleco de alta visibilidad
    // ---------------------------------------------------------
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 0.62, 4, 10), vestMat);
    torso.position.y = 1.92;
    torso.castShadow = true;
    g.add(torso);

    // Bandas reflectantes (detalle de PPE)
    for (const y of [1.78, 2.02]) {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.07, 0.74), stripeMat);
      stripe.position.y = y;
      g.add(stripe);
    }
    // Tirantes del chaleco
    for (const side of [-1, 1]) {
      const strap = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.62, 0.72), stripeMat);
      strap.position.set(side * 0.17, 2.12, 0);
      g.add(strap);
    }

    // ---------------------------------------------------------
    // Brazos (pivote en el hombro) — bien separados del torso
    // ---------------------------------------------------------
    const arms = [];
    for (const side of [-1, 1]) {
      const shoulder = new THREE.Group();
      shoulder.position.set(side * 0.52, 2.28, 0);

      const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.145, 0.52, 4, 8), vestMat);
      arm.position.y = -0.32;
      arm.castShadow = true;
      shoulder.add(arm);

      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.165, 10, 8), skinMat);
      hand.position.y = -0.68;
      hand.castShadow = true;
      shoulder.add(hand);

      g.add(shoulder);
      arms.push(shoulder);
    }

    // ---------------------------------------------------------
    // Cabeza
    // ---------------------------------------------------------
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.16, 10), skinMat);
    neck.position.y = 2.55;
    g.add(neck);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.33, 16, 14), skinMat);
    head.position.y = 2.9;
    head.castShadow = true;
    g.add(head);

    // Ojos: dejan clara la dirección de la mirada
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.048, 8, 8), eyeMat);
      eye.position.set(side * 0.115, 2.94, 0.285);
      g.add(eye);
    }

    // Nariz (marca la orientation frontal)
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.12, 6), skinMat);
    nose.rotation.x = Math.PI / 2;
    nose.position.set(0, 2.86, 0.32);
    g.add(nose);

    // Pelo: casquete trasero, sin tapar la cara
    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.345, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.52),
      hairMat
    );
    hair.position.set(0, 2.92, -0.03);
    g.add(hair);

    if (gender === 'female') {
      const ponytail = new THREE.Mesh(new THREE.SphereGeometry(0.19, 10, 10), hairMat);
      ponytail.position.set(0, 2.78, -0.36);
      ponytail.scale.set(1, 1.7, 1);
      ponytail.castShadow = true;
      g.add(ponytail);
    }

    // ---------------------------------------------------------
    // Casco de seguridad: cúpula + cresta + ala frontal
    // ---------------------------------------------------------
    const helmet = new THREE.Mesh(
      new THREE.SphereGeometry(0.39, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5),
      helmetMat
    );
    helmet.position.y = 3.02;
    helmet.castShadow = true;
    g.add(helmet);

    // Cresta central
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.1, 0.72), helmetMat);
    ridge.position.set(0, 3.36, -0.02);
    g.add(ridge);

    // Ala frontal (media corona hacia delante, no disco completo)
    const brim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.44, 0.44, 0.06, 16, 1, false, -Math.PI / 2, Math.PI),
      helmetMat
    );
    brim.position.set(0, 3.0, 0);
    brim.castShadow = true;
    g.add(brim);

    g.userData = { legs, arms, torso, head, helmet };
    return g;
  }

  /** Cambia el personaje (reinicia la malla). */
  setGender(gender) {
    this.gender = gender;
    const pos = this.group.position.clone();
    const rot = this.group.rotation.y;
    this.scene.remove(this.group);
    this.group = this.build(gender);
    this.group.position.copy(pos);
    this.group.rotation.y = rot;
    this.group.scale.setScalar(1.25);
    this.scene.add(this.group);
  }

  /**
   * @param {number} dt
   * @param {{x:number,z:number}} move  vector de entrada
   * @param {THREE.Camera} camera
   * @param {boolean} wantJump
   * @param {boolean} running
   */
  update(dt, move, camera, wantJump, running = false) {
    const pos = this.group.position;

    // ---- Rotación de la cámara (para mover relativo a la vista) ----
    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);
    camDir.y = 0;
    if (camDir.lengthSq() < 0.0001) camDir.set(0, 0, -1);
    camDir.normalize();
    const camRight = new THREE.Vector3(camDir.z, 0, -camDir.x);

    // ---- Velocidad de movimiento en el mundo ----
    const target = new THREE.Vector3()
      .addScaledVector(camDir, move.z)
      .addScaledVector(camRight, move.x);

    const speed = running ? RUN_SPEED : WALK_SPEED;
    const hasInput = target.lengthSq() > 0.0001;
    if (hasInput) target.normalize().multiplyScalar(speed);

    // Aceleración suave
    this.velocity.x = THREE.MathUtils.lerp(this.velocity.x, target.x, 1 - Math.pow(0.001, dt));
    this.velocity.z = THREE.MathUtils.lerp(this.velocity.z, target.z, 1 - Math.pow(0.001, dt));

    // ---- Salto y gravedad ----
    if (wantJump && this.onGround) {
      this.velocity.y = JUMP_FORCE;
      this.onGround = false;
    }
    this.velocity.y += GRAVITY * dt;

    // ---- Integración ----
    pos.x += this.velocity.x * dt;
    pos.z += this.velocity.z * dt;
    pos.y += this.velocity.y * dt;

    // ---- Límite del mundo jugable ----
    const dist = Math.hypot(pos.x, pos.z);
    if (dist > WORLD.playableRadius) {
      const s = WORLD.playableRadius / dist;
      pos.x *= s;
      pos.z *= s;
    }

    // ---- Colisión con el suelo (se adapta al relieve) ----
    const ground = terrainHeight(pos.x, pos.z);
    if (pos.y <= ground) {
      pos.y = ground;
      this.velocity.y = 0;
      this.onGround = true;
    }

    // ---- Orientación ----
    const horizontalSpeed = Math.hypot(this.velocity.x, this.velocity.z);
    this.speedRatio = THREE.MathUtils.clamp(horizontalSpeed / WALK_SPEED, 0, 1.4);

    if (horizontalSpeed > 0.35) {
      const targetAngle = Math.atan2(this.velocity.x, this.velocity.z);
      let diff = targetAngle - this.group.rotation.y;
      // normaliza a [-PI, PI]
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      this.group.rotation.y += diff * Math.min(1, dt * 12);
    }

    // ---- Animación de caminar / saltar ----
    const { legs, arms, torso } = this.group.userData;

    if (!this.onGround) {
      // Pose de salto: piernas recogidas, brazos arriba
      legs[0].rotation.x = -0.55;
      legs[1].rotation.x = 0.25;
      arms[0].rotation.x = -1.5;
      arms[1].rotation.x = -1.5;
      torso.position.y = 1.92;
    } else {
      this.walkPhase += dt * horizontalSpeed * 1.35;
      const swing = Math.sin(this.walkPhase) * 0.7 * this.speedRatio;
      legs[0].rotation.x = swing;
      legs[1].rotation.x = -swing;
      arms[0].rotation.x = -swing * 0.85;
      arms[1].rotation.x = swing * 0.85;
      torso.position.y = 1.92 + Math.abs(Math.sin(this.walkPhase)) * 0.07 * this.speedRatio;
    }
  }

  /** Teletransporte (usado al iniciar el juego o cambiar de mapa). */
  setPosition(x, z) {
    this.group.position.set(x, terrainHeight(x, z), z);
    this.velocity.set(0, 0, 0);
  }

  /** Orienta al personaje hacia un punto del mundo. */
  faceTowards(x, z) {
    const dx = x - this.group.position.x;
    const dz = z - this.group.position.z;
    if (Math.hypot(dx, dz) < 0.01) return;
    this.group.rotation.y = Math.atan2(dx, dz);
  }
}
