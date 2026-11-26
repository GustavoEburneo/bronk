import type { World } from '../world';

/**
 * Orelhões que tocam na run (2026-11-24): um aparelho novo aparece pelo
 * RELÓGIO (`firstAtSec` + i × `intervalSec`, um por entrada da rampa
 * `killRequirements`), em posição sorteada no RNG PRÓPRIO `orelhaoRng` —
 * nunca no da sim, para não tocar nas sequências congeladas de spawn/crit.
 *
 * ATENDER = estar a `answerRadius` do aparelho COM os abates mínimos dele.
 * O prêmio são bananas no valor do requisito (creditadas na run, como as de
 * abate) + o evento `orelhaoAnswered` para a apresentação. Orelhão atendido
 * fica no mundo (o render o mostra como atendido) e não toca de novo.
 */

/** Distância mínima do player no spawn: o orelhão nunca nasce em cima dele. */
const MIN_SPAWN_DISTANCE = 20;
/** Tentativas de posição antes de aceitar a última (RNG próprio: barato). */
const MAX_PLACEMENT_ATTEMPTS = 8;
/** Margem da borda da arena (u): o aparelho nasce em área confortável. */
const EDGE_MARGIN = 6;

export function updateOrelhoes(world: World): void {
  const config = world.data.orelhoes;
  const requirements = config.killRequirements;

  // Spawn pelo relógio da run.
  while (
    world.orelhoes.length < requirements.length &&
    world.time >= config.firstAtSec + world.orelhoes.length * config.intervalSec
  ) {
    const range = Math.max(1, world.arenaHalfSize - EDGE_MARGIN);
    let x = 0;
    let z = 0;
    for (let attempt = 0; attempt < MAX_PLACEMENT_ATTEMPTS; attempt++) {
      x = (world.orelhaoRng.next() * 2 - 1) * range;
      z = (world.orelhaoRng.next() * 2 - 1) * range;
      const dx = x - world.player.x;
      const dz = z - world.player.z;
      if (dx * dx + dz * dz >= MIN_SPAWN_DISTANCE * MIN_SPAWN_DISTANCE) break;
    }
    world.orelhoes.push({
      x,
      z,
      requirement: requirements[world.orelhoes.length]!,
      answered: false,
    });
  }

  // Atendimento: perto o bastante E com os abates mínimos do aparelho.
  const radiusSq = config.answerRadius * config.answerRadius;
  for (const orelhao of world.orelhoes) {
    if (orelhao.answered || world.kills < orelhao.requirement) continue;
    const dx = orelhao.x - world.player.x;
    const dz = orelhao.z - world.player.z;
    if (dx * dx + dz * dz > radiusSq) continue;
    orelhao.answered = true;
    world.bananasEarned += orelhao.requirement;
    world.events.push({
      type: 'orelhaoAnswered',
      x: orelhao.x,
      z: orelhao.z,
      reward: orelhao.requirement,
    });
  }
}
