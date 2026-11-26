/**
 * Tipos de inimigo como dado (decisão de 2026-11-18). O inimigo único da POC
 * foi batizado (Cone Revoltado) e virou a primeira linha. Comportamento é
 * união discriminada (mesma convenção do `AbilityDef`): parâmetro novo de
 * comportamento = campo novo no ramo dele, tipado; nunca "campo opcional que
 * só vale para um kind". Valores do GDD ("Inimigos — Avenida em Obras" e
 * "Inimigos — Feira de Domingo"); seguem hipótese até jogadas reais — ajuste
 * é mudança de tabela.
 */

export type EnemyBehaviorDef =
  | { kind: 'chase' } // persegue o player (a IA da POC; Cone, Rato, Britadeira…)
  | {
      /** Voa reto na direção da posição do player NO SPAWN (Pombo, Maritaca). */
      kind: 'flyby';
      /**
       * Distância ao CENTRO da arena (u) além da qual despawna sem XP —
       * só quando está se AFASTANDO do centro (dir·pos > 0): perto da borda
       * o pombo pode nascer já além do raio voando para dentro.
       */
      despawnRadius: number;
      /** Teto de segurança (s) de voo em Chasing; despawna sem XP. */
      despawnAfter: number;
    }
  | {
      /**
       * Cicla mira parada + arrancada reta (Carrinho da feira, 2026-11-19):
       * durante `windup` fica PARADO re-mirando o player (telegraph legível);
       * depois arranca em `moveSpeed` na direção congelada por `chargeTime`,
       * clampado na arena. O ciclo deriva de `stateTime % (windup+chargeTime)`
       * — zero estado novo no pool. Knockback desloca sem mudar a direção da
       * arrancada (mesma regra do flyby).
       */
      kind: 'investida';
      /** Tempo (s) parado mirando antes de cada arrancada. */
      windup: number;
      /** Duração (s) de cada arrancada reta. */
      chargeTime: number;
    };

export interface EnemyTypeDef {
  /** Estável, minúsculo; aparece no `spawnSchedule` dos mapas e nos testes. */
  id: string;
  /** Exibível (álbum, conquistas, debug). */
  name: string;
  /** Ícone exibível (emoji) — figurinha do álbum e telas; a UI só consome. */
  icon: string;
  behavior: EnemyBehaviorDef;
  moveSpeed: number;
  maxHp: number;
  radius: number;
  contactDamage: number;
  xpValue: number;
  spawnStateDuration: number;
  dyingStateDuration: number;
}

/**
 * Fase do cronograma de spawn (a curva de dificuldade é DADO DO MAPA desde
 * 2026-11-19 — vive em `MapDef.spawnSchedule`): a partir de `fromTime`, cada
 * spawn sorteia o tipo pelos pesos. `Record` por id é o formato da TABELA
 * (legível); `createWorld` compila uma vez para forma indexada — a sim não
 * faz lookup de string em runtime.
 */
export interface SpawnPhase {
  /** Segundo de partida em que a fase passa a valer (a 1ª deve ser 0). */
  fromTime: number;
  /** enemyTypeId → peso relativo (>= 0; soma > 0). */
  weights: Record<string, number>;
}

export const enemyTypeTable: EnemyTypeDef[] = [
  // ——— Avenida em Obras ———————————————————————————————————————————————
  {
    // O básico da POC, batizado — stats inalterados (GDD 2026-11-18).
    id: 'cone',
    name: 'Cone Revoltado',
    icon: '🚧',
    behavior: { kind: 'chase' },
    moveSpeed: 3.2,
    maxHp: 20,
    radius: 0.45,
    contactDamage: 8,
    xpValue: 1,
    spawnStateDuration: 0.4,
    dyingStateDuration: 0.25,
  },
  {
    // Rusher frágil: morre para 1 acerto de qualquer habilidade base.
    id: 'rato',
    name: 'Rato de Entulho',
    icon: '🐀',
    behavior: { kind: 'chase' },
    moveSpeed: 5.0,
    maxHp: 6,
    radius: 0.35,
    contactDamage: 5,
    xpValue: 1,
    spawnStateDuration: 0.3,
    dyingStateDuration: 0.2,
  },
  {
    // Tanque lento: corpo largo que atrapalha rota; XP 6 paga o investimento.
    id: 'britadeira',
    name: 'Britadeira Desgovernada',
    icon: '⚒️',
    behavior: { kind: 'chase' },
    moveSpeed: 1.8,
    maxHp: 90,
    radius: 0.7,
    contactDamage: 18,
    xpValue: 6,
    spawnStateDuration: 0.6,
    dyingStateDuration: 0.35,
  },
  {
    // Atravessador em linha reta: pune ficar parado; despawn silencioso
    // (40 u do centro afastando-se, ou 15 s de voo) sem orbe de XP.
    id: 'pombo',
    name: 'Pombo de Obra',
    icon: '🐦',
    behavior: { kind: 'flyby', despawnRadius: 40, despawnAfter: 15 },
    moveSpeed: 7.0,
    maxHp: 12,
    radius: 0.4,
    contactDamage: 10,
    xpValue: 2,
    spawnStateDuration: 0.4,
    dyingStateDuration: 0.2,
  },

  // ——— Feira de Domingo (GDD 2026-11-19) ———————————————————————————————
  {
    // Rusher da feira: mais rápida e mais numerosa que o rato, igualmente
    // frágil — a pressão da feira vem em bando.
    id: 'galinha',
    name: 'Galinha de Quintal',
    icon: '🐔',
    behavior: { kind: 'chase' },
    moveSpeed: 5.4,
    maxHp: 6,
    radius: 0.35,
    contactDamage: 5,
    xpValue: 1,
    spawnStateDuration: 0.3,
    dyingStateDuration: 0.2,
  },
  {
    // Comportamento novo (investida): para, mira (telegraph de 0,9 s) e
    // arranca reto — pune ficar parado E recompensa desviar no tempo certo.
    id: 'carrinho',
    name: 'Carrinho de Feira Desembestado',
    icon: '🛒',
    behavior: { kind: 'investida', windup: 0.9, chargeTime: 1.2 },
    moveSpeed: 9.5,
    maxHp: 35,
    radius: 0.5,
    contactDamage: 14,
    xpValue: 3,
    spawnStateDuration: 0.5,
    dyingStateDuration: 0.3,
  },
  {
    // Tanque da feira: casca grossa literal, mais HP e dano que a britadeira
    // — a feira aperta mais cedo que a avenida.
    id: 'abacaxi',
    name: 'Abacaxi Casca-Grossa',
    icon: '🍍',
    behavior: { kind: 'chase' },
    moveSpeed: 1.6,
    maxHp: 110,
    radius: 0.75,
    contactDamage: 20,
    xpValue: 7,
    spawnStateDuration: 0.6,
    dyingStateDuration: 0.35,
  },
  {
    // Flyby da feira: mais rápida que o pombo, mesma regra de despawn
    // silencioso (sem XP) ao se afastar do centro ou no teto de voo.
    id: 'maritaca',
    name: 'Maritaca Tagarela',
    icon: '🦜',
    behavior: { kind: 'flyby', despawnRadius: 40, despawnAfter: 13 },
    moveSpeed: 8.0,
    maxHp: 10,
    radius: 0.4,
    contactDamage: 9,
    xpValue: 2,
    spawnStateDuration: 0.35,
    dyingStateDuration: 0.2,
  },

  // ——— Rio de Janeiro (2026-11-23; valores: hipótese) ————————————————————
  {
    // Rusher do Rio: o sagui que assalta lanche de turista — o mais rápido
    // dos rushers (a pressão do mapa é bando descendo o morro).
    id: 'sagui',
    name: 'Sagui Ladrão de Lanche',
    icon: '🐒',
    behavior: { kind: 'chase' },
    moveSpeed: 5.6,
    maxHp: 6,
    radius: 0.35,
    contactDamage: 5,
    xpValue: 1,
    spawnStateDuration: 0.3,
    dyingStateDuration: 0.2,
  },
  {
    // Investida do Rio (receita do carrinho): a bola de futevôlei quica
    // parada mirando (telegraph de 0,8 s) e dispara reto — mais rápida e um
    // pouco mais frágil que o carrinho.
    id: 'bola',
    name: 'Bola de Futevôlei Possuída',
    icon: '🏐',
    behavior: { kind: 'investida', windup: 0.8, chargeTime: 1.1 },
    moveSpeed: 10.0,
    maxHp: 30,
    radius: 0.5,
    contactDamage: 13,
    xpValue: 3,
    spawnStateDuration: 0.5,
    dyingStateDuration: 0.3,
  },
  {
    // Tanque do Rio: coco gelado parrudo, o mais gordo dos tanques — régua
    // acima do abacaxi (o Rio é o terceiro mapa; aperta mais).
    id: 'coco',
    name: 'Coco Gelado Rancoroso',
    icon: '🥥',
    behavior: { kind: 'chase' },
    moveSpeed: 1.7,
    maxHp: 120,
    radius: 0.75,
    contactDamage: 20,
    xpValue: 7,
    spawnStateDuration: 0.6,
    dyingStateDuration: 0.35,
  },
  {
    // Flyby do Rio: urubu rondando a orla — entre o pombo e a maritaca em
    // velocidade, mesma regra de despawn silencioso (sem XP).
    id: 'urubu',
    name: 'Urubu de Orla',
    icon: '🦅',
    behavior: { kind: 'flyby', despawnRadius: 40, despawnAfter: 13 },
    moveSpeed: 8.5,
    maxHp: 10,
    radius: 0.4,
    contactDamage: 9,
    xpValue: 2,
    spawnStateDuration: 0.35,
    dyingStateDuration: 0.2,
  },
];

/**
 * Curva da Avenida em Obras (GDD "Inimigos — Avenida em Obras"; valores:
 * hipótese). Consumida por `mapTable` ('cidade').
 */
export const cidadeSpawnSchedule: SpawnPhase[] = [
  { fromTime: 0, weights: { cone: 100 } },
  { fromTime: 60, weights: { cone: 75, rato: 25 } },
  { fromTime: 150, weights: { cone: 55, rato: 30, britadeira: 15 } },
  { fromTime: 240, weights: { cone: 40, rato: 30, britadeira: 20, pombo: 10 } },
  { fromTime: 360, weights: { cone: 30, rato: 30, britadeira: 25, pombo: 15 } },
];

/**
 * Curva da Feira de Domingo (GDD 2026-11-19; valores: hipótese). Fases mais
 * cedo que a avenida: o carrinho entra aos 45 s — a identidade do mapa é
 * desviar de investida desde o início. Consumida por `mapTable` ('feira').
 */
export const feiraSpawnSchedule: SpawnPhase[] = [
  { fromTime: 0, weights: { galinha: 100 } },
  { fromTime: 45, weights: { galinha: 70, carrinho: 30 } },
  { fromTime: 120, weights: { galinha: 50, carrinho: 30, abacaxi: 20 } },
  { fromTime: 210, weights: { galinha: 35, carrinho: 30, abacaxi: 20, maritaca: 15 } },
  { fromTime: 330, weights: { galinha: 25, carrinho: 30, abacaxi: 25, maritaca: 20 } },
];

/**
 * Curva do Rio de Janeiro (2026-11-23; valores: hipótese). Mesma espinha da
 * feira com as fases um pouco mais tardias que as dela e mais cedo que as da
 * avenida: a bola entra aos 50 s (a identidade de desviar continua) e o coco
 * sobe o peso do tanque no fim — o Rio é o mapa que mais aperta no tardio.
 * Consumida por `mapTable` ('rio').
 */
export const rioSpawnSchedule: SpawnPhase[] = [
  { fromTime: 0, weights: { sagui: 100 } },
  { fromTime: 50, weights: { sagui: 70, bola: 30 } },
  { fromTime: 130, weights: { sagui: 50, bola: 30, coco: 20 } },
  { fromTime: 220, weights: { sagui: 35, bola: 30, coco: 20, urubu: 15 } },
  { fromTime: 340, weights: { sagui: 25, bola: 30, coco: 25, urubu: 20 } },
];
