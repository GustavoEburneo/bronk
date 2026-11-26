import { describe, expect, it } from 'vitest';
import { gameData } from '../../data/tables';
import { CARD_POOL_CAPACITY } from '../../data/characters';
import { validateGameData } from '../../data/validate';
import { characterById, cloneGameData, mapById } from './helpers';

describe('validação do gameData', () => {
  it('a tabela oficial passa na validação', () => {
    expect(() => validateGameData(gameData)).not.toThrow();
  });

  it('ringMinRadius >= ringMaxRadius é rejeitado citando o campo', () => {
    const data = cloneGameData();
    data.spawn.ringMinRadius = data.spawn.ringMaxRadius;
    expect(() => validateGameData(data)).toThrow(/ringMinRadius/);
  });
});

describe('validação da tabela de personagens', () => {
  it('ability.cooldown igual a 0 é rejeitado citando o campo', () => {
    const data = cloneGameData();
    characterById(data, 'capivara').ability.cooldown = 0;
    expect(() => validateGameData(data)).toThrow(/ability\.cooldown/);
  });

  it('NaN em stats.moveSpeed é rejeitado citando o campo', () => {
    const data = cloneGameData();
    characterById(data, 'capivara').stats.moveSpeed = Number.NaN;
    expect(() => validateGameData(data)).toThrow(/stats\.moveSpeed/);
  });

  it('id de personagem duplicado é rejeitado', () => {
    const data = cloneGameData();
    data.characters[1]!.id = data.characters[0]!.id;
    expect(() => validateGameData(data)).toThrow(/duplicado/);
  });

  it('mordida com alcance menor que a soma dos raios (com o MAIOR tipo) é rejeitada', () => {
    const data = cloneGameData();
    const capivara = characterById(data, 'capivara');
    const maxRadius = Math.max(...data.enemyTypes.map((type) => type.radius));
    capivara.ability.range = capivara.stats.radius + maxRadius;
    expect(() => validateGameData(data)).toThrow(/ability\.range/);
  });

  it('anti-tunneling: velocidade de carta que atravessa inimigo num tick é rejeitada', () => {
    const data = cloneGameData();
    const ability = characterById(data, 'carteiro').ability;
    if (ability.kind !== 'cartas') throw new Error('carteiro deveria usar cartas');
    ability.projectileSpeed = 1000; // 1000/60 ≈ 16,7 u/tick >> 0,6 + 0,45
    expect(() => validateGameData(data)).toThrow(/tunneling/);
  });

  it('fumaça com raio menor que a soma dos raios (com o MAIOR tipo) é rejeitada', () => {
    const data = cloneGameData();
    const churrasqueiro = characterById(data, 'churrasqueiro');
    const maxRadius = Math.max(...data.enemyTypes.map((type) => type.radius));
    churrasqueiro.ability.range = churrasqueiro.stats.radius + maxRadius;
    expect(() => validateGameData(data)).toThrow(/ability\.range/);
  });

  it('fumaça com dano, cooldown ou raio não positivos é rejeitada citando o campo', () => {
    for (const field of ['damage', 'cooldown', 'range'] as const) {
      const data = cloneGameData();
      characterById(data, 'churrasqueiro').ability[field] = 0;
      expect(() => validateGameData(data)).toThrow(new RegExp(`ability\\.${field}`));
    }
  });

  it('maxLive fora de [1, 128] ou acima da capacidade do pool é rejeitado', () => {
    const data = cloneGameData();
    const ability = characterById(data, 'carteiro').ability;
    if (ability.kind !== 'cartas') throw new Error('carteiro deveria usar cartas');

    ability.maxLive = 0;
    expect(() => validateGameData(data)).toThrow(/maxLive/);

    ability.maxLive = 2.5;
    expect(() => validateGameData(data)).toThrow(/maxLive/);

    ability.maxLive = CARD_POOL_CAPACITY + 1;
    expect(() => validateGameData(data)).toThrow(/maxLive/);
  });
});

describe('validação da tabela de mapas', () => {
  it('nenhum mapa jogável é rejeitado', () => {
    const data = cloneGameData();
    for (const map of data.maps) map.playable = false;
    expect(() => validateGameData(data)).toThrow(/jogável/);
  });

  it('id de mapa duplicado é rejeitado', () => {
    const data = cloneGameData();
    data.maps[1]!.id = data.maps[0]!.id;
    expect(() => validateGameData(data)).toThrow(/duplicado/);
  });

  it('mapa jogável com arena menor que o anel de spawn é rejeitado', () => {
    const data = cloneGameData();
    mapById(data, 'cidade').arena.halfSize = data.spawn.ringMaxRadius;
    // O despawnRadius do pombo (40) também estoura a arena encolhida e a
    // validação dele roda antes: encolhe junto para isolar a regra do anel.
    for (const type of data.enemyTypes) {
      if (type.behavior.kind === 'flyby') {
        type.behavior.despawnRadius = data.spawn.ringMaxRadius;
      }
    }
    expect(() => validateGameData(data)).toThrow(/ringMaxRadius/);
  });

  it('arena de mapa "em breve" ainda precisa ser finita e positiva', () => {
    const data = cloneGameData();
    mapById(data, 'feira').arena.halfSize = 0;
    expect(() => validateGameData(data)).toThrow(/halfSize/);
  });
});

describe('validação da tabela de melhorias', () => {
  it('id duplicado é rejeitado', () => {
    const data = cloneGameData();
    data.upgrades[1]!.id = data.upgrades[0]!.id;
    expect(() => validateGameData(data)).toThrow(/duplicado/);
  });

  it('characterId desconhecido é rejeitado', () => {
    const data = cloneGameData();
    data.upgrades[0]!.characterId = 'motoboy';
    expect(() => validateGameData(data)).toThrow(/characterId/);
  });

  it('mais de um fallback é rejeitado', () => {
    const data = cloneGameData();
    data.upgrades[0]!.isFallback = true;
    data.upgrades[0]!.maxStacks = Number.POSITIVE_INFINITY;
    delete data.upgrades[0]!.effect;
    data.upgrades[0]!.healOnPick = 20;
    expect(() => validateGameData(data)).toThrow(/exatamente 1 fallback/);
  });

  it('nenhum fallback é rejeitado', () => {
    const data = cloneGameData();
    data.upgrades = data.upgrades.filter((def) => def.isFallback !== true);
    expect(() => validateGameData(data)).toThrow(/exatamente 1 fallback/);
  });

  it('maxStacks 0 em melhoria comum é rejeitado', () => {
    const data = cloneGameData();
    data.upgrades[0]!.maxStacks = 0;
    expect(() => validateGameData(data)).toThrow(/maxStacks/);
  });

  it('efeito sem percentual nem valor absoluto é rejeitado', () => {
    const data = cloneGameData();
    data.upgrades[0]!.effect!.percentPerStack = 0;
    data.upgrades[0]!.effect!.flatPerStack = 0;
    expect(() => validateGameData(data)).toThrow(/sem percentual/);
  });

  it('fallback com efeito contínuo é rejeitado', () => {
    const data = cloneGameData();
    const fallback = data.upgrades.find((def) => def.isFallback === true)!;
    fallback.effect = { stat: 'player.maxHp', percentPerStack: 0, flatPerStack: 1 };
    expect(() => validateGameData(data)).toThrow(/fallback/);
  });

  it('stat que zera ou vira negativo no teto de stacks é rejeitado, citando o personagem', () => {
    const data = cloneGameData();
    const cafe = data.upgrades.find((def) => def.id === 'cafe')!;
    cafe.effect!.percentPerStack = -0.3; // 4 stacks: cooldown * (1 - 1,2) < 0...
    delete cafe.effect!.min; // ...e sem piso para segurar...
    // ...nem o piso do talento de recarga (clamp vale por stat, de qualquer fonte).
    const despertador = data.talents.find((def) => def.id === 'despertador')!;
    delete despertador.effect.min;
    expect(() => validateGameData(data)).toThrow(/teto.*personagem/);
  });
});
