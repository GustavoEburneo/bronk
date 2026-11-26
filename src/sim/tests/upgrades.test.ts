import { describe, expect, it } from 'vitest';
import { SIM_DT } from '../tick';
import type { World } from '../world';
import { UPGRADE_CHOICE_COUNT } from '../../data/upgrades';
import {
  applyUpgrade,
  applyUpgradesById,
  chooseUpgrade,
  findUpgradeIndex,
  openPendingUpgradeChoice,
  rerollChoice,
} from '../upgrades';
import { recomputeEffectiveStats } from '../stats';
import {
  baseEnemyType,
  characterById,
  cloneGameData,
  disableSpawn,
  makeTestWorld,
  placeEnemy,
  placeOrb,
  runTicks,
} from './helpers';

function makeWorld(seed = 1): World {
  return makeTestWorld({ seed, data: disableSpawn(cloneGameData()) });
}

/** Aplica `stacks` vezes a melhoria `id` direto, sem passar pelo sorteio. */
function stackUpgrade(world: World, id: string, stacks: number): void {
  const index = findUpgradeIndex(world.data, id);
  for (let i = 0; i < stacks; i++) applyUpgrade(world, index);
}

/** Põe todas as melhorias não-fallback no teto (pool de sorteio esgotado). */
function maxOutAllUpgrades(world: World): void {
  for (let i = 0; i < world.data.upgrades.length; i++) {
    const def = world.data.upgrades[i]!;
    if (def.isFallback !== true) world.upgradeStacks[i] = def.maxStacks;
  }
  recomputeEffectiveStats(world);
}

/** Dispara um level-up pelo caminho real: orbe colado que cobre o custo. */
function levelUpViaOrb(world: World): void {
  const needed = world.player.xpToNext - world.player.xp;
  // Folga pequena: o xpValue do orbe vive em Float32Array, e a divisão pelo
  // multiplicador arredondada em float32 poderia ficar um épsilon ABAIXO do
  // custo e não subir de nível.
  placeOrb(world, 0.1, 0, needed / world.stats.xpGainMultiplier + 1e-3);
  runTicks(world, 1);
}

function optionIds(world: World): string[] {
  if (world.upgradeChoice === null) throw new Error('nenhuma escolha aberta');
  return world.upgradeChoice.options.map((index) => world.data.upgrades[index]!.id);
}

describe('aplicação de efeitos (regra linear sobre a base)', () => {
  it('pimenta: +25% de dano da habilidade por stack, sobre a base', () => {
    const world = makeWorld();
    const base = world.ability.damage;

    stackUpgrade(world, 'pimenta', 1);
    expect(world.stats.abilityDamage).toBeCloseTo(base * 1.25, 10);

    stackUpgrade(world, 'pimenta', 4); // teto: 5 stacks
    expect(world.stats.abilityDamage).toBeCloseTo(base * (1 + 0.25 * 5), 10);
  });

  it('pimenta muda o dano real aplicado ao inimigo (mordida da capivara)', () => {
    const world = makeWorld();
    stackUpgrade(world, 'pimenta', 1);
    const index = placeEnemy(world, { x: 1, z: 0, hp: 1000 });

    runTicks(world, 1);

    expect(world.enemies.hp[index]!).toBeCloseTo(1000 - world.ability.damage * 1.25, 10);
  });

  it('bocao: +20% de alcance por stack; alvo antes fora do alcance passa a ser mordido', () => {
    const world = makeWorld();
    const base = world.ability.range;
    stackUpgrade(world, 'bocao', 4);
    expect(world.stats.abilityRange).toBeCloseTo(base * 1.8, 10);

    // Fora do alcance base (2,2) mas dentro do melhorado (3,96), já contando o
    // passo de perseguição do tick (3,2 u/s * 1/60 ≈ 0,053).
    const index = placeEnemy(world, { x: 3.5, z: 0 });
    runTicks(world, 1);
    expect(world.enemies.hp[index]!).toBeLessThan(baseEnemyType(world.data).maxHp);
  });

  it('cafe: −12% de recarga por stack, sobre a base', () => {
    const world = makeWorld();
    const base = world.ability.cooldown;

    stackUpgrade(world, 'cafe', 1);
    expect(world.stats.abilityCooldown).toBeCloseTo(base * 0.88, 10);

    stackUpgrade(world, 'cafe', 3); // teto: 4 stacks
    expect(world.stats.abilityCooldown).toBeCloseTo(base * (1 - 0.12 * 4), 10);
    // Com os valores atuais (0,8 * 0,52 = 0,416) o piso de 0,35 não ativa.
    expect(world.stats.abilityCooldown).toBeGreaterThan(0.35);
  });

  it('cafe: o piso da recarga clampa quando a redução passaria dele', () => {
    const data = disableSpawn(cloneGameData());
    const cafe = data.upgrades.find((def) => def.id === 'cafe')!;
    cafe.effect!.percentPerStack = -0.2; // 4 stacks: 0,8 * 0,2 = 0,16 < piso
    const world = makeTestWorld({ data });

    stackUpgrade(world, 'cafe', 4);

    expect(world.stats.abilityCooldown).toBe(cafe.effect!.min);
  });

  it('chinelo: +10% de velocidade por stack, refletido no deslocamento por tick', () => {
    const world = makeWorld();
    const base = characterById(world.data, 'capivara').stats.moveSpeed;
    stackUpgrade(world, 'chinelo', 1);
    expect(world.stats.moveSpeed).toBeCloseTo(base * 1.1, 10);

    runTicks(world, 1, { moveX: 1, moveZ: 0 });
    expect(world.player.x).toBeCloseTo(base * 1.1 * SIM_DT, 10);
  });

  it('marmita: +20 de HP máximo e cura 20, clampada no NOVO máximo', () => {
    const world = makeWorld();
    world.player.hp = 50;

    stackUpgrade(world, 'marmita', 1);
    expect(world.stats.maxHp).toBe(120);
    expect(world.player.hp).toBe(70);

    // Com HP cheio, a cura é limitada pelo novo máximo.
    world.player.hp = world.stats.maxHp;
    stackUpgrade(world, 'marmita', 1);
    expect(world.stats.maxHp).toBe(140);
    expect(world.player.hp).toBe(140);
  });

  it('ima: +50% no raio do ímã por stack; orbe antes parado passa a ser puxado', () => {
    const world = makeWorld();
    expect(world.stats.magnetRadius).toBe(world.data.xp.magnetRadius);

    const index = placeOrb(world, 5, 0); // fora do raio base de 3,5
    runTicks(world, 1);
    expect(world.orbs.posX[index]!).toBe(5);

    stackUpgrade(world, 'ima', 1);
    expect(world.stats.magnetRadius).toBeCloseTo(world.data.xp.magnetRadius * 1.5, 10);
    runTicks(world, 1);
    expect(world.orbs.posX[index]!).toBeLessThan(5);
  });

  it('capa: +0,25 s de i-frames por stack; no teto de 2 stacks bate no máximo de 1,1 s', () => {
    const world = makeWorld();
    stackUpgrade(world, 'capa', 1);
    expect(world.stats.contactIFrames).toBeCloseTo(0.85, 10);

    stackUpgrade(world, 'capa', 1);
    expect(world.stats.contactIFrames).toBeCloseTo(1.1, 10);
  });

  it('capa: o teto clampa o valor efetivo quando a soma passaria dele', () => {
    const data = disableSpawn(cloneGameData());
    const capa = data.upgrades.find((def) => def.id === 'capa')!;
    capa.effect!.max = 1.0; // 0,6 + 2 * 0,25 = 1,1 > teto customizado
    const world = makeTestWorld({ data });

    stackUpgrade(world, 'capa', 2);

    expect(world.stats.contactIFrames).toBe(1.0);
  });

  it('capa: a janela de invulnerabilidade usada no golpe é a melhorada', () => {
    const world = makeWorld();
    stackUpgrade(world, 'capa', 1);
    placeEnemy(world, { x: 0.5, z: 0, hp: 1000 });

    runTicks(world, 1);

    // O timer é armado no tick do golpe e só decrementa nos seguintes.
    expect(world.player.invulnTimer).toBeCloseTo(0.85, 10);
  });

  it('figurinha: +25% de XP por orbe', () => {
    const world = makeWorld();
    stackUpgrade(world, 'figurinha', 1);
    expect(world.stats.xpGainMultiplier).toBeCloseTo(1.25, 10);

    placeOrb(world, 0.1, 0);
    runTicks(world, 1);
    expect(world.player.xp).toBeCloseTo(baseEnemyType(world.data).xpValue * 1.25, 10);
  });

  it('trocado: cura 20 clampada no HP máximo efetivo e sem teto de stacks', () => {
    const world = makeWorld();
    world.player.hp = 50;
    stackUpgrade(world, 'trocado', 1);
    expect(world.player.hp).toBe(70);

    world.player.hp = world.stats.maxHp - 5;
    stackUpgrade(world, 'trocado', 1);
    expect(world.player.hp).toBe(world.stats.maxHp);

    // Sem teto: aplicar muitas vezes nunca lança.
    stackUpgrade(world, 'trocado', 10);
    expect(world.player.hp).toBe(world.stats.maxHp);
  });

  it('applyUpgrade acima do teto de stacks lança erro', () => {
    const world = makeWorld();
    stackUpgrade(world, 'capa', 2);
    expect(() => stackUpgrade(world, 'capa', 1)).toThrow(/teto/);
  });

  it('o dano da mordida não depende mais do nível (levelDamageBonus saiu)', () => {
    const world = makeWorld();
    world.player.level = 3;
    const index = placeEnemy(world, { x: 1, z: 0, hp: 1000 });

    runTicks(world, 1);

    expect(world.enemies.hp[index]!).toBe(1000 - world.ability.damage);
  });

  it('melhoria filtrada por characterId não entra no sorteio de outro personagem', () => {
    const data = disableSpawn(cloneGameData());
    data.upgrades.find((def) => def.id === 'pimenta')!.characterId = 'carteiro';
    const world = makeTestWorld({ data }); // capivara equipada

    // Esgota o pool inteiro escolhendo sempre a 1ª opção: a pimenta filtrada
    // nunca pode aparecer, nem quando ela é a única abaixo do teto.
    for (let i = 0; i < 30; i++) {
      world.pendingLevelUps = 1;
      openPendingUpgradeChoice(world);
      expect(optionIds(world)).not.toContain('pimenta');
      chooseUpgrade(world, 0);
    }
  });

  it('melhoria filtrada por characterId lança ao ser aplicada em outro personagem', () => {
    const data = disableSpawn(cloneGameData());
    data.upgrades.find((def) => def.id === 'pimenta')!.characterId = 'carteiro';
    const world = makeTestWorld({ data }); // capivara equipada

    expect(() => applyUpgradesById(world, ['pimenta'])).toThrow(/exclusiva/);
  });
});

describe('escolha pendente no level-up', () => {
  it('level-up abre escolha com 3 opções distintas, não-fallback e fora do teto', () => {
    for (let seed = 1; seed <= 10; seed++) {
      const world = makeWorld(seed);
      levelUpViaOrb(world);

      expect(world.pendingLevelUps).toBe(1);
      const choice = world.upgradeChoice;
      expect(choice).not.toBeNull();
      expect(choice!.options).toHaveLength(UPGRADE_CHOICE_COUNT);
      expect(new Set(choice!.options).size).toBe(UPGRADE_CHOICE_COUNT);
      expect(choice!.rerollAvailable).toBe(true);
      for (const index of choice!.options) {
        const def = world.data.upgrades[index]!;
        expect(def.isFallback).not.toBe(true);
        expect(world.upgradeStacks[index]!).toBeLessThan(def.maxStacks);
      }
    }
  });

  it('melhoria no teto sai do sorteio: só as elegíveis aparecem', () => {
    const world = makeWorld();
    maxOutAllUpgrades(world);
    // Reabre só pimenta e cafe: as duas únicas elegíveis.
    world.upgradeStacks[findUpgradeIndex(world.data, 'pimenta')] = 0;
    world.upgradeStacks[findUpgradeIndex(world.data, 'cafe')] = 0;
    recomputeEffectiveStats(world);

    levelUpViaOrb(world);

    expect(optionIds(world).sort()).toEqual(['cafe', 'pimenta']);
  });

  it('pool esgotado: a opção única é o fallback trocado', () => {
    const world = makeWorld();
    maxOutAllUpgrades(world);

    levelUpViaOrb(world);

    expect(optionIds(world)).toEqual(['trocado']);
    // Escolher o trocado cura e fecha a escolha.
    world.player.hp = 50;
    chooseUpgrade(world, 0);
    expect(world.player.hp).toBe(70);
    expect(world.upgradeChoice).toBeNull();
    expect(world.pendingLevelUps).toBe(0);
  });

  it('chooseUpgrade aplica a opção, fecha a escolha e decrementa a fila', () => {
    const world = makeWorld();
    levelUpViaOrb(world);
    const chosenIndex = world.upgradeChoice!.options[1]!;

    chooseUpgrade(world, 1);

    expect(world.upgradeStacks[chosenIndex]).toBe(1);
    expect(world.upgradeChoice).toBeNull();
    expect(world.pendingLevelUps).toBe(0);
  });

  it('vários level-ups no mesmo tick formam fila e resolvem um por vez', () => {
    const data = disableSpawn(cloneGameData());
    const world = makeTestWorld({ data });
    // Um orbe que cobre os custos dos níveis 1 e 2 de uma vez.
    baseEnemyType(data).xpValue = world.player.xpToNext * (1 + data.xp.growthPerLevel);
    placeOrb(world, 0.1, 0);
    runTicks(world, 1);

    expect(world.player.level).toBe(3);
    expect(world.pendingLevelUps).toBe(2);
    expect(world.upgradeChoice).not.toBeNull();

    chooseUpgrade(world, 0);
    // A próxima escolha da fila abre imediatamente, com reroll renovado.
    expect(world.pendingLevelUps).toBe(1);
    expect(world.upgradeChoice).not.toBeNull();
    expect(world.upgradeChoice!.rerollAvailable).toBe(true);

    chooseUpgrade(world, 0);
    expect(world.pendingLevelUps).toBe(0);
    expect(world.upgradeChoice).toBeNull();
  });

  it('reroll sorteia opções novas e só vale uma vez por level-up', () => {
    const world = makeWorld();
    levelUpViaOrb(world);
    const before = [...world.upgradeChoice!.options];

    rerollChoice(world);

    const after = world.upgradeChoice!.options;
    expect(world.upgradeChoice!.rerollAvailable).toBe(false);
    expect(after).toHaveLength(UPGRADE_CHOICE_COUNT);
    expect(new Set(after).size).toBe(UPGRADE_CHOICE_COUNT);
    // Com seed 1 o novo sorteio difere do primeiro (determinístico no teste).
    expect(after).not.toEqual(before);

    expect(() => rerollChoice(world)).toThrow(/reroll/);
  });

  it('reroll com pool esgotado devolve o fallback de novo e consome o reroll', () => {
    const world = makeWorld();
    maxOutAllUpgrades(world);
    levelUpViaOrb(world);

    rerollChoice(world);

    expect(optionIds(world)).toEqual(['trocado']);
    expect(world.upgradeChoice!.rerollAvailable).toBe(false);
  });

  it('reroll com só 2 elegíveis devolve o mesmo par', () => {
    const world = makeWorld();
    maxOutAllUpgrades(world);
    world.upgradeStacks[findUpgradeIndex(world.data, 'pimenta')] = 0;
    world.upgradeStacks[findUpgradeIndex(world.data, 'cafe')] = 0;
    recomputeEffectiveStats(world);
    levelUpViaOrb(world);

    rerollChoice(world);

    expect(optionIds(world).sort()).toEqual(['cafe', 'pimenta']);
    expect(world.upgradeChoice!.rerollAvailable).toBe(false);
  });

  it('o reroll volta a ficar disponível no level-up seguinte', () => {
    const world = makeWorld();
    levelUpViaOrb(world);
    rerollChoice(world);
    chooseUpgrade(world, 0);

    levelUpViaOrb(world);

    expect(world.upgradeChoice!.rerollAvailable).toBe(true);
  });

  it('morte e level-up no mesmo tick: a morte vence e nenhuma escolha abre', () => {
    const world = makeWorld();
    world.player.hp = baseEnemyType(world.data).contactDamage; // um golpe mata
    placeEnemy(world, { x: 0.5, z: 0, hp: 1000 });
    baseEnemyType(world.data).xpValue = world.player.xpToNext;
    placeOrb(world, 0.1, 0);

    runTicks(world, 1);

    expect(world.events).toContainEqual({ type: 'levelUp', level: 2 });
    expect(world.events).toContainEqual({ type: 'playerDied' });
    expect(world.status).toBe('gameOver');
    expect(world.upgradeChoice).toBeNull();
  });

  it('a sim não se pausa: ticks seguem com escolha aberta e level-up extra só enfileira', () => {
    const world = makeWorld();
    levelUpViaOrb(world);
    const openOptions = [...world.upgradeChoice!.options];
    const timeBefore = world.time;

    runTicks(world, 5);
    expect(world.time).toBeGreaterThan(timeBefore);

    levelUpViaOrb(world); // segundo level-up com a escolha ainda aberta
    expect(world.pendingLevelUps).toBe(2);
    // A escolha aberta não é substituída pelo level-up enfileirado.
    expect(world.upgradeChoice!.options).toEqual(openOptions);
  });

  it('chooseUpgrade sem escolha aberta ou com índice inválido lança erro', () => {
    const world = makeWorld();
    expect(() => chooseUpgrade(world, 0)).toThrow(/escolha/);
    expect(() => rerollChoice(world)).toThrow(/escolha/);

    levelUpViaOrb(world);
    expect(() => chooseUpgrade(world, -1)).toThrow(/opção/);
    expect(() => chooseUpgrade(world, 3)).toThrow(/opção/);
    expect(() => chooseUpgrade(world, 0.5)).toThrow(/opção/);
  });

  it('determinismo: mesma seed e mesmo roteiro de escolhas, mesmo resultado', () => {
    const roll = (world: World): unknown => {
      levelUpViaOrb(world);
      rerollChoice(world);
      const firstOptions = [...world.upgradeChoice!.options];
      chooseUpgrade(world, 1);
      levelUpViaOrb(world);
      const secondOptions = [...world.upgradeChoice!.options];
      chooseUpgrade(world, 2);
      return {
        firstOptions,
        secondOptions,
        stacks: [...world.upgradeStacks],
        stats: { ...world.stats },
        hp: world.player.hp,
      };
    };

    expect(roll(makeWorld(777))).toEqual(roll(makeWorld(777)));
  });
});

describe('applyUpgradesById (montagem de build por id, usada pelo ?melhorias=)', () => {
  it('aplica a sequência em ordem, acumulando stacks e stats efetivos', () => {
    const world = makeWorld();
    const baseCooldown = world.ability.cooldown;
    const baseRange = world.ability.range;

    applyUpgradesById(world, ['cafe', 'cafe', 'bocao']);

    expect(world.upgradeStacks[findUpgradeIndex(world.data, 'cafe')]).toBe(2);
    expect(world.upgradeStacks[findUpgradeIndex(world.data, 'bocao')]).toBe(1);
    expect(world.stats.abilityCooldown).toBeCloseTo(baseCooldown * (1 - 0.12 * 2), 10);
    expect(world.stats.abilityRange).toBeCloseTo(baseRange * 1.2, 10);
  });

  it('lança em id desconhecido', () => {
    expect(() => applyUpgradesById(makeWorld(), ['cafezinho'])).toThrow(
      'melhoria desconhecida: cafezinho',
    );
  });

  it('lança ao estourar o teto de stacks (build de teste inválida não passa calada)', () => {
    const world = makeWorld();
    const cafe = world.data.upgrades[findUpgradeIndex(world.data, 'cafe')]!;
    const tooMany = Array.from({ length: cafe.maxStacks + 1 }, () => 'cafe');
    expect(() => applyUpgradesById(world, tooMany)).toThrow('teto');
  });
});
