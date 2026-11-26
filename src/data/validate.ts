import type { GameData } from './tables';
import { SIM_DT } from './tables';
import type { UpgradeStatId } from './upgrades';
import { ALL_UPGRADE_STATS, baseStatValue, effectiveStatValue } from './upgrades';
import { CARD_POOL_CAPACITY } from './characters';
import type { SpawnPhase } from './enemies';
import { albumDamageBonus } from './album';

/**
 * Subárvores com formato próprio (strings, flags, zeros semânticos): o walk
 * genérico "tudo > 0" as pula; cada uma tem a sua função de validação.
 */
const WALK_SKIP_PATHS: ReadonlySet<string> = new Set([
  'gameData.upgrades',
  'gameData.talents',
  'gameData.characters',
  'gameData.maps',
  'gameData.enemyTypes',
  'gameData.album',
  'gameData.achievements',
]);

/**
 * Valida a tabela de dados na inicialização. Lança `Error` nomeando o campo
 * inválido — tabela quebrada derruba o jogo no boot, nunca em runtime.
 */
export function validateGameData(data: GameData): void {
  walkFinitePositive(data, 'gameData');
  validateEnemyTypes(data);
  validateCharacters(data);
  validateMaps(data);
  validateUpgrades(data);
  validateTalents(data);
  validateAlbum(data);
  validateAchievements(data);

  // Orelhões: rampa de requisitos não vazia e crescente (a ordem É a rampa).
  const requirements = data.orelhoes.killRequirements;
  assert(requirements.length > 0, 'gameData.orelhoes.killRequirements não pode ser vazio');
  for (let i = 1; i < requirements.length; i++) {
    assert(
      requirements[i]! > requirements[i - 1]!,
      'gameData.orelhoes.killRequirements deve ser estritamente crescente',
    );
  }

  const { enemies, spawn, xp } = data;

  assert(xp.growthPerLevel > 1, 'gameData.xp.growthPerLevel deve ser > 1');
  assert(
    spawn.ringMinRadius < spawn.ringMaxRadius,
    'gameData.spawn.ringMinRadius deve ser < ringMaxRadius',
  );
  assert(
    Number.isInteger(enemies.maxAlive) && enemies.maxAlive <= 4096,
    'gameData.enemies.maxAlive deve ser inteiro <= 4096',
  );
  assert(
    Number.isInteger(xp.maxOrbs) && xp.maxOrbs <= 8192,
    'gameData.xp.maxOrbs deve ser inteiro <= 8192',
  );
  assert(
    xp.collectRadius < xp.magnetRadius,
    'gameData.xp.collectRadius deve ser < magnetRadius',
  );
}

function validateEnemyTypes(data: GameData): void {
  const types = data.enemyTypes;
  assert(types.length > 0, 'gameData.enemyTypes não pode ser vazio');
  assert(types.length <= 256, 'gameData.enemyTypes: máximo 256 tipos (typeIndex é Uint8Array)');

  const seenIds = new Set<string>();
  for (let i = 0; i < types.length; i++) {
    const def = types[i]!;
    const path = `gameData.enemyTypes[${i}] (${def.id || '?'})`;

    assert(def.id.length > 0, `${path}: id vazio`);
    assert(!seenIds.has(def.id), `${path}: id duplicado`);
    seenIds.add(def.id);
    assert(def.name.length > 0, `${path}: name vazio`);
    assert(def.icon.length > 0, `${path}: icon vazio`);

    assertFinitePositive(def.moveSpeed, `${path}.moveSpeed`);
    assertFinitePositive(def.maxHp, `${path}.maxHp`);
    assertFinitePositive(def.radius, `${path}.radius`);
    assertFinitePositive(def.contactDamage, `${path}.contactDamage`);
    assertFinitePositive(def.xpValue, `${path}.xpValue`);
    assertFinitePositive(def.spawnStateDuration, `${path}.spawnStateDuration`);
    assertFinitePositive(def.dyingStateDuration, `${path}.dyingStateDuration`);

    if (def.behavior.kind === 'flyby') {
      assertFinitePositive(def.behavior.despawnRadius, `${path}.behavior.despawnRadius`);
      assertFinitePositive(def.behavior.despawnAfter, `${path}.behavior.despawnAfter`);
      // O movimento flyby não tem clamp de arena: o despawn por raio é o que
      // impede voo fora do chão visível, então precisa caber em toda arena jogável.
      for (const map of data.maps) {
        if (!map.playable) continue;
        assert(
          def.behavior.despawnRadius <= map.arena.halfSize,
          `${path}.behavior.despawnRadius deve ser <= arena.halfSize do mapa jogável '${map.id}'`,
        );
      }
    } else if (def.behavior.kind === 'investida') {
      assertFinitePositive(def.behavior.windup, `${path}.behavior.windup`);
      assertFinitePositive(def.behavior.chargeTime, `${path}.behavior.chargeTime`);
    }
  }
}

/**
 * Valida o cronograma de spawn de UM mapa (a curva de dificuldade é dado do
 * mapa desde 2026-11-19). `basePath` nomeia o mapa nas mensagens de erro.
 */
function validateSpawnSchedule(data: GameData, schedule: SpawnPhase[], basePath: string): void {
  assert(schedule.length > 0, `${basePath} não pode ser vazio`);

  const typeIds = new Set(data.enemyTypes.map((def) => def.id));
  for (let i = 0; i < schedule.length; i++) {
    const phase = schedule[i]!;
    const path = `${basePath}[${i}]`;

    assert(
      Number.isFinite(phase.fromTime) && phase.fromTime >= 0,
      `${path}.fromTime deve ser finito e >= 0`,
    );
    if (i === 0) {
      assert(phase.fromTime === 0, `${path}.fromTime deve começar em 0`);
    } else {
      assert(
        phase.fromTime > schedule[i - 1]!.fromTime,
        `${path}.fromTime deve ser estritamente crescente`,
      );
    }

    let totalWeight = 0;
    for (const [typeId, weight] of Object.entries(phase.weights)) {
      assert(typeIds.has(typeId), `${path}.weights: tipo desconhecido (${typeId})`);
      assert(
        Number.isFinite(weight) && weight >= 0,
        `${path}.weights.${typeId} deve ser finito e >= 0`,
      );
      totalWeight += weight;
    }
    assert(totalWeight > 0, `${path}.weights: soma dos pesos deve ser > 0`);
  }
}

/** Maior raio entre os tipos: todo tipo encostado precisa ser atingível. */
function maxEnemyRadius(data: GameData): number {
  let max = 0;
  for (const def of data.enemyTypes) if (def.radius > max) max = def.radius;
  return max;
}

/** Menor raio entre os tipos: o menor inimigo é o que a carta atravessaria. */
function minEnemyRadius(data: GameData): number {
  let min = Number.POSITIVE_INFINITY;
  for (const def of data.enemyTypes) if (def.radius < min) min = def.radius;
  return min;
}

function validateCharacters(data: GameData): void {
  const characters = data.characters;
  assert(characters.length > 0, 'gameData.characters não pode ser vazio');

  const seenIds = new Set<string>();
  for (let i = 0; i < characters.length; i++) {
    const def = characters[i]!;
    const path = `gameData.characters[${i}] (${def.id || '?'})`;

    assert(def.id.length > 0, `${path}: id vazio`);
    assert(!seenIds.has(def.id), `${path}: id duplicado`);
    seenIds.add(def.id);
    assert(def.name.length > 0, `${path}: name vazio`);
    assert(def.tagline.length > 0, `${path}: tagline vazia`);

    walkFinitePositive(def.stats, `${path}.stats`);

    const ability = def.ability;
    assertFinitePositive(ability.damage, `${path}.ability.damage`);
    assertFinitePositive(ability.cooldown, `${path}.ability.cooldown`);
    assertFinitePositive(ability.range, `${path}.ability.range`);

    if (ability.kind === 'mordida' || ability.kind === 'fumaca') {
      // Mordida e fumaça usam a mesma convenção (centro-a-centro <= range):
      // um alcance menor que a soma dos raios nunca atingiria nem um inimigo
      // encostado no player — habilidade inútil é erro de tabela. O extremo é
      // o MAIOR raio da tabela de tipos: todo tipo encostado é atingível.
      assert(
        ability.range > def.stats.radius + maxEnemyRadius(data),
        `${path}.ability.range deve ser maior que stats.radius + MAX(enemyTypes.radius)`,
      );
    } else {
      assertFinitePositive(ability.projectileSpeed, `${path}.ability.projectileSpeed`);
      assertFinitePositive(ability.cardRadius, `${path}.ability.cardRadius`);
      assert(
        Number.isInteger(ability.maxLive) && ability.maxLive >= 1 && ability.maxLive <= 128,
        `${path}.ability.maxLive deve ser inteiro em [1, 128]`,
      );
      assert(
        ability.maxLive <= CARD_POOL_CAPACITY,
        `${path}.ability.maxLive deve ser <= CARD_POOL_CAPACITY (${CARD_POOL_CAPACITY})`,
      );
      // Anti-tunneling: a carta não pode atravessar NEM O MENOR inimigo num
      // só tick — o extremo é o MENOR raio da tabela de tipos.
      assert(
        ability.projectileSpeed * SIM_DT < ability.cardRadius + minEnemyRadius(data),
        `${path}.ability.projectileSpeed causa tunneling: ` +
          `projectileSpeed × SIM_DT deve ser < cardRadius + MIN(enemyTypes.radius)`,
      );
    }
  }
}

function validateMaps(data: GameData): void {
  const maps = data.maps;
  assert(maps.length > 0, 'gameData.maps não pode ser vazio');

  const seenIds = new Set<string>();
  let playableCount = 0;
  for (let i = 0; i < maps.length; i++) {
    const def = maps[i]!;
    const path = `gameData.maps[${i}] (${def.id || '?'})`;

    assert(def.id.length > 0, `${path}: id vazio`);
    assert(!seenIds.has(def.id), `${path}: id duplicado`);
    seenIds.add(def.id);
    assert(def.name.length > 0, `${path}: name vazio`);
    if (def.tagline !== undefined) {
      assert(def.tagline.length > 0, `${path}: tagline vazia (omita o campo se não há descrição)`);
    }
    assertFinitePositive(def.arena.halfSize, `${path}.arena.halfSize`);

    if (def.playable) {
      playableCount++;
      assert(
        data.spawn.ringMaxRadius < def.arena.halfSize,
        `${path}: spawn.ringMaxRadius deve ser < arena.halfSize`,
      );
      // A curva de dificuldade é do mapa: jogável sem cronograma não abre.
      assert(
        def.spawnSchedule !== undefined,
        `${path}: mapa jogável precisa de spawnSchedule`,
      );
      validateSpawnSchedule(data, def.spawnSchedule!, `${path}.spawnSchedule`);
    } else if (def.spawnSchedule !== undefined) {
      // Slot "EM BREVE" com cronograma: valida também (vai virar jogável).
      validateSpawnSchedule(data, def.spawnSchedule, `${path}.spawnSchedule`);
    }
  }

  assert(playableCount >= 1, 'gameData.maps deve ter ao menos 1 mapa jogável');
}

/**
 * Melhorias têm formato próprio: textos exibíveis, flags, campos zeráveis
 * (ex.: `flatPerStack` 0 em efeito só-percentual) e o teto infinito do
 * fallback. Nada aqui é caso especial de um item: as regras valem para
 * qualquer entrada que cumpra o mesmo papel.
 */
function validateUpgrades(data: GameData): void {
  const upgrades = data.upgrades;
  assert(upgrades.length > 0, 'gameData.upgrades não pode ser vazio');

  const characterIds = new Set(data.characters.map((def) => def.id));
  const seenIds = new Set<string>();
  const validStats = new Set<UpgradeStatId>(ALL_UPGRADE_STATS);
  let fallbackCount = 0;

  for (let i = 0; i < upgrades.length; i++) {
    const def = upgrades[i]!;
    const path = `gameData.upgrades[${i}] (${def.id || '?'})`;

    assert(def.id.length > 0, `${path}: id vazio`);
    assert(!seenIds.has(def.id), `${path}: id duplicado`);
    seenIds.add(def.id);
    assert(def.name.length > 0, `${path}: name vazio`);
    assert(def.effectLine.length > 0, `${path}: effectLine vazia`);
    assert(
      def.effect !== undefined || def.healOnPick !== undefined,
      `${path}: melhoria sem efeito contínuo nem cura instantânea`,
    );

    if (def.characterId !== undefined) {
      assert(
        characterIds.has(def.characterId),
        `${path}: characterId desconhecido (${def.characterId})`,
      );
    }

    if (def.healOnPick !== undefined) {
      assert(
        Number.isFinite(def.healOnPick) && def.healOnPick > 0,
        `${path}: healOnPick deve ser finito e > 0`,
      );
    }

    if (def.isFallback === true) {
      fallbackCount++;
      assert(
        def.maxStacks === Number.POSITIVE_INFINITY,
        `${path}: fallback deve ter maxStacks Infinity`,
      );
      // Teto infinito + efeito contínuo faria o stat crescer sem limite.
      assert(def.effect === undefined, `${path}: fallback não pode ter efeito contínuo`);
    } else {
      assert(
        Number.isInteger(def.maxStacks) && def.maxStacks >= 1,
        `${path}: maxStacks deve ser inteiro >= 1`,
      );
    }

    const effect = def.effect;
    if (effect !== undefined) {
      assert(validStats.has(effect.stat), `${path}: stat desconhecido (${effect.stat})`);
      assert(
        Number.isFinite(effect.percentPerStack) && Number.isFinite(effect.flatPerStack),
        `${path}: percentPerStack e flatPerStack devem ser finitos`,
      );
      assert(
        effect.percentPerStack !== 0 || effect.flatPerStack !== 0,
        `${path}: efeito sem percentual nem valor absoluto`,
      );
      if (effect.min !== undefined && effect.max !== undefined) {
        assert(effect.min < effect.max, `${path}: min deve ser < max`);
      }
      // Efeito só-percentual sobre stat de base 0 é no-op garantido (base 0
      // obriga flatPerStack — regra dos stats derivados, TECH 2026-11-18).
      if (effect.flatPerStack === 0) {
        for (const character of data.characters) {
          if (def.characterId !== undefined && def.characterId !== character.id) continue;
          assert(
            baseStatValue(data, character, effect.stat) !== 0,
            `${path}: efeito só-percentual sobre stat de base 0 (${effect.stat}) é no-op`,
          );
        }
      }
    }
  }

  assert(
    fallbackCount === 1,
    `gameData.upgrades deve ter exatamente 1 fallback (tem ${fallbackCount})`,
  );

  // Sanidade dos clamps, POR PERSONAGEM (ability.* depende do equipado):
  // nenhum stat pode zerar ou virar negativo nem com todas as melhorias
  // aplicáveis àquele personagem no teto de stacks.
  for (const character of data.characters) {
    const maxedStacks = upgrades.map((def) => {
      if (def.isFallback === true) return 0;
      if (def.characterId !== undefined && def.characterId !== character.id) return 0;
      return def.maxStacks;
    });
    for (const stat of ALL_UPGRADE_STATS) {
      const atCap = effectiveStatValue(data, character, stat, maxedStacks);
      if (baseStatValue(data, character, stat) === 0) {
        // Stat derivado de base 0 (armor, regen, crit, knockback): 0 é valor
        // legítimo (sem a melhoria no pool); só o negativo quebra o jogo.
        assert(
          atCap >= 0,
          `gameData.upgrades: stat ${stat} fica < 0 (${atCap}) com todos os stacks ` +
            `no teto (personagem ${character.id})`,
        );
      } else {
        assert(
          atCap > 0,
          `gameData.upgrades: stat ${stat} fica <= 0 (${atCap}) com todos os stacks ` +
            `no teto (personagem ${character.id})`,
        );
      }
    }
  }
}

/**
 * Valida a tabela de talentos (Loja de Talentos). Mesmas regras de sanidade
 * das melhorias onde o formato coincide, mais as da loja: custos por nível
 * (inteiros > 0, nunca decrescentes) com `length === maxRank`.
 */
function validateTalents(data: GameData): void {
  const talents = data.talents;
  const seenIds = new Set<string>();
  const validStats = new Set<UpgradeStatId>(ALL_UPGRADE_STATS);

  for (let i = 0; i < talents.length; i++) {
    const def = talents[i]!;
    const path = `gameData.talents[${i}] (${def.id || '?'})`;

    assert(def.id.length > 0, `${path}: id vazio`);
    assert(!seenIds.has(def.id), `${path}: id duplicado`);
    seenIds.add(def.id);
    assert(def.name.length > 0, `${path}: name vazio`);
    assert(def.effectLine.length > 0, `${path}: effectLine vazia`);
    assert(def.icon.length > 0, `${path}: icon vazio`);
    assert(
      Number.isInteger(def.maxRank) && def.maxRank >= 1,
      `${path}: maxRank deve ser inteiro >= 1`,
    );

    assert(
      def.costPerRank.length === def.maxRank,
      `${path}: costPerRank deve ter maxRank entradas (tem ${def.costPerRank.length})`,
    );
    for (let r = 0; r < def.costPerRank.length; r++) {
      const cost = def.costPerRank[r]!;
      assert(
        Number.isInteger(cost) && cost > 0,
        `${path}: costPerRank[${r}] deve ser inteiro > 0`,
      );
      if (r > 0) {
        assert(
          cost >= def.costPerRank[r - 1]!,
          `${path}: costPerRank não pode decrescer (nível ${r + 1} mais barato que o ${r})`,
        );
      }
    }

    const effect = def.effect;
    assert(validStats.has(effect.stat), `${path}: stat desconhecido (${effect.stat})`);
    assert(
      Number.isFinite(effect.percentPerStack) && Number.isFinite(effect.flatPerStack),
      `${path}: percentPerStack e flatPerStack devem ser finitos`,
    );
    assert(
      effect.percentPerStack !== 0 || effect.flatPerStack !== 0,
      `${path}: efeito sem percentual nem valor absoluto`,
    );
    if (effect.min !== undefined && effect.max !== undefined) {
      assert(effect.min < effect.max, `${path}: min deve ser < max`);
    }
    // Mesma regra das melhorias: percentual puro sobre base 0 é no-op.
    if (effect.flatPerStack === 0) {
      for (const character of data.characters) {
        assert(
          baseStatValue(data, character, effect.stat) !== 0,
          `${path}: efeito só-percentual sobre stat de base 0 (${effect.stat}) é no-op`,
        );
      }
    }
  }

  // Sanidade dos clamps com TUDO no teto: melhorias E talentos maximizados
  // não podem zerar/negativar stat algum (por personagem, como nas melhorias).
  const maxedRanks = talents.map((def) => def.maxRank);
  for (const character of data.characters) {
    const maxedStacks = data.upgrades.map((def) => {
      if (def.isFallback === true) return 0;
      if (def.characterId !== undefined && def.characterId !== character.id) return 0;
      return def.maxStacks;
    });
    for (const stat of ALL_UPGRADE_STATS) {
      const atCap = effectiveStatValue(data, character, stat, maxedStacks, maxedRanks);
      if (baseStatValue(data, character, stat) === 0) {
        assert(
          atCap >= 0,
          `gameData.talents: stat ${stat} fica < 0 (${atCap}) com melhorias e talentos ` +
            `no teto (personagem ${character.id})`,
        );
      } else {
        assert(
          atCap > 0,
          `gameData.talents: stat ${stat} fica <= 0 (${atCap}) com melhorias e talentos ` +
            `no teto (personagem ${character.id})`,
        );
      }
    }
  }
}

/**
 * Valida o Álbum de Figurinhas: chance de drop em (0, 1] e degraus
 * estritamente crescentes em cópias E em bônus (degrau que não melhora o
 * anterior é erro de tabela).
 */
function validateAlbum(data: GameData): void {
  const album = data.album;
  assert(
    Number.isFinite(album.dropChance) && album.dropChance > 0 && album.dropChance <= 1,
    'gameData.album.dropChance deve estar em (0, 1]',
  );
  assert(album.tiers.length > 0, 'gameData.album.tiers não pode ser vazio');

  for (let i = 0; i < album.tiers.length; i++) {
    const tier = album.tiers[i]!;
    const path = `gameData.album.tiers[${i}]`;
    assert(Number.isInteger(tier.copies) && tier.copies >= 1, `${path}.copies deve ser inteiro >= 1`);
    assert(
      Number.isFinite(tier.damageBonus) && tier.damageBonus > 0,
      `${path}.damageBonus deve ser finito e > 0`,
    );
    if (i > 0) {
      assert(
        tier.copies > album.tiers[i - 1]!.copies,
        `${path}.copies deve ser estritamente crescente`,
      );
      assert(
        tier.damageBonus > album.tiers[i - 1]!.damageBonus,
        `${path}.damageBonus deve ser estritamente crescente`,
      );
    }
  }

  // Sanidade da função de bônus: abaixo do 1º degrau não há bônus.
  assert(
    albumDamageBonus(album, album.tiers[0]!.copies - 1) === 0,
    'gameData.album: cópias abaixo do 1º degrau devem dar bônus 0',
  );
}

/**
 * Valida as conquistas: ids únicos, exibíveis presentes, prêmio inteiro >= 0
 * e condição sã (números positivos; `enemyTypeId` existente na tabela).
 */
function validateAchievements(data: GameData): void {
  const achievements = data.achievements;
  assert(achievements.length > 0, 'gameData.achievements não pode ser vazio');

  const typeIds = new Set(data.enemyTypes.map((def) => def.id));
  const seenIds = new Set<string>();
  for (let i = 0; i < achievements.length; i++) {
    const def = achievements[i]!;
    const path = `gameData.achievements[${i}] (${def.id || '?'})`;

    assert(def.id.length > 0, `${path}: id vazio`);
    assert(!seenIds.has(def.id), `${path}: id duplicado`);
    seenIds.add(def.id);
    assert(def.name.length > 0, `${path}: name vazio`);
    assert(def.description.length > 0, `${path}: description vazia`);
    assert(def.icon.length > 0, `${path}: icon vazio`);
    assert(
      Number.isInteger(def.reward) && def.reward >= 0,
      `${path}: reward deve ser inteiro >= 0`,
    );

    const condition = def.condition;
    switch (condition.kind) {
      case 'lifetimeKills':
        if (condition.enemyTypeId !== undefined) {
          assert(
            typeIds.has(condition.enemyTypeId),
            `${path}: enemyTypeId desconhecido (${condition.enemyTypeId})`,
          );
        }
        assertPositiveInteger(condition.count, `${path}.condition.count`);
        break;
      case 'runsPlayed':
      case 'lifetimeBananas':
      case 'runKills':
      case 'talentRanksBought':
      case 'talentsMaxed':
      case 'charactersPlayed':
      case 'mapsPlayed':
      case 'albumCards':
      case 'albumTypesCollected':
      case 'albumSetsMaxed':
        assertPositiveInteger(condition.count, `${path}.condition.count`);
        break;
      case 'runTime':
      case 'runDeathUnder':
        assertFinitePositive(condition.seconds, `${path}.condition.seconds`);
        break;
      case 'runLevel':
        assertPositiveInteger(condition.level, `${path}.condition.level`);
        break;
      default: {
        const unhandled: never = condition;
        throw new Error(`${path}: condição sem validação: ${JSON.stringify(unhandled)}`);
      }
    }
  }
}

function assertPositiveInteger(value: number, fieldPath: string): void {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${fieldPath} deve ser inteiro >= 1 (recebeu ${value})`);
  }
}

function walkFinitePositive(node: object, path: string): void {
  for (const [key, value] of Object.entries(node)) {
    const fieldPath = `${path}.${key}`;
    if (WALK_SKIP_PATHS.has(fieldPath)) continue;
    if (typeof value === 'number') {
      assertFinitePositive(value, fieldPath);
    } else if (typeof value === 'object' && value !== null) {
      walkFinitePositive(value, fieldPath);
    } else {
      throw new Error(`${fieldPath} tem tipo inesperado (${typeof value})`);
    }
  }
}

function assertFinitePositive(value: number, fieldPath: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${fieldPath} deve ser um número finito e positivo (recebeu ${value})`);
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}
