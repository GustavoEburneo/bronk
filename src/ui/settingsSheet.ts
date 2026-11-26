/**
 * Formulário de configurações COMPARTILHADO (2026-11-23): o mesmo panfleto de
 * ajustes aparece na tela CONFIGURAÇÕES do menu e no sub-painel da pausa.
 * Extraído da settingsScreen quando a pausa ganhou o acesso — uma fonte só
 * para controles, textos e CSS; quem muda um slider muda nos dois lugares.
 *
 * Contrato igual ao da tela: lê e escreve APENAS via GameSettings (clamps e
 * persistência vivem no cofre); quem APLICA os efeitos é o integrador,
 * assinante do cofre. Os sliders aplicam no gesto (evento `input`), sem botão
 * de salvar.
 *
 * `idPrefix` diferencia os ids dos controles entre as instâncias (menu e
 * pausa coexistem no DOM; label/for exige id único).
 */
import type { GameSettings } from '../meta/settingsStore';
import { SENSITIVITY_MIN, SENSITIVITY_MAX } from '../meta/settingsStore';
import { el, injectStyleOnce } from './screens/screenTheme';

/** Passos dos sliders, em pontos percentuais (teclado: uma seta = um passo). */
const VOLUME_STEP_PCT = 5;
const SENSITIVITY_STEP_PCT = 10;

export interface SettingsSheet {
  /** O panfleto pronto para ser anexado (classe .settings-sheet). */
  readonly root: HTMLElement;
  /** Re-sincroniza os controles do cofre — chamar ao abrir/mostrar. */
  sync(): void;
}

export function createSettingsSheet(settings: GameSettings, idPrefix: string): SettingsSheet {
  injectStyleOnce('settings-sheet-style', SETTINGS_SHEET_CSS);

  /** Linha de slider: rótulo | range | valor em %. O % ao lado é decorativo
   * para leitores de tela (o range já anuncia o próprio valor). */
  function sliderRow(options: {
    id: string;
    label: string;
    minPct: number;
    maxPct: number;
    stepPct: number;
    onInput(pct: number): void;
  }): { row: HTMLElement; input: HTMLInputElement; value: HTMLElement } {
    const row = el('div', 'settings-row', null);
    const label = document.createElement('label');
    label.className = 'settings-label';
    label.htmlFor = options.id;
    label.textContent = options.label;
    const input = document.createElement('input');
    input.type = 'range';
    input.id = options.id;
    input.className = 'settings-range';
    input.min = String(options.minPct);
    input.max = String(options.maxPct);
    input.step = String(options.stepPct);
    const value = el('span', 'settings-value', '');
    value.setAttribute('aria-hidden', 'true');
    input.addEventListener('input', () => options.onInput(input.valueAsNumber));
    row.append(label, input, value);
    return { row, input, value };
  }

  // --- Volume geral (0–100% → 0..1 no cofre) --------------------------------
  const volume = sliderRow({
    id: `${idPrefix}-volume`,
    label: 'Volume',
    minPct: 0,
    maxPct: 100,
    stepPct: VOLUME_STEP_PCT,
    onInput(pct) {
      settings.setVolume(pct / 100);
      syncVolume();
    },
  });

  function syncVolume(): void {
    const pct = Math.round(settings.volume * 100);
    // Só reatribui se divergiu (ex.: valor clampado): mexer no value durante o
    // arrasto reiniciaria o gesto em alguns navegadores.
    if (volume.input.valueAsNumber !== pct) volume.input.value = String(pct);
    volume.value.textContent = `${pct}%`;
  }

  // --- Sensibilidade do mouse (% sobre a base; 100% = padrão) ---------------
  const sensitivity = sliderRow({
    id: `${idPrefix}-sensitivity`,
    label: 'Sensibilidade do mouse',
    minPct: Math.round(SENSITIVITY_MIN * 100),
    maxPct: Math.round(SENSITIVITY_MAX * 100),
    stepPct: SENSITIVITY_STEP_PCT,
    onInput(pct) {
      settings.setMouseSensitivity(pct / 100);
      syncSensitivity();
    },
  });

  function syncSensitivity(): void {
    const pct = Math.round(settings.mouseSensitivity * 100);
    if (sensitivity.input.valueAsNumber !== pct) sensitivity.input.value = String(pct);
    sensitivity.value.textContent = `${pct}%`;
  }

  // --- Números de dano (liga/desliga; padrão ligado — 2026-11-24) -----------
  const damageRow = el('div', 'settings-row', null);
  const damageLabel = document.createElement('label');
  damageLabel.className = 'settings-label';
  damageLabel.htmlFor = `${idPrefix}-damage-numbers`;
  damageLabel.textContent = 'Números de dano';
  const damageToggle = document.createElement('input');
  damageToggle.type = 'checkbox';
  damageToggle.id = `${idPrefix}-damage-numbers`;
  damageToggle.className = 'settings-checkbox';
  damageToggle.addEventListener('change', () => {
    settings.setShowDamageNumbers(damageToggle.checked);
    syncDamageNumbers();
  });
  const damageValue = el('span', 'settings-value', '');
  damageValue.setAttribute('aria-hidden', 'true');
  damageRow.append(
    damageLabel,
    damageToggle,
    damageValue,
    el('span', 'settings-note', 'Mostra o dano causado (e sofrido) flutuando na run.'),
  );

  function syncDamageNumbers(): void {
    damageToggle.checked = settings.showDamageNumbers;
    damageValue.textContent = settings.showDamageNumbers ? 'ligado' : 'desligado';
  }

  // --- Idioma (fixo em pt-BR na v1) -----------------------------------------
  const languageRow = el('div', 'settings-row', null);
  const languageLabel = document.createElement('label');
  languageLabel.className = 'settings-label';
  languageLabel.htmlFor = `${idPrefix}-language`;
  languageLabel.textContent = 'Idioma';
  const languageSelect = document.createElement('select');
  languageSelect.id = `${idPrefix}-language`;
  languageSelect.className = 'settings-select';
  const languageOption = document.createElement('option');
  languageOption.value = settings.language;
  languageOption.textContent = 'Português (Brasil)';
  languageSelect.append(languageOption);
  // Única opção na v1: desabilitado de verdade (não há o que escolher).
  languageSelect.disabled = true;
  languageRow.append(
    languageLabel,
    languageSelect,
    el('span', 'settings-value', ''),
    el('span', 'settings-note', 'Único idioma disponível na v1.'),
  );

  const root = el('div', 'settings-sheet', null);
  root.append(volume.row, sensitivity.row, damageRow, languageRow);

  return {
    root,
    sync(): void {
      // Re-sincroniza do cofre: os valores podem ter sido clampados na carga
      // ou mudados pela OUTRA instância (menu ⇄ pausa).
      syncVolume();
      syncSensitivity();
      syncDamageNumbers();
    },
  };
}

/**
 * O panfleto consome as variáveis --ui-* do ancestral (#screens no menu,
 * #pause-overlay na pausa — os dois definem o conjunto completo).
 */
const SETTINGS_SHEET_CSS = `
/* Formulário de rua: um panfleto só, com as linhas de ajuste. */
.settings-sheet {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 22px;
  width: min(560px, 94vw);
  padding: 28px 30px 30px;
  background: var(--ui-paper-0);
  color: var(--ui-ink);
  text-align: left;
  border: 2px solid rgba(0, 0, 0, 0.35);
  border-radius: 2px;
  box-shadow: 6px 8px 0 rgba(0, 0, 0, 0.45);
  transform: rotate(-1deg);
}
.settings-sheet::before { /* grampo, como nos demais panfletos */
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  width: 26px;
  height: 8px;
  background: var(--ui-staple);
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  transform: translateX(-50%) rotate(-2deg);
}

.settings-row {
  display: grid;
  grid-template-columns: 180px 1fr 56px;
  align-items: center;
  gap: 4px 12px;
}
.settings-label { font-size: 17px; font-weight: bold; line-height: 1.2; }
.settings-range {
  width: 100%;
  height: 24px;
  accent-color: var(--ui-promo);
  cursor: pointer;
}
.settings-range:focus-visible { outline: 3px dashed var(--ui-promo); outline-offset: 3px; }
.settings-value {
  font-weight: bold;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.settings-checkbox {
  width: 24px;
  height: 24px;
  justify-self: start;
  accent-color: var(--ui-promo);
  cursor: pointer;
}
.settings-checkbox:focus-visible { outline: 3px dashed var(--ui-promo); outline-offset: 3px; }
.settings-select {
  font: inherit;
  padding: 6px 10px;
  color: var(--ui-ink);
  background: rgba(255, 251, 230, 0.9);
  border: 2px solid rgba(0, 0, 0, 0.35);
  border-radius: 4px;
}
/* Desabilitado mas legível: é informação ("o jogo está em pt-BR"), não ação. */
.settings-select:disabled { color: var(--ui-ink); opacity: 1; cursor: not-allowed; }
.settings-note { grid-column: 2 / -1; font-size: 12.5px; opacity: 0.8; }

@media (max-width: 640px), (max-height: 560px) {
  .settings-sheet { gap: 16px; padding: 20px 18px 22px; }
  .settings-row { grid-template-columns: 112px 1fr 48px; }
  .settings-label { font-size: 14px; }
}
`;
