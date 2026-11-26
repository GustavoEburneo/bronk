import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { GameData } from '../data/tables';
import type { EnemyTypeDef } from '../data/enemies';
import type { World } from '../sim/world';
import { EnemyState } from '../sim/enemyState';
import {
  createCartGridTexture,
  createChickenTexture,
  createConeTexture,
  createFutevoleiTexture,
  createHazardTexture,
  createMaritacaTexture,
  createPigeonTexture,
  createPineappleTexture,
  createRubbleFurTexture,
} from './jankTextures';
import { applyVertexSnap } from './retro';
import type { GroundHeightFn } from './terrain';

export interface EnemyInstances {
  /** Um InstancedMesh POR TIPO de inimigo (TECH, "Render: um InstancedMesh POR TIPO"). */
  readonly meshes: readonly THREE.InstancedMesh[];
  update(world: World, alpha: number): void;
}

const MIN_SCALE = 0.05;

/** Guarda numérica contra normalizar vetor nulo (inimigo exatamente no player). */
const MIN_FACING_DIST_SQ = 1e-12;

/**
 * Flash de hit (2026-11-24): por quantos ticks o inimigo recém-atingido fica
 * "estourado" de branco (crítico: dourado). A cor de instância multiplica o
 * material; valores > 1 clareiam a textura (o tone mapping segura o estouro).
 */
const HIT_FLASH_TICKS = 8;

/**
 * Proporções visuais do cone em função do raio do TIPO (a dívida de espelhar
 * 0.45 da tabela morre aqui: tudo deriva de `type.radius`).
 */
const CONE_HEIGHT_PER_RADIUS = 2.2;

/**
 * Modelo tosco de um tipo: geometria única (primitivas mescladas) + material
 * (ou array, com um grupo por material — olhos esbugalhados são a marca do
 * jogo e entram como esferas chapadas, não textura).
 */
interface EnemyTypeModel {
  geometry: THREE.BufferGeometry;
  material: THREE.Material | THREE.Material[];
  /** Multiplica a altura do pulinho do trote (a britadeira "martela" o chão). */
  bounceScale: number;
}

/**
 * Hordas desenhadas em lote: 1 `InstancedMesh` POR TIPO de inimigo, cada um
 * com capacidade `enemies.maxAlive` (pior caso: horda inteira de um tipo) e
 * geometria/textura próprias. A cada frame, UMA passada no pool escreve a
 * matriz de cada inimigo no buffer do mesh do seu `typeIndex`, num cursor por
 * tipo — a instância i do mesh NÃO corresponde mais ao slot i do pool. Sem
 * Matrix4/Object3D por instância, sem alocação por frame.
 *
 * Orientação: todo modelo é construído olhando +Z; `chase` encara o player
 * (direção interpolada por frame) e `flyby` aponta a direção de voo fixada no
 * spawn (`dirX`/`dirZ` do pool).
 *
 * `ground` assenta cada inimigo na altura do relevo do mapa (apresentação —
 * ver render/terrain.ts); em mapa plano é a função constante 0.
 */
export function createEnemyInstances(data: GameData, ground: GroundHeightFn): EnemyInstances {
  const capacity = data.enemies.maxAlive;

  // Materiais dos olhos compartilhados entre os tipos. O dispose da cena é
  // idempotente (ver disposeHierarchy no renderer): compartilhar é seguro.
  const eyeWhite = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xf4f0e6 }));
  const eyeBlack = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x141414 }));

  const types = data.enemyTypes;
  const meshes: THREE.InstancedMesh[] = [];
  const matricesPerType: Float32Array[] = [];
  const colorsPerType: Float32Array[] = [];
  const flyStraight: boolean[] = [];
  const bounceScales: number[] = [];

  const white = new THREE.Color(1, 1, 1);
  for (const type of types) {
    const model = createEnemyTypeModel(type, eyeWhite, eyeBlack);
    const mesh = new THREE.InstancedMesh(model.geometry, model.material, capacity);
    // A esfera envolvente é a da geometria base: sem isto, a horda inteira
    // some quando essa esfera sai do frustum.
    mesh.frustumCulled = false;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    // Cor por instância (flash de hit): nasce branca (multiplicador neutro).
    for (let i = 0; i < capacity; i++) mesh.setColorAt(i, white);
    mesh.instanceColor!.setUsage(THREE.DynamicDrawUsage);

    // Buffer nasce zerado: inicializa identidade uma vez. O update reescreve
    // sempre os mesmos 8 elementos (rotação Y × escala + translação); os
    // demais permanecem os da identidade.
    const matrices = mesh.instanceMatrix.array as Float32Array;
    for (let i = 0; i < capacity; i++) {
      const offset = i * 16;
      matrices[offset] = 1;
      matrices[offset + 5] = 1;
      matrices[offset + 10] = 1;
      matrices[offset + 15] = 1;
    }

    meshes.push(mesh);
    matricesPerType.push(matrices);
    colorsPerType.push(mesh.instanceColor!.array as Float32Array);
    // Facing pela direção do pool (dirX/dirZ) para todo comportamento que
    // não persegue: o flyby voa reto nela e a investida mira nela no windup
    // e congela na arrancada (a sim mantém o vetor; o render só encara).
    flyStraight.push(type.behavior.kind !== 'chase');
    bounceScales.push(model.bounceScale);
  }

  // Cursor de escrita por tipo, reutilizado (zero alocação por frame).
  const cursors = new Int32Array(types.length);

  return {
    meshes,
    update(world: World, alpha: number): void {
      const enemies = world.enemies;
      const time = world.time;
      const player = world.player;
      const playerX = player.prevX + (player.x - player.prevX) * alpha;
      const playerZ = player.prevZ + (player.z - player.prevZ) * alpha;

      cursors.fill(0);

      for (let i = 0; i < enemies.count; i++) {
        const typeIndex = enemies.typeIndex[i]!;
        const type = types[typeIndex]!;
        const matrices = matricesPerType[typeIndex]!;
        const slot = cursors[typeIndex]!;
        const offset = slot * 16;
        cursors[typeIndex]!++;

        // Flash de hit: branco estourado (crítico: dourado) por alguns ticks
        // após o golpe; fora disso, multiplicador neutro.
        const colors = colorsPerType[typeIndex]!;
        const sinceHit = world.tickCount - enemies.hitTick[i]!;
        const colorOffset = slot * 3;
        if (enemies.hitTick[i]! >= 0 && sinceHit < HIT_FLASH_TICKS) {
          const crit = enemies.hitCrit[i]! === 1;
          colors[colorOffset] = crit ? 3.2 : 2.6;
          colors[colorOffset + 1] = crit ? 2.1 : 2.6;
          colors[colorOffset + 2] = crit ? 0.9 : 2.6;
        } else {
          colors[colorOffset] = 1;
          colors[colorOffset + 1] = 1;
          colors[colorOffset + 2] = 1;
        }

        const state = enemies.state[i]!;
        const stateTime = enemies.stateTime[i]!;

        let scale = 1;
        if (state === EnemyState.Spawning) {
          scale = Math.max(MIN_SCALE, Math.min(1, stateTime / type.spawnStateDuration));
        } else if (state === EnemyState.Dying) {
          scale = Math.max(MIN_SCALE, 1 - stateTime / type.dyingStateDuration);
        }

        const x = enemies.prevX[i]! + (enemies.posX[i]! - enemies.prevX[i]!) * alpha;
        const z = enemies.prevZ[i]! + (enemies.posZ[i]! - enemies.prevZ[i]!) * alpha;

        // Facing: flyby aponta a direção de voo fixada no spawn (nunca vira);
        // chase encara o player — a direção do movimento da IA.
        let sin = 0;
        let cos = 1;
        if (flyStraight[typeIndex]!) {
          sin = enemies.dirX[i]!;
          cos = enemies.dirZ[i]!;
        } else {
          const dx = playerX - x;
          const dz = playerZ - z;
          const distSq = dx * dx + dz * dz;
          if (distSq > MIN_FACING_DIST_SQ) {
            const invDist = 1 / Math.sqrt(distSq);
            sin = dx * invDist;
            cos = dz * invDist;
          }
        }

        // Pulinho duro com squash/stretch, defasado pelo slot do POOL para a
        // horda não quicar em uníssono. Jank proposital: sem easing nenhum.
        const wobble = Math.sin(time * 9 + i * 1.7);
        const sxz = scale * (1 - 0.08 * wobble);

        // M = T · Ry · S escrita direto no buffer (column-major do three).
        matrices[offset] = cos * sxz;
        matrices[offset + 2] = -sin * sxz;
        matrices[offset + 5] = scale * (1 + 0.14 * wobble);
        matrices[offset + 8] = sin * sxz;
        matrices[offset + 10] = cos * sxz;
        matrices[offset + 12] = x;
        matrices[offset + 13] =
          ground(x, z) + Math.max(0, wobble) * 0.18 * scale * bounceScales[typeIndex]!;
        matrices[offset + 14] = z;
      }

      for (let t = 0; t < meshes.length; t++) {
        const mesh = meshes[t]!;
        mesh.count = cursors[t]!;
        if (cursors[t]! > 0) {
          mesh.instanceMatrix.needsUpdate = true;
          mesh.instanceColor!.needsUpdate = true;
        }
      }
    },
  };
}

/**
 * Modelo por id de tipo (mesmo padrão do createPlayerView: visual novo = ramo
 * novo aqui; tipo sem visual é erro claro no boot, não cone silencioso).
 * TODAS as dimensões derivam de `type.radius` — nada espelha a tabela.
 */
function createEnemyTypeModel(
  type: EnemyTypeDef,
  eyeWhite: THREE.Material,
  eyeBlack: THREE.Material,
): EnemyTypeModel {
  switch (type.id) {
    case 'cone':
      return createConeModel(type.radius);
    case 'rato':
      return createRatoModel(type.radius, eyeWhite, eyeBlack);
    case 'britadeira':
      return createBritadeiraModel(type.radius, eyeWhite, eyeBlack);
    case 'pombo':
      return createPomboModel(type.radius, eyeBlack);
    case 'galinha':
      return createGalinhaModel(type.radius, eyeWhite, eyeBlack);
    case 'carrinho':
      return createCarrinhoModel(type.radius, eyeWhite, eyeBlack);
    case 'abacaxi':
      return createAbacaxiModel(type.radius, eyeWhite, eyeBlack);
    case 'maritaca':
      return createMaritacaModel(type.radius, eyeBlack);
    case 'sagui':
      return createSaguiModel(type.radius, eyeWhite, eyeBlack);
    case 'bola':
      return createBolaModel(type.radius, eyeWhite, eyeBlack);
    case 'coco':
      return createCocoModel(type.radius, eyeWhite, eyeBlack);
    case 'urubu':
      return createUrubuModel(type.radius, eyeBlack);
    default:
      throw new Error(`tipo de inimigo sem modelo de render: ${type.id}`);
  }
}

/** Mescla primitivas numa geometria só; null do merge é bug de construção. */
function mergeParts(parts: THREE.BufferGeometry[], useGroups = false): THREE.BufferGeometry {
  const merged = mergeGeometries(parts, useGroups);
  if (merged === null) throw new Error('falha ao mesclar geometria de inimigo');
  for (const part of parts) part.dispose();
  return merged;
}

/**
 * Monta geometria com 1 grupo por material (1 draw call por grupo — o custo
 * dos olhos esbugalhados por tipo, dentro da folga do orçamento do TECH).
 */
function buildGroupedModel(
  sections: Array<{ material: THREE.Material; parts: THREE.BufferGeometry[] }>,
  bounceScale: number,
): EnemyTypeModel {
  const merged = sections.map((section) => mergeParts(section.parts));
  return {
    geometry: mergeParts(merged, true),
    material: sections.map((section) => section.material),
    bounceScale,
  };
}

/** Cone Revoltado: o visual da POC, agora com as dimensões derivadas do raio. */
function createConeModel(r: number): EnemyTypeModel {
  const height = r * CONE_HEIGHT_PER_RADIUS;
  const geometry = new THREE.ConeGeometry(r, height, 8);
  // Base na origem: escala uniforme cresce/encolhe mantendo a base no chão.
  geometry.translate(0, height / 2, 0);
  const material = applyVertexSnap(new THREE.MeshLambertMaterial({ map: createConeTexture() }));
  return { geometry, material, bounceScale: 1 };
}

/**
 * Rato de Entulho: corpo achatado e comprido, orelhas exageradas desiguais,
 * rabo de cilindro fino e olhos esbugalhados saltados na frente. Cinza-entulho.
 */
function createRatoModel(r: number, eyeWhite: THREE.Material, eyeBlack: THREE.Material): EnemyTypeModel {
  const furMaterial = applyVertexSnap(
    new THREE.MeshLambertMaterial({ map: createRubbleFurTexture() }),
  );

  const body = new THREE.SphereGeometry(r, 8, 6);
  body.scale(1.0, 0.55, 1.4);
  body.translate(0, r * 0.55, 0);

  const snout = new THREE.ConeGeometry(r * 0.3, r * 0.6, 6);
  snout.rotateX(Math.PI / 2);
  snout.translate(0, r * 0.6, r * 1.5);

  // Orelhas exageradas, de tamanhos diferentes (regra de ouro do tosco).
  const leftEar = new THREE.SphereGeometry(r * 0.5, 6, 5);
  leftEar.scale(1, 1, 0.35);
  leftEar.translate(-r * 0.55, r * 1.15, r * 0.4);
  const rightEar = new THREE.SphereGeometry(r * 0.62, 6, 5);
  rightEar.scale(1, 1, 0.35);
  rightEar.translate(r * 0.55, r * 1.3, r * 0.35);

  // Rabo fino apontando para trás, subindo de teimoso.
  const tail = new THREE.CylinderGeometry(r * 0.09, r * 0.14, r * 2.4, 5);
  tail.rotateX(-Math.PI / 2 + 0.3);
  tail.translate(0, r * 0.7, -r * 2.1);

  const leftEye = new THREE.SphereGeometry(r * 0.26, 6, 5);
  leftEye.translate(-r * 0.38, r * 0.8, r * 1.05);
  const rightEye = new THREE.SphereGeometry(r * 0.19, 6, 5);
  rightEye.translate(r * 0.4, r * 0.85, r * 1.0);

  const leftPupil = new THREE.SphereGeometry(r * 0.1, 5, 4);
  leftPupil.translate(-r * 0.4, r * 0.82, r * 1.27);
  const rightPupil = new THREE.SphereGeometry(r * 0.08, 5, 4);
  rightPupil.translate(r * 0.42, r * 0.87, r * 1.17);

  return buildGroupedModel(
    [
      { material: furMaterial, parts: [body, snout, leftEar, rightEar, tail] },
      { material: eyeWhite, parts: [leftEye, rightEye] },
      { material: eyeBlack, parts: [leftPupil, rightPupil] },
    ],
    1,
  );
}

/**
 * Britadeira Desgovernada: caixa alta amarela de obra com listras pretas,
 * "bico" de britadeira na base, alças tortas e olhos esbugalhados na carcaça.
 * O bounceScale alto faz o "pulo" rígido de martelar o chão ao andar.
 */
function createBritadeiraModel(
  r: number,
  eyeWhite: THREE.Material,
  eyeBlack: THREE.Material,
): EnemyTypeModel {
  const hazardMaterial = applyVertexSnap(
    new THREE.MeshLambertMaterial({ map: createHazardTexture() }),
  );
  const metalMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x8e9299 }));

  // Bico: ponta fina no chão, engrossando até a carcaça.
  const bit = new THREE.CylinderGeometry(r * 0.24, r * 0.1, r * 0.9, 6);
  bit.translate(0, r * 0.45, 0);

  const casing = new THREE.BoxGeometry(r * 1.25, r * 1.9, r * 0.95);
  casing.translate(0, r * 1.85, 0);

  // Alças tortas (uma mais baixa que a outra, de propósito).
  const leftHandle = new THREE.BoxGeometry(r * 0.9, r * 0.2, r * 0.25);
  leftHandle.translate(-r * 0.95, r * 2.5, 0);
  const rightHandle = new THREE.BoxGeometry(r * 0.9, r * 0.2, r * 0.25);
  rightHandle.translate(r * 0.95, r * 2.38, 0);

  const leftEye = new THREE.SphereGeometry(r * 0.3, 8, 6);
  leftEye.translate(-r * 0.3, r * 2.35, r * 0.48);
  const rightEye = new THREE.SphereGeometry(r * 0.22, 8, 6);
  rightEye.translate(r * 0.33, r * 2.45, r * 0.5);

  const leftPupil = new THREE.SphereGeometry(r * 0.12, 5, 4);
  leftPupil.translate(-r * 0.32, r * 2.37, r * 0.73);
  const rightPupil = new THREE.SphereGeometry(r * 0.1, 5, 4);
  rightPupil.translate(r * 0.35, r * 2.47, r * 0.68);

  return buildGroupedModel(
    [
      { material: hazardMaterial, parts: [casing, leftHandle, rightHandle] },
      { material: metalMaterial, parts: [bit] },
      { material: eyeWhite, parts: [leftEye, rightEye] },
      { material: eyeBlack, parts: [leftPupil, rightPupil] },
    ],
    2.2,
  );
}

/**
 * Galinha de Quintal: corpo branco rechonchudo, crista vermelha torta, bico
 * amarelo e olhos esbugalhados desiguais. bounceScale alto: anda ciscando.
 */
function createGalinhaModel(
  r: number,
  eyeWhite: THREE.Material,
  eyeBlack: THREE.Material,
): EnemyTypeModel {
  const featherMaterial = applyVertexSnap(
    new THREE.MeshLambertMaterial({ map: createChickenTexture() }),
  );
  const crestMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xc1352a }));
  const beakMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xe0a62e }));

  // Corpo rechonchudo inclinado para a frente (galinha apressada).
  const body = new THREE.SphereGeometry(r, 8, 6);
  body.scale(0.95, 1.05, 1.2);
  body.translate(0, r * 1.0, -r * 0.1);

  const head = new THREE.SphereGeometry(r * 0.48, 6, 5);
  head.translate(0, r * 1.95, r * 0.75);

  // Crista torta: três bolotinhas desiguais em fila.
  const crest1 = new THREE.SphereGeometry(r * 0.17, 5, 4);
  crest1.translate(-r * 0.05, r * 2.42, r * 0.62);
  const crest2 = new THREE.SphereGeometry(r * 0.22, 5, 4);
  crest2.translate(r * 0.03, r * 2.5, r * 0.82);
  const crest3 = new THREE.SphereGeometry(r * 0.14, 5, 4);
  crest3.translate(-r * 0.02, r * 2.38, r * 1.0);

  const beak = new THREE.ConeGeometry(r * 0.14, r * 0.42, 5);
  beak.rotateX(Math.PI / 2);
  beak.translate(0, r * 1.9, r * 1.3);

  // Rabo empinado: leque achatado para trás.
  const tail = new THREE.SphereGeometry(r * 0.45, 6, 5);
  tail.scale(0.7, 1.1, 0.5);
  tail.rotateX(0.6);
  tail.translate(0, r * 1.55, -r * 1.05);

  // Olhos esbugalhados desiguais (regra de ouro do tosco).
  const leftEye = new THREE.SphereGeometry(r * 0.2, 6, 5);
  leftEye.translate(-r * 0.3, r * 2.05, r * 0.95);
  const rightEye = new THREE.SphereGeometry(r * 0.26, 6, 5);
  rightEye.translate(r * 0.3, r * 2.0, r * 0.9);

  const leftPupil = new THREE.SphereGeometry(r * 0.08, 5, 4);
  leftPupil.translate(-r * 0.32, r * 2.07, r * 1.12);
  const rightPupil = new THREE.SphereGeometry(r * 0.11, 5, 4);
  rightPupil.translate(r * 0.33, r * 2.02, r * 1.12);

  return buildGroupedModel(
    [
      { material: featherMaterial, parts: [body, head, tail] },
      { material: crestMaterial, parts: [crest1, crest2, crest3] },
      { material: beakMaterial, parts: [beak] },
      { material: eyeWhite, parts: [leftEye, rightEye] },
      { material: eyeBlack, parts: [leftPupil, rightPupil] },
    ],
    1.6,
  );
}

/**
 * Carrinho de Feira Desembestado: cesta gradeada inclinada para a frente,
 * alças tortas atrás, 2 rodinhas desiguais e olhos esbugalhados na cesta.
 * bounceScale baixo: ele rola, não pula.
 */
function createCarrinhoModel(
  r: number,
  eyeWhite: THREE.Material,
  eyeBlack: THREE.Material,
): EnemyTypeModel {
  const gridMaterial = applyVertexSnap(
    new THREE.MeshLambertMaterial({ map: createCartGridTexture() }),
  );
  const metalMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x6e747a }));
  const wheelMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x24262b }));

  // Cesta gradeada, nariz para +Z e levemente empinada (desembestado).
  const basket = new THREE.BoxGeometry(r * 1.6, r * 1.3, r * 2.1);
  basket.rotateX(-0.08);
  basket.translate(0, r * 1.45, 0);

  // Alças tortas atrás (uma mais alta, de propósito).
  const leftHandle = new THREE.BoxGeometry(r * 0.14, r * 0.14, r * 0.9);
  leftHandle.rotateX(0.5);
  leftHandle.translate(-r * 0.55, r * 2.25, -r * 1.25);
  const rightHandle = new THREE.BoxGeometry(r * 0.14, r * 0.14, r * 0.9);
  rightHandle.rotateX(0.42);
  rightHandle.translate(r * 0.55, r * 2.12, -r * 1.25);

  // Rodinhas desiguais: dianteira menor e torta (a culpada do desembesto).
  const frontWheel = new THREE.CylinderGeometry(r * 0.28, r * 0.28, r * 0.2, 8);
  frontWheel.rotateZ(Math.PI / 2);
  frontWheel.rotateY(0.18);
  frontWheel.translate(0, r * 0.28, r * 0.8);
  const backWheel = new THREE.CylinderGeometry(r * 0.38, r * 0.38, r * 0.22, 8);
  backWheel.rotateZ(Math.PI / 2);
  backWheel.translate(0, r * 0.38, -r * 0.75);

  const leftEye = new THREE.SphereGeometry(r * 0.3, 8, 6);
  leftEye.translate(-r * 0.4, r * 1.95, r * 1.05);
  const rightEye = new THREE.SphereGeometry(r * 0.22, 8, 6);
  rightEye.translate(r * 0.42, r * 2.02, r * 1.08);

  const leftPupil = new THREE.SphereGeometry(r * 0.12, 5, 4);
  leftPupil.translate(-r * 0.42, r * 1.97, r * 1.3);
  const rightPupil = new THREE.SphereGeometry(r * 0.09, 5, 4);
  rightPupil.translate(r * 0.44, r * 2.04, r * 1.26);

  return buildGroupedModel(
    [
      { material: gridMaterial, parts: [basket] },
      { material: metalMaterial, parts: [leftHandle, rightHandle] },
      { material: wheelMaterial, parts: [frontWheel, backWheel] },
      { material: eyeWhite, parts: [leftEye, rightEye] },
      { material: eyeBlack, parts: [leftPupil, rightPupil] },
    ],
    0.3,
  );
}

/**
 * Abacaxi Casca-Grossa: corpo oval com a grade de losangos, coroa de folhas
 * tortas e olhos esbugalhados bravos (pupilas apertadas e desiguais).
 */
function createAbacaxiModel(
  r: number,
  eyeWhite: THREE.Material,
  eyeBlack: THREE.Material,
): EnemyTypeModel {
  const skinMaterial = applyVertexSnap(
    new THREE.MeshLambertMaterial({ map: createPineappleTexture() }),
  );
  const leafMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x3f7d3a }));

  // Corpo oval gordo, base no chão (tanque parrudo).
  const body = new THREE.SphereGeometry(r, 8, 7);
  body.scale(1.0, 1.45, 1.0);
  body.translate(0, r * 1.45, 0);

  // Coroa: cones tortos desiguais apontando para cima.
  const leaves: THREE.BufferGeometry[] = [];
  const leafSpecs = [
    { x: 0, z: 0, lean: 0, h: 1.1 },
    { x: 0.28, z: 0.1, lean: 0.45, h: 0.85 },
    { x: -0.3, z: 0.05, lean: -0.5, h: 0.9 },
    { x: 0.05, z: 0.3, lean: 0.35, h: 0.75 },
    { x: -0.08, z: -0.28, lean: -0.3, h: 0.95 },
  ] as const;
  for (const spec of leafSpecs) {
    const leaf = new THREE.ConeGeometry(r * 0.16, r * spec.h, 4);
    leaf.rotateZ(spec.lean);
    leaf.translate(r * spec.x, r * 2.9 + (r * spec.h) / 2, r * spec.z);
    leaves.push(leaf);
  }

  // Olhos bravos: brancos desiguais, pupilas pequenas (olhar fechado).
  const leftEye = new THREE.SphereGeometry(r * 0.26, 8, 6);
  leftEye.translate(-r * 0.3, r * 1.9, r * 0.82);
  const rightEye = new THREE.SphereGeometry(r * 0.2, 8, 6);
  rightEye.translate(r * 0.32, r * 1.98, r * 0.85);

  const leftPupil = new THREE.SphereGeometry(r * 0.08, 5, 4);
  leftPupil.translate(-r * 0.32, r * 1.88, r * 1.04);
  const rightPupil = new THREE.SphereGeometry(r * 0.07, 5, 4);
  rightPupil.translate(r * 0.34, r * 1.96, r * 1.02);

  return buildGroupedModel(
    [
      { material: skinMaterial, parts: [body] },
      { material: leafMaterial, parts: leaves },
      { material: eyeWhite, parts: [leftEye, rightEye] },
      { material: eyeBlack, parts: [leftPupil, rightPupil] },
    ],
    1,
  );
}

/**
 * Maritaca Tagarela: receita do pombo (asas abertas fixas, altura de voo na
 * geometria) em verde, com bico laranja curvo (duas peças) e cauda longa.
 */
function createMaritacaModel(r: number, eyeBlack: THREE.Material): EnemyTypeModel {
  const featherMaterial = applyVertexSnap(
    new THREE.MeshLambertMaterial({ map: createMaritacaTexture() }),
  );
  const orangeMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xd97b29 }));

  const flightY = r * 2.2;

  const body = new THREE.SphereGeometry(r * 0.8, 8, 6);
  body.scale(0.9, 0.8, 1.3);
  body.translate(0, flightY, 0);

  const head = new THREE.SphereGeometry(r * 0.42, 6, 5);
  head.translate(0, flightY + r * 0.55, r * 0.8);

  // Bico curvo de maritaca: cone para a frente + gancho apontando para baixo.
  const beakTop = new THREE.ConeGeometry(r * 0.13, r * 0.4, 5);
  beakTop.rotateX(Math.PI / 2);
  beakTop.translate(0, flightY + r * 0.52, r * 1.25);
  const beakHook = new THREE.ConeGeometry(r * 0.09, r * 0.22, 5);
  beakHook.rotateX(Math.PI);
  beakHook.translate(0, flightY + r * 0.38, r * 1.36);

  // Asas abertas fixas, pontas para cima (mesma planagem do pombo).
  const leftWing = new THREE.BoxGeometry(r * 1.7, r * 0.09, r * 0.75);
  leftWing.rotateZ(-0.22);
  leftWing.translate(-r * 1.15, flightY + r * 0.25, -r * 0.1);
  const rightWing = new THREE.BoxGeometry(r * 1.7, r * 0.09, r * 0.75);
  rightWing.rotateZ(0.22);
  rightWing.translate(r * 1.15, flightY + r * 0.25, -r * 0.1);

  // Cauda longa de maritaca (bem mais comprida que a do pombo).
  const tail = new THREE.BoxGeometry(r * 0.4, r * 0.07, r * 1.4);
  tail.rotateX(-0.18);
  tail.translate(0, flightY + r * 0.08, -r * 1.75);

  // Olhos alaranjados desiguais com pupilas saltadas (padrão do pombo).
  const leftEye = new THREE.SphereGeometry(r * 0.17, 6, 5);
  leftEye.translate(-r * 0.3, flightY + r * 0.62, r * 0.92);
  const rightEye = new THREE.SphereGeometry(r * 0.22, 6, 5);
  rightEye.translate(r * 0.3, flightY + r * 0.6, r * 0.88);

  const leftPupil = new THREE.SphereGeometry(r * 0.07, 5, 4);
  leftPupil.translate(-r * 0.33, flightY + r * 0.63, r * 1.05);
  const rightPupil = new THREE.SphereGeometry(r * 0.09, 5, 4);
  rightPupil.translate(r * 0.34, flightY + r * 0.61, r * 1.03);

  return buildGroupedModel(
    [
      { material: featherMaterial, parts: [body, head, leftWing, rightWing, tail] },
      { material: orangeMaterial, parts: [beakTop, beakHook, leftEye, rightEye] },
      { material: eyeBlack, parts: [leftPupil, rightPupil] },
    ],
    1,
  );
}

/**
 * Pombo de Obra: pombo cinza de asas abertas FIXAS (voa reto, nunca vira),
 * olhos alaranjados esbugalhados e bico no mesmo laranja. Levemente acima do
 * chão: a altura de voo está na própria geometria.
 */
function createPomboModel(r: number, eyeBlack: THREE.Material): EnemyTypeModel {
  const featherMaterial = applyVertexSnap(
    new THREE.MeshLambertMaterial({ map: createPigeonTexture() }),
  );
  const orangeMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xd97b29 }));

  const flightY = r * 2.2;

  const body = new THREE.SphereGeometry(r * 0.85, 8, 6);
  body.scale(0.95, 0.8, 1.35);
  body.translate(0, flightY, 0);

  const head = new THREE.SphereGeometry(r * 0.42, 6, 5);
  head.translate(0, flightY + r * 0.55, r * 0.85);

  const beak = new THREE.ConeGeometry(r * 0.1, r * 0.35, 5);
  beak.rotateX(Math.PI / 2);
  beak.translate(0, flightY + r * 0.5, r * 1.3);

  // Asas abertas fixas, pontas levemente para cima (planador de obra).
  const leftWing = new THREE.BoxGeometry(r * 1.7, r * 0.09, r * 0.75);
  leftWing.rotateZ(-0.22);
  leftWing.translate(-r * 1.15, flightY + r * 0.25, -r * 0.1);
  const rightWing = new THREE.BoxGeometry(r * 1.7, r * 0.09, r * 0.75);
  rightWing.rotateZ(0.22);
  rightWing.translate(r * 1.15, flightY + r * 0.25, -r * 0.1);

  const tail = new THREE.BoxGeometry(r * 0.55, r * 0.08, r * 0.7);
  tail.rotateX(-0.25);
  tail.translate(0, flightY + r * 0.1, -r * 1.3);

  // Olhos alaranjados desiguais (GDD: "olho alaranjado"); pupilas saltadas.
  const leftEye = new THREE.SphereGeometry(r * 0.16, 6, 5);
  leftEye.translate(-r * 0.3, flightY + r * 0.62, r * 0.95);
  const rightEye = new THREE.SphereGeometry(r * 0.21, 6, 5);
  rightEye.translate(r * 0.3, flightY + r * 0.6, r * 0.9);

  const leftPupil = new THREE.SphereGeometry(r * 0.07, 5, 4);
  leftPupil.translate(-r * 0.33, flightY + r * 0.63, r * 1.07);
  const rightPupil = new THREE.SphereGeometry(r * 0.09, 5, 4);
  rightPupil.translate(r * 0.34, flightY + r * 0.61, r * 1.05);

  return buildGroupedModel(
    [
      { material: featherMaterial, parts: [body, head, leftWing, rightWing, tail] },
      { material: orangeMaterial, parts: [beak, leftEye, rightEye] },
      { material: eyeBlack, parts: [leftPupil, rightPupil] },
    ],
    1,
  );
}

/**
 * Sagui Ladrão de Lanche: corpo pequeno marrom-acinzentado, cabeçona com os
 * tufos brancos de orelha (a marca do sagui), rabo comprido empinado e olhos
 * esbugalhados desiguais. Todo em cor chapada: o bicho é pequeno demais para
 * textura render a render.
 */
function createSaguiModel(r: number, eyeWhite: THREE.Material, eyeBlack: THREE.Material): EnemyTypeModel {
  const furMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x8a7458 }));
  const tailMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x5c4c3a }));

  const body = new THREE.SphereGeometry(r, 8, 6);
  body.scale(0.9, 0.8, 1.2);
  body.translate(0, r * 0.8, 0);

  // Cabeçona desproporcional inclinada para a frente (de olho no lanche).
  const head = new THREE.SphereGeometry(r * 0.62, 7, 6);
  head.translate(0, r * 1.7, r * 0.6);

  // Tufos brancos de orelha, exagerados e desiguais (regra de ouro do tosco).
  const leftTuft = new THREE.SphereGeometry(r * 0.34, 5, 4);
  leftTuft.scale(1, 1, 0.5);
  leftTuft.translate(-r * 0.62, r * 1.85, r * 0.5);
  const rightTuft = new THREE.SphereGeometry(r * 0.42, 5, 4);
  rightTuft.scale(1, 1, 0.5);
  rightTuft.translate(r * 0.62, r * 1.95, r * 0.45);

  // Rabo comprido empinado em ponto de interrogação (cilindro torto).
  const tail = new THREE.CylinderGeometry(r * 0.1, r * 0.16, r * 2.6, 5);
  tail.rotateX(-0.5);
  tail.translate(0, r * 1.6, -r * 1.5);

  const leftEye = new THREE.SphereGeometry(r * 0.24, 6, 5);
  leftEye.translate(-r * 0.26, r * 1.8, r * 1.05);
  const rightEye = new THREE.SphereGeometry(r * 0.18, 6, 5);
  rightEye.translate(r * 0.3, r * 1.85, r * 1.02);

  const leftPupil = new THREE.SphereGeometry(r * 0.1, 5, 4);
  leftPupil.translate(-r * 0.28, r * 1.82, r * 1.25);
  const rightPupil = new THREE.SphereGeometry(r * 0.08, 5, 4);
  rightPupil.translate(r * 0.32, r * 1.87, r * 1.18);

  return buildGroupedModel(
    [
      { material: furMaterial, parts: [body, head] },
      { material: eyeWhite, parts: [leftTuft, rightTuft, leftEye, rightEye] },
      { material: tailMaterial, parts: [tail] },
      { material: eyeBlack, parts: [leftPupil, rightPupil] },
    ],
    1.7,
  );
}

/**
 * Bola de Futevôlei Possuída: esfera de gomos encardidos com olhos
 * esbugalhados grandes demais (a possessão é visível). bounceScale alto:
 * ela QUICA parada no windup — o telegraph da investida é o quique no lugar.
 */
function createBolaModel(r: number, eyeWhite: THREE.Material, eyeBlack: THREE.Material): EnemyTypeModel {
  const ballMaterial = applyVertexSnap(
    new THREE.MeshLambertMaterial({ map: createFutevoleiTexture() }),
  );

  const body = new THREE.SphereGeometry(r, 9, 7);
  body.translate(0, r, 0);

  // Olhos enormes e desiguais saltados para a frente (+Z: a direção da mira).
  const leftEye = new THREE.SphereGeometry(r * 0.34, 7, 6);
  leftEye.translate(-r * 0.34, r * 1.3, r * 0.75);
  const rightEye = new THREE.SphereGeometry(r * 0.26, 7, 6);
  rightEye.translate(r * 0.38, r * 1.22, r * 0.78);

  const leftPupil = new THREE.SphereGeometry(r * 0.14, 5, 4);
  leftPupil.translate(-r * 0.36, r * 1.3, r * 1.02);
  const rightPupil = new THREE.SphereGeometry(r * 0.1, 5, 4);
  rightPupil.translate(r * 0.41, r * 1.24, r * 1.0);

  return buildGroupedModel(
    [
      { material: ballMaterial, parts: [body] },
      { material: eyeWhite, parts: [leftEye, rightEye] },
      { material: eyeBlack, parts: [leftPupil, rightPupil] },
    ],
    2.0,
  );
}

/**
 * Coco Gelado Rancoroso: cocão verde parrudo com a tampa aberta a facão,
 * canudo vermelho torto e olhos apertados de rancor. Tanque: corpo largo.
 */
function createCocoModel(r: number, eyeWhite: THREE.Material, eyeBlack: THREE.Material): EnemyTypeModel {
  const huskMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x4e7a3a }));
  const fleshMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xf0ead8 }));
  const strawMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xc23b2e }));

  // Corpo oval de coco, base no chão.
  const body = new THREE.SphereGeometry(r, 9, 7);
  body.scale(1.0, 1.3, 1.0);
  body.translate(0, r * 1.3, 0);

  // Tampa cortada: disco de polpa branca inclinado no topo.
  const lid = new THREE.CylinderGeometry(r * 0.52, r * 0.52, r * 0.12, 8);
  lid.rotateX(0.18);
  lid.rotateZ(-0.12);
  lid.translate(r * 0.08, r * 2.52, -r * 0.05);

  // Canudo vermelho torto espetado fora do centro.
  const straw = new THREE.CylinderGeometry(r * 0.07, r * 0.07, r * 1.1, 5);
  straw.rotateZ(0.35);
  straw.rotateX(-0.15);
  straw.translate(r * 0.4, r * 2.95, -r * 0.1);

  // Olhos brancos desiguais com pupilas mínimas: o olhar fechado do rancor.
  const leftEye = new THREE.SphereGeometry(r * 0.24, 8, 6);
  leftEye.translate(-r * 0.3, r * 1.75, r * 0.85);
  const rightEye = new THREE.SphereGeometry(r * 0.19, 8, 6);
  rightEye.translate(r * 0.32, r * 1.82, r * 0.87);

  const leftPupil = new THREE.SphereGeometry(r * 0.07, 5, 4);
  leftPupil.translate(-r * 0.32, r * 1.73, r * 1.05);
  const rightPupil = new THREE.SphereGeometry(r * 0.06, 5, 4);
  rightPupil.translate(r * 0.34, r * 1.8, r * 1.03);

  return buildGroupedModel(
    [
      { material: huskMaterial, parts: [body] },
      { material: fleshMaterial, parts: [lid] },
      { material: strawMaterial, parts: [straw] },
      { material: eyeWhite, parts: [leftEye, rightEye] },
      { material: eyeBlack, parts: [leftPupil, rightPupil] },
    ],
    1,
  );
}

/**
 * Urubu de Orla: receita do pombo (asas abertas fixas, altura de voo na
 * geometria) em preto, pescoço de colar branco, cabeça pelada cinza e bico
 * de gancho — rondando a praia atrás de farelo de biscoito.
 */
function createUrubuModel(r: number, eyeBlack: THREE.Material): EnemyTypeModel {
  const featherMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x24222a }));
  const baldMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x6e6256 }));
  const ruffMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xe8e4da }));
  const eyeMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xd9a62e }));

  const flightY = r * 2.2;

  const body = new THREE.SphereGeometry(r * 0.9, 8, 6);
  body.scale(0.95, 0.8, 1.35);
  body.translate(0, flightY, 0);

  // Colar branco na base do pescoço (a gola do urubu).
  const ruff = new THREE.SphereGeometry(r * 0.38, 6, 5);
  ruff.scale(1.1, 0.7, 1.0);
  ruff.translate(0, flightY + r * 0.42, r * 0.62);

  // Cabeça pelada cinza, menor que a do pombo (desproporção ao contrário).
  const head = new THREE.SphereGeometry(r * 0.32, 6, 5);
  head.translate(0, flightY + r * 0.62, r * 0.95);

  // Bico de gancho: cone para a frente + gancho virado para baixo.
  const beakTop = new THREE.ConeGeometry(r * 0.1, r * 0.34, 5);
  beakTop.rotateX(Math.PI / 2);
  beakTop.translate(0, flightY + r * 0.6, r * 1.3);
  const beakHook = new THREE.ConeGeometry(r * 0.07, r * 0.18, 5);
  beakHook.rotateX(Math.PI);
  beakHook.translate(0, flightY + r * 0.5, r * 1.4);

  // Asas pretas mais largas que as do pombo (urubu plana, não bate asa).
  const leftWing = new THREE.BoxGeometry(r * 2.0, r * 0.09, r * 0.85);
  leftWing.rotateZ(-0.18);
  leftWing.translate(-r * 1.3, flightY + r * 0.25, -r * 0.1);
  const rightWing = new THREE.BoxGeometry(r * 2.0, r * 0.09, r * 0.85);
  rightWing.rotateZ(0.18);
  rightWing.translate(r * 1.3, flightY + r * 0.25, -r * 0.1);

  const tail = new THREE.BoxGeometry(r * 0.5, r * 0.08, r * 0.8);
  tail.rotateX(-0.22);
  tail.translate(0, flightY + r * 0.08, -r * 1.35);

  // Olhos amarelos desiguais com pupilas saltadas (padrão da casa).
  const leftEye = new THREE.SphereGeometry(r * 0.13, 6, 5);
  leftEye.translate(-r * 0.22, flightY + r * 0.68, r * 1.02);
  const rightEye = new THREE.SphereGeometry(r * 0.17, 6, 5);
  rightEye.translate(r * 0.22, flightY + r * 0.66, r * 0.98);

  const leftPupil = new THREE.SphereGeometry(r * 0.06, 5, 4);
  leftPupil.translate(-r * 0.24, flightY + r * 0.69, r * 1.12);
  const rightPupil = new THREE.SphereGeometry(r * 0.08, 5, 4);
  rightPupil.translate(r * 0.24, flightY + r * 0.67, r * 1.1);

  return buildGroupedModel(
    [
      { material: featherMaterial, parts: [body, leftWing, rightWing, tail] },
      { material: ruffMaterial, parts: [ruff] },
      { material: baldMaterial, parts: [head, beakTop, beakHook] },
      { material: eyeMaterial, parts: [leftEye, rightEye] },
      { material: eyeBlack, parts: [leftPupil, rightPupil] },
    ],
    1,
  );
}
