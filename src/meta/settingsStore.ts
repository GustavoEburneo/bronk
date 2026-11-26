/**
 * Cofre de configurações do jogador: volume geral, sensibilidade do mouse e
 * idioma, persistidos em localStorage (mesma decisão do metaStore de
 * 2026-11-19 — POC sem backend). Separado do cofre de meta-progressão de
 * propósito: configuração é preferência de dispositivo, não progresso —
 * apagar o save de progresso não pode resetar o volume (e vice-versa).
 *
 * Fronteiras:
 * - A UI (tela CONFIGURAÇÕES) lê e muda VIA ESTA API — nunca toca o storage.
 * - Quem APLICA os efeitos é o integrador (main.ts), assinante de `subscribe`:
 *   volume → `audio.setMasterVolume`, sensibilidade → `mouseLook.setSensitivity`.
 *   Este módulo não importa `audio` nem `app` (fronteiras do TECH).
 * - IDIOMA é fixo em pt-BR na v1 (decisão 2026-11-23): o campo existe na API
 *   para a tela exibir, mas não há setter — quando outro idioma entrar, o
 *   setter nasce junto com a infraestrutura de textos.
 *
 * Robustez (mesmo contrato do metaStore): storage ausente ou com lixo degrada
 * para memória/padrões, números fora da faixa clampam, e nada aqui lança.
 */

/** Chave versionada: mudança de formato incompatível = nova chave. */
export const SETTINGS_STORAGE_KEY = 'bronk.settings.v1';

/** Subconjunto de Storage usado (injetável nos testes). */
export type SettingsStorage = Pick<Storage, 'getItem' | 'setItem'>;

/** Único idioma da v1 — todo texto do jogo já nasce em pt-BR. */
export const LANGUAGE = 'pt-BR';

export const VOLUME_DEFAULT = 1;
/** Multiplicador sobre a sensibilidade base do mouseLook (1 = padrão). */
export const SENSITIVITY_DEFAULT = 1;
export const SENSITIVITY_MIN = 0.1;
export const SENSITIVITY_MAX = 3;

export interface GameSettings {
  /** Volume geral, 0..1 (multiplica o ganho master do áudio). */
  readonly volume: number;
  /** Multiplicador da sensibilidade do mouse, SENSITIVITY_MIN..SENSITIVITY_MAX. */
  readonly mouseSensitivity: number;
  /** Números de dano flutuantes na run (2026-11-24). Padrão: ligado. */
  readonly showDamageNumbers: boolean;
  /** Idioma da interface — fixo em pt-BR na v1 (sem setter). */
  readonly language: typeof LANGUAGE;
  /** Clampa para 0..1, persiste e notifica. Não finito é no-op. */
  setVolume(volume: number): void;
  /** Clampa para a faixa, persiste e notifica. Não finito é no-op. */
  setMouseSensitivity(multiplier: number): void;
  /** Liga/desliga os números de dano, persiste e notifica. */
  setShowDamageNumbers(show: boolean): void;
  /** Registra ouvinte chamado após CADA mudança persistida. */
  subscribe(listener: () => void): void;
}

export function createSettingsStore(storage?: SettingsStorage): GameSettings {
  const store = storage ?? resolveLocalStorage();
  const listeners: Array<() => void> = [];

  let volume = VOLUME_DEFAULT;
  let mouseSensitivity = SENSITIVITY_DEFAULT;
  let showDamageNumbers = true;

  load();

  function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }

  /** Número finito clampado a partir de valor desconhecido do storage; senão null. */
  function sanitizeRange(value: unknown, min: number, max: number): number | null {
    if (typeof value !== 'number' || !Number.isFinite(value)) return null;
    return clamp(value, min, max);
  }

  function load(): void {
    if (store === null) return;
    let raw: string | null = null;
    try {
      raw = store.getItem(SETTINGS_STORAGE_KEY);
    } catch {
      return; // storage inacessível: padrões, em memória
    }
    if (raw === null) return;

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return; // lixo gravado: ignora (a próxima escrita regrava são)
    }
    if (typeof parsed !== 'object' || parsed === null) return;
    const record = parsed as Record<string, unknown>;

    const rawVolume = sanitizeRange(record['volume'], 0, 1);
    if (rawVolume !== null) volume = rawVolume;

    const rawSensitivity = sanitizeRange(
      record['mouseSensitivity'],
      SENSITIVITY_MIN,
      SENSITIVITY_MAX,
    );
    if (rawSensitivity !== null) mouseSensitivity = rawSensitivity;

    if (typeof record['showDamageNumbers'] === 'boolean') {
      showDamageNumbers = record['showDamageNumbers'];
    }
  }

  function save(): void {
    if (store === null) return;
    try {
      store.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify({ volume, mouseSensitivity, showDamageNumbers }),
      );
    } catch {
      // Cota cheia/modo privado: segue em memória — configuração nunca quebra o jogo.
    }
  }

  /** Persiste UMA vez e avisa os assinantes (que aplicam o efeito). */
  function commit(): void {
    save();
    for (const listener of listeners) listener();
  }

  return {
    get volume(): number {
      return volume;
    },
    get mouseSensitivity(): number {
      return mouseSensitivity;
    },
    get showDamageNumbers(): boolean {
      return showDamageNumbers;
    },
    get language(): typeof LANGUAGE {
      return LANGUAGE;
    },
    setVolume(value: number): void {
      if (!Number.isFinite(value)) return;
      volume = clamp(value, 0, 1);
      commit();
    },
    setMouseSensitivity(multiplier: number): void {
      if (!Number.isFinite(multiplier)) return;
      mouseSensitivity = clamp(multiplier, SENSITIVITY_MIN, SENSITIVITY_MAX);
      commit();
    },
    setShowDamageNumbers(show: boolean): void {
      showDamageNumbers = show === true;
      commit();
    },
    subscribe(listener: () => void): void {
      listeners.push(listener);
    },
  };
}

/**
 * localStorage com o ACESSO guardado (mesma borda do metaStore): em alguns
 * navegadores só tocar na propriedade lança. null = sem persistência.
 */
function resolveLocalStorage(): SettingsStorage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
