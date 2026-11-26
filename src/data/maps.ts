/**
 * Mapas como dado (decisão de 2026-11-17). `gameData.arena` saiu da tabela:
 * `arena.halfSize` vive no MapDef e o world lê a arena do mapa escolhido.
 * Desde 2026-11-19 a CURVA DE DIFICULDADE também é do mapa: `spawnSchedule`
 * define quais inimigos aparecem e quando — cada mapa tem a sua fauna.
 * `playable: false` = slot "EM BREVE": card bloqueado, não selecionável;
 * a arena desses é placeholder e eles não têm cronograma.
 */
import type { SpawnPhase } from './enemies';
import { cidadeSpawnSchedule, feiraSpawnSchedule, rioSpawnSchedule } from './enemies';

export interface MapDef {
  id: string;
  /** Nome exibível no card de seleção. */
  name: string;
  /** Descrição em 1 linha do card de seleção (texto de jogador do GDD). */
  tagline?: string;
  playable: boolean;
  arena: { halfSize: number };
  /**
   * Cronograma de spawn do mapa (a curva de dificuldade MORA aqui — dado,
   * não código). Obrigatório em mapa jogável (validação de boot); slots
   * "EM BREVE" não têm.
   */
  spawnSchedule?: SpawnPhase[];
}

export const mapTable: MapDef[] = [
  {
    id: 'cidade',
    name: 'Avenida em Obras',
    tagline:
      'Pista urbana, cones de trânsito por todo lado, prédios ao fundo — a obra nunca termina',
    playable: true,
    arena: { halfSize: 60 },
    spawnSchedule: cidadeSpawnSchedule,
  },
  {
    id: 'feira',
    name: 'Feira de Domingo',
    tagline:
      'Barracas de lona, chão de terra batida e carrinho desgovernado — leve o troco e corra',
    playable: true,
    arena: { halfSize: 60 },
    spawnSchedule: feiraSpawnSchedule,
  },
  {
    // Terceiro mapa (2026-11-23): substituiu o slot "Orla no Feriadão". É o
    // primeiro mapa com RELEVO — morros jogáveis; o relevo é apresentação
    // (render/terrain.ts): a sim segue 2D no plano, como nos outros mapas.
    id: 'rio',
    name: 'Rio de Janeiro',
    tagline:
      'Cartão-postal com morro de verdade: escale o Corcovado até o Cristo, Pão de Açúcar no horizonte, calçadão de Copacabana — e a fauna da orla no seu pé',
    playable: true,
    // halfSize 110 (2026-11-23, era 60): o maior mapa do jogo — os números do
    // relevo (render/terrain.ts) e do cenário (arena.ts) casam com este valor.
    arena: { halfSize: 110 },
    spawnSchedule: rioSpawnSchedule,
  },
  { id: 'laje', name: 'Festa na Laje', playable: false, arena: { halfSize: 60 } },
];
