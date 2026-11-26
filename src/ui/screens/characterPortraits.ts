/**
 * Retratos dos personagens para a tela de seleção — ARTE PROVISÓRIA desenhada
 * por código (a polir pelo technical-artist), mesma receita do QR placeholder
 * e das jankTextures: zero assets, zero dependência. Pixel art tosca de
 * propósito num grid baixo, ampliada com image-rendering: pixelated no CSS.
 *
 * As cores espelham os materiais do playerView (render 3D): o retrato no
 * panfleto e o boneco em jogo são claramente o mesmo sujeito. A UI não importa
 * de `src/render` (fronteiras do TECH) — os hex são duplicados de propósito.
 *
 * Id desconhecido cai num rosto genérico "em obras": personagem novo na tabela
 * ganha retrato placeholder de graça até alguém desenhar o dele aqui.
 */

/** Lado do grid de pixels (o canvas interno é GRID×GRID; o CSS amplia). */
export const PORTRAIT_GRID = 24;

type Paint = (x: number, y: number, w: number, h: number, color: string) => void;

export function drawCharacterPortrait(canvas: HTMLCanvasElement, characterId: string): void {
  canvas.width = PORTRAIT_GRID;
  canvas.height = PORTRAIT_GRID;
  const context = canvas.getContext('2d');
  if (context === null) return; // sem 2d, fica o quadro em branco — é só enfeite

  const paint: Paint = (x, y, w, h, color) => {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
  };

  switch (characterId) {
    case 'capivara':
      drawCapivara(paint);
      return;
    case 'carteiro':
      drawCarteiro(paint);
      return;
    case 'churrasqueiro':
      drawChurrasqueiro(paint);
      return;
    default:
      drawUnknown(paint);
  }
}

/** Capivara: pelagem 0x4a3222 do playerView, olhos esbugalhados desiguais e
 * dentões — céu e gramado de fundo (ela vive na rua, como todo mundo aqui). */
function drawCapivara(paint: Paint): void {
  paint(0, 0, 24, 24, '#79b7d8'); // céu
  paint(0, 18, 24, 6, '#55803c'); // gramado
  // Orelhas tortas (alturas diferentes de propósito).
  paint(5, 3, 3, 3, '#4a3222');
  paint(16, 4, 3, 3, '#4a3222');
  paint(4, 5, 16, 13, '#4a3222'); // cabeçona desproporcional
  paint(8, 12, 8, 6, '#6b4a2e'); // focinho mais claro
  // Olhos esbugalhados desiguais: o esquerdo maior, pupilas fora de centro.
  paint(6, 7, 4, 4, '#f4f0e6');
  paint(8, 8, 2, 2, '#141414');
  paint(14, 8, 3, 3, '#f4f0e6');
  paint(15, 9, 1, 1, '#141414');
  // Narinas e dentões (um mais baixo que o outro).
  paint(10, 13, 1, 1, '#141414');
  paint(13, 13, 1, 1, '#141414');
  paint(10, 16, 2, 3, '#f4f0e6');
  paint(12, 17, 2, 3, '#f4f0e6');
}

/** Carteiro: pele 0xe0a46c e boné 0x2c4e73 do playerView, boné torto e uma
 * carta (das que voltam) espiando no canto. */
function drawCarteiro(paint: Paint): void {
  paint(0, 0, 24, 24, '#8aa7b8'); // cinza azulado de rua
  paint(0, 19, 24, 5, '#6e6a63'); // calçada
  paint(5, 7, 14, 12, '#e0a46c'); // cabeça
  // Boné torto: copa inclinada e aba só de um lado.
  paint(4, 3, 17, 4, '#2c4e73');
  paint(3, 6, 10, 2, '#24405e');
  // Olhos esbugalhados desiguais (o direito maior, marca da casa).
  paint(7, 10, 3, 3, '#f4f0e6');
  paint(8, 11, 1, 1, '#141414');
  paint(13, 9, 4, 4, '#f4f0e6');
  paint(15, 11, 2, 2, '#141414');
  // Sorriso torto de quem entrega no endereço errado.
  paint(9, 16, 5, 1, '#141414');
  paint(14, 15, 2, 1, '#141414');
  // A carta no canto, com filete vermelho de promoção.
  paint(15, 18, 7, 5, '#f4f0e6');
  paint(15, 18, 7, 1, '#e8231a');
  paint(16, 20, 5, 1, '#b9b9b9');
}

/** Churrasqueiro: pele 0xc98a58 e chapéu 0xece6d8 do playerView, bochechas de
 * baforada, bigodão e avental quadriculado — tudo no meio da fumaça. */
function drawChurrasqueiro(paint: Paint): void {
  paint(0, 0, 24, 24, '#9a9a9a'); // fumaça
  // Tufos mais claros de fumaça (os mesmos da nuvem em jogo, em espírito).
  paint(1, 2, 5, 3, '#b5b5b5');
  paint(17, 4, 6, 3, '#b5b5b5');
  paint(2, 15, 4, 3, '#b5b5b5');
  // Chapéu de cozinheiro torto: copa deslocada do aro.
  paint(7, 1, 11, 4, '#ece6d8');
  paint(5, 4, 13, 3, '#ece6d8');
  paint(6, 8, 12, 10, '#c98a58'); // cabeça
  // Bochechas estufadas de baforada (saltam para fora da cabeça).
  paint(4, 12, 2, 4, '#c98a58');
  paint(18, 12, 2, 4, '#c98a58');
  // Olhos espremidos de esforço.
  paint(8, 11, 3, 1, '#141414');
  paint(14, 11, 3, 1, '#141414');
  // Bigodão em dois blocos desalinhados.
  paint(7, 15, 5, 2, '#2a1c12');
  paint(12, 14, 5, 2, '#2a1c12');
  // Avental branco com xadrez vermelho aparecendo embaixo.
  paint(6, 18, 12, 6, '#f4f0e6');
  paint(7, 19, 2, 2, '#c23b2e');
  paint(11, 21, 2, 2, '#c23b2e');
  paint(15, 19, 2, 2, '#c23b2e');
}

/** Personagem sem retrato ainda: rosto genérico "em obras", papel desbotado. */
function drawUnknown(paint: Paint): void {
  paint(0, 0, 24, 24, '#cfcabc');
  paint(5, 5, 14, 14, '#9a9282'); // silhueta
  paint(8, 9, 3, 3, '#f4f0e6');
  paint(14, 9, 3, 3, '#f4f0e6');
  paint(9, 10, 1, 1, '#141414');
  paint(15, 10, 1, 1, '#141414');
  paint(9, 15, 7, 1, '#141414'); // boca reta de quem espera o desenhista
}
