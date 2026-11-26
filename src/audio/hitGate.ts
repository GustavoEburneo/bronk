import type { SimEvent } from '../sim/world';

/**
 * Teto global de vozes de efeito simultâneas (TECH, "Teto de vozes e
 * throttle"). Evento que chega com o teto cheio é DESCARTADO, nunca
 * enfileirado.
 */
export const MAX_SFX_VOICES = 8;

/**
 * Intervalo mínimo entre dois sons de hit, em segundos (teto de 10 hits/s do
 * GDD "Áudio v1"). Excedente descartado, nunca enfileirado — som atrasado é
 * pior que som ausente.
 */
export const HIT_MIN_INTERVAL = 0.1;

/**
 * Subconjunto estrutural do `World` que o gate lê. Manter mínimo é o que
 * permite testar o gate em node puro, sem construir um mundo inteiro e sem
 * mock de WebAudio.
 */
export interface HitEventSource {
  tickCount: number;
  events: readonly SimEvent[];
}

/** Um toc aprovado para tocar neste frame (os campos que modulam a síntese). */
export interface HitPlayback {
  count: number;
  critCount: number;
}

export interface HitGate {
  /** Zera dedup e throttle (início de partida; o endMatch também o chama). */
  reset(): void;
  /**
   * Devolve os hits do frame que DEVEM tocar, já deduplicados por tick e
   * limitados por `HIT_MIN_INTERVAL`. `nowSeconds` é relógio monotônico de
   * apresentação (performance.now()/1000), não o relógio da sim.
   */
  collect(source: HitEventSource, nowSeconds: number): HitPlayback[];
}

/**
 * Lógica PURA de "o que toca neste frame" — zero WebAudio, zero DOM, para ser
 * testável em node e reusável pelos próximos sons.
 *
 * - **Dedup por tick (risco nº 1 do TECH)**: `world.events` é o lote do ÚLTIMO
 *   tick e o render chama update() todo frame — sem guardar o último tickCount
 *   processado, frames sem tick novo (144 Hz, pausa do Panfleto, gameOver)
 *   re-tocariam o mesmo lote a cada frame. Só processa quando o tickCount
 *   AVANÇOU desde a última chamada.
 * - **Restart sem beginMatch**: "Jogar de novo" recria o world (tickCount
 *   volta a 0) sem passar pelo beginMatch do áudio. Troca de referência do
 *   source OU tickCount andando para trás = mundo novo → reseta o dedup (o
 *   throttle de tempo real segue valendo: ele protege o ouvido, não a sim).
 * - **Throttle com prioridade**: dentro de um mesmo lote, se o intervalo só
 *   deixa passar um toc, toca o mais significativo — crítico primeiro (é o
 *   ÚNICO feedback do Dado Viciado na v1), depois o lote maior. Descartar o
 *   excedente é regra (nunca enfileirar).
 */
export function createHitGate(): HitGate {
  let lastSource: HitEventSource | null = null;
  let lastTickCount = 0;
  // -Infinity: o primeiro hit da partida nunca é barrado pelo throttle.
  let lastHitAt = Number.NEGATIVE_INFINITY;

  return {
    reset(): void {
      lastSource = null;
      lastTickCount = 0;
      lastHitAt = Number.NEGATIVE_INFINITY;
    },

    collect(source: HitEventSource, nowSeconds: number): HitPlayback[] {
      const isNewWorld = source !== lastSource || source.tickCount < lastTickCount;
      if (!isNewWorld && source.tickCount === lastTickCount) return [];
      lastSource = source;
      lastTickCount = source.tickCount;

      const hits: HitPlayback[] = [];
      for (const event of source.events) {
        if (event.type === 'enemyHit') hits.push({ count: event.count, critCount: event.critCount });
      }
      if (hits.length === 0) return [];

      // Prioridade sob throttle: crítico > lote grande > comum (ordenação
      // estável; empates mantêm a ordem de emissão da sim).
      hits.sort((a, b) => {
        const critDiff = Math.sign(b.critCount) - Math.sign(a.critCount);
        if (critDiff !== 0) return critDiff;
        return b.count - a.count;
      });

      const approved: HitPlayback[] = [];
      for (const hit of hits) {
        if (nowSeconds - lastHitAt < HIT_MIN_INTERVAL) continue;
        lastHitAt = nowSeconds;
        approved.push(hit);
      }
      return approved;
    },
  };
}
