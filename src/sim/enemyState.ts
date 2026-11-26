/**
 * Máquina de estados do inimigo (objeto `as const`; `const enum` conflita com isolatedModules).
 *
 * Spawning: nasce crescendo; não dá nem recebe dano.
 * Chasing:  persegue o player; pode morder e ser mordido.
 * Dying:    inerte encolhendo; ao expirar dropa orbe de XP e sai do pool.
 */
export const EnemyState = {
  Spawning: 0,
  Chasing: 1,
  Dying: 2,
} as const;

export type EnemyStateId = (typeof EnemyState)[keyof typeof EnemyState];
