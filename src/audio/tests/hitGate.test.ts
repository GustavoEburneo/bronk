import { describe, expect, it } from 'vitest';
import type { SimEvent } from '../../sim/world';
import type { HitEventSource } from '../hitGate';
import { HIT_MIN_INTERVAL, createHitGate } from '../hitGate';

// Teste 100% puro: o gate não conhece WebAudio nem DOM — nenhum mock.

function hit(count: number, critCount = 0): SimEvent {
  return { type: 'enemyHit', count, critCount, x: 0, z: 0 };
}

function source(tickCount: number, events: SimEvent[]): HitEventSource {
  return { tickCount, events };
}

describe('hitGate — dedup por tickCount (risco nº 1 do TECH)', () => {
  it('processa o lote uma única vez enquanto o tickCount não avança', () => {
    const gate = createHitGate();
    const world = source(10, [hit(1)]);

    expect(gate.collect(world, 0)).toHaveLength(1);
    // Frames seguintes sem tick novo (144 Hz, pausa do Panfleto, gameOver):
    // o MESMO lote não re-toca, não importa quanto tempo passe.
    expect(gate.collect(world, 0.5)).toHaveLength(0);
    expect(gate.collect(world, 60)).toHaveLength(0);
  });

  it('volta a processar quando o tickCount avança', () => {
    const gate = createHitGate();
    const world = source(1, [hit(1)]);
    expect(gate.collect(world, 0)).toHaveLength(1);

    world.tickCount = 2;
    world.events = [hit(2)];
    expect(gate.collect(world, 1)).toHaveLength(1);
  });

  it('restart sem beginMatch (world novo, tickCount menor) não engole eventos', () => {
    const gate = createHitGate();
    expect(gate.collect(source(500, [hit(1)]), 0)).toHaveLength(1);

    // "Jogar de novo" recria o world: referência nova, contador do zero.
    const fresh = source(1, [hit(1)]);
    expect(gate.collect(fresh, 1)).toHaveLength(1);
  });

  it('ignora eventos que não são enemyHit', () => {
    const gate = createHitGate();
    const events: SimEvent[] = [{ type: 'biteFired' }, { type: 'levelUp', level: 2 }];
    expect(gate.collect(source(1, events), 0)).toHaveLength(0);
  });
});

describe('hitGate — throttle (teto de 10 hits/s do GDD)', () => {
  it('descarta o excedente do mesmo lote (nunca enfileira)', () => {
    const gate = createHitGate();
    // 3 cartas ferindo no mesmo tick = 3 enemyHit no lote; só 1 toca.
    const approved = gate.collect(source(1, [hit(1), hit(2), hit(4)]), 0);
    expect(approved).toHaveLength(1);
  });

  it('respeita HIT_MIN_INTERVAL entre frames e libera depois dele', () => {
    const gate = createHitGate();
    expect(gate.collect(source(1, [hit(1)]), 0)).toHaveLength(1);
    // Tick novo, mas cedo demais: descartado.
    expect(gate.collect(source(2, [hit(1)]), HIT_MIN_INTERVAL / 2)).toHaveLength(0);
    // Intervalo vencido: toca.
    expect(gate.collect(source(3, [hit(1)]), HIT_MIN_INTERVAL + 0.01)).toHaveLength(1);
  });

  it('sob throttle, o crítico vence o lote (é o único feedback do Dado na v1)', () => {
    const gate = createHitGate();
    const approved = gate.collect(source(1, [hit(5, 0), hit(1, 1)]), 0);
    expect(approved).toHaveLength(1);
    expect(approved[0]?.critCount).toBe(1);
  });

  it('sem crítico, o lote maior vence', () => {
    const gate = createHitGate();
    const approved = gate.collect(source(1, [hit(1), hit(6)]), 0);
    expect(approved[0]?.count).toBe(6);
  });
});
