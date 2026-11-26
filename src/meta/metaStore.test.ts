/**
 * Cofre de meta-progressão: persistência, sanitização de carga e regras de
 * compra. Usa storage falso em memória — o módulo degrada para memória sem
 * storage, e os testes exercitam exatamente essa borda.
 */
import { describe, expect, it } from 'vitest';
import { gameData } from '../data/tables';
import type { MetaStorage, RunRecord } from './metaStore';
import { createMetaStore, META_STORAGE_KEY } from './metaStore';

function fakeStorage(initial?: string): MetaStorage & { map: Map<string, string> } {
  const map = new Map<string, string>();
  if (initial !== undefined) map.set(META_STORAGE_KEY, initial);
  return {
    map,
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => void map.set(key, value),
  };
}

const firstTalent = gameData.talents[0]!;

describe('createMetaStore', () => {
  it('começa zerado sem save anterior', () => {
    const meta = createMetaStore(gameData, fakeStorage());
    expect(meta.bananas).toBe(0);
    expect(meta.talentRanksArray()).toEqual(new Array(gameData.talents.length).fill(0));
  });

  it('credit persiste e um store novo recarrega o saldo', () => {
    const storage = fakeStorage();
    createMetaStore(gameData, storage).credit(123);
    expect(createMetaStore(gameData, storage).bananas).toBe(123);
  });

  it('credit ignora valores não positivos e não finitos', () => {
    const meta = createMetaStore(gameData, fakeStorage());
    meta.credit(0);
    meta.credit(-10);
    meta.credit(Number.NaN);
    expect(meta.bananas).toBe(0);
  });

  it('buy debita o custo, sobe o rank, desbloqueia conquista de loja e persiste', () => {
    const storage = fakeStorage();
    const meta = createMetaStore(gameData, storage);
    const cost = firstTalent.costPerRank[0]!;
    meta.credit(cost + 5);

    expect(meta.isUnlocked('cliente-da-casa')).toBe(false);
    expect(meta.nextCost(firstTalent.id)).toBe(cost);
    expect(meta.buy(firstTalent.id)).toBe(true);
    // A 1ª compra desbloqueia "Cliente da Casa": sobram 5 + o prêmio dela.
    const clienteReward = gameData.achievements.find((def) => def.id === 'cliente-da-casa')!
      .reward;
    expect(meta.isUnlocked('cliente-da-casa')).toBe(true);
    expect(meta.bananas).toBe(5 + clienteReward);
    expect(meta.rankOf(firstTalent.id)).toBe(1);
    // O próximo nível custa a 2ª entrada da tabela.
    expect(meta.nextCost(firstTalent.id)).toBe(firstTalent.costPerRank[1] ?? null);

    const reloaded = createMetaStore(gameData, storage);
    expect(reloaded.rankOf(firstTalent.id)).toBe(1);
    expect(reloaded.bananas).toBe(5 + clienteReward);
    // O desbloqueio persiste: recarregar não re-premia.
    expect(reloaded.isUnlocked('cliente-da-casa')).toBe(true);
  });

  it('buy sem saldo falha sem alterar nada', () => {
    const meta = createMetaStore(gameData, fakeStorage());
    meta.credit(firstTalent.costPerRank[0]! - 1);
    expect(meta.canBuy(firstTalent.id)).toBe(false);
    expect(meta.buy(firstTalent.id)).toBe(false);
    expect(meta.rankOf(firstTalent.id)).toBe(0);
  });

  it('no teto: nextCost null, canBuy e buy falham', () => {
    const meta = createMetaStore(gameData, fakeStorage());
    meta.credit(1_000_000);
    for (let r = 0; r < firstTalent.maxRank; r++) expect(meta.buy(firstTalent.id)).toBe(true);
    expect(meta.rankOf(firstTalent.id)).toBe(firstTalent.maxRank);
    expect(meta.nextCost(firstTalent.id)).toBeNull();
    expect(meta.canBuy(firstTalent.id)).toBe(false);
    expect(meta.buy(firstTalent.id)).toBe(false);
  });

  it('carga sanitiza lixo: JSON inválido, ids mortos, ranks estourados e saldo quebrado', () => {
    expect(createMetaStore(gameData, fakeStorage('{{{nem json')).bananas).toBe(0);

    const dirty = JSON.stringify({
      bananas: 77.9,
      talentRanks: {
        [firstTalent.id]: firstTalent.maxRank + 50, // clampa no teto
        'talento-removido': 3, // id desconhecido cai
        [gameData.talents[1]!.id]: -2, // negativo vira 0
      },
    });
    const meta = createMetaStore(gameData, fakeStorage(dirty));
    expect(meta.bananas).toBe(77);
    expect(meta.rankOf(firstTalent.id)).toBe(firstTalent.maxRank);
    expect(meta.rankOf(gameData.talents[1]!.id)).toBe(0);
  });

  it('rankOf/nextCost com id desconhecido lançam (contrato da API)', () => {
    const meta = createMetaStore(gameData, fakeStorage());
    expect(() => meta.rankOf('nao-existe')).toThrow(/talento desconhecido/);
    expect(() => meta.nextCost('nao-existe')).toThrow(/talento desconhecido/);
    expect(() => meta.copiesOf('nao-existe')).toThrow(/tipo de inimigo desconhecido/);
    expect(() => meta.isUnlocked('nao-existe')).toThrow(/conquista desconhecida/);
  });
});

/** Array por tipo de inimigo zerado, com overrides por id. */
function perType(overrides: Record<string, number> = {}): number[] {
  const counts = new Array<number>(gameData.enemyTypes.length).fill(0);
  for (const [id, value] of Object.entries(overrides)) {
    const index = gameData.enemyTypes.findIndex((def) => def.id === id);
    if (index < 0) throw new Error(`tipo desconhecido no teste: ${id}`);
    counts[index] = value;
  }
  return counts;
}

/** RunRecord padrão dos testes, com overrides. */
function runRecord(overrides: Partial<RunRecord> = {}): RunRecord {
  return {
    characterId: 'capivara',
    mapId: 'cidade',
    timeSec: 120,
    level: 5,
    died: true,
    bananasEarned: 30,
    killsByType: perType({ cone: 30 }),
    cardsEarned: perType(),
    ...overrides,
  };
}

function rewardOf(id: string): number {
  const def = gameData.achievements.find((achievement) => achievement.id === id);
  if (def === undefined) throw new Error(`conquista desconhecida no teste: ${id}`);
  return def.reward;
}

describe('recordRun (fechamento de run: bananas, álbum, conquistas)', () => {
  it('credita bananas e figurinhas, desbloqueia as primeiras conquistas e persiste', () => {
    const storage = fakeStorage();
    const meta = createMetaStore(gameData, storage);

    const outcome = meta.recordRun(runRecord({ cardsEarned: perType({ cone: 2, rato: 1 }) }));

    const ids = outcome.newAchievements.map((def) => def.id);
    expect(ids).toContain('estreia'); // 1ª run
    expect(ids).toContain('primeiro-cascudo'); // 1º abate
    expect(ids).toContain('colecionador'); // 1ª figurinha
    expect(outcome.rewardBananas).toBe(
      ids.reduce((sum, id) => sum + rewardOf(id), 0),
    );
    // Saldo = bananas da run + prêmios (creditados uma única vez).
    expect(meta.bananas).toBe(30 + outcome.rewardBananas);
    expect(meta.copiesOf('cone')).toBe(2);
    expect(meta.copiesOf('rato')).toBe(1);
    expect(meta.lifetimeKillsOf('cone')).toBe(30);

    const reloaded = createMetaStore(gameData, storage);
    expect(reloaded.copiesOf('cone')).toBe(2);
    expect(reloaded.isUnlocked('estreia')).toBe(true);
    expect(reloaded.bananas).toBe(meta.bananas);
  });

  it('conquista desbloqueada não re-premia em runs seguintes', () => {
    const meta = createMetaStore(gameData, fakeStorage());
    const first = meta.recordRun(runRecord());
    expect(first.newAchievements.map((def) => def.id)).toContain('estreia');

    const second = meta.recordRun(runRecord());
    expect(second.newAchievements.map((def) => def.id)).not.toContain('estreia');
  });

  it('Rapidinha exige MORRER em menos de 30 s (desistência não conta)', () => {
    const meta = createMetaStore(gameData, fakeStorage());
    const quit = meta.recordRun(runRecord({ timeSec: 10, died: false }));
    expect(quit.newAchievements.map((def) => def.id)).not.toContain('rapidinha');

    const death = meta.recordRun(runRecord({ timeSec: 10, died: true }));
    expect(death.newAchievements.map((def) => def.id)).toContain('rapidinha');
  });

  it('condições de run: sobreviver 5 min e nível 10', () => {
    const meta = createMetaStore(gameData, fakeStorage());
    const outcome = meta.recordRun(runRecord({ timeSec: 301, level: 10 }));
    const ids = outcome.newAchievements.map((def) => def.id);
    expect(ids).toContain('aguenta-mao');
    expect(ids).toContain('subiu-na-vida');
  });

  it('Rodízio (3 personagens) e Turista (2 mapas) acumulam entre runs', () => {
    const meta = createMetaStore(gameData, fakeStorage());
    meta.recordRun(runRecord({ characterId: 'capivara', mapId: 'cidade' }));
    meta.recordRun(runRecord({ characterId: 'carteiro', mapId: 'feira' }));
    expect(meta.isUnlocked('turista-local')).toBe(true);
    expect(meta.isUnlocked('rodizio')).toBe(false);

    const outcome = meta.recordRun(runRecord({ characterId: 'churrasqueiro' }));
    expect(outcome.newAchievements.map((def) => def.id)).toContain('rodizio');
  });

  it('set completo do álbum (último degrau) desbloqueia Página Virada', () => {
    const meta = createMetaStore(gameData, fakeStorage());
    const lastTier = gameData.album.tiers[gameData.album.tiers.length - 1]!;
    const outcome = meta.recordRun(
      runRecord({ cardsEarned: perType({ cone: lastTier.copies }) }),
    );
    expect(outcome.newAchievements.map((def) => def.id)).toContain('pagina-virada');
  });

  it('killsByType/cardsEarned com tamanho errado falham rápido', () => {
    const meta = createMetaStore(gameData, fakeStorage());
    expect(() => meta.recordRun(runRecord({ killsByType: [1] }))).toThrow(/killsByType/);
    expect(() => meta.recordRun(runRecord({ cardsEarned: [1] }))).toThrow(/cardsEarned/);
  });

  it('carga sanitiza álbum, conquistas e lifetime com lixo', () => {
    const dirty = JSON.stringify({
      bananas: 10,
      album: { cone: 3.9, 'bicho-removido': 5, rato: -1 },
      achievements: ['estreia', 'conquista-removida', 42],
      lifetime: { runs: 2.7, kills: 'muitos', killsByType: { cone: 12 }, characters: ['capivara', 'ninguem'] },
    });
    const meta = createMetaStore(gameData, fakeStorage(dirty));
    expect(meta.copiesOf('cone')).toBe(3); // floor
    expect(meta.copiesOf('rato')).toBe(0); // negativo vira 0
    expect(meta.isUnlocked('estreia')).toBe(true);
    expect(meta.unlockedCount).toBe(1); // os ids inválidos caíram
    expect(meta.lifetimeKillsOf('cone')).toBe(12);
  });
});
