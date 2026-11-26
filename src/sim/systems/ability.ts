import type { World } from '../world';
import { updateBiteAttack } from './biteAttack';
import { updateCardAbility } from './cardAbility';
import { updateSmokeAbility } from './smokeAbility';

/**
 * Despacho por habilidade equipada (item 4 da ordem fixa do tick). Habilidade
 * nova = ramo novo na união `AbilityDef` + caso novo aqui; nunca caso especial
 * dentro de outra habilidade.
 */
export function updateAbility(world: World, dt: number): void {
  const ability = world.ability;
  switch (ability.kind) {
    case 'mordida':
      updateBiteAttack(world, dt);
      break;
    case 'cartas':
      updateCardAbility(world, dt);
      break;
    case 'fumaca':
      updateSmokeAbility(world, dt);
      break;
    default: {
      // Exaustividade em tempo de compilação: kind novo sem caso não compila.
      const unhandled: never = ability;
      throw new Error(`habilidade sem sistema: ${JSON.stringify(unhandled)}`);
    }
  }
}
