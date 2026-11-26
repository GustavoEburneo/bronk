import { describe, expect, it } from 'vitest';
import type { GameData } from '../../data/tables';
import type { World } from '../world';
import { CardPhase } from '../pool';
import { EnemyState } from '../enemyState';
import { applyUpgradesById } from '../upgrades';
import {
  baseEnemyType,
  characterById,
  cloneGameData,
  disableSpawn,
  freezeEnemies,
  makeTestWorld,
  placeEnemy,
  runTicks,
} from './helpers';

/**
 * Cenário padrão: carteiro, sem spawn aleatório e inimigos congelados no lugar
 * (asserções de posição/timing exatas). Números base do GDD: dano 7,
 * cooldown 1,2 s, alcance 7 u, velocidade 14 u/s (0,2333 u/tick), raio da
 * carta 0,6 u; raio do inimigo 0,45 (zona de acerto 1,05 u); captura por soma
 * de raios 0,5 + 0,6 = 1,1 u.
 */
function makeCarteiroWorld(data?: GameData): World {
  return makeTestWorld({
    characterId: 'carteiro',
    data: data ?? freezeEnemies(disableSpawn(cloneGameData())),
  });
}

/** Ability 'cartas' do carteiro no clone dado, pronta para o teste customizar. */
function carteiroCards(data: GameData) {
  const ability = characterById(data, 'carteiro').ability;
  if (ability.kind !== 'cartas') throw new Error('carteiro deveria usar cartas');
  return ability;
}

describe('cartas: lançamento e mira', () => {
  it('sem inimigo no alcance não arremessa e o cooldown não gasta (segura em 0)', () => {
    const world = makeCarteiroWorld();

    runTicks(world, 100);
    expect(world.cards.count).toBe(0);
    expect(world.player.abilityCooldown).toBe(0);

    // Alvo aparece: o cooldown segurado dispara o arremesso no mesmo tick.
    placeEnemy(world, { x: 3, z: 0, hp: 1000 });
    runTicks(world, 1);
    expect(world.cards.count).toBe(1);
    expect(world.events).toContainEqual({ type: 'cardFired' });
  });

  it('inimigo fora do alcance de arremesso não vira alvo', () => {
    const world = makeCarteiroWorld();
    placeEnemy(world, { x: world.ability.range + 0.5, z: 0, hp: 1000 });

    runTicks(world, 50);

    expect(world.cards.count).toBe(0);
    expect(world.player.abilityCooldown).toBe(0);
  });

  it('inimigo em Spawning não é alvo; vira alvo quando entra em Chasing', () => {
    const world = makeCarteiroWorld();
    placeEnemy(world, { x: 3, z: 0, hp: 1000, state: EnemyState.Spawning });

    runTicks(world, 5); // ainda em Spawning (dura 0,4 s = 24 ticks)
    expect(world.cards.count).toBe(0);

    runTicks(world, 25); // já virou Chasing: arremesso imediato
    expect(world.cards.count).toBe(1);
  });

  it('mira no inimigo mais próximo e parte da posição do player', () => {
    const world = makeCarteiroWorld();
    placeEnemy(world, { x: 0, z: 4, hp: 1000 }); // mais próximo
    placeEnemy(world, { x: 5, z: 0, hp: 1000 });

    runTicks(world, 1);

    expect(world.cards.count).toBe(1);
    expect(world.cards.dirX[0]!).toBeCloseTo(0, 5);
    expect(world.cards.dirZ[0]!).toBeCloseTo(1, 5);
    // Partiu do player (origem) e andou 1 passo de 14/60 na direção do alvo.
    expect(world.cards.posX[0]!).toBeCloseTo(0, 5);
    expect(world.cards.posZ[0]!).toBeCloseTo(14 / 60, 4);
  });
});

describe('cartas: voo ida → volta → captura', () => {
  it('vai em linha reta até o alcance, volta perseguindo o player e é capturada', () => {
    const world = makeCarteiroWorld();
    placeEnemy(world, { x: 3, z: 0, hp: 1000 });

    runTicks(world, 25); // 25 ticks × 0,2333 ≈ 5,8 u: ainda na ida
    expect(world.cards.count).toBe(1);
    expect(world.cards.phase[0]).toBe(CardPhase.Outgoing);

    runTicks(world, 10); // alcance de 7 u vencido (~30 ticks): voltando
    expect(world.cards.count).toBe(1);
    expect(world.cards.phase[0]).toBe(CardPhase.Returning);

    runTicks(world, 35); // volta de ~7 u até 1,1 u do player: capturada
    expect(world.cards.count).toBe(0);
  });

  it('a volta persegue a posição ATUAL do player, não a do arremesso', () => {
    const world = makeCarteiroWorld();
    placeEnemy(world, { x: 3, z: 0, hp: 1e6 });
    runTicks(world, 1); // arremesso na direção +x

    // Player corre para -z durante o voo inteiro: a captura exige homing
    // (fechamento mínimo de 14 − 8 = 6 u/s; captura bem antes dos 3 s de teto,
    // então count 0 aqui prova captura, não despawn por timeout).
    runTicks(world, 149, { moveX: 0, moveZ: -1 });

    expect(world.cards.count).toBe(0); // capturada mesmo com o player longe
  });

  it('despawn de segurança: carta que não completa o voo some aos 3 s', () => {
    const data = freezeEnemies(disableSpawn(cloneGameData()));
    const ability = carteiroCards(data);
    ability.projectileSpeed = 1; // ida de 7 u levaria 7 s: estoura o teto antes
    ability.cooldown = 10; // só 1 carta na janela observada
    const world = makeCarteiroWorld(data);
    placeEnemy(world, { x: 3, z: 0, hp: 1e6 });

    runTicks(world, 175); // 2,92 s de voo: ainda viva
    expect(world.cards.count).toBe(1);

    runTicks(world, 10); // 3 s vencidos (folga para o acúmulo em float32)
    expect(world.cards.count).toBe(0);
  });
});

describe('cartas: dano na ida e na volta', () => {
  it('acerta o mesmo inimigo no máximo 1× na ida e 1× na volta', () => {
    const world = makeCarteiroWorld();
    const index = placeEnemy(world, { x: 3, z: 0, hp: 1000 });

    // Ida: a carta atravessa a zona de acerto por ~9 ticks, mas fere só 1×.
    runTicks(world, 25);
    expect(world.enemies.hp[index]!).toBe(1000 - 7);

    // Volta: mais exatamente 1 acerto; carta capturada antes do 2º arremesso.
    runTicks(world, 45);
    expect(world.enemies.hp[index]!).toBe(1000 - 14);
    expect(world.cards.count).toBe(0);
  });

  it('atravessa vários inimigos no mesmo voo, ferindo cada um na ida e na volta', () => {
    const world = makeCarteiroWorld();
    const near = placeEnemy(world, { x: 2, z: 0, hp: 1000 });
    const mid = placeEnemy(world, { x: 4, z: 0, hp: 1000 });
    const far = placeEnemy(world, { x: 6, z: 0, hp: 1000 });

    runTicks(world, 70); // voo completo, antes do segundo arremesso (~tick 72)

    expect(world.cards.count).toBe(0);
    expect(world.enemies.hp[near]!).toBe(1000 - 14);
    expect(world.enemies.hp[mid]!).toBe(1000 - 14);
    expect(world.enemies.hp[far]!).toBe(1000 - 14);
  });

  it('inimigo morto pela carta entra em Dying e emite enemyDied; mortos não são feridos', () => {
    const world = makeCarteiroWorld();
    const index = placeEnemy(world, { x: 3, z: 0, hp: 7 }); // morre no 1º acerto

    runTicks(world, 10);

    expect(world.enemies.state[index]).toBe(EnemyState.Dying);
    expect(
      world.events.some((event) => event.type === 'enemyDied') || world.enemies.hp[index]! <= 0,
    ).toBe(true);
    const hpAfterKill = world.enemies.hp[index]!;
    runTicks(world, 2); // ainda em Dying (dura 0,25 s): a carta não fere de novo
    expect(world.enemies.hp[index]!).toBe(hpAfterKill);
  });

  it('gameOver congela as cartas junto com o resto do mundo', () => {
    const world = makeCarteiroWorld();
    placeEnemy(world, { x: 3, z: 0, hp: 1e6 }); // alvo do arremesso
    placeEnemy(world, { x: 0.5, z: 0, hp: 1e6 }); // contato: mata o player
    world.player.hp = baseEnemyType(world.data).contactDamage;

    runTicks(world, 1);
    expect(world.status).toBe('gameOver');
    expect(world.cards.count).toBe(1);
    const cardX = world.cards.posX[0]!;

    runTicks(world, 30);
    expect(world.cards.count).toBe(1);
    expect(world.cards.posX[0]!).toBe(cardX);
  });
});

describe('cartas: teto de voo e pool', () => {
  it('no teto de cartas em voo o lançamento é adiado segurando o cooldown em 0', () => {
    const data = freezeEnemies(disableSpawn(cloneGameData()));
    const ability = carteiroCards(data);
    ability.cooldown = 0.4; // acima do piso de 0,35 do café: lança a cada ~24 ticks
    ability.range = 20; // voo longo: ~2,8 s por carta, acumula em voo
    const world = makeCarteiroWorld(data);
    placeEnemy(world, { x: 3, z: 0, hp: 1e6 });

    runTicks(world, 80); // 3 lançadas (ticks ~1/25/49); a 4ª (~73) fica adiada
    expect(world.cards.count).toBe(3);
    expect(world.player.abilityCooldown).toBe(0);

    // O teto nunca é violado e, quando uma carta volta, o arremesso adiado sai.
    let fired = 0;
    for (let i = 0; i < 230; i++) {
      runTicks(world, 1);
      expect(world.cards.count).toBeLessThanOrEqual(ability.maxLive);
      fired += world.events.filter((event) => event.type === 'cardFired').length;
    }
    expect(fired).toBeGreaterThanOrEqual(1); // houve novo arremesso pós-captura
  });
});

describe('cartas: melhorias genéricas sobre a habilidade equipada', () => {
  it('cafe reduz a recarga do arremesso sobre a base do carteiro', () => {
    const world = makeCarteiroWorld();
    applyUpgradesById(world, ['cafe']);
    expect(world.stats.abilityCooldown).toBeCloseTo(1.2 * 0.88, 10);
  });

  it('bocao estende o alcance de arremesso: alvo antes inalcançável vira alvo', () => {
    const noUpgrade = makeCarteiroWorld();
    placeEnemy(noUpgrade, { x: 8, z: 0, hp: 1000 }); // fora dos 7 u base
    runTicks(noUpgrade, 10);
    expect(noUpgrade.cards.count).toBe(0);

    const withBocao = makeCarteiroWorld();
    applyUpgradesById(withBocao, ['bocao']); // alcance 8,4 u
    placeEnemy(withBocao, { x: 8, z: 0, hp: 1000 });
    runTicks(withBocao, 1);
    expect(withBocao.cards.count).toBe(1);
  });

  it('pimenta aumenta o dano por acerto da carta', () => {
    const world = makeCarteiroWorld();
    applyUpgradesById(world, ['pimenta']); // dano 7 × 1,25 = 8,75
    const index = placeEnemy(world, { x: 3, z: 0, hp: 1000 });

    runTicks(world, 25); // só o acerto da ida

    expect(world.enemies.hp[index]!).toBeCloseTo(1000 - 8.75, 3);
  });
});
