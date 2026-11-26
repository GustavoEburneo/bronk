/**
 * Mapa Rio de Janeiro (2026-11-23): cronograma próprio (a curva de
 * dificuldade é dado do mapa) e fauna própria. Os COMPORTAMENTOS da fauna
 * (chase, investida, flyby) já são cobertos pelos testes da avenida e da
 * feira — aqui valida-se o que é DO MAPA: cronograma, id e arena. O relevo
 * não aparece: é apresentação (render/terrain.ts), a sim segue 2D.
 */
import { describe, expect, it } from 'vitest';
import { cloneGameData, makeTestWorld, runTicks } from './helpers';

describe('mapa rio', () => {
  it('cria mundo com o cronograma do mapa: a 1ª fase só spawna sagui', () => {
    const data = cloneGameData();
    data.spawn.baseRatePerSec = 60;
    data.spawn.rateGrowthPerMinute = 0;
    const world = makeTestWorld({ seed: 7, data, mapId: 'rio' });
    const saguiIndex = data.enemyTypes.findIndex((type) => type.id === 'sagui');

    runTicks(world, 60); // 1 s — dentro da fase 0 (sagui 100)
    expect(world.enemies.count).toBeGreaterThan(0);
    for (let i = 0; i < world.enemies.count; i++) {
      expect(world.enemies.typeIndex[i]).toBe(saguiIndex);
    }
  });

  it('mapId e arena vêm do mapa escolhido', () => {
    const world = makeTestWorld({ data: cloneGameData(), mapId: 'rio' });
    expect(world.mapId).toBe('rio');
    // 110 desde a ampliação de 2026-11-23 (o maior mapa — ver data/maps.ts).
    expect(world.arenaHalfSize).toBe(110);
  });
});
