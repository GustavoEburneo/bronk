/** Única fonte de aleatoriedade da simulação. `Math.random` é proibido em `src/sim`. */
export interface Rng {
  /** Próximo número pseudoaleatório em [0, 1). */
  next(): number;
}

/** PRNG mulberry32: determinístico por seed, rápido e sem dependências. */
export function mulberry32(seed: number): Rng {
  let state = seed >>> 0;
  return {
    next(): number {
      state = (state + 0x6d2b79f5) >>> 0;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
  };
}
