/**
 * Gerador de QR Code REAL por código (2026-11-23) — feito para o Pix da
 * caixinha do dev, mas genérico: modo byte, nível de correção M, versões 1–10
 * (até 216 bytes de dado). Zero dependências em runtime, como todo o resto
 * do projeto (jankTextures, áudio): o QR é "arte" gerada, não asset.
 *
 * ISTO É PAGAMENTO: um QR sutilmente errado parece válido e não escaneia (ou
 * escaneia errado). Por isso o módulo é PURO (string → matriz de booleanos) e
 * os testes em qrcode.test.ts fazem o caminho inverso COMPLETO (ler máscara,
 * desmascarar, desembaralhar blocos, conferir Reed-Solomon, extrair o texto)
 * além de conferir vetores publicados da especificação (ISO/IEC 18004).
 *
 * Implementação segue a estrutura clássica (referência: algoritmo do
 * qrcodegen de Nayuki, reescrito aqui): dados em modo byte + terminador +
 * padding EC/11 → blocos Reed-Solomon GF(256) → entrelaçamento → matriz com
 * padrões de função → melhor máscara pelas 4 regras de penalidade.
 */

/** Maior versão suportada (10 → 57×57 módulos, 216 bytes em nível M). */
export const QR_MAX_VERSION = 10;

// ---------------------------------------------------------------------------
// Tabelas (ISO/IEC 18004, nível de correção M, versões 1–10)
// ---------------------------------------------------------------------------

/** Codewords DE DADO por versão (índice 0 = versão 1). */
const DATA_CODEWORDS_M = [16, 28, 44, 64, 86, 108, 124, 154, 182, 216] as const;

/** Codewords de correção POR BLOCO, por versão. */
const ECC_PER_BLOCK_M = [10, 16, 26, 18, 24, 16, 18, 22, 22, 26] as const;

/** Estrutura de blocos por versão: pares [quantidade, codewords de dado]. */
const BLOCKS_M: ReadonlyArray<ReadonlyArray<readonly [number, number]>> = [
  [[1, 16]],
  [[1, 28]],
  [[1, 44]],
  [[2, 32]],
  [[2, 43]],
  [[4, 27]],
  [[4, 31]],
  [
    [2, 38],
    [2, 39],
  ],
  [
    [3, 36],
    [2, 37],
  ],
  [
    [4, 43],
    [1, 44],
  ],
];

/** Centros dos padrões de alinhamento por versão (versão 1 não tem). */
const ALIGNMENT_CENTERS: ReadonlyArray<readonly number[]> = [
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
];

/** Bits do nível M no format info (ISO: L=01, M=00, Q=11, H=10). */
const ECL_M_BITS = 0;

// ---------------------------------------------------------------------------
// Aritmética GF(256) e Reed-Solomon (polinômio 0x11D, gerador α = 2)
// ---------------------------------------------------------------------------

const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
{
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255]!;
}

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a]! + GF_LOG[b]!]!;
}

/** Polinômio gerador de grau `degree`: ∏ (x − α^i), i = 0..degree−1. */
export function rsGeneratorPoly(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const next = new Uint8Array(poly.length + 1);
    for (let j = 0; j < poly.length; j++) {
      next[j] = next[j]! ^ gfMul(poly[j]!, 1); // termo x
      next[j + 1] = next[j + 1]! ^ gfMul(poly[j]!, GF_EXP[i]!); // termo α^i
    }
    poly = next;
  }
  return poly;
}

/** Resto da divisão polinomial (os codewords de correção, forma sistemática). */
export function rsRemainder(data: Uint8Array, generator: Uint8Array): Uint8Array {
  const result = new Uint8Array(generator.length - 1);
  for (const byte of data) {
    const factor = byte ^ result[0]!;
    result.copyWithin(0, 1);
    result[result.length - 1] = 0;
    for (let i = 0; i < result.length; i++) {
      result[i] = result[i]! ^ gfMul(generator[i + 1]!, factor);
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Codificação dos dados (modo byte) e montagem dos codewords
// ---------------------------------------------------------------------------

/** Bits do contador de caracteres do modo byte: 8 (v1–9) ou 16 (v10+). */
function charCountBits(version: number): number {
  return version <= 9 ? 8 : 16;
}

/** Menor versão (nível M) que comporta `byteLength` bytes em modo byte. */
function pickVersion(byteLength: number): number {
  for (let version = 1; version <= QR_MAX_VERSION; version++) {
    const capacityBits = DATA_CODEWORDS_M[version - 1]! * 8;
    const neededBits = 4 + charCountBits(version) + byteLength * 8;
    if (neededBits <= capacityBits) return version;
  }
  throw new Error(
    `texto com ${byteLength} bytes não cabe num QR nível M até a versão ${QR_MAX_VERSION}`,
  );
}

/** Dados → codewords finais (dado + correção, blocos entrelaçados). */
function buildCodewords(bytes: Uint8Array, version: number): Uint8Array {
  const dataCapacity = DATA_CODEWORDS_M[version - 1]!;

  // Fluxo de bits: modo byte (0100) + contador + dados.
  const bits: number[] = [];
  const pushBits = (value: number, count: number): void => {
    for (let i = count - 1; i >= 0; i--) bits.push((value >> i) & 1);
  };
  pushBits(0b0100, 4);
  pushBits(bytes.length, charCountBits(version));
  for (const byte of bytes) pushBits(byte, 8);

  // Terminador (até 4 zeros), alinhamento a byte e padding EC/11 da spec.
  const capacityBits = dataCapacity * 8;
  pushBits(0, Math.min(4, capacityBits - bits.length));
  if (bits.length % 8 !== 0) pushBits(0, 8 - (bits.length % 8));
  const dataCodewords = new Uint8Array(dataCapacity);
  for (let i = 0; i < bits.length; i++) {
    dataCodewords[i >> 3] = dataCodewords[i >> 3]! | (bits[i]! << (7 - (i & 7)));
  }
  for (let i = bits.length / 8, pad = 0xec; i < dataCapacity; i++, pad ^= 0xfd) {
    dataCodewords[i] = pad; // alterna 0xEC / 0x11 (0xEC ^ 0xFD = 0x11)
  }

  // Blocos: dados fatiados conforme a tabela, correção por bloco.
  const eccLen = ECC_PER_BLOCK_M[version - 1]!;
  const generator = rsGeneratorPoly(eccLen);
  const dataBlocks: Uint8Array[] = [];
  const eccBlocks: Uint8Array[] = [];
  let offset = 0;
  for (const [count, size] of BLOCKS_M[version - 1]!) {
    for (let b = 0; b < count; b++) {
      const block = dataCodewords.slice(offset, offset + size);
      offset += size;
      dataBlocks.push(block);
      eccBlocks.push(rsRemainder(block, generator));
    }
  }

  // Entrelaçamento: coluna a coluna dos blocos de dado, depois dos de correção.
  const result: number[] = [];
  const maxBlockLen = Math.max(...dataBlocks.map((block) => block.length));
  for (let i = 0; i < maxBlockLen; i++) {
    for (const block of dataBlocks) if (i < block.length) result.push(block[i]!);
  }
  for (let i = 0; i < eccLen; i++) {
    for (const block of eccBlocks) result.push(block[i]!);
  }
  return Uint8Array.from(result);
}

// ---------------------------------------------------------------------------
// Matriz: padrões de função, colocação dos dados, máscara
// ---------------------------------------------------------------------------

interface Grid {
  size: number;
  /** modules[linha][coluna] = módulo escuro. */
  modules: boolean[][];
  /** true = módulo de função (não recebe dado nem máscara). */
  isFunction: boolean[][];
}

function setFunction(grid: Grid, row: number, col: number, dark: boolean): void {
  grid.modules[row]![col] = dark;
  grid.isFunction[row]![col] = true;
}

/** Finders + separadores, timing, alinhamento e área de versão (v7+). */
function drawFunctionPatterns(grid: Grid, version: number): void {
  const size = grid.size;

  // Timing: linha 6 e coluna 6, alternando a partir de escuro.
  for (let i = 0; i < size; i++) {
    setFunction(grid, 6, i, i % 2 === 0);
    setFunction(grid, i, 6, i % 2 === 0);
  }

  // Finders (3 cantos) com o anel separador claro (distância 2 e 4 claras).
  for (const [centerRow, centerCol] of [
    [3, 3],
    [3, size - 4],
    [size - 4, 3],
  ] as const) {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const row = centerRow + dy;
        const col = centerCol + dx;
        if (row < 0 || row >= size || col < 0 || col >= size) continue;
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        setFunction(grid, row, col, dist !== 2 && dist !== 4);
      }
    }
  }

  // Padrões de alinhamento 5×5 (pulando os que caem sobre um finder).
  const centers = ALIGNMENT_CENTERS[version - 1]!;
  const last = centers.length - 1;
  for (let a = 0; a < centers.length; a++) {
    for (let b = 0; b < centers.length; b++) {
      if (
        (a === 0 && b === 0) ||
        (a === 0 && b === last) ||
        (a === last && b === 0)
      ) {
        continue; // sobreporia um finder
      }
      const centerRow = centers[a]!;
      const centerCol = centers[b]!;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          setFunction(
            grid,
            centerRow + dy,
            centerCol + dx,
            Math.max(Math.abs(dx), Math.abs(dy)) !== 1,
          );
        }
      }
    }
  }

  // Informação de versão (v7+): 18 bits BCH(18,6) nos dois blocos 3×6.
  if (version >= 7) {
    const bits = versionInfoBits(version);
    for (let i = 0; i < 18; i++) {
      const bit = ((bits >> i) & 1) !== 0;
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      setFunction(grid, a, b, bit);
      setFunction(grid, b, a, bit);
    }
  }

  // Posições do format info reservadas com valores provisórios (máscara 0);
  // a escolhida é regravada no fim — mesmas posições, já marcadas de função.
  drawFormatBits(grid, 0);
}

/** 18 bits da informação de versão: versão (6 bits) + BCH com 0x1F25. */
export function versionInfoBits(version: number): number {
  let rem = version;
  for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >> 11) * 0x1f25);
  return (version << 12) | rem;
}

/** 15 bits do format info (nível M + máscara): BCH 0x537, XOR 0x5412. */
export function formatInfoBits(mask: number): number {
  const data = (ECL_M_BITS << 3) | mask;
  let rem = data;
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >> 9) * 0x537);
  return ((data << 10) | rem) ^ 0x5412;
}

/** Grava os 15 bits do format info nas DUAS cópias da spec + módulo escuro fixo. */
function drawFormatBits(grid: Grid, mask: number): void {
  const bits = formatInfoBits(mask);
  const bit = (i: number): boolean => ((bits >> i) & 1) !== 0;
  const size = grid.size;

  // Cópia 1, em volta do finder superior esquerdo.
  for (let i = 0; i <= 5; i++) setFunction(grid, i, 8, bit(i));
  setFunction(grid, 7, 8, bit(6));
  setFunction(grid, 8, 8, bit(7));
  setFunction(grid, 8, 7, bit(8));
  for (let i = 9; i < 15; i++) setFunction(grid, 8, 14 - i, bit(i));

  // Cópia 2, repartida entre os outros dois finders.
  for (let i = 0; i < 8; i++) setFunction(grid, 8, size - 1 - i, bit(i));
  for (let i = 8; i < 15; i++) setFunction(grid, size - 15 + i, 8, bit(i));

  // Módulo sempre-escuro ao lado do finder inferior esquerdo.
  setFunction(grid, size - 8, 8, true);
}

/** Zigue-zague da spec: colunas de 2 da direita para a esquerda, pulando a 6. */
function placeData(grid: Grid, codewords: Uint8Array): void {
  const size = grid.size;
  let bitIndex = 0;
  const totalBits = codewords.length * 8;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const col = right - j;
        const upward = ((right + 1) & 2) === 0;
        const row = upward ? size - 1 - vert : vert;
        if (grid.isFunction[row]![col]! || bitIndex >= totalBits) continue;
        grid.modules[row]![col] =
          ((codewords[bitIndex >> 3]! >> (7 - (bitIndex & 7))) & 1) !== 0;
        bitIndex++;
      }
    }
  }
}

/** Condição da máscara `mask` no módulo (linha, coluna) — tabela da spec. */
function maskBit(mask: number, row: number, col: number): boolean {
  switch (mask) {
    case 0:
      return (row + col) % 2 === 0;
    case 1:
      return row % 2 === 0;
    case 2:
      return col % 3 === 0;
    case 3:
      return (row + col) % 3 === 0;
    case 4:
      return (Math.floor(row / 2) + Math.floor(col / 3)) % 2 === 0;
    case 5:
      return ((row * col) % 2) + ((row * col) % 3) === 0;
    case 6:
      return (((row * col) % 2) + ((row * col) % 3)) % 2 === 0;
    default:
      return (((row + col) % 2) + ((row * col) % 3)) % 2 === 0;
  }
}

/** Aplica (XOR) a máscara nos módulos de dado. Chamada 2× desfaz. */
function applyMask(grid: Grid, mask: number): void {
  for (let row = 0; row < grid.size; row++) {
    for (let col = 0; col < grid.size; col++) {
      if (!grid.isFunction[row]![col]! && maskBit(mask, row, col)) {
        grid.modules[row]![col] = !grid.modules[row]![col]!;
      }
    }
  }
}

/** As 4 regras de penalidade da spec (N1=3, N2=3, N3=40, N4=10). */
function penaltyScore(grid: Grid): number {
  const size = grid.size;
  const modules = grid.modules;
  let score = 0;

  // N1: corridas de 5+ módulos iguais em linhas e colunas.
  for (let i = 0; i < size; i++) {
    let runColorRow = modules[i]![0]!;
    let runLenRow = 1;
    let runColorCol = modules[0]![i]!;
    let runLenCol = 1;
    for (let j = 1; j < size; j++) {
      if (modules[i]![j]! === runColorRow) {
        runLenRow++;
        if (runLenRow === 5) score += 3;
        else if (runLenRow > 5) score += 1;
      } else {
        runColorRow = modules[i]![j]!;
        runLenRow = 1;
      }
      if (modules[j]![i]! === runColorCol) {
        runLenCol++;
        if (runLenCol === 5) score += 3;
        else if (runLenCol > 5) score += 1;
      } else {
        runColorCol = modules[j]![i]!;
        runLenCol = 1;
      }
    }
  }

  // N2: blocos 2×2 de uma cor só.
  for (let row = 0; row < size - 1; row++) {
    for (let col = 0; col < size - 1; col++) {
      const color = modules[row]![col]!;
      if (
        color === modules[row]![col + 1]! &&
        color === modules[row + 1]![col]! &&
        color === modules[row + 1]![col + 1]!
      ) {
        score += 3;
      }
    }
  }

  // N3: padrão tipo-finder 1011101 com 4 claros de um dos lados.
  const FINDER_A = [true, false, true, true, true, false, true, false, false, false, false];
  const FINDER_B = [false, false, false, false, true, false, true, true, true, false, true];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j <= size - 11; j++) {
      let matchRowA = true;
      let matchRowB = true;
      let matchColA = true;
      let matchColB = true;
      for (let k = 0; k < 11; k++) {
        if (modules[i]![j + k]! !== FINDER_A[k]!) matchRowA = false;
        if (modules[i]![j + k]! !== FINDER_B[k]!) matchRowB = false;
        if (modules[j + k]![i]! !== FINDER_A[k]!) matchColA = false;
        if (modules[j + k]![i]! !== FINDER_B[k]!) matchColB = false;
      }
      if (matchRowA || matchRowB) score += 40;
      if (matchColA || matchColB) score += 40;
    }
  }

  // N4: desvio da proporção de escuros em relação a 50%.
  let dark = 0;
  for (const rowModules of modules) for (const module of rowModules) if (module) dark++;
  const percent = (dark * 100) / (size * size);
  score += Math.floor(Math.abs(percent - 50) / 5) * 10;

  return score;
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

/**
 * Codifica `text` (modo byte, nível M, menor versão que couber até a 10) e
 * devolve a matriz de módulos `[linha][coluna]` (true = escuro), SEM zona
 * quieta — quem desenha adiciona (drawQrToCanvas usa 4 módulos, o mínimo).
 */
export function encodeQrMatrix(text: string): boolean[][] {
  const bytes = new TextEncoder().encode(text);
  const version = pickVersion(bytes.length);
  const codewords = buildCodewords(bytes, version);

  const size = 17 + version * 4;
  const grid: Grid = {
    size,
    modules: Array.from({ length: size }, () => new Array<boolean>(size).fill(false)),
    isFunction: Array.from({ length: size }, () => new Array<boolean>(size).fill(false)),
  };

  drawFunctionPatterns(grid, version);
  placeData(grid, codewords);

  // Melhor máscara pelas 4 regras de penalidade (aplica, mede, desfaz).
  let bestMask = 0;
  let bestScore = Number.POSITIVE_INFINITY;
  for (let mask = 0; mask < 8; mask++) {
    applyMask(grid, mask);
    drawFormatBits(grid, mask);
    const score = penaltyScore(grid);
    if (score < bestScore) {
      bestScore = score;
      bestMask = mask;
    }
    applyMask(grid, mask); // desfaz (XOR)
  }
  applyMask(grid, bestMask);
  drawFormatBits(grid, bestMask);

  return grid.modules;
}

/**
 * Desenha a matriz no canvas, 1 módulo = `modulePx` pixels, com zona quieta
 * de 4 módulos (mínimo da spec). Exibir o canvas no TAMANHO NATURAL (sem
 * esticar via CSS): reescalar sem ser por inteiro pode sumir com módulos.
 */
export function drawQrToCanvas(canvas: HTMLCanvasElement, matrix: boolean[][], modulePx: number): void {
  const quiet = 4;
  const size = (matrix.length + quiet * 2) * modulePx;
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  if (context === null) return; // sem 2d não há QR; o copia-e-cola continua

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, size, size);
  context.fillStyle = '#1a1208';
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix.length; col++) {
      if (!matrix[row]![col]!) continue;
      context.fillRect((col + quiet) * modulePx, (row + quiet) * modulePx, modulePx, modulePx);
    }
  }
}
