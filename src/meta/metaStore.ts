/**
 * Cofre de meta-progressão: bananas, talentos comprados, Álbum de Figurinhas,
 * conquistas e estatísticas de vida, persistidos em localStorage (decisão de
 * 2026-11-19 — POC sem backend; quando o backend-engineer assumir contas/save,
 * este módulo vira a borda a trocar).
 *
 * Fronteiras:
 * - A SIM não conhece este módulo: ela conta (`bananasEarned`, `killsByType`,
 *   `cardsEarned`) e lê o que foi congelado na criação do mundo
 *   (`talentRanks`, `albumCopies`). Quem fecha a conta no fim da run é o
 *   integrador (main.ts), via `recordRun`.
 * - A UI (loja, conquistas, álbum) lê e muda VIA ESTA API — nunca toca o
 *   storage direto.
 * - As CONQUISTAS são avaliadas AQUI (fim de run e compra na loja), com a
 *   função pura de `data/achievements.ts`; o prêmio em bananas é creditado
 *   uma única vez, no desbloqueio.
 *
 * Robustez: storage pode não existir (modo privado, permissões) ou conter
 * lixo. Carga sanitiza tudo (ids desconhecidos caem, ranks/cópias clampam,
 * números viram inteiros >= 0) e falha de leitura/escrita degrada para
 * memória — o jogo nunca quebra por causa do cofre.
 */
import type { GameData } from '../data/tables';
import type { AchievementDef, AchievementProgress, RunFacts } from '../data/achievements';
import { evaluateAchievements } from '../data/achievements';

/** Chave versionada: mudança de formato incompatível = nova chave. Os campos
 * de 2026-11-19 (album/achievements/lifetime) são ADITIVOS: cofre antigo
 * carrega com eles zerados — sem migração. */
export const META_STORAGE_KEY = 'bronk.meta.v1';

/** Subconjunto de Storage usado (injetável nos testes). */
export type MetaStorage = Pick<Storage, 'getItem' | 'setItem'>;

/** Fechamento de UMA run (quem monta é o integrador, lendo o world). */
export interface RunRecord {
  characterId: string;
  mapId: string;
  timeSec: number;
  level: number;
  /** true só na morte de verdade; desistência/saída não conta pra Rapidinha. */
  died: boolean;
  bananasEarned: number;
  /** Abates por tipo, alinhado por índice com `data.enemyTypes`. */
  killsByType: readonly number[];
  /** Figurinhas dropadas por tipo, alinhado com `data.enemyTypes`. */
  cardsEarned: readonly number[];
}

/** Resultado de `recordRun`: o que a tela de fim de run anuncia. */
export interface RunOutcome {
  /** Conquistas recém-desbloqueadas, na ordem da tabela. */
  newAchievements: AchievementDef[];
  /** Soma dos prêmios em bananas das conquistas novas (já creditada). */
  rewardBananas: number;
}

export interface MetaStore {
  /** Saldo atual de bananas. */
  readonly bananas: number;
  /** Nível comprado do talento `id` (0 = nenhum). Id desconhecido lança. */
  rankOf(id: string): number;
  /** Ranks alinhados por índice com `data.talents` (para `MatchSelection`). */
  talentRanksArray(): number[];
  /** Credita bananas (override `?bananas=`). Valores <= 0 são no-op. Persiste. */
  credit(amount: number): void;
  /** Custo do PRÓXIMO nível do talento, ou null se está no teto. */
  nextCost(id: string): number | null;
  /** true se há saldo para o próximo nível (false também quando no teto). */
  canBuy(id: string): boolean;
  /** Compra 1 nível: debita, reavalia conquistas e persiste. false se no teto ou sem saldo. */
  buy(id: string): boolean;
  /** Cópias da figurinha do tipo `id` no álbum. Id desconhecido lança. */
  copiesOf(id: string): number;
  /** Cópias alinhadas por índice com `data.enemyTypes` (para `MatchSelection`). */
  albumCopiesArray(): number[];
  /** true se a conquista `id` já foi desbloqueada. Id desconhecido lança. */
  isUnlocked(id: string): boolean;
  /** Quantidade de conquistas desbloqueadas. */
  readonly unlockedCount: number;
  /** Abates acumulados do tipo `id` (estatística de vida). Id desconhecido lança. */
  lifetimeKillsOf(id: string): number;
  /**
   * Fecha a conta de UMA run: credita bananas e figurinhas, atualiza as
   * estatísticas de vida, avalia conquistas (com os fatos da run), credita os
   * prêmios e persiste UMA vez. Retorna o que desbloqueou.
   */
  recordRun(run: RunRecord): RunOutcome;
}

export function createMetaStore(data: GameData, storage?: MetaStorage): MetaStore {
  const store = storage ?? resolveLocalStorage();

  let bananas = 0;
  /** Ranks por índice, alinhados com `data.talents`. */
  const ranks = new Array<number>(data.talents.length).fill(0);
  /** Cópias por índice, alinhadas com `data.enemyTypes`. */
  const album = new Array<number>(data.enemyTypes.length).fill(0);
  /** Ids de conquista desbloqueados (ordem de desbloqueio, persistida). */
  const unlocked = new Set<string>();
  /** Estatísticas de vida (insumo das conquistas). */
  const lifetime = {
    runs: 0,
    kills: 0,
    /** Por índice, alinhado com `data.enemyTypes`. */
    killsByType: new Array<number>(data.enemyTypes.length).fill(0),
    /** Bananas GANHAS em abates (prêmio de conquista não conta). */
    bananas: 0,
    bestTimeSec: 0,
    characters: new Set<string>(),
    maps: new Set<string>(),
  };

  load();

  function talentIndex(id: string): number {
    const index = data.talents.findIndex((def) => def.id === id);
    if (index < 0) throw new Error(`talento desconhecido: ${id}`);
    return index;
  }

  function enemyTypeIndex(id: string): number {
    const index = data.enemyTypes.findIndex((def) => def.id === id);
    if (index < 0) throw new Error(`tipo de inimigo desconhecido: ${id}`);
    return index;
  }

  /** Inteiro >= 0 a partir de valor desconhecido do storage; senão null. */
  function sanitizeCount(value: unknown): number | null {
    if (typeof value !== 'number' || !Number.isFinite(value)) return null;
    return Math.max(0, Math.floor(value));
  }

  function load(): void {
    if (store === null) return;
    let raw: string | null = null;
    try {
      raw = store.getItem(META_STORAGE_KEY);
    } catch {
      return; // storage inacessível: começa zerado, em memória
    }
    if (raw === null) return;

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return; // lixo gravado: ignora (a próxima escrita regrava são)
    }
    if (typeof parsed !== 'object' || parsed === null) return;
    const record = parsed as Record<string, unknown>;

    const rawBananas = sanitizeCount(record['bananas']);
    if (rawBananas !== null) bananas = rawBananas;

    const rawRanks = record['talentRanks'];
    if (typeof rawRanks === 'object' && rawRanks !== null) {
      for (const [id, value] of Object.entries(rawRanks as Record<string, unknown>)) {
        const index = data.talents.findIndex((def) => def.id === id);
        if (index < 0) continue; // talento removido da tabela: rank cai
        const count = sanitizeCount(value);
        if (count === null) continue;
        ranks[index] = Math.min(data.talents[index]!.maxRank, count);
      }
    }

    const rawAlbum = record['album'];
    if (typeof rawAlbum === 'object' && rawAlbum !== null) {
      for (const [id, value] of Object.entries(rawAlbum as Record<string, unknown>)) {
        const index = data.enemyTypes.findIndex((def) => def.id === id);
        if (index < 0) continue; // tipo removido da tabela: figurinhas caem
        const count = sanitizeCount(value);
        if (count === null) continue;
        album[index] = count;
      }
    }

    const rawAchievements = record['achievements'];
    if (Array.isArray(rawAchievements)) {
      for (const id of rawAchievements) {
        if (typeof id !== 'string') continue;
        if (!data.achievements.some((def) => def.id === id)) continue; // removida
        unlocked.add(id);
      }
    }

    const rawLifetime = record['lifetime'];
    if (typeof rawLifetime === 'object' && rawLifetime !== null) {
      const lt = rawLifetime as Record<string, unknown>;
      lifetime.runs = sanitizeCount(lt['runs']) ?? 0;
      lifetime.kills = sanitizeCount(lt['kills']) ?? 0;
      lifetime.bananas = sanitizeCount(lt['bananas']) ?? 0;
      lifetime.bestTimeSec = sanitizeCount(lt['bestTimeSec']) ?? 0;
      const killsByType = lt['killsByType'];
      if (typeof killsByType === 'object' && killsByType !== null) {
        for (const [id, value] of Object.entries(killsByType as Record<string, unknown>)) {
          const index = data.enemyTypes.findIndex((def) => def.id === id);
          if (index < 0) continue;
          const count = sanitizeCount(value);
          if (count === null) continue;
          lifetime.killsByType[index] = count;
        }
      }
      const characters = lt['characters'];
      if (Array.isArray(characters)) {
        for (const id of characters) {
          if (typeof id === 'string' && data.characters.some((def) => def.id === id)) {
            lifetime.characters.add(id);
          }
        }
      }
      const maps = lt['maps'];
      if (Array.isArray(maps)) {
        for (const id of maps) {
          if (typeof id === 'string' && data.maps.some((def) => def.id === id)) {
            lifetime.maps.add(id);
          }
        }
      }
    }
  }

  function save(): void {
    if (store === null) return;
    const talentRanks: Record<string, number> = {};
    for (let i = 0; i < data.talents.length; i++) {
      if (ranks[i]! > 0) talentRanks[data.talents[i]!.id] = ranks[i]!;
    }
    const albumRecord: Record<string, number> = {};
    const killsByType: Record<string, number> = {};
    for (let i = 0; i < data.enemyTypes.length; i++) {
      const id = data.enemyTypes[i]!.id;
      if (album[i]! > 0) albumRecord[id] = album[i]!;
      if (lifetime.killsByType[i]! > 0) killsByType[id] = lifetime.killsByType[i]!;
    }
    try {
      store.setItem(
        META_STORAGE_KEY,
        JSON.stringify({
          bananas,
          talentRanks,
          album: albumRecord,
          achievements: [...unlocked],
          lifetime: {
            runs: lifetime.runs,
            kills: lifetime.kills,
            killsByType,
            bananas: lifetime.bananas,
            bestTimeSec: lifetime.bestTimeSec,
            characters: [...lifetime.characters],
            maps: [...lifetime.maps],
          },
        }),
      );
    } catch {
      // Cota cheia/modo privado: segue em memória; a run não pode quebrar.
    }
  }

  /** Monta a visão de progresso que as condições de conquista leem. */
  function buildProgress(lastRun: RunFacts | null): AchievementProgress {
    let talentRanksBought = 0;
    let talentsMaxed = 0;
    for (let i = 0; i < data.talents.length; i++) {
      talentRanksBought += ranks[i]!;
      if (ranks[i]! >= data.talents[i]!.maxRank) talentsMaxed++;
    }

    const lastTier = data.album.tiers[data.album.tiers.length - 1]!;
    let albumCards = 0;
    let albumTypesCollected = 0;
    let albumSetsMaxed = 0;
    for (const copies of album) {
      albumCards += copies;
      if (copies >= 1) albumTypesCollected++;
      if (copies >= lastTier.copies) albumSetsMaxed++;
    }

    const lifetimeKillsByType: Record<string, number> = {};
    for (let i = 0; i < data.enemyTypes.length; i++) {
      lifetimeKillsByType[data.enemyTypes[i]!.id] = lifetime.killsByType[i]!;
    }

    return {
      runsPlayed: lifetime.runs,
      lifetimeKills: lifetime.kills,
      lifetimeKillsByType,
      lifetimeBananas: lifetime.bananas,
      talentRanksBought,
      talentsMaxed,
      charactersPlayed: lifetime.characters.size,
      mapsPlayed: lifetime.maps.size,
      albumCards,
      albumTypesCollected,
      albumSetsMaxed,
      lastRun,
    };
  }

  /**
   * Avalia as conquistas ainda trancadas, desbloqueia, credita os prêmios e
   * retorna as novas. NÃO persiste (o chamador persiste uma vez no fim).
   */
  function unlockFresh(lastRun: RunFacts | null): RunOutcome {
    const fresh = evaluateAchievements(data, buildProgress(lastRun), unlocked);
    let rewardBananas = 0;
    for (const def of fresh) {
      unlocked.add(def.id);
      rewardBananas += def.reward;
    }
    bananas += rewardBananas;
    return { newAchievements: fresh, rewardBananas };
  }

  return {
    get bananas(): number {
      return bananas;
    },
    rankOf(id: string): number {
      return ranks[talentIndex(id)]!;
    },
    talentRanksArray(): number[] {
      return ranks.slice();
    },
    credit(amount: number): void {
      if (!Number.isFinite(amount) || amount <= 0) return;
      bananas += Math.floor(amount);
      save();
    },
    nextCost(id: string): number | null {
      const index = talentIndex(id);
      const def = data.talents[index]!;
      const rank = ranks[index]!;
      if (rank >= def.maxRank) return null;
      return def.costPerRank[rank]!;
    },
    canBuy(id: string): boolean {
      const cost = this.nextCost(id);
      return cost !== null && cost <= bananas;
    },
    buy(id: string): boolean {
      const index = talentIndex(id);
      const def = data.talents[index]!;
      const rank = ranks[index]!;
      if (rank >= def.maxRank) return false;
      const cost = def.costPerRank[rank]!;
      if (cost > bananas) return false;
      bananas -= cost;
      ranks[index] = rank + 1;
      // Comprar pode desbloquear conquista de loja (Cliente da Casa etc.);
      // o prêmio entra no saldo antes do save — tudo numa escrita só.
      unlockFresh(null);
      save();
      return true;
    },
    copiesOf(id: string): number {
      return album[enemyTypeIndex(id)]!;
    },
    albumCopiesArray(): number[] {
      return album.slice();
    },
    isUnlocked(id: string): boolean {
      if (!data.achievements.some((def) => def.id === id)) {
        throw new Error(`conquista desconhecida: ${id}`);
      }
      return unlocked.has(id);
    },
    get unlockedCount(): number {
      return unlocked.size;
    },
    lifetimeKillsOf(id: string): number {
      return lifetime.killsByType[enemyTypeIndex(id)]!;
    },
    recordRun(run: RunRecord): RunOutcome {
      if (run.killsByType.length !== data.enemyTypes.length) {
        throw new Error(
          `killsByType com tamanho ${run.killsByType.length}; esperado ${data.enemyTypes.length}`,
        );
      }
      if (run.cardsEarned.length !== data.enemyTypes.length) {
        throw new Error(
          `cardsEarned com tamanho ${run.cardsEarned.length}; esperado ${data.enemyTypes.length}`,
        );
      }

      const earned = Math.max(0, Math.floor(run.bananasEarned));
      bananas += earned;
      lifetime.bananas += earned;
      lifetime.runs += 1;
      lifetime.bestTimeSec = Math.max(lifetime.bestTimeSec, Math.floor(run.timeSec));
      lifetime.characters.add(run.characterId);
      lifetime.maps.add(run.mapId);

      let runKills = 0;
      for (let i = 0; i < data.enemyTypes.length; i++) {
        const kills = Math.max(0, Math.floor(run.killsByType[i]!));
        runKills += kills;
        lifetime.kills += kills;
        lifetime.killsByType[i] = lifetime.killsByType[i]! + kills;
        album[i] = album[i]! + Math.max(0, Math.floor(run.cardsEarned[i]!));
      }

      const outcome = unlockFresh({
        kills: runKills,
        timeSec: run.timeSec,
        level: run.level,
        died: run.died,
      });
      save();
      return outcome;
    },
  };
}

/**
 * localStorage com o ACESSO guardado: em alguns navegadores só tocar na
 * propriedade lança (política de privacidade). null = sem persistência.
 */
function resolveLocalStorage(): MetaStorage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
