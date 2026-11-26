import type { CompiledSpawnPhase, World } from '../world';
import { allocEnemy } from '../pool';

const TWO_PI = Math.PI * 2;

/** Guarda numérica contra normalizar vetor nulo; não é constante de jogo. */
const MIN_DIR_DISTANCE = 1e-6;

/**
 * Spawn contínuo em anel ao redor do player (fora da vista da câmera), com
 * taxa crescente no tempo e teto de vivos. A fração de spawn acumula entre
 * ticks. O TIPO de cada spawn é sorteado por peso na fase vigente do
 * cronograma compilado (1 `rng.next()` extra por spawn); hp, raio de clamp e
 * direção de voo saem do tipo sorteado.
 */
export function updateEnemySpawn(world: World, dt: number): void {
  const { data, enemies, player, rng } = world;
  const ratePerSec =
    data.spawn.baseRatePerSec + data.spawn.rateGrowthPerMinute * (world.time / 60);
  world.spawnAccumulator += ratePerSec * dt;

  // A fase é função de world.time, fixo durante o tick: resolve uma vez.
  const phase = currentSpawnPhase(world);

  while (world.spawnAccumulator >= 1 && enemies.count < enemies.capacity) {
    world.spawnAccumulator -= 1;
    const index = allocEnemy(enemies);
    if (index < 0) break;

    const typeIndex = rollEnemyTypeIndex(phase, rng.next());
    const type = data.enemyTypes[typeIndex]!;

    const angle = rng.next() * TWO_PI;
    const radius =
      data.spawn.ringMinRadius + rng.next() * (data.spawn.ringMaxRadius - data.spawn.ringMinRadius);
    const limit = world.arenaHalfSize - type.radius;
    const x = clamp(player.x + Math.cos(angle) * radius, -limit, limit);
    const z = clamp(player.z + Math.sin(angle) * radius, -limit, limit);

    enemies.posX[index] = x;
    enemies.posZ[index] = z;
    // Sem isso, o render interpola a partir do lixo do slot reutilizado.
    enemies.prevX[index] = x;
    enemies.prevZ[index] = z;
    enemies.hp[index] = type.maxHp;
    enemies.typeIndex[index] = typeIndex;

    // Direção normalizada spawn→player (posição do player NESTE instante),
    // gravada para todos os tipos: o flyby voa reto nela; o chase a ignora.
    const toPlayerX = player.x - x;
    const toPlayerZ = player.z - z;
    const dist = Math.hypot(toPlayerX, toPlayerZ);
    enemies.dirX[index] = dist > MIN_DIR_DISTANCE ? toPlayerX / dist : 0;
    enemies.dirZ[index] = dist > MIN_DIR_DISTANCE ? toPlayerZ / dist : 1;
  }

  // Teto atingido: descarta o excedente para não despejar uma rajada ao abrir vaga.
  if (world.spawnAccumulator > 1) world.spawnAccumulator = 1;
}

/** Última fase com `fromTime <= world.time` (a validação garante a 1ª em 0). */
function currentSpawnPhase(world: World): CompiledSpawnPhase {
  const schedule = world.spawnSchedule;
  for (let i = schedule.length - 1; i >= 0; i--) {
    if (schedule[i]!.fromTime <= world.time) return schedule[i]!;
  }
  return schedule[0]!;
}

/** Sorteio ponderado pelo acumulado: `roll` em [0, 1) vindo do RNG da sim. */
function rollEnemyTypeIndex(phase: CompiledSpawnPhase, roll: number): number {
  const cumulative = phase.cumulativeWeights;
  const total = cumulative[cumulative.length - 1]!;
  const target = roll * total;
  for (let i = 0; i < cumulative.length; i++) {
    if (target < cumulative[i]!) return phase.typeIndices[i]!;
  }
  // roll < 1 garante target < total; a última entrada cobre qualquer resto.
  return phase.typeIndices[phase.typeIndices.length - 1]!;
}

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}
