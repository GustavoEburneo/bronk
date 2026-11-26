import * as THREE from 'three';
import type { World } from '../sim/world';
import { EnemyState } from '../sim/enemyState';
import { makeRng } from './jankTextures';
import type { GroundHeightFn } from './terrain';

/**
 * Faíscas de hit e explosão de morte (partículas instanciadas, 2026-11-26).
 * Apresentação pura: detecta golpes pelo `hitTick` do pool (mesma janela
 * [nextTick, tickCount) do damageNumbers — robusta a 0 ou N ticks por frame)
 * e morte por "hitTick fresco + state Dying" (o golpe letal grava os dois no
 * mesmo tick, ver combat.applyAbilityHit). Nada aqui toca a sim.
 *
 * - HIT: punhado de faíscas amarelas saltando do inimigo (crítico: mais
 *   faíscas, douradas) com gravidade e vida curta.
 * - MORTE: explosão maior de faíscas quentes + anel de choque no chão.
 *
 * Orçamento (padrão da casa): 2 InstancedMesh (faíscas + anéis) = 2 draw
 * calls, buffers de capacidade fixa reescritos por frame, zero alocação em
 * runtime. Slots são um ring buffer: estouro sobrescreve a partícula mais
 * velha (com teto de spawns por frame para um pulso em massa não apagar tudo).
 *
 * As partículas avançam no relógio de FRAME (frameDt): seguem vivas na pausa,
 * mesmo padrão aceito do giro das cartas e do redemoinho da fumaça.
 */

export interface HitSparks {
  /** Meshes a adicionar na raiz da cena da partida (disposeHierarchy os solta). */
  readonly meshes: readonly THREE.Object3D[];
  update(world: World, frameDt: number): void;
}

/** Faíscas simultâneas no teto (ring buffer; estouro recicla a mais velha). */
const SPARK_CAPACITY = 320;
/** Anéis de morte simultâneos no teto. */
const RING_CAPACITY = 24;
/** Teto de faíscas NOVAS por frame: pulso em massa não recicla o buffer inteiro. */
const MAX_SPAWNS_PER_FRAME = 120;
/** Gravidade das faíscas (u/s²) — queda de desenho animado, mais seca que a real. */
const GRAVITY = 16;

/** Faíscas por golpe normal / crítico / morte. */
const HIT_SPARKS = 5;
const CRIT_SPARKS = 9;
const DEATH_SPARKS = 13;

/** Vida do anel de morte (s) e escala final em raios do tipo. */
const RING_LIFETIME = 0.38;
const RING_END_SCALE = 2.6;

export function createHitSparks(ground: GroundHeightFn): HitSparks {
  // --- Faíscas: tetraedros aditivos com cor por instância ---------------------
  const sparkMesh = new THREE.InstancedMesh(
    new THREE.TetrahedronGeometry(1, 0),
    new THREE.MeshBasicMaterial({
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    }),
    SPARK_CAPACITY,
  );
  sparkMesh.frustumCulled = false;
  sparkMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const black = new THREE.Color(0, 0, 0);
  for (let i = 0; i < SPARK_CAPACITY; i++) sparkMesh.setColorAt(i, black);
  sparkMesh.instanceColor!.setUsage(THREE.DynamicDrawUsage);
  const sparkMatrices = sparkMesh.instanceMatrix.array as Float32Array;
  const sparkColors = sparkMesh.instanceColor!.array as Float32Array;
  for (let i = 0; i < SPARK_CAPACITY; i++) sparkMatrices[i * 16 + 15] = 1;

  // Estado por slot (SoA, capacidade fixa — zero alocação em runtime).
  const px = new Float32Array(SPARK_CAPACITY);
  const py = new Float32Array(SPARK_CAPACITY);
  const pz = new Float32Array(SPARK_CAPACITY);
  const vx = new Float32Array(SPARK_CAPACITY);
  const vy = new Float32Array(SPARK_CAPACITY);
  const vz = new Float32Array(SPARK_CAPACITY);
  const age = new Float32Array(SPARK_CAPACITY).fill(Infinity);
  const life = new Float32Array(SPARK_CAPACITY).fill(1);
  const size = new Float32Array(SPARK_CAPACITY);
  const colR = new Float32Array(SPARK_CAPACITY);
  const colG = new Float32Array(SPARK_CAPACITY);
  const colB = new Float32Array(SPARK_CAPACITY);
  let sparkCursor = 0;

  // --- Anéis de morte: anel chapado no chão expandindo e sumindo -------------
  const ringGeometry = new THREE.RingGeometry(0.78, 1, 20);
  ringGeometry.rotateX(-Math.PI / 2);
  const ringMesh = new THREE.InstancedMesh(
    ringGeometry,
    new THREE.MeshBasicMaterial({
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
    RING_CAPACITY,
  );
  ringMesh.frustumCulled = false;
  ringMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  for (let i = 0; i < RING_CAPACITY; i++) ringMesh.setColorAt(i, black);
  ringMesh.instanceColor!.setUsage(THREE.DynamicDrawUsage);
  const ringMatrices = ringMesh.instanceMatrix.array as Float32Array;
  const ringColors = ringMesh.instanceColor!.array as Float32Array;
  for (let i = 0; i < RING_CAPACITY; i++) ringMatrices[i * 16 + 15] = 1;

  const ringX = new Float32Array(RING_CAPACITY);
  const ringY = new Float32Array(RING_CAPACITY);
  const ringZ = new Float32Array(RING_CAPACITY);
  const ringAge = new Float32Array(RING_CAPACITY).fill(Infinity);
  const ringEndScale = new Float32Array(RING_CAPACITY).fill(1);
  let ringCursor = 0;

  // RNG local do visual (fora da sim, como o do redemoinho da fumaça).
  const rnd = makeRng(20261126);

  /** Primeiro tick ainda não processado (mesma âncora do damageNumbers). */
  let nextTick = 0;
  /** Faíscas já emitidas NESTE frame (teto MAX_SPAWNS_PER_FRAME). */
  let spawnedThisFrame = 0;

  function spawnSpark(
    x: number,
    y: number,
    z: number,
    speed: number,
    r: number,
    g: number,
    b: number,
  ): void {
    if (spawnedThisFrame >= MAX_SPAWNS_PER_FRAME) return;
    spawnedThisFrame++;
    const i = sparkCursor;
    sparkCursor = (sparkCursor + 1) % SPARK_CAPACITY;
    const angle = rnd() * Math.PI * 2;
    const horizontal = (0.6 + rnd() * 2.2) * speed;
    px[i] = x;
    py[i] = y;
    pz[i] = z;
    vx[i] = Math.cos(angle) * horizontal;
    vz[i] = Math.sin(angle) * horizontal;
    vy[i] = (2.2 + rnd() * 3.4) * speed;
    age[i] = 0;
    life[i] = 0.3 + rnd() * 0.3;
    size[i] = 0.07 + rnd() * 0.09;
    colR[i] = r;
    colG[i] = g;
    colB[i] = b;
  }

  function spawnBurst(
    x: number,
    y: number,
    z: number,
    count: number,
    speed: number,
    r: number,
    g: number,
    b: number,
  ): void {
    for (let n = 0; n < count; n++) spawnSpark(x, y, z, speed, r, g, b);
  }

  function spawnRing(x: number, z: number, endScale: number): void {
    const i = ringCursor;
    ringCursor = (ringCursor + 1) % RING_CAPACITY;
    ringX[i] = x;
    ringY[i] = ground(x, z) + 0.06;
    ringZ[i] = z;
    ringAge[i] = 0;
    ringEndScale[i] = endScale;
  }

  return {
    meshes: [sparkMesh, ringMesh],
    update(world: World, frameDt: number): void {
      // Restart: o mundo novo recomeça o relógio — re-ancora a janela.
      if (world.tickCount < nextTick) nextTick = 0;
      spawnedThisFrame = 0;

      // Golpes novos desde o último frame → rajadas. Morte = golpe letal:
      // hitTick fresco com o inimigo já em Dying (combat grava os dois juntos).
      const enemies = world.enemies;
      const types = world.data.enemyTypes;
      for (let i = 0; i < enemies.count; i++) {
        const hitTick = enemies.hitTick[i]!;
        if (hitTick < nextTick || hitTick >= world.tickCount) continue;
        const x = enemies.posX[i]!;
        const z = enemies.posZ[i]!;
        const type = types[enemies.typeIndex[i]!]!;
        // Voadores (flyby) têm a altura de voo na geometria (2.2 r); os demais
        // estouram no centro do corpo (~1 raio acima do chão).
        const centerY =
          ground(x, z) + type.radius * (type.behavior.kind === 'flyby' ? 2.2 : 1.0);
        if (enemies.state[i] === EnemyState.Dying) {
          // Morte: explosão quente (laranja + brasa branca) e anel no chão.
          spawnBurst(x, centerY, z, DEATH_SPARKS, 1.25, 2.4, 1.1, 0.25);
          spawnBurst(x, centerY, z, 4, 1.0, 2.6, 2.3, 1.6);
          spawnRing(x, z, type.radius * RING_END_SCALE);
        } else if (enemies.hitCrit[i]! === 1) {
          spawnBurst(x, centerY, z, CRIT_SPARKS, 1.1, 2.6, 1.5, 0.2);
        } else {
          spawnBurst(x, centerY, z, HIT_SPARKS, 0.85, 2.2, 1.8, 0.5);
        }
      }
      nextTick = world.tickCount;

      // --- Integração das faíscas (relógio de frame; cor aditiva → preto some) ---
      for (let i = 0; i < SPARK_CAPACITY; i++) {
        const offset = i * 16;
        if (age[i]! >= life[i]!) {
          // Morta: escala 0 (sem fragmento rasterizado; manter no buffer é grátis).
          sparkMatrices[offset] = 0;
          sparkMatrices[offset + 5] = 0;
          sparkMatrices[offset + 10] = 0;
          continue;
        }
        age[i] = age[i]! + frameDt;
        px[i] = px[i]! + vx[i]! * frameDt;
        py[i] = py[i]! + vy[i]! * frameDt;
        pz[i] = pz[i]! + vz[i]! * frameDt;
        vy[i] = vy[i]! - GRAVITY * frameDt;
        // Quicar no chão mataria o barato: faísca que afunda apenas apaga.
        const fade = Math.max(0, 1 - age[i]! / life[i]!);
        const scale = size[i]! * (0.4 + 0.6 * fade);
        sparkMatrices[offset] = scale;
        sparkMatrices[offset + 5] = scale;
        sparkMatrices[offset + 10] = scale;
        sparkMatrices[offset + 12] = px[i]!;
        sparkMatrices[offset + 13] = py[i]!;
        sparkMatrices[offset + 14] = pz[i]!;
        const colorOffset = i * 3;
        sparkColors[colorOffset] = colR[i]! * fade;
        sparkColors[colorOffset + 1] = colG[i]! * fade;
        sparkColors[colorOffset + 2] = colB[i]! * fade;
      }
      sparkMesh.instanceMatrix.needsUpdate = true;
      sparkMesh.instanceColor!.needsUpdate = true;

      // --- Anéis de morte: expandem até o raio final e somem ---------------------
      for (let i = 0; i < RING_CAPACITY; i++) {
        const offset = i * 16;
        if (ringAge[i]! >= RING_LIFETIME) {
          ringMatrices[offset] = 0;
          ringMatrices[offset + 5] = 0;
          ringMatrices[offset + 10] = 0;
          continue;
        }
        ringAge[i] = ringAge[i]! + frameDt;
        const progress = Math.min(1, ringAge[i]! / RING_LIFETIME);
        const scale = ringEndScale[i]! * (0.25 + 0.75 * progress);
        const fade = 1 - progress;
        ringMatrices[offset] = scale;
        ringMatrices[offset + 5] = 1;
        ringMatrices[offset + 10] = scale;
        ringMatrices[offset + 12] = ringX[i]!;
        ringMatrices[offset + 13] = ringY[i]!;
        ringMatrices[offset + 14] = ringZ[i]!;
        const colorOffset = i * 3;
        ringColors[colorOffset] = 2.2 * fade;
        ringColors[colorOffset + 1] = 1.5 * fade;
        ringColors[colorOffset + 2] = 0.7 * fade;
      }
      ringMesh.instanceMatrix.needsUpdate = true;
      ringMesh.instanceColor!.needsUpdate = true;
    },
  };
}
