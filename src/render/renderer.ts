import * as THREE from 'three';
import type { GameData } from '../data/tables';
import type { MatchSelection, World } from '../sim/world';
import { createArena, createFeiraArena, createRioArena } from './arena';
import type { GroundHeightFn } from './terrain';
import { groundHeightForMap } from './terrain';
import type { EnemyInstances } from './enemyInstances';
import { createEnemyInstances } from './enemyInstances';
import type { OrbInstances } from './orbInstances';
import { createOrbInstances } from './orbInstances';
import type { CardInstances } from './cardInstances';
import { createCardInstances } from './cardInstances';
import type { PlayerView } from './playerView';
import { createPlayerView } from './playerView';
import type { DamageNumbers } from './damageNumbers';
import { createDamageNumbers } from './damageNumbers';
import type { OrelhaoView } from './orelhaoView';
import { createOrelhaoView } from './orelhaoView';
import type { FollowCamera } from './followCamera';
import { createFollowCamera } from './followCamera';
import type { CameraLook } from '../app/mouseLook';
import { createSky, skyForMap } from './sky';
import { setSnapResolution } from './retro';
import { setCrudeTextureAnisotropy } from './jankTextures';

export interface RendererOptions {
  /**
   * Altura interna de render em pixels (largura segue o aspecto da janela).
   * 0 = NATIVA (altura da janela, teto 1080) — padrão desde o passe gráfico
   * de 2026-11-24; um valor > 0 força a altura (override ?res=, usado na
   * medição de estresse com ?res=270 e ?res=540).
   */
  renderHeight: number;
  /** Orientação da câmera, lida a cada frame (controlada pelo mouse). */
  cameraLook: CameraLook;
  /** Números de dano ligados? Lido a cada frame do cofre de configurações. */
  showDamageNumbers(): boolean;
}

export interface GameRenderer {
  /**
   * Monta a cena da partida: arena do mapa escolhido, instâncias de inimigos/
   * orbes, vista do personagem escolhido e cartas (só quando a habilidade usa).
   * Chamar com partida já montada é bug do chamador.
   */
  beginMatch(data: GameData, selection: MatchSelection): void;
  /**
   * Desfaz TUDO que a cena da partida alocou (geometrias, materiais, texturas)
   * — ver risco "vazamento de GPU" no TECH. Loga renderer.info.memory para
   * conferência: deve voltar ao valor pós-boot.
   */
  endMatch(): void;
  /** Exige cena montada (beginMatch). */
  draw(world: World, alpha: number, frameDt: number): void;
  dispose(): void;
}

/** Tudo que vive só durante uma partida (criado em beginMatch, solto em endMatch). */
interface MatchScene {
  root: THREE.Group;
  enemies: EnemyInstances;
  orbs: OrbInstances;
  /** Só existe quando o personagem equipado usa cartas. */
  cards: CardInstances | null;
  player: PlayerView;
  /** Relevo do mapa: o draw o usa para a altura do chão sob o player. */
  ground: GroundHeightFn;
  /** Céu do mapa (domo + sol + nuvens): segue a câmera no XZ a cada draw. */
  sky: THREE.Group;
  /** Números de dano + vinheta (camada DOM; removida no endMatch). */
  damage: DamageNumbers;
  /** Orelhões (aparelho na cena + rótulo DOM de requisito). */
  orelhoes: OrelhaoView;
  followCamera: FollowCamera;
}

/**
 * Contexto de render com a vida do APP: o WebGLRenderer, a câmera e o resize
 * são criados UMA vez (evita churn de contexto WebGL por partida — TECH). A
 * cena de cada partida entra e sai por beginMatch/endMatch.
 */
export function createRenderer(canvas: HTMLCanvasElement, options: RendererOptions): GameRenderer {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    // Antialias ligado (passe gráfico 2026-11-24): com a resolução interna
    // nativa, a serrilha deixou de ser estilo e virou ruído.
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(1);
  // Tone mapping fílmico: segura o estouro do flash de hit (cores > 1) e dá
  // profundidade às cores chapadas — parte do passe "mais realista".
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = false;
  // Antes de criar arena/vistas: as texturas leem este valor ao nascer.
  setCrudeTextureAnisotropy(renderer.capabilities.getMaxAnisotropy());

  const scene = new THREE.Scene();
  // Cor de fundo e da névoa trocadas POR MAPA no beginMatch, sempre para a cor
  // do HORIZONTE do céu do mapa (sky.ts): o cenário some fundindo no céu.
  const background = new THREE.Color(0x14121a);
  scene.background = background;
  // Névoa de AMBIENTE, não de cortina (2026-11-24, era 38..70): a vista
  // alcança longe — morros, cartões-postais e o cenário inteiro à vista; o
  // anel de spawn (24..32 u) sempre esteve dentro da vista limpa mesmo.
  const fog = new THREE.Fog(0x14121a, 60, 170);
  scene.fog = fog;

  const camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.5,
    400,
  );

  const hemisphere = new THREE.HemisphereLight(0xcfd8ff, 0x403429, 1.1);
  const sun = new THREE.DirectionalLight(0xfff2d8, 1.6);
  sun.position.set(12, 20, 6);
  scene.add(hemisphere, sun);

  let match: MatchScene | null = null;

  const applySize = (): void => {
    // Sem override: resolução nativa da janela (teto 1080 — acima disso o
    // custo não compra nitidez perceptível no estilo do jogo).
    const targetHeight =
      options.renderHeight > 0 ? options.renderHeight : Math.min(window.innerHeight, 1080);
    const height = Math.max(90, Math.round(targetHeight));
    const width = Math.max(160, Math.round((window.innerWidth / window.innerHeight) * height));
    // updateStyle=false: o CSS mantém o canvas em tela cheia e faz o upscale.
    renderer.setSize(width, height, false);
    setSnapResolution(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  applySize();
  window.addEventListener('resize', applySize);

  function beginMatch(data: GameData, selection: MatchSelection): void {
    if (match !== null) {
      throw new Error('beginMatch com cena de partida já montada — faltou endMatch');
    }

    // Mesmas regras de resolução do createWorld; validar aqui também dá erro
    // claro no boot mesmo se a ordem de chamada mudar.
    const character = data.characters.find((def) => def.id === selection.characterId);
    if (character === undefined) {
      throw new Error(`personagem desconhecido no render: ${selection.characterId}`);
    }
    const map =
      selection.mapId === undefined
        ? data.maps.find((def) => def.playable)
        : data.maps.find((def) => def.id === selection.mapId);
    if (map === undefined || !map.playable) {
      throw new Error(`mapa inválido no render: ${selection.mapId ?? '(nenhum jogável)'}`);
    }

    const root = new THREE.Group();
    // Relevo do mapa (apresentação — ver render/terrain.ts): a MESMA função
    // deforma o chão e assenta player, inimigos, orbes, cartas e câmera.
    const ground = groundHeightForMap(map.id);
    const arena = createMapArena(map.id, map.arena.halfSize, ground);
    const enemies = createEnemyInstances(data, ground);
    const orbs = createOrbInstances(data, ground);
    const cards = character.ability.kind === 'cartas' ? createCardInstances(ground) : null;
    const player = createPlayerView(character, ground);
    // Por partida: zera o amortecimento (a câmera nasce em cima do spawn).
    // O relevo entra para a colisão câmera×morro.
    const followCamera = createFollowCamera(camera, ground);

    // Céu do mapa: o domo segue a câmera (draw); névoa e fundo casam com o
    // horizonte dele — sem isso o cenário sumiria contra uma cor estranha.
    const skyDef = skyForMap(map.id);
    const sky = createSky(skyDef);
    background.setHex(skyDef.horizon);
    fog.color.setHex(skyDef.horizon);

    root.add(arena, sky, orbs.mesh, player.group);
    // Um InstancedMesh por TIPO de inimigo (TECH, "Render: um InstancedMesh POR TIPO").
    for (const enemyMesh of enemies.meshes) root.add(enemyMesh);
    if (cards !== null) root.add(cards.mesh);
    scene.add(root);

    const orelhoes = createOrelhaoView(data.orelhoes.killRequirements.length, ground);
    root.add(orelhoes.group);

    match = {
      root,
      enemies,
      orbs,
      cards,
      player,
      ground,
      sky,
      damage: createDamageNumbers(ground),
      orelhoes,
      followCamera,
    };
  }

  function endMatch(): void {
    if (match === null) {
      throw new Error('endMatch sem cena de partida montada');
    }
    scene.remove(match.root);
    disposeHierarchy(match.root);
    match.damage.dispose();
    match.orelhoes.dispose();
    match = null;
    // Conferência do risco "vazamento de GPU" (TECH): deve voltar ao pós-boot.
    console.log(
      `[render] endMatch — renderer.info.memory: geometries=${renderer.info.memory.geometries} ` +
        `textures=${renderer.info.memory.textures}`,
    );
  }

  return {
    beginMatch,
    endMatch,
    draw(world: World, alpha: number, frameDt: number): void {
      if (match === null) {
        throw new Error('draw sem cena de partida — beginMatch não foi chamado');
      }
      // O pulo agora é estado da SIM (player.jumpOffset): o playerView já o
      // soma à altura do chão; o render não tem física própria.
      match.player.update(world, alpha, frameDt);
      match.enemies.update(world, alpha);
      match.orbs.update(world, alpha);
      match.cards?.update(world, alpha, frameDt);
      match.followCamera.update(
        match.player.group.position.x,
        // Altura do CHÃO sob o player (sem o pulo: a câmera não quica junto).
        match.ground(match.player.group.position.x, match.player.group.position.z),
        match.player.group.position.z,
        options.cameraLook.yaw,
        options.cameraLook.pitch,
        frameDt,
      );
      // O céu segue a câmera no plano: o domo (raio 150 < far 400) envolve a
      // vista em qualquer canto do mapa, de qualquer tamanho de arena.
      match.sky.position.set(camera.position.x, 0, camera.position.z);
      match.damage.update(world, camera, options.showDamageNumbers());
      match.orelhoes.update(world, camera);
      renderer.render(scene, camera);
    },
    dispose(): void {
      if (match !== null) endMatch();
      window.removeEventListener('resize', applySize);
      renderer.dispose();
    },
  };
}

/**
 * Cenário por id de mapa (mesmo padrão do createEnemyTypeModel: mapa novo =
 * ramo novo aqui; mapa jogável sem cenário é erro claro no boot, nunca rua
 * de cidade silenciosa no lugar errado).
 */
function createMapArena(mapId: string, halfSize: number, ground: GroundHeightFn): THREE.Group {
  switch (mapId) {
    case 'cidade':
      return createArena(halfSize);
    case 'feira':
      return createFeiraArena(halfSize);
    case 'rio':
      return createRioArena(halfSize, ground);
    default:
      throw new Error(`mapa sem cenário: ${mapId}`);
  }
}

/**
 * Libera geometria, materiais e texturas de toda a hierarquia da partida.
 * dispose() em three é idempotente: recursos compartilhados entre meshes
 * (materiais da capivara, fachadas dos prédios) podem ser liberados mais de
 * uma vez sem efeito colateral.
 */
function disposeHierarchy(root: THREE.Object3D): void {
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry.dispose();
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) {
      const map = (material as THREE.MeshLambertMaterial).map;
      if (map !== null && map !== undefined) map.dispose();
      material.dispose();
    }
    // InstancedMesh guarda buffers próprios (instanceMatrix) fora da geometria.
    if ((mesh as unknown as THREE.InstancedMesh).isInstancedMesh) {
      (mesh as unknown as THREE.InstancedMesh).dispose();
    }
  });
}
