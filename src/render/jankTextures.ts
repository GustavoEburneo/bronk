import * as THREE from 'three';

/**
 * Texturas "desenhadas mal" de propósito, em canvas minúsculo — o estilo do
 * jogo é o tosco assumido (ver docs/DECISIONS.md): traço torto, cores chapadas,
 * NearestFilter sem mipmap. Tudo determinístico: o visual não muda entre
 * recarregamentos.
 */

/** RNG próprio (LCG) para o desenho das texturas: fora da sim, mas estável. */
export function makeRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function makeCanvas(width: number, height: number): CanvasRenderingContext2D {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('não foi possível criar o contexto 2d de textura');
  return context;
}

// Definida pelo renderer antes de as texturas serem criadas: a anisotropia é
// o que mantém chão/faixas nítidos em ângulo rasante mesmo com mipmaps.
let textureAnisotropy = 1;

export function setCrudeTextureAnisotropy(value: number): void {
  textureAnisotropy = Math.max(1, value);
}

function toCrudeTexture(context: CanvasRenderingContext2D): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(context.canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  // Linear na magnificação (passe gráfico 2026-11-24, era Nearest): o traço
  // torto continua, mas sem o degrau de pixel de perto. Na minificação,
  // mipmap linear + anisotropia: sem mipmap a textura "ferve" ao longe; sem
  // anisotropia ela borra em ângulo rasante.
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = textureAnisotropy;
  return texture;
}

/** Asfalto com manchas, rachaduras e um chiclete. Tile pensado para 4×4 un. */
export function createAsphaltTexture(): THREE.CanvasTexture {
  const ctx = makeCanvas(64, 64);
  const rnd = makeRng(101);

  ctx.fillStyle = '#3b3b41';
  ctx.fillRect(0, 0, 64, 64);

  for (let i = 0; i < 26; i++) {
    ctx.fillStyle = rnd() > 0.5 ? '#36363c' : '#404048';
    ctx.fillRect(rnd() * 64, rnd() * 64, 2 + rnd() * 6, 2 + rnd() * 5);
  }

  ctx.strokeStyle = '#2c2c31';
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    let x = rnd() * 64;
    let y = rnd() * 64;
    ctx.moveTo(x, y);
    for (let s = 0; s < 4; s++) {
      x += (rnd() - 0.5) * 18;
      y += (rnd() - 0.5) * 18;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  ctx.fillStyle = '#4d4450';
  ctx.beginPath();
  ctx.arc(14, 46, 2.2, 0, Math.PI * 2);
  ctx.fill();

  return toCrudeTexture(ctx);
}

/** Faixa amarela de rua pintada sem capricho: cada traço sai do lugar. */
export function createRoadLineTexture(): THREE.CanvasTexture {
  const ctx = makeCanvas(8, 64);
  const rnd = makeRng(7);

  ctx.fillStyle = '#e7c53b';
  for (let y = 4; y < 60; y += 16) {
    ctx.fillRect(2 + (rnd() - 0.5) * 4, y + (rnd() - 0.5) * 3, 3 + rnd() * 2, 9 + rnd() * 3);
  }

  return toCrudeTexture(ctx);
}

/** Guia zebrada amarelo/preto com listras tortas (borda da arena). */
export function createCurbTexture(): THREE.CanvasTexture {
  const ctx = makeCanvas(32, 16);
  const rnd = makeRng(33);

  ctx.fillStyle = '#d9b23c';
  ctx.fillRect(0, 0, 32, 16);

  ctx.fillStyle = '#1c1a20';
  for (let x = -8; x < 32; x += 12) {
    const lean = 4 + rnd() * 4;
    ctx.beginPath();
    ctx.moveTo(x, 16);
    ctx.lineTo(x + lean, 0);
    ctx.lineTo(x + lean + 5, 0);
    ctx.lineTo(x + 5, 16);
    ctx.closePath();
    ctx.fill();
  }

  return toCrudeTexture(ctx);
}

/** Pelo de capivara: base marrom com rabiscos curtos (riscos de caneta). */
export function createFurTexture(): THREE.CanvasTexture {
  const ctx = makeCanvas(64, 64);
  const rnd = makeRng(55);

  ctx.fillStyle = '#8a5a3b';
  ctx.fillRect(0, 0, 64, 64);

  ctx.lineWidth = 1;
  for (let i = 0; i < 90; i++) {
    ctx.strokeStyle = rnd() > 0.35 ? '#6e4630' : '#9d6c49';
    const x = rnd() * 64;
    const y = rnd() * 64;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (rnd() - 0.5) * 6, y + 2 + rnd() * 5);
    ctx.stroke();
  }

  return toCrudeTexture(ctx);
}

/** Cone de trânsito: laranja com faixas "refletivas" tortas e sujeira na base. */
export function createConeTexture(): THREE.CanvasTexture {
  const ctx = makeCanvas(64, 64);
  const rnd = makeRng(77);

  ctx.fillStyle = '#ff5a1f';
  ctx.fillRect(0, 0, 64, 64);

  ctx.fillStyle = '#f2ede2';
  for (const band of [
    { y: 18, h: 9 },
    { y: 36, h: 7 },
  ]) {
    for (let x = 0; x < 64; x += 4) {
      ctx.fillRect(x, band.y + (rnd() - 0.5) * 4, 4, band.h);
    }
  }

  ctx.fillStyle = 'rgba(40, 36, 34, 0.5)';
  for (let i = 0; i < 10; i++) {
    ctx.fillRect(rnd() * 64, 52 + rnd() * 10, 3 + rnd() * 5, 2 + rnd() * 3);
  }

  return toCrudeTexture(ctx);
}

/**
 * Envelope mal desenhado (carta do carteiro): papel amarelado, borda tracejada
 * torta, selo quadrado, linhas de "endereço" rabiscadas e o V da aba atrás.
 */
export function createEnvelopeTexture(): THREE.CanvasTexture {
  const ctx = makeCanvas(64, 48);
  const rnd = makeRng(2211);

  ctx.fillStyle = '#f3ead1';
  ctx.fillRect(0, 0, 64, 48);

  // Borda "aérea" tracejada vermelha/azul, cada traço fora do lugar.
  for (let x = 2; x < 62; x += 7) {
    ctx.fillStyle = (x / 7) % 2 === 0 ? '#cf3f36' : '#3a5ba8';
    ctx.fillRect(x + (rnd() - 0.5) * 2, 1 + (rnd() - 0.5) * 2, 4, 3);
    ctx.fillRect(x + (rnd() - 0.5) * 2, 44 + (rnd() - 0.5) * 2, 4, 3);
  }

  // Aba do envelope: V torto.
  ctx.strokeStyle = '#c9b98f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(3, 6);
  ctx.lineTo(33 + (rnd() - 0.5) * 6, 26 + (rnd() - 0.5) * 4);
  ctx.lineTo(61, 6);
  ctx.stroke();

  // Selo colado torto no canto, com rabisco dentro.
  ctx.save();
  ctx.translate(50, 12);
  ctx.rotate(0.12);
  ctx.fillStyle = '#d9842e';
  ctx.fillRect(-6, -6, 12, 12);
  ctx.strokeStyle = '#fff3b0';
  ctx.lineWidth = 1;
  ctx.strokeRect(-4.5, -4.5, 9, 9);
  ctx.restore();

  // Linhas de endereço: riscos que não dizem nada.
  ctx.strokeStyle = '#4a4238';
  ctx.lineWidth = 1;
  for (let line = 0; line < 3; line++) {
    const y = 28 + line * 5 + (rnd() - 0.5) * 2;
    ctx.beginPath();
    ctx.moveTo(8, y);
    ctx.lineTo(8 + 20 + rnd() * 18, y + (rnd() - 0.5) * 2);
    ctx.stroke();
  }

  return toCrudeTexture(ctx);
}

/**
 * Uniforme do carteiro: camisa azul desbotada com bolso torto, botões
 * desalinhados e costuras rabiscadas.
 */
export function createMailUniformTexture(): THREE.CanvasTexture {
  const ctx = makeCanvas(64, 64);
  const rnd = makeRng(1337);

  ctx.fillStyle = '#3f6d9e';
  ctx.fillRect(0, 0, 64, 64);

  // Desbotado: manchas mais claras/escuras.
  for (let i = 0; i < 22; i++) {
    ctx.fillStyle = rnd() > 0.5 ? '#3a6592' : '#4677ab';
    ctx.fillRect(rnd() * 64, rnd() * 64, 3 + rnd() * 7, 3 + rnd() * 6);
  }

  // Bolso torto com lapela.
  ctx.strokeStyle = '#2c4e73';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 24, 18, 16);
  ctx.beginPath();
  ctx.moveTo(10, 29);
  ctx.lineTo(28, 31);
  ctx.stroke();

  // Botões desalinhados descendo o meio.
  ctx.fillStyle = '#e8e4da';
  for (let y = 8; y < 60; y += 12) {
    ctx.beginPath();
    ctx.arc(42 + (rnd() - 0.5) * 5, y + (rnd() - 0.5) * 3, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  return toCrudeTexture(ctx);
}

/**
 * Avental do churrasqueiro: pano claro encardido sobre camisa vermelha
 * desbotada, com manchas de gordura/molho, bolso torto e um espetinho
 * rabiscado de caneta.
 */
export function createApronTexture(): THREE.CanvasTexture {
  const ctx = makeCanvas(64, 64);
  const rnd = makeRng(4242);

  // Camisa vermelha desbotada por trás do avental.
  ctx.fillStyle = '#a8392c';
  ctx.fillRect(0, 0, 64, 64);
  for (let i = 0; i < 14; i++) {
    ctx.fillStyle = rnd() > 0.5 ? '#9c3328' : '#b24234';
    ctx.fillRect(rnd() * 64, rnd() * 64, 3 + rnd() * 6, 3 + rnd() * 5);
  }

  // Avental claro, torto de propósito.
  ctx.fillStyle = '#e8e0cc';
  ctx.beginPath();
  ctx.moveTo(15, 4);
  ctx.lineTo(50, 6);
  ctx.lineTo(53, 62);
  ctx.lineTo(11, 60);
  ctx.closePath();
  ctx.fill();

  // Manchas de gordura e de molho.
  for (let i = 0; i < 9; i++) {
    ctx.fillStyle = rnd() > 0.5 ? 'rgba(122, 90, 44, 0.55)' : 'rgba(150, 52, 38, 0.5)';
    ctx.beginPath();
    ctx.arc(16 + rnd() * 34, 10 + rnd() * 34, 2 + rnd() * 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Espetinho rabiscado: vareta inclinada com três naquinhos.
  ctx.strokeStyle = '#5a4632';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(22, 40);
  ctx.lineTo(42, 16);
  ctx.stroke();
  ctx.fillStyle = '#8a4a2e';
  for (const t of [0.3, 0.55, 0.8]) {
    ctx.beginPath();
    ctx.arc(22 + 20 * t, 40 - 24 * t, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bolso costurado fora do esquadro.
  ctx.strokeStyle = '#b8ae92';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 47, 15, 11);
  ctx.beginPath();
  ctx.moveTo(20, 50);
  ctx.lineTo(35, 49);
  ctx.stroke();

  return toCrudeTexture(ctx);
}

/**
 * Fumaça de churrasco: cinza encardido com blobs mais claros e mais escuros,
 * como nuvem rabiscada de giz — vai nos tufos da nuvem do churrasqueiro.
 */
export function createSmokeTexture(): THREE.CanvasTexture {
  const ctx = makeCanvas(32, 32);
  const rnd = makeRng(606);

  ctx.fillStyle = '#9b958e';
  ctx.fillRect(0, 0, 32, 32);

  for (let i = 0; i < 18; i++) {
    ctx.fillStyle = rnd() > 0.5 ? '#aba49b' : '#847e77';
    ctx.beginPath();
    ctx.arc(rnd() * 32, rnd() * 32, 2 + rnd() * 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Riscos de "cheirinho de churrasco" subindo.
  ctx.strokeStyle = '#b8b2a8';
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    const x = 4 + rnd() * 24;
    const y = 8 + rnd() * 18;
    ctx.beginPath();
    ctx.moveTo(x, y + 5);
    ctx.quadraticCurveTo(x + 3, y + 2, x, y);
    ctx.stroke();
  }

  return toCrudeTexture(ctx);
}

/**
 * Pelagem de rato de entulho: cinza-poeira com riscos curtos de pelo sujo e
 * remendos mais escuros — o bicho mora no caliça.
 */
export function createRubbleFurTexture(): THREE.CanvasTexture {
  const ctx = makeCanvas(64, 64);
  const rnd = makeRng(1913);

  ctx.fillStyle = '#8d8a84';
  ctx.fillRect(0, 0, 64, 64);

  // Remendos de poeira/entulho.
  for (let i = 0; i < 16; i++) {
    ctx.fillStyle = rnd() > 0.5 ? '#817e78' : '#99958e';
    ctx.fillRect(rnd() * 64, rnd() * 64, 3 + rnd() * 7, 3 + rnd() * 6);
  }

  // Riscos de pelo, tortos como riscos de caneta (padrão da fur da capivara).
  ctx.lineWidth = 1;
  for (let i = 0; i < 70; i++) {
    ctx.strokeStyle = rnd() > 0.4 ? '#6f6c66' : '#a6a29a';
    const x = rnd() * 64;
    const y = rnd() * 64;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (rnd() - 0.5) * 6, y + 2 + rnd() * 5);
    ctx.stroke();
  }

  return toCrudeTexture(ctx);
}

/**
 * Carcaça de britadeira de obra: amarelo industrial com listras pretas tortas
 * (zebrado de advertência pintado sem capricho), arranhões e parafusos.
 */
export function createHazardTexture(): THREE.CanvasTexture {
  const ctx = makeCanvas(64, 64);
  const rnd = makeRng(515);

  ctx.fillStyle = '#e8b63a';
  ctx.fillRect(0, 0, 64, 64);

  // Manchas de amarelo desbotado/encardido.
  for (let i = 0; i < 12; i++) {
    ctx.fillStyle = rnd() > 0.5 ? '#ddab31' : '#f0c04a';
    ctx.fillRect(rnd() * 64, rnd() * 64, 4 + rnd() * 8, 3 + rnd() * 6);
  }

  // Faixa zebrada diagonal no meio, cada listra fora do esquadro.
  ctx.fillStyle = '#1c1a20';
  for (let x = -16; x < 72; x += 14) {
    const lean = 6 + rnd() * 5;
    ctx.beginPath();
    ctx.moveTo(x, 44);
    ctx.lineTo(x + lean, 20);
    ctx.lineTo(x + lean + 6, 20);
    ctx.lineTo(x + 6, 44);
    ctx.closePath();
    ctx.fill();
  }

  // Arranhões de obra e dois parafusos tortos.
  ctx.strokeStyle = '#8a6f24';
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const x = rnd() * 64;
    const y = rnd() * 64;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (rnd() - 0.5) * 14, y + (rnd() - 0.5) * 10);
    ctx.stroke();
  }
  ctx.fillStyle = '#6e6861';
  for (const [x, y] of [
    [8, 8],
    [54, 56],
  ] as const) {
    ctx.beginPath();
    ctx.arc(x + (rnd() - 0.5) * 3, y + (rnd() - 0.5) * 3, 2.4, 0, Math.PI * 2);
    ctx.fill();
  }

  return toCrudeTexture(ctx);
}

/**
 * Pena de pombo urbano: cinza-chumbo com rabiscos de pena e a mancha
 * "furta-cor" verde/roxa do pescoço desenhada sem o menor capricho.
 */
export function createPigeonTexture(): THREE.CanvasTexture {
  const ctx = makeCanvas(64, 64);
  const rnd = makeRng(737);

  ctx.fillStyle = '#9da2a8';
  ctx.fillRect(0, 0, 64, 64);

  // Penas rabiscadas: arcos curtos tortos.
  ctx.lineWidth = 1;
  for (let i = 0; i < 46; i++) {
    ctx.strokeStyle = rnd() > 0.45 ? '#83888f' : '#b3b8bd';
    const x = rnd() * 64;
    const y = rnd() * 64;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 3, y + 3 + rnd() * 3, x + 6 + rnd() * 3, y + 2);
    ctx.stroke();
  }

  // Mancha furta-cor do pescoço: blobs verde e roxo, mal colocados.
  for (let i = 0; i < 7; i++) {
    ctx.fillStyle = rnd() > 0.5 ? 'rgba(74, 134, 94, 0.55)' : 'rgba(116, 82, 136, 0.5)';
    ctx.beginPath();
    ctx.arc(18 + rnd() * 16, 12 + rnd() * 14, 2 + rnd() * 4, 0, Math.PI * 2);
    ctx.fill();
  }

  return toCrudeTexture(ctx);
}

/**
 * Terra batida de feira: marrom pisoteado com manchas, riscos de vassoura e
 * restos de feira (folha de couve, casca de fruta). Tile pensado para 4×4 un,
 * como o asfalto.
 */
export function createDirtGroundTexture(): THREE.CanvasTexture {
  const ctx = makeCanvas(64, 64);
  const rnd = makeRng(1119);

  ctx.fillStyle = '#8a6a44';
  ctx.fillRect(0, 0, 64, 64);

  // Manchas de terra mais seca/mais úmida.
  for (let i = 0; i < 24; i++) {
    ctx.fillStyle = rnd() > 0.5 ? '#7e5f3c' : '#96754d';
    ctx.fillRect(rnd() * 64, rnd() * 64, 3 + rnd() * 7, 2 + rnd() * 6);
  }

  // Riscos de vassoura/pisoteio: traços curtos meio paralelos.
  ctx.strokeStyle = '#6f5334';
  ctx.lineWidth = 1;
  for (let i = 0; i < 14; i++) {
    const x = rnd() * 64;
    const y = rnd() * 64;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 6 + rnd() * 8, y + (rnd() - 0.5) * 4);
    ctx.stroke();
  }

  // Restos de feira: uma folha de couve e uma casca de banana pisadas.
  ctx.fillStyle = 'rgba(90, 128, 62, 0.7)';
  ctx.beginPath();
  ctx.arc(46, 18, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(214, 177, 62, 0.7)';
  ctx.fillRect(12, 50, 7, 3);

  return toCrudeTexture(ctx);
}

const AWNING_PALETTE = ['#cf3f36', '#3a5ba8', '#d9a62e', '#4e8a52'];

export const AWNING_VARIANTS = AWNING_PALETTE.length;

/**
 * Lona de barraca de feira: listras verticais cor/branco pintadas sem
 * capricho (cada listra sai do prumo), com encardido de poeira na barra.
 */
export function createAwningTexture(variant: number): THREE.CanvasTexture {
  const ctx = makeCanvas(64, 48);
  const rnd = makeRng(2026 + variant * 31);

  ctx.fillStyle = '#efe8d8';
  ctx.fillRect(0, 0, 64, 48);

  ctx.fillStyle = AWNING_PALETTE[variant % AWNING_PALETTE.length]!;
  for (let x = 0; x < 64; x += 16) {
    const lean = (rnd() - 0.5) * 5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 8, 0);
    ctx.lineTo(x + 8 + lean, 48);
    ctx.lineTo(x + lean, 48);
    ctx.closePath();
    ctx.fill();
  }

  // Barra encardida de poeira da rua.
  ctx.fillStyle = 'rgba(70, 58, 40, 0.3)';
  for (let i = 0; i < 8; i++) {
    ctx.fillRect(rnd() * 64, 40 + rnd() * 8, 4 + rnd() * 7, 2 + rnd() * 3);
  }

  return toCrudeTexture(ctx);
}

/**
 * Caixote de feira: tábuas de madeira tortas com frestas escuras e nós —
 * vira a mureta da borda da arena da feira.
 */
export function createCrateTexture(): THREE.CanvasTexture {
  const ctx = makeCanvas(32, 16);
  const rnd = makeRng(808);

  ctx.fillStyle = '#b08954';
  ctx.fillRect(0, 0, 32, 16);

  // Tábuas horizontais com frestas tortas.
  ctx.strokeStyle = '#6e5231';
  ctx.lineWidth = 1;
  for (const y of [5, 11]) {
    ctx.beginPath();
    ctx.moveTo(0, y + (rnd() - 0.5) * 2);
    ctx.lineTo(32, y + (rnd() - 0.5) * 2);
    ctx.stroke();
  }
  // Ripas verticais das pontas e um nó de madeira.
  ctx.fillStyle = '#9a7646';
  ctx.fillRect(1, 0, 3, 16);
  ctx.fillRect(28, 0, 3, 16);
  ctx.fillStyle = '#5c431f';
  ctx.beginPath();
  ctx.arc(14 + rnd() * 6, 6 + rnd() * 5, 1.4, 0, Math.PI * 2);
  ctx.fill();

  return toCrudeTexture(ctx);
}

/**
 * Pena de galinha de quintal: branco encardido com riscos de pena e respingos
 * de terra do ciscado — mesma receita da fur da capivara, em clave clara.
 */
export function createChickenTexture(): THREE.CanvasTexture {
  const ctx = makeCanvas(64, 64);
  const rnd = makeRng(1717);

  ctx.fillStyle = '#ece6d6';
  ctx.fillRect(0, 0, 64, 64);

  ctx.lineWidth = 1;
  for (let i = 0; i < 60; i++) {
    ctx.strokeStyle = rnd() > 0.4 ? '#d3ccb8' : '#f8f4e8';
    const x = rnd() * 64;
    const y = rnd() * 64;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 2, y + 3, x + 5 + rnd() * 3, y + 2);
    ctx.stroke();
  }

  // Respingos de terra do ciscado.
  ctx.fillStyle = 'rgba(122, 94, 58, 0.45)';
  for (let i = 0; i < 6; i++) {
    ctx.fillRect(rnd() * 64, 44 + rnd() * 18, 2 + rnd() * 4, 2 + rnd() * 3);
  }

  return toCrudeTexture(ctx);
}

/**
 * Casca de abacaxi: amarelo-queimado com a grade de losangos riscada torta e
 * um "olho" escuro dentro de cada losango.
 */
export function createPineappleTexture(): THREE.CanvasTexture {
  const ctx = makeCanvas(64, 64);
  const rnd = makeRng(4545);

  ctx.fillStyle = '#d9a62e';
  ctx.fillRect(0, 0, 64, 64);

  // Manchas de maturação desigual.
  for (let i = 0; i < 12; i++) {
    ctx.fillStyle = rnd() > 0.5 ? '#c9981f' : '#e5b545';
    ctx.fillRect(rnd() * 64, rnd() * 64, 4 + rnd() * 8, 3 + rnd() * 6);
  }

  // Grade de losangos: diagonais nos dois sentidos, cada uma fora do prumo.
  ctx.strokeStyle = '#8a6a18';
  ctx.lineWidth = 2;
  for (let d = -64; d < 128; d += 16) {
    const wob = (rnd() - 0.5) * 5;
    ctx.beginPath();
    ctx.moveTo(d + wob, 0);
    ctx.lineTo(d + 64 + wob, 64);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(d + 64 + wob, 0);
    ctx.lineTo(d + wob, 64);
    ctx.stroke();
  }

  // "Olhos" do abacaxi: um pontinho escuro por célula, mal centrado.
  ctx.fillStyle = '#7a5a10';
  for (let y = 8; y < 64; y += 16) {
    for (let x = 8; x < 64; x += 16) {
      ctx.beginPath();
      ctx.arc(x + (rnd() - 0.5) * 6, y + (rnd() - 0.5) * 6, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return toCrudeTexture(ctx);
}

/**
 * Pena de maritaca: verde-bandeira rabiscado (mesma receita da pena do pombo,
 * em clave verde) com blobs amarelos da barriga mal posicionados.
 */
export function createMaritacaTexture(): THREE.CanvasTexture {
  const ctx = makeCanvas(64, 64);
  const rnd = makeRng(9393);

  ctx.fillStyle = '#4e9a44';
  ctx.fillRect(0, 0, 64, 64);

  // Penas rabiscadas: arcos curtos tortos (padrão do pombo).
  ctx.lineWidth = 1;
  for (let i = 0; i < 46; i++) {
    ctx.strokeStyle = rnd() > 0.45 ? '#3d7f35' : '#66b25a';
    const x = rnd() * 64;
    const y = rnd() * 64;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 3, y + 3 + rnd() * 3, x + 6 + rnd() * 3, y + 2);
    ctx.stroke();
  }

  // Barriga amarelada: blobs mal colocados.
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = rnd() > 0.5 ? 'rgba(214, 196, 74, 0.5)' : 'rgba(170, 190, 70, 0.5)';
    ctx.beginPath();
    ctx.arc(20 + rnd() * 20, 34 + rnd() * 20, 2 + rnd() * 4, 0, Math.PI * 2);
    ctx.fill();
  }

  return toCrudeTexture(ctx);
}

/**
 * Grade de carrinho de feira: metal encardido com a malha de arame riscada
 * torta — vai na cesta do Carrinho Desembestado.
 */
export function createCartGridTexture(): THREE.CanvasTexture {
  const ctx = makeCanvas(64, 64);
  const rnd = makeRng(3131);

  ctx.fillStyle = '#9aa0a6';
  ctx.fillRect(0, 0, 64, 64);

  // Manchas de ferrugem e encardido.
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = rnd() > 0.5 ? 'rgba(140, 94, 52, 0.5)' : 'rgba(110, 116, 122, 0.6)';
    ctx.fillRect(rnd() * 64, rnd() * 64, 3 + rnd() * 7, 3 + rnd() * 6);
  }

  // Malha de arame: grade com cada fio fora do prumo.
  ctx.strokeStyle = '#5f646a';
  ctx.lineWidth = 2;
  for (let p = 4; p < 64; p += 12) {
    const wob = (rnd() - 0.5) * 4;
    ctx.beginPath();
    ctx.moveTo(p + wob, 0);
    ctx.lineTo(p - wob, 64);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, p + wob);
    ctx.lineTo(64, p - wob);
    ctx.stroke();
  }

  return toCrudeTexture(ctx);
}

const BUILDING_PALETTE = ['#4f7ca8', '#d9b23c', '#c97b8e', '#6a9a6d'];

export const BUILDING_VARIANTS = BUILDING_PALETTE.length;

/** Fachada de prédio: janelas desalinhadas (algumas acesas) e porta fora do eixo. */
export function createBuildingTexture(variant: number): THREE.CanvasTexture {
  const ctx = makeCanvas(48, 64);
  const rnd = makeRng(900 + variant * 17);

  ctx.fillStyle = BUILDING_PALETTE[variant % BUILDING_PALETTE.length]!;
  ctx.fillRect(0, 0, 48, 64);

  // Platibanda torta.
  ctx.fillStyle = 'rgba(20, 18, 24, 0.35)';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(48, 0);
  ctx.lineTo(48, 5 + rnd() * 3);
  ctx.lineTo(0, 3 + rnd() * 3);
  ctx.closePath();
  ctx.fill();

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      ctx.fillStyle = rnd() > 0.72 ? '#ffd96b' : '#22242c';
      ctx.fillRect(
        6 + col * 14 + (rnd() - 0.5) * 4,
        11 + row * 12 + (rnd() - 0.5) * 3,
        7 + (rnd() - 0.5) * 2,
        6 + (rnd() - 0.5) * 2,
      );
    }
  }

  ctx.fillStyle = '#2b2430';
  ctx.fillRect(20 + (rnd() - 0.5) * 6, 56, 9, 8);

  return toCrudeTexture(ctx);
}

/**
 * Chão do Rio: grama de morro rala com terra aparecendo e trilhas pisoteadas.
 * Tile pensado para 4×4 un, como o asfalto e a terra batida.
 */
export function createMorroGroundTexture(): THREE.CanvasTexture {
  const ctx = makeCanvas(64, 64);
  const rnd = makeRng(2111);

  ctx.fillStyle = '#5a7a3e';
  ctx.fillRect(0, 0, 64, 64);

  // Manchas de grama mais seca/mais viva.
  for (let i = 0; i < 26; i++) {
    ctx.fillStyle = rnd() > 0.5 ? '#4e6c36' : '#6a8a48';
    ctx.fillRect(rnd() * 64, rnd() * 64, 3 + rnd() * 7, 2 + rnd() * 6);
  }

  // Terra aparecendo onde o morro foi mais pisado.
  for (let i = 0; i < 9; i++) {
    ctx.fillStyle = rnd() > 0.5 ? '#8a6a44' : '#7e5f3c';
    ctx.fillRect(rnd() * 64, rnd() * 64, 4 + rnd() * 8, 3 + rnd() * 5);
  }

  // Tufos de capim: tracinhos verticais tortos.
  ctx.strokeStyle = '#3f5c2c';
  ctx.lineWidth = 1;
  for (let i = 0; i < 16; i++) {
    const x = rnd() * 64;
    const y = rnd() * 64;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (rnd() - 0.5) * 3, y - 3 - rnd() * 3);
    ctx.stroke();
  }

  return toCrudeTexture(ctx);
}

/**
 * Calçadão de Copacabana: a onda de pedra portuguesa preto-e-branco, pintada
 * sem capricho (ondas fora de fase e grossura irregular). Repete no eixo X.
 */
export function createCalcadaoTexture(): THREE.CanvasTexture {
  const ctx = makeCanvas(64, 64);
  const rnd = makeRng(1565);

  ctx.fillStyle = '#e8e2d2';
  ctx.fillRect(0, 0, 64, 64);

  // Duas ondas pretas atravessando o tile (período = largura: o tile emenda).
  ctx.strokeStyle = '#2a2824';
  for (const phase of [10, 42]) {
    ctx.lineWidth = 9 + rnd() * 3;
    ctx.beginPath();
    for (let x = 0; x <= 64; x += 4) {
      const y = phase + Math.sin((x / 64) * Math.PI * 2) * 11;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Juntas das pedrinhas: pontilhado claro por cima de tudo.
  ctx.fillStyle = 'rgba(255, 252, 240, 0.25)';
  for (let i = 0; i < 70; i++) {
    ctx.fillRect(rnd() * 64, rnd() * 64, 1.5, 1.5);
  }

  return toCrudeTexture(ctx);
}

/** Areia de praia clara com conchinhas e pontinhos de sujeira de feriadão. */
export function createSandTexture(): THREE.CanvasTexture {
  const ctx = makeCanvas(64, 64);
  const rnd = makeRng(1904);

  ctx.fillStyle = '#d9c38c';
  ctx.fillRect(0, 0, 64, 64);

  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = rnd() > 0.5 ? '#cdb77f' : '#e4d09c';
    ctx.fillRect(rnd() * 64, rnd() * 64, 2 + rnd() * 6, 2 + rnd() * 4);
  }

  // Pontinhos: conchas, biscoito caído e marcas de pé.
  for (let i = 0; i < 24; i++) {
    ctx.fillStyle = rnd() > 0.7 ? '#f0e8d4' : '#b89f6a';
    ctx.fillRect(rnd() * 64, rnd() * 64, 1.5, 1.5);
  }

  return toCrudeTexture(ctx);
}

/**
 * Bola de futevôlei encardida: gomos amarelo/azul sobre branco sujo, costura
 * torta — mapeada numa esfera, as faixas viram os gomos.
 */
export function createFutevoleiTexture(): THREE.CanvasTexture {
  const ctx = makeCanvas(64, 32);
  const rnd = makeRng(2170);

  ctx.fillStyle = '#e8e0cc';
  ctx.fillRect(0, 0, 64, 32);

  // Gomos alternados (amarelo/azul), cada um saindo do prumo.
  const colors = ['#d9a62e', '#3a5ba8'];
  for (let i = 0; i < 4; i++) {
    const x = i * 16 + 4;
    const lean = (rnd() - 0.5) * 4;
    ctx.fillStyle = colors[i % 2]!;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 7, 0);
    ctx.lineTo(x + 7 + lean, 32);
    ctx.lineTo(x + lean, 32);
    ctx.closePath();
    ctx.fill();
  }

  // Costuras tortas e encardido de areia.
  ctx.strokeStyle = 'rgba(60, 50, 40, 0.5)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= 64; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x + (rnd() - 0.5) * 2, 0);
    ctx.lineTo(x + (rnd() - 0.5) * 3, 32);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(120, 100, 70, 0.3)';
  for (let i = 0; i < 10; i++) {
    ctx.fillRect(rnd() * 64, rnd() * 32, 3 + rnd() * 4, 2 + rnd() * 3);
  }

  return toCrudeTexture(ctx);
}

const FAVELA_PALETTE = ['#c05c4a', '#4e8a52', '#3a5ba8', '#d9a62e', '#b05a8a', '#50a8a0'];

export const FAVELA_VARIANTS = FAVELA_PALETTE.length;

/**
 * Casinha de morro: parede colorida com janelinha torta e marca de reboco —
 * o casario empilhado do Rio (variante = cor da parede).
 */
export function createFavelaTexture(variant: number): THREE.CanvasTexture {
  const ctx = makeCanvas(32, 32);
  const rnd = makeRng(1808 + variant * 47);

  ctx.fillStyle = FAVELA_PALETTE[variant % FAVELA_PALETTE.length]!;
  ctx.fillRect(0, 0, 32, 32);

  // Reboco faltando: manchas de tijolo/cimento cru.
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = rnd() > 0.5 ? 'rgba(146, 94, 66, 0.55)' : 'rgba(150, 150, 140, 0.45)';
    ctx.fillRect(rnd() * 32, rnd() * 32, 4 + rnd() * 7, 3 + rnd() * 5);
  }

  // Janelinha torta (escura) com batente branco caindo de um lado.
  const wx = 8 + rnd() * 12;
  const wy = 8 + rnd() * 10;
  ctx.fillStyle = '#f0ead8';
  ctx.fillRect(wx - 1.5, wy - 1.5, 11, 10);
  ctx.fillStyle = '#241f28';
  ctx.fillRect(wx + (rnd() - 0.5) * 2, wy, 8, 7);

  return toCrudeTexture(ctx);
}
