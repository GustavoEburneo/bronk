import * as THREE from 'three';
import type { World } from '../sim/world';
import type { CharacterDef } from '../data/characters';
import {
  createApronTexture,
  createFurTexture,
  createMailUniformTexture,
  createSmokeTexture,
  makeRng,
} from './jankTextures';
import { applyVertexSnap } from './retro';
import { EnemyState } from '../sim/enemyState';
import type { GroundHeightFn } from './terrain';

export interface PlayerView {
  readonly group: THREE.Group;
  /**
   * `frameDt` é o tempo de FRAME: alimenta só enfeites que seguem vivos com a
   * sim pausada (ondular da fumaça — padrão do giro das cartas); tudo que é
   * posição/raio/pulso deriva do estado da sim e congela com ela.
   */
  update(world: World, alpha: number, frameDt: number): void;
}

/**
 * CONVENÇÃO DE RENDER (contrato com o harness, ver TECH): o mesh do CORPO de
 * qualquer personagem recebe este nome — o spy de posição do verify:headless
 * procura por ele.
 */
const PLAYER_BODY_NAME = 'player-body';

/** Janela do flash de ativação da habilidade (mordida ou arremesso). */
const ABILITY_FLASH_SECONDS = 0.15;
/** Frequência do trote/marcha (rad/s). Alta e sem easing: a dureza é a piada. */
const TROT_FREQUENCY = 11;

/** Tufos da nuvem de fumaça do churrasqueiro (1 InstancedMesh = 1 draw call). */
const SMOKE_PUFF_COUNT = 16;
/**
 * Janela do "incha e solta anel" após cada pulso da fumaça (s de tempo
 * SIMULADO: congela na pausa junto com a sim). Menor que o piso de cooldown
 * (0,35 s do Café): um pulso nunca atropela a animação do anterior.
 */
const SMOKE_PULSE_SECONDS = 0.3;

/**
 * Vista do player montada POR PERSONAGEM (TECH, "Estado de aplicação"): o
 * beginMatch escolhe o modelo pelo id. Visual novo = ramo novo aqui.
 */
export function createPlayerView(character: CharacterDef, ground: GroundHeightFn): PlayerView {
  switch (character.id) {
    case 'capivara':
      return createCapivaraView(ground);
    case 'carteiro':
      return createCarteiroView(ground);
    case 'churrasqueiro':
      // O pulso visual deriva de "cooldown recém-recarregado" (ver
      // secondsSinceAbilityFired): a equivalência 1:1 com o smokeFired exige
      // cooldown base maior que a janela do flash — cooldown <= janela acenderia
      // o pulso permanentemente. Blindagem contra linha futura da tabela.
      if (character.ability.cooldown <= SMOKE_PULSE_SECONDS) {
        throw new Error(
          `cooldown da fumaça (${character.ability.cooldown}s) precisa ser > ` +
            `${SMOKE_PULSE_SECONDS}s (janela do pulso visual)`,
        );
      }
      return createChurrasqueiroView(ground);
    default:
      throw new Error(`personagem sem vista de render: ${character.id}`);
  }
}

/**
 * Tempo desde a última ativação da habilidade, derivado do cooldown (estado da
 * sim), não de eventos: funciona igual com 0 ou N ticks por frame. Com o
 * lançamento adiado (pool de cartas cheio segura o cooldown em 0), o valor é o
 * cooldown inteiro e fica fora da janela de flash — sem flash falso.
 */
function secondsSinceAbilityFired(world: World): number {
  return world.stats.abilityCooldown - world.player.abilityCooldown;
}

/**
 * Interpola prev→pos do player para a posição do grupo raiz e o assenta na
 * altura do relevo do mapa (`ground` — ver render/terrain.ts; 0 em mapa plano)
 * MAIS o pulo da sim (jumpOffset, interpolado como a posição).
 */
function applyInterpolatedPosition(
  world: World,
  alpha: number,
  group: THREE.Group,
  ground: GroundHeightFn,
): void {
  const player = world.player;
  group.position.x = player.prevX + (player.x - player.prevX) * alpha;
  group.position.z = player.prevZ + (player.z - player.prevZ) * alpha;
  group.position.y =
    ground(group.position.x, group.position.z) +
    player.prevJumpOffset +
    (player.jumpOffset - player.prevJumpOffset) * alpha;
}

/**
 * Pisca durante a janela de invulnerabilidade; morto não pisca (com a sim
 * congelada, o seno ficaria fixo e poderia deixar o modelo invisível).
 */
function applyInvulnBlink(world: World, model: THREE.Group): void {
  model.visible =
    world.player.state === 'dead' ||
    world.player.invulnTimer <= 0 ||
    Math.sin(world.time * 40) > -0.2;
}

function isMoving(world: World): boolean {
  const player = world.player;
  return Math.hypot(player.x - player.prevX, player.z - player.prevZ) > 1e-4;
}

/**
 * Capivara tosca de propósito: cabeça desproporcional, olhos esbugalhados
 * assimétricos, dentões e trote rígido de quatro patas que viram em bloco.
 */
function createCapivaraView(ground: GroundHeightFn): PlayerView {
  const group = new THREE.Group();

  const furMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ map: createFurTexture() }));
  const darkMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x4a3222 }));
  const whiteMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xf4f0e6 }));
  const blackMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x141414 }));

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 1.0), furMaterial);
  body.name = PLAYER_BODY_NAME;
  body.position.y = 0.52;

  // Cabeça desproporcional: o corpo é quase um detalhe atrás dela.
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.8, 0.6);

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.52, 0.56), furMaterial);
  const snout = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.26, 0.22), darkMaterial);
  snout.position.set(0, -0.08, 0.36);

  // Dentões.
  const toothGeometry = new THREE.BoxGeometry(0.09, 0.14, 0.04);
  const leftTooth = new THREE.Mesh(toothGeometry, whiteMaterial);
  leftTooth.position.set(-0.055, -0.24, 0.45);
  const rightTooth = new THREE.Mesh(toothGeometry, whiteMaterial);
  rightTooth.position.set(0.055, -0.24, 0.45);

  // Olhos esbugalhados, de tamanhos diferentes (regra de ouro do tosco).
  const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 6), whiteMaterial);
  leftEye.position.set(-0.24, 0.1, 0.22);
  const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 6), whiteMaterial);
  rightEye.position.set(0.26, 0.13, 0.2);
  const pupilGeometry = new THREE.SphereGeometry(0.05, 6, 4);
  const leftPupil = new THREE.Mesh(pupilGeometry, blackMaterial);
  leftPupil.position.set(-0.26, 0.12, 0.31);
  const rightPupil = new THREE.Mesh(pupilGeometry, blackMaterial);
  rightPupil.position.set(0.29, 0.14, 0.33);

  const earGeometry = new THREE.BoxGeometry(0.13, 0.13, 0.1);
  const leftEar = new THREE.Mesh(earGeometry, darkMaterial);
  leftEar.position.set(-0.21, 0.31, 0.05);
  const rightEar = new THREE.Mesh(earGeometry, darkMaterial);
  rightEar.position.set(0.21, 0.31, 0.05);

  headGroup.add(
    head,
    snout,
    leftTooth,
    rightTooth,
    leftEye,
    rightEye,
    leftPupil,
    rightPupil,
    leftEar,
    rightEar,
  );

  // Patas com pivô no quadril (geometria deslocada para girar no topo).
  const legGeometry = new THREE.BoxGeometry(0.16, 0.34, 0.16);
  legGeometry.translate(0, -0.17, 0);
  const makeLeg = (x: number, z: number): THREE.Mesh => {
    const leg = new THREE.Mesh(legGeometry, furMaterial);
    leg.position.set(x, 0.36, z);
    return leg;
  };
  const frontLeft = makeLeg(-0.24, 0.35);
  const frontRight = makeLeg(0.24, 0.35);
  const backLeft = makeLeg(-0.24, -0.35);
  const backRight = makeLeg(0.24, -0.35);

  const capybara = new THREE.Group();
  capybara.add(body, headGroup, frontLeft, frontRight, backLeft, backRight);
  group.add(capybara);

  // Arco da mordida: feedback ESPECÍFICO da mordida, que é de ALVO ÚNICO
  // (DECISIONS 2026-11-18) — um anel cheio leria como dano em área (a
  // linguagem da fumaça do churrasqueiro), o que seria falso. O arco aponta ao
  // alvo e sua ponta expande até o alcance real: direção + alcance, sem
  // prometer área. Geometria centrada em θ=0 (+X); o rotation.z do update gira
  // o arco até o alvo.
  const BITE_ARC = Math.PI / 2.8;
  const biteArc = new THREE.Mesh(
    new THREE.RingGeometry(0.55, 1, 10, 1, -BITE_ARC / 2, BITE_ARC),
    new THREE.MeshBasicMaterial({
      color: 0xffe066,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  biteArc.rotation.x = -Math.PI / 2;
  biteArc.position.y = 0.06;
  biteArc.visible = false;
  group.add(biteArc);

  const biteMaterial = biteArc.material as THREE.MeshBasicMaterial;

  return {
    group,
    update(world: World, alpha: number): void {
      const player = world.player;
      applyInterpolatedPosition(world, alpha, group, ground);
      capybara.rotation.y = Math.atan2(player.facingX, player.facingZ);

      if (player.state === 'dead') {
        // Tombada de lado, patas esticadas: fim de run.
        capybara.rotation.z = Math.PI / 2;
        capybara.position.y = 0.1;
      } else if (isMoving(world)) {
        // Trote em onda quadrada: Math.sign troca de lado num estalo, sem
        // transição — o jank do movimento é este degrau.
        const wave = Math.sin(world.time * TROT_FREQUENCY);
        const snap = Math.sign(wave);
        capybara.position.y = Math.abs(wave) * 0.1;
        capybara.rotation.z = snap * 0.07;
        frontLeft.rotation.x = snap * 0.8;
        backRight.rotation.x = snap * 0.8;
        frontRight.rotation.x = -snap * 0.8;
        backLeft.rotation.x = -snap * 0.8;
      } else {
        capybara.position.y = 0;
        capybara.rotation.z = 0;
        frontLeft.rotation.x = 0;
        frontRight.rotation.x = 0;
        backLeft.rotation.x = 0;
        backRight.rotation.x = 0;
      }

      applyInvulnBlink(world, capybara);

      // O flash da mordida deriva do cooldown (estado da sim), não de eventos:
      // funciona igual com 0 ou N ticks por frame.
      const sinceBite = secondsSinceAbilityFired(world);
      if (player.state === 'alive' && sinceBite >= 0 && sinceBite <= ABILITY_FLASH_SECONDS) {
        const progress = sinceBite / ABILITY_FLASH_SECONDS;
        const radius = world.stats.abilityRange * Math.max(progress, 0.2);
        // Aponta o arco ao Chasing mais próximo — a MESMA regra de alvo da
        // sim, replicada aqui só como feedback (não é regra de dano): se o
        // alvo morreu entre o tick e o frame, o arco aponta o vizinho por
        // 0,15 s. Fallback sem inimigo: o facing. Sem alocação (scan no pool).
        let bestDistSq = Infinity;
        let dirX = player.facingX;
        let dirZ = player.facingZ;
        const enemies = world.enemies;
        for (let i = 0; i < enemies.count; i++) {
          if (enemies.state[i] !== EnemyState.Chasing) continue;
          const dx = enemies.posX[i]! - player.x;
          const dz = enemies.posZ[i]! - player.z;
          const distSq = dx * dx + dz * dz;
          if (distSq < bestDistSq) {
            bestDistSq = distSq;
            dirX = dx;
            dirZ = dz;
          }
        }
        // Com rotation.x=-π/2 (ordem XYZ), o ângulo de mundo do arco é -rotation.z.
        biteArc.rotation.z = -Math.atan2(dirZ, dirX);
        biteArc.visible = true;
        biteArc.scale.setScalar(radius);
        biteMaterial.opacity = 1 - progress;
        // Cabeça infla num estalo e volta: mordida de desenho animado.
        headGroup.scale.setScalar(1 + 0.45 * (1 - progress));
      } else {
        biteArc.visible = false;
        headGroup.scale.setScalar(1);
      }
    },
  };
}

/**
 * Carteiro tosco (visual provisório, a polir pelo technical-artist): cabeça
 * grande com olhos esbugalhados desiguais, boné torto, bolsa de carteiro
 * desproporcional e marcha dura. Sem anel de alcance: o feedback do ataque é a
 * própria carta em voo; o arremesso só levanta o braço num estalo.
 */
function createCarteiroView(ground: GroundHeightFn): PlayerView {
  const group = new THREE.Group();

  const uniformMaterial = applyVertexSnap(
    new THREE.MeshLambertMaterial({ map: createMailUniformTexture() }),
  );
  const skinMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xe0a46c }));
  const capMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x2c4e73 }));
  const bagMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x7a4e2a }));
  const flapMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x95643a }));
  const pantsMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x33415a }));
  const whiteMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xf4f0e6 }));
  const blackMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x141414 }));

  // Tronco: o mesh do corpo leva o nome do contrato do harness.
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.65, 0.34), uniformMaterial);
  body.name = PLAYER_BODY_NAME;
  body.position.y = 0.85;

  // Cabeça desproporcional com boné torto.
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.45, 0);

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.45), skinMaterial);

  const nose = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.12), skinMaterial);
  nose.position.set(0.03, -0.05, 0.26);

  // Olhos esbugalhados de tamanhos diferentes (regra de ouro do tosco).
  const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), whiteMaterial);
  leftEye.position.set(-0.14, 0.07, 0.21);
  const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), whiteMaterial);
  rightEye.position.set(0.16, 0.1, 0.19);
  const pupilGeometry = new THREE.SphereGeometry(0.045, 6, 4);
  const leftPupil = new THREE.Mesh(pupilGeometry, blackMaterial);
  leftPupil.position.set(-0.15, 0.08, 0.29);
  const rightPupil = new THREE.Mesh(pupilGeometry, blackMaterial);
  rightPupil.position.set(0.18, 0.11, 0.31);

  const capCrown = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.18, 0.5), capMaterial);
  capCrown.position.set(0, 0.28, -0.02);
  capCrown.rotation.z = 0.12; // boné torto de propósito
  const capBrim = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.05, 0.3), capMaterial);
  capBrim.position.set(0, 0.2, 0.32);
  capBrim.rotation.z = 0.12;

  headGroup.add(head, nose, leftEye, rightEye, leftPupil, rightPupil, capCrown, capBrim);

  // Bolsa de carteiro desproporcional no quadril, com aba e alça atravessada.
  const bagGroup = new THREE.Group();
  bagGroup.position.set(-0.42, 0.72, 0);
  const bag = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.42, 0.5), bagMaterial);
  const bagFlap = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.16, 0.53), flapMaterial);
  bagFlap.position.y = 0.16;
  bagGroup.add(bag, bagFlap);

  const strap = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.95, 0.06), flapMaterial);
  strap.position.set(-0.14, 1.0, 0.19);
  strap.rotation.z = 0.55;

  // Braços e pernas com pivô no ombro/quadril (geometria deslocada).
  const armGeometry = new THREE.BoxGeometry(0.14, 0.5, 0.14);
  armGeometry.translate(0, -0.25, 0);
  const leftArm = new THREE.Mesh(armGeometry, uniformMaterial);
  leftArm.position.set(-0.36, 1.12, 0);
  const rightArm = new THREE.Mesh(armGeometry, uniformMaterial);
  rightArm.position.set(0.36, 1.12, 0);

  const legGeometry = new THREE.BoxGeometry(0.17, 0.52, 0.17);
  legGeometry.translate(0, -0.26, 0);
  const leftLeg = new THREE.Mesh(legGeometry, pantsMaterial);
  leftLeg.position.set(-0.15, 0.52, 0);
  const rightLeg = new THREE.Mesh(legGeometry, pantsMaterial);
  rightLeg.position.set(0.15, 0.52, 0);

  const carteiro = new THREE.Group();
  carteiro.add(body, headGroup, bagGroup, strap, leftArm, rightArm, leftLeg, rightLeg);
  group.add(carteiro);

  return {
    group,
    update(world: World, alpha: number): void {
      const player = world.player;
      applyInterpolatedPosition(world, alpha, group, ground);
      carteiro.rotation.y = Math.atan2(player.facingX, player.facingZ);

      if (player.state === 'dead') {
        // Tombado de lado, boné no asfalto: fim de run.
        carteiro.rotation.z = Math.PI / 2;
        carteiro.position.y = 0.28;
      } else if (isMoving(world)) {
        // Marcha em onda quadrada, braços e pernas em oposição — mesmo degrau
        // sem easing do trote da capivara.
        const wave = Math.sin(world.time * TROT_FREQUENCY);
        const snap = Math.sign(wave);
        carteiro.position.y = Math.abs(wave) * 0.08;
        carteiro.rotation.z = snap * 0.05;
        leftLeg.rotation.x = snap * 0.7;
        rightLeg.rotation.x = -snap * 0.7;
        leftArm.rotation.x = -snap * 0.6;
        rightArm.rotation.x = snap * 0.6;
      } else {
        carteiro.position.y = 0;
        carteiro.rotation.z = 0;
        leftLeg.rotation.x = 0;
        rightLeg.rotation.x = 0;
        leftArm.rotation.x = 0;
        rightArm.rotation.x = 0;
      }

      applyInvulnBlink(world, carteiro);

      // Flash do arremesso derivado do cooldown (ver secondsSinceAbilityFired):
      // o braço do lado da mão sobe num estalo e a bolsa infla — sem anel.
      const sinceThrow = secondsSinceAbilityFired(world);
      if (player.state === 'alive' && sinceThrow >= 0 && sinceThrow <= ABILITY_FLASH_SECONDS) {
        const progress = sinceThrow / ABILITY_FLASH_SECONDS;
        rightArm.rotation.x = -2.2 * (1 - progress);
        bagGroup.scale.setScalar(1 + 0.35 * (1 - progress));
      } else {
        bagGroup.scale.setScalar(1);
      }
    },
  };
}

/**
 * Churrasqueiro tosco (visual provisório, a polir pelo technical-artist):
 * barrigudo de avental manchado, chapéu de cozinheiro torto, espátula na mão,
 * olhos esbugalhados desiguais e marcha dura. A habilidade é lida pela NUVEM:
 *
 * - O ANEL DE BORDA é a informação de jogo — escalado todo frame por
 *   `stats.abilityRange`, comunica o raio REAL do pulso (Bocão o alarga).
 * - Os tufos redemoinham DENTRO do raio e são enfeite sem hitbox; ondulam com
 *   o relógio de frame mesmo na pausa (padrão aceito do giro das cartas), mas
 *   posição do centro e raio derivam da sim e congelam com ela.
 * - O pulso é derivado do cooldown (ver secondsSinceAbilityFired): a sim só
 *   recarrega o cooldown quando um `smokeFired` real saiu (sem alvo ele segura
 *   em 0), então "cooldown recém-cheio" equivale ao evento — e funciona com
 *   0 ou N ticks por frame, sem depender da vida curta de `world.events`.
 *   No disparo: anel de choque expande até a borda, tufos incham, bochechas
 *   estufam na baforada.
 */
function createChurrasqueiroView(ground: GroundHeightFn): PlayerView {
  const group = new THREE.Group();

  const apronMaterial = applyVertexSnap(
    new THREE.MeshLambertMaterial({ map: createApronTexture() }),
  );
  const skinMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xc98a58 }));
  const hatMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xece6d8 }));
  const pantsMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x4a3a30 }));
  const whiteMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xf4f0e6 }));
  const blackMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x141414 }));
  const woodMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x6b4423 }));
  const metalMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xb8bcc2 }));

  // Tronco: o mesh do corpo leva o nome do contrato do harness.
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.65, 0.4), apronMaterial);
  body.name = PLAYER_BODY_NAME;
  body.position.y = 0.85;

  // Barriga estufando o avental: churrasqueiro prova o próprio tempero.
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 6), apronMaterial);
  belly.position.set(0, 0.74, 0.15);

  // Cabeça com bochechas de baforada e chapéu de cozinheiro torto.
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.45, 0);

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.46, 0.46), skinMaterial);

  const nose = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.13, 0.13), skinMaterial);
  nose.position.set(-0.02, -0.04, 0.27);

  // Bigodão torto sob o nariz.
  const mustache = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.06), blackMaterial);
  mustache.position.set(0, -0.14, 0.25);
  mustache.rotation.z = -0.09;

  // Olhos esbugalhados de tamanhos diferentes (regra de ouro do tosco).
  const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 6), whiteMaterial);
  leftEye.position.set(-0.15, 0.09, 0.21);
  const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), whiteMaterial);
  rightEye.position.set(0.15, 0.06, 0.22);
  const pupilGeometry = new THREE.SphereGeometry(0.045, 6, 4);
  const leftPupil = new THREE.Mesh(pupilGeometry, blackMaterial);
  leftPupil.position.set(-0.16, 0.1, 0.3);
  const rightPupil = new THREE.Mesh(pupilGeometry, blackMaterial);
  rightPupil.position.set(0.16, 0.07, 0.29);

  const hatBase = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.48), hatMaterial);
  hatBase.position.set(0.02, 0.27, 0);
  hatBase.rotation.z = -0.14; // chapéu torto de propósito
  const hatTop = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.3, 0.54), hatMaterial);
  hatTop.position.set(0.07, 0.46, 0);
  hatTop.rotation.z = -0.18;

  headGroup.add(
    head,
    nose,
    mustache,
    leftEye,
    rightEye,
    leftPupil,
    rightPupil,
    hatBase,
    hatTop,
  );

  // Braços e pernas com pivô no ombro/quadril (geometria deslocada).
  const armGeometry = new THREE.BoxGeometry(0.15, 0.5, 0.15);
  armGeometry.translate(0, -0.25, 0);
  const leftArm = new THREE.Mesh(armGeometry, apronMaterial);
  leftArm.position.set(-0.4, 1.12, 0);
  const rightArm = new THREE.Mesh(armGeometry, apronMaterial);
  rightArm.position.set(0.4, 1.12, 0);

  // Espátula presa na mão direita: acompanha o balanço do braço.
  const spatulaHandle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.3, 0.05), woodMaterial);
  spatulaHandle.position.set(0, -0.6, 0.06);
  const spatulaBlade = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 0.03), metalMaterial);
  spatulaBlade.position.set(0, -0.84, 0.06);
  rightArm.add(spatulaHandle, spatulaBlade);

  const legGeometry = new THREE.BoxGeometry(0.18, 0.52, 0.18);
  legGeometry.translate(0, -0.26, 0);
  const leftLeg = new THREE.Mesh(legGeometry, pantsMaterial);
  leftLeg.position.set(-0.16, 0.52, 0);
  const rightLeg = new THREE.Mesh(legGeometry, pantsMaterial);
  rightLeg.position.set(0.16, 0.52, 0);

  const churrasqueiro = new THREE.Group();
  churrasqueiro.add(body, belly, headGroup, leftArm, rightArm, leftLeg, rightLeg);
  group.add(churrasqueiro);

  // --- Nuvem de fumaça (fora do grupo do modelo: não pisca com os i-frames) ---

  // Tufos em lote: 1 InstancedMesh, matrizes escritas direto no buffer — zero
  // alocação por frame, mesmo padrão de cardInstances.
  const puffs = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(0.26, 0),
    new THREE.MeshLambertMaterial({
      map: createSmokeTexture(),
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    }),
    SMOKE_PUFF_COUNT,
  );
  puffs.frustumCulled = false;
  puffs.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const puffMatrices = puffs.instanceMatrix.array as Float32Array;
  for (let i = 0; i < SMOKE_PUFF_COUNT; i++) puffMatrices[i * 16 + 15] = 1;

  // Parâmetros fixos por tufo, sorteados uma vez (determinístico, fora da sim).
  const rnd = makeRng(808);
  const puffAngle = new Float32Array(SMOKE_PUFF_COUNT);
  const puffRadiusFrac = new Float32Array(SMOKE_PUFF_COUNT);
  const puffHeight = new Float32Array(SMOKE_PUFF_COUNT);
  const puffScale = new Float32Array(SMOKE_PUFF_COUNT);
  const puffSpin = new Float32Array(SMOKE_PUFF_COUNT);
  for (let i = 0; i < SMOKE_PUFF_COUNT; i++) {
    puffAngle[i] = (i / SMOKE_PUFF_COUNT) * Math.PI * 2;
    puffRadiusFrac[i] = 0.25 + rnd() * 0.7;
    puffHeight[i] = 0.25 + rnd() * 0.9;
    puffScale[i] = 0.7 + rnd() * 0.8;
    // Metade gira para cada lado: redemoinho, não carrossel.
    puffSpin[i] = (0.4 + rnd() * 0.5) * (i % 2 === 0 ? 1 : -1);
  }

  // Anel de borda: A informação de jogo — raio REAL do pulso (stats.abilityRange).
  const rangeRing = new THREE.Mesh(
    new THREE.RingGeometry(0.93, 1, 40),
    new THREE.MeshBasicMaterial({
      color: 0xd8d2c4,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  rangeRing.rotation.x = -Math.PI / 2;
  rangeRing.position.y = 0.05;

  // Anel de choque do pulso: expande do centro até a borda e some.
  const pulseRing = new THREE.Mesh(
    new THREE.RingGeometry(0.8, 1, 40),
    new THREE.MeshBasicMaterial({
      color: 0xf5efdd,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  pulseRing.rotation.x = -Math.PI / 2;
  pulseRing.position.y = 0.07;
  pulseRing.visible = false;

  group.add(puffs, rangeRing, pulseRing);

  const rangeRingMaterial = rangeRing.material as THREE.MeshBasicMaterial;
  const pulseRingMaterial = pulseRing.material as THREE.MeshBasicMaterial;

  // Relógio de render da ondulação: segue na pausa (padrão do giro das cartas).
  let swirlTime = 0;

  return {
    group,
    update(world: World, alpha: number, frameDt: number): void {
      swirlTime += frameDt;
      const player = world.player;
      applyInterpolatedPosition(world, alpha, group, ground);
      churrasqueiro.rotation.y = Math.atan2(player.facingX, player.facingZ);

      if (player.state === 'dead') {
        // Tombado de lado, chapéu no asfalto: fim de run.
        churrasqueiro.rotation.z = Math.PI / 2;
        churrasqueiro.position.y = 0.3;
      } else if (isMoving(world)) {
        // Marcha em onda quadrada, braços e pernas em oposição — mesmo degrau
        // sem easing do trote da capivara.
        const wave = Math.sin(world.time * TROT_FREQUENCY);
        const snap = Math.sign(wave);
        churrasqueiro.position.y = Math.abs(wave) * 0.07;
        churrasqueiro.rotation.z = snap * 0.06;
        leftLeg.rotation.x = snap * 0.7;
        rightLeg.rotation.x = -snap * 0.7;
        leftArm.rotation.x = -snap * 0.5;
        rightArm.rotation.x = snap * 0.5;
      } else {
        churrasqueiro.position.y = 0;
        churrasqueiro.rotation.z = 0;
        leftLeg.rotation.x = 0;
        rightLeg.rotation.x = 0;
        leftArm.rotation.x = 0;
        rightArm.rotation.x = 0;
      }

      applyInvulnBlink(world, churrasqueiro);

      // Pulso derivado do cooldown (equivale ao smokeFired, ver doc da função).
      const sincePulse = secondsSinceAbilityFired(world);
      const alive = player.state === 'alive';
      const pulsing = alive && sincePulse >= 0 && sincePulse <= SMOKE_PULSE_SECONDS;
      const kick = pulsing ? 1 - sincePulse / SMOKE_PULSE_SECONDS : 0;

      // Bochechas estufam na baforada e esvaziam sem easing.
      headGroup.scale.setScalar(1 + 0.4 * kick);

      const range = world.stats.abilityRange;

      // Borda = raio real; morto não promete alcance de nada.
      rangeRing.visible = alive;
      rangeRing.scale.setScalar(range);
      rangeRingMaterial.opacity = 0.3 + 0.45 * kick;

      pulseRing.visible = pulsing;
      if (pulsing) {
        const progress = 1 - kick;
        pulseRing.scale.setScalar(range * (0.3 + 0.7 * progress));
        pulseRingMaterial.opacity = 0.75 * (1 - progress);
      }

      // Tufos: redemoinho SEMPRE dentro do raio real (a nuvem não pode sugerir
      // alcance que o pulso não tem; a folga de 0,55 u cobre o raio do tufo).
      const reach = range - 0.55;
      for (let i = 0; i < SMOKE_PUFF_COUNT; i++) {
        const offset = i * 16;
        const angle = puffAngle[i]! + swirlTime * puffSpin[i]!;
        const radius = puffRadiusFrac[i]! * reach;
        const scale =
          puffScale[i]! * (1 + 0.1 * Math.sin(swirlTime * 3 + i)) * (1 + 0.45 * kick);
        puffMatrices[offset] = scale;
        puffMatrices[offset + 5] = scale;
        puffMatrices[offset + 10] = scale;
        puffMatrices[offset + 12] = Math.cos(angle) * radius;
        puffMatrices[offset + 13] = puffHeight[i]! + Math.sin(swirlTime * 2 + i * 1.7) * 0.08;
        puffMatrices[offset + 14] = Math.sin(angle) * radius;
      }
      puffs.instanceMatrix.needsUpdate = true;
    },
  };
}
