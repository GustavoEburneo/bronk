import * as THREE from 'three';
import { makeRng } from './jankTextures';

/**
 * Céu por mapa (2026-11-23): domo de gradiente + sol (ou lua) + nuvens de
 * caixa tortas, tudo MeshBasicMaterial SEM FOG — o céu é o "infinito"; a
 * névoa só apaga o chão e o cenário. A cor do HORIZONTE do domo é a mesma
 * que o renderer põe na névoa e no background: o cenário some fundindo no
 * céu, nunca contra uma cor estranha.
 *
 * O domo NÃO acompanha o tamanho do mapa: ele SEGUE A CÂMERA no plano XZ
 * (renderer.draw reposiciona o grupo todo frame) — raio fixo bem menor que o
 * far da câmera (200) em qualquer canto de qualquer arena. depthWrite off +
 * renderOrder negativo: o céu pinta primeiro e nunca tampa o mundo.
 */

export interface SkyDef {
  /** Cor do zênite (topo do domo). */
  top: number;
  /** Cor do horizonte — o renderer usa a MESMA na névoa e no background. */
  horizon: number;
  /** Cor do disco do sol (ou da lua). */
  sun: number;
  /** Direção do sol vista do jogador (normalizada no createSky). */
  sunDirection: [number, number, number];
  /** Raio do disco do sol (a lua da cidade é menor que o sol da praia). */
  sunRadius: number;
  /** Cor das nuvens (entardecer = nuvem rosada; noite = nuvem escura). */
  cloud: number;
}

/**
 * Céu por id de mapa (mesmo padrão do groundHeightForMap: mapa novo = ramo
 * novo; sem ramo, vale o anoitecer genérico — o visual antigo do jogo).
 */
export function skyForMap(mapId: string): SkyDef {
  switch (mapId) {
    case 'rio':
      // Dia de praia: azul forte no alto, esbranquiçado no horizonte.
      return {
        top: 0x2f6fd0,
        horizon: 0xbcd8e6,
        sun: 0xfff3c0,
        sunDirection: [0.5, 0.75, 0.3],
        sunRadius: 14,
        cloud: 0xf5f2e8,
      };
    case 'feira':
      // Manhã de domingo: azul mais lavado.
      return {
        top: 0x4a86c8,
        horizon: 0xd3e2e6,
        sun: 0xfff0b8,
        sunDirection: [-0.45, 0.6, 0.45],
        sunRadius: 12,
        cloud: 0xf2eee2,
      };
    case 'cidade':
      // Entardecer de obra: roxo no alto caindo para laranja no horizonte.
      return {
        top: 0x2c2650,
        horizon: 0xc9754a,
        sun: 0xffb36b,
        sunDirection: [-0.7, 0.22, -0.4],
        sunRadius: 16,
        cloud: 0xa06a78,
      };
    default:
      // Anoitecer genérico: perto do fundo escuro que o jogo sempre teve.
      return {
        top: 0x14121a,
        horizon: 0x3a3448,
        sun: 0xe8e4da,
        sunDirection: [0.4, 0.6, -0.5],
        sunRadius: 8,
        cloud: 0x4a4458,
      };
  }
}

/** Raio do domo: > névoa (70), < far da câmera (200) com folga para o snap. */
const SKY_RADIUS = 150;

/** Gradiente vertical topo→horizonte (o hemisfério de baixo fica no horizonte). */
function createGradientTexture(top: number, horizon: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('não foi possível criar o contexto 2d do céu');
  const gradient = context.createLinearGradient(0, 0, 0, 128);
  gradient.addColorStop(0, `#${top.toString(16).padStart(6, '0')}`);
  gradient.addColorStop(0.52, `#${horizon.toString(16).padStart(6, '0')}`);
  gradient.addColorStop(1, `#${horizon.toString(16).padStart(6, '0')}`);
  context.fillStyle = gradient;
  context.fillRect(0, 0, 4, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  // Linear (não Nearest): degrau de cor no céu leria como bug, não como tosco.
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

export function createSky(def: SkyDef): THREE.Group {
  const group = new THREE.Group();
  // O céu ignora a névoa e não escreve profundidade: pinta primeiro
  // (renderOrder negativo) e todo o resto desenha por cima.
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(SKY_RADIUS, 16, 12),
    new THREE.MeshBasicMaterial({
      map: createGradientTexture(def.top, def.horizon),
      side: THREE.BackSide,
      fog: false,
      depthWrite: false,
    }),
  );
  dome.renderOrder = -3;
  group.add(dome);

  // Sol/lua: disco chapado colado por dentro do domo, olhando para o centro.
  const sunDirection = new THREE.Vector3(...def.sunDirection).normalize();
  const sun = new THREE.Mesh(
    new THREE.CircleGeometry(def.sunRadius, 10),
    new THREE.MeshBasicMaterial({ color: def.sun, fog: false, depthWrite: false }),
  );
  sun.position.copy(sunDirection).multiplyScalar(SKY_RADIUS * 0.94);
  sun.lookAt(0, 0, 0);
  sun.renderOrder = -2;
  group.add(sun);

  // Nuvens: pranchas de caixa tortas (o tosco da casa), coladas no domo.
  const cloudMaterial = new THREE.MeshBasicMaterial({
    color: def.cloud,
    fog: false,
    depthWrite: false,
  });
  const rnd = makeRng(1808);
  for (let i = 0; i < 7; i++) {
    const cloud = new THREE.Group();
    const parts = 2 + Math.floor(rnd() * 2);
    for (let p = 0; p < parts; p++) {
      const puff = new THREE.Mesh(
        new THREE.BoxGeometry(10 + rnd() * 12, 1.6 + rnd() * 1.4, 5 + rnd() * 5),
        cloudMaterial,
      );
      puff.position.set((rnd() - 0.5) * 14, (rnd() - 0.5) * 2, (rnd() - 0.5) * 6);
      puff.renderOrder = -1;
      cloud.add(puff);
    }
    const angle = rnd() * Math.PI * 2;
    const elevation = 0.25 + rnd() * 0.45; // nunca no zênite nem raspando o chão
    const horizontal = Math.cos(elevation) * SKY_RADIUS * 0.85;
    cloud.position.set(
      Math.cos(angle) * horizontal,
      Math.sin(elevation) * SKY_RADIUS * 0.85,
      Math.sin(angle) * horizontal,
    );
    cloud.rotation.y = rnd() * Math.PI;
    cloud.rotation.z = (rnd() - 0.5) * 0.12;
    group.add(cloud);
  }

  return group;
}
