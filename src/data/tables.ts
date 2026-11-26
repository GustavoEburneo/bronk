/** Tabelas de conteúdo do jogo. Toda constante de jogo vive aqui, com nome. */
import type { UpgradeDef } from './upgrades';
import { upgradeTable } from './upgrades';
import type { TalentDef } from './talents';
import { talentTable } from './talents';
import type { CharacterDef } from './characters';
import { characterTable } from './characters';
import type { MapDef } from './maps';
import { mapTable } from './maps';
import type { EnemyTypeDef } from './enemies';
import { enemyTypeTable } from './enemies';
import type { AlbumConfig } from './album';
import { albumConfig } from './album';
import type { AchievementDef } from './achievements';
import { achievementTable } from './achievements';

/**
 * Timestep fixo da simulação (s). Mora em `data` porque a validação de boot
 * (anti-tunneling) precisa dele e `data` não pode importar de `sim`;
 * `sim/tick.ts` re-exporta para os consumidores de sempre.
 */
export const SIM_DT = 1 / 60;

export interface GameData {
  /**
   * Config GLOBAL de inimigos: só o que não é atributo de um tipo. Tudo que
   * era comportamento/atributo do inimigo vive em `enemyTypes`.
   */
  enemies: {
    /** Capacidade do pool (orçamento de desempenho do TECH; `?inimigos=`). */
    maxAlive: number;
  };
  /** Tipos de inimigo (o Cone da POC é a 1ª linha). Ver `data/enemies.ts`. */
  enemyTypes: EnemyTypeDef[];
  /**
   * Config GLOBAL de spawn (taxa e anel). O CRONOGRAMA de mix por tempo é
   * dado DO MAPA (`maps[].spawnSchedule`) desde 2026-11-19.
   */
  spawn: {
    baseRatePerSec: number;
    rateGrowthPerMinute: number;
    ringMinRadius: number;
    ringMaxRadius: number;
  };
  xp: {
    maxOrbs: number;
    collectRadius: number;
    magnetRadius: number;
    magnetSpeed: number;
    baseToNext: number;
    /** xpToNext = baseToNext * growthPerLevel^(nível - 1). Deve ser > 1. */
    growthPerLevel: number;
  };
  /** Personagens jogáveis (stats base do player + habilidade equipada). */
  characters: CharacterDef[];
  /** Mapas (o jogável + slots "em breve"); a arena vem do mapa escolhido. */
  maps: MapDef[];
  /** Melhorias "Panfleto na Esquina"; regra de aplicação em `upgrades.ts`. */
  upgrades: UpgradeDef[];
  /** Talentos permanentes da Loja de Talentos; regra em `talents.ts`. */
  talents: TalentDef[];
  /** Moeda de meta-progressão (bananas). */
  bananas: {
    /** Bananas ganhas por abate (creditadas ao cofre no fim da run). */
    perKill: number;
  };
  /** Álbum de Figurinhas (drop por abate + degraus de bônus); `album.ts`. */
  album: AlbumConfig;
  /** Conquistas (condições declarativas + prêmio); `achievements.ts`. */
  achievements: AchievementDef[];
  /**
   * Orelhões que tocam na run (2026-11-24): aparecem pelo relógio em posições
   * do RNG próprio (`world.orelhaoRng`), e ATENDER exige chegar perto com os
   * abates mínimos do aparelho — prêmio em bananas igual ao requisito. A
   * sequência de requisitos é a rampa (um orelhão por entrada, na ordem).
   */
  orelhoes: {
    /** O primeiro orelhão toca aos X s de run. */
    firstAtSec: number;
    /** Um novo toca a cada Y s, até a rampa acabar. */
    intervalSec: number;
    /** Abates mínimos por orelhão, na ordem de spawn (valores: hipótese). */
    killRequirements: number[];
    /** Raio (u) ao redor do aparelho em que o atendimento acontece. */
    answerRadius: number;
  };
}

export const gameData: GameData = {
  enemies: {
    maxAlive: 600,
  },
  enemyTypes: enemyTypeTable,
  spawn: {
    // Curva de dificuldade nova (GDD 2026-11-18, "Curva de dificuldade"):
    // 1,5 → 2,0 e 3,0 → 4,5. Aos 5 min a taxa chega a 24,5/s — praticamente o
    // cenário de estresse (25/s). O cenário de balanceamento do trio NÃO
    // acompanha (congelado na curva antiga; ver balance.sim.test.ts).
    baseRatePerSec: 2.0,
    rateGrowthPerMinute: 4.5,
    ringMinRadius: 24,
    ringMaxRadius: 32,
  },
  xp: {
    maxOrbs: 1024,
    collectRadius: 0.8,
    magnetRadius: 3.5,
    magnetSpeed: 12,
    baseToNext: 5,
    growthPerLevel: 1.3,
  },
  characters: characterTable,
  maps: mapTable,
  upgrades: upgradeTable,
  talents: talentTable,
  bananas: {
    perKill: 1,
  },
  album: albumConfig,
  achievements: achievementTable,
  orelhoes: {
    firstAtSec: 25,
    intervalSec: 45,
    killRequirements: [5, 15, 30, 60, 100, 150],
    answerRadius: 1.8,
  },
};
