/**
 * Relevo do chão POR MAPA — decisão de 2026-11-23 (mapa Rio de Janeiro):
 * O RELEVO É APRESENTAÇÃO. A sim continua 100% 2D no plano XZ (movimento,
 * alcances, colisões e knockback são centro-a-centro no plano, como sempre);
 * o render consulta esta função pura para deformar o chão e assentar player,
 * inimigos, orbes, cartas e câmera na altura local. Nenhum módulo da sim
 * importa daqui — fronteira do TECH, mesma relação do bounce dos inimigos.
 *
 * A função precisa ser BARATA (chamada por entidade por frame, pior caso
 * ~1,7k chamadas) e SUAVE (sem degraus: o vertex snapping já dá o tremor
 * PS1; relevo serrilhado deixaria entidades saltando).
 */

/** Altura do chão (u) em (x, z) do mundo. Pura e determinística. */
export type GroundHeightFn = (x: number, z: number) => number;

/** Mapas planos (cidade, feira): altura 0 em todo lugar. */
export const flatGround: GroundHeightFn = () => 0;

/** smoothstep clássico em [0, 1]: rampa suave sem quina. */
function smooth01(t: number): number {
  const clamped = t < 0 ? 0 : t > 1 ? 1 : t;
  return clamped * clamped * (3 - 2 * clamped);
}

/** Morro gaussiano: altura `amp` no centro, espalhamento `sigma`. */
function morro(x: number, z: number, cx: number, cz: number, amp: number, sigma: number): number {
  const dx = x - cx;
  const dz = z - cz;
  return amp * Math.exp(-(dx * dx + dz * dz) / (sigma * sigma));
}

/**
 * Relevo do Rio de Janeiro (arena halfSize 110 — AMPLIADA em 2026-11-23, era
 * 60): o CORCOVADO é JOGÁVEL — pico de ~17 u com o Cristo no topo (arena.ts o
 * posiciona com esta mesma função; escalar até ele é a identidade do mapa) —
 * mais ~20 morros/lombadas espalhados, ondulação leve no resto, e a faixa de
 * +Z vira orla: o relevo deita até o calçadão (plano perto da borda) e, JÁ
 * FORA da arena, a areia desce ao mar. Os números casam com o cenário em
 * arena.ts e com `arena.halfSize` do mapa `rio` em data/maps.ts.
 */

/** Centro do pico do Corcovado jogável (o Cristo fica aqui — ver arena.ts). */
export const CORCOVADO_X = -62;
export const CORCOVADO_Z = -76;

export const rioGroundHeight: GroundHeightFn = (x, z) => {
  // Morros jogáveis (centro e espalhamento escolhidos longe do spawn em 0,0;
  // a área ao redor de 0,0 fica baixa de propósito — o jogador nasce no plano).
  let height =
    // Corcovado escalável: sigma largo = encosta longa, dá para subir andando.
    morro(x, z, CORCOVADO_X, CORCOVADO_Z, 17, 26) +
    morro(x, z, 70, -40, 6.0, 18) + // Morro leste
    morro(x, z, 30, -85, 7.0, 17) + // Morro norte
    morro(x, z, -90, -90, 6.0, 16) + // Morro do canto noroeste
    morro(x, z, 95, -85, 5.5, 15) + // Morro do canto nordeste
    morro(x, z, -80, 50, 5.0, 16) + // Morro sudoeste
    morro(x, z, 90, 30, 4.5, 14) + // Morro sudeste
    morro(x, z, -95, -25, 4.5, 13) + // Morro oeste
    morro(x, z, 0, -65, 4.0, 13) + // Morro ao norte do spawn
    morro(x, z, -55, 10, 3.6, 12) + // Morro a oeste do spawn
    morro(x, z, 55, -60, 3.5, 11) + // Morro nordeste
    morro(x, z, -20, -40, 3.5, 12) + // Lombada noroeste do spawn
    morro(x, z, 60, 60, 3.2, 12) + // Morro rumo à orla leste
    morro(x, z, -60, 75, 3.0, 12) + // Morro rumo à orla oeste
    morro(x, z, 45, 5, 3.0, 11) + // Lombada leste do spawn
    morro(x, z, 8, 52, 2.8, 11) + // Lombada ao sul do spawn
    morro(x, z, 85, 80, 2.6, 10) + // Lombada do canto da orla
    morro(x, z, -35, 55, 2.5, 10) + // Lombada sudoeste
    morro(x, z, -15, 25, 2.4, 10) + // Lombada perto do spawn
    morro(x, z, 18, -28, 2.2, 9); // Lombada curta perto do spawn

  // Ondulação leve de rua carioca (período longo: nada de serrilhado).
  height += 0.35 * Math.sin(x * 0.09) * Math.sin(z * 0.11);

  // Orla em +Z: o relevo deita chegando ao calçadão (z ≈ 102..110 plano)…
  height *= 1 - smooth01((z - 86) / 16);
  // …e além da borda a areia desce até o nível do mar (~ -2,1 u em z ≥ 122).
  height -= 2.1 * smooth01((z - 110) / 12);

  return height;
};

/**
 * Função de altura por id de mapa (mesmo padrão do createMapArena: mapa novo
 * com relevo = ramo novo aqui; sem ramo, o mapa é plano — padrão seguro).
 */
export function groundHeightForMap(mapId: string): GroundHeightFn {
  switch (mapId) {
    case 'rio':
      return rioGroundHeight;
    default:
      return flatGround;
  }
}
