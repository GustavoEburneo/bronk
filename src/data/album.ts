/**
 * Álbum de Figurinhas (meta-progressão, decisão de 2026-11-19): cada ABATE
 * tem uma chance pequena de dropar a figurinha daquele tipo de inimigo. As
 * cópias ACUMULAM no cofre persistido e, ao bater os degraus de `tiers`, dão
 * bônus de dano CONTRA aquele tipo — conhecer o bicho é bater mais forte nele.
 *
 * Regras:
 * - O drop é rolado no RNG PRÓPRIO do álbum (`world.dropRng`), nunca no RNG
 *   da sim: a coleção não altera as sequências de spawn/crit/sorteio (TECH).
 * - O bônus NÃO soma degraus: vale o MAIOR degrau atingido (`albumDamageBonus`).
 * - A figurinha é creditada na hora do abate (sem entidade de chão para
 *   coletar) e entra no cofre no fim da run, como as bananas.
 * - Despawn silencioso (flyby fora do raio) não é abate: não dropa.
 *
 * Exibíveis da figurinha (nome/ícone) vêm do próprio `EnemyTypeDef`.
 * Números: hipótese a calibrar com runs reais.
 */

export interface AlbumTier {
  /** Cópias da figurinha necessárias para o degrau valer. */
  copies: number;
  /** Bônus de dano contra o tipo (fração: 0.1 = +10%). Substitui o anterior. */
  damageBonus: number;
}

export interface AlbumConfig {
  /** Chance de drop por abate (fração 0..1), igual para todos os tipos. */
  dropChance: number;
  /** Degraus em ordem crescente de cópias E de bônus. */
  tiers: AlbumTier[];
}

export const albumConfig: AlbumConfig = {
  // ~1 figurinha a cada 25 abates: uma run típica rende um punhado.
  dropChance: 0.04,
  tiers: [
    { copies: 1, damageBonus: 0.05 },
    { copies: 5, damageBonus: 0.1 },
    { copies: 15, damageBonus: 0.2 },
    { copies: 40, damageBonus: 0.35 },
  ],
};

/**
 * Bônus de dano para `copies` cópias: o `damageBonus` do MAIOR degrau
 * atingido, ou 0 sem nenhum. Os degraus são validados no boot (crescentes).
 */
export function albumDamageBonus(config: AlbumConfig, copies: number): number {
  let bonus = 0;
  for (const tier of config.tiers) {
    if (copies >= tier.copies) bonus = tier.damageBonus;
  }
  return bonus;
}

/**
 * Próximo degrau ainda não atingido com `copies` cópias, ou null no teto.
 * Usado pela tela do álbum ("faltam K pra +10%").
 */
export function nextAlbumTier(config: AlbumConfig, copies: number): AlbumTier | null {
  for (const tier of config.tiers) {
    if (copies < tier.copies) return tier;
  }
  return null;
}
