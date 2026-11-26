/**
 * Formulário de configurações COMPARTILHADO (2026-11-23): o mesmo painel de
 * ajustes aparece na tela CONFIGURAÇÕES do menu e no sub-painel da pausa.
 * Extraído da settingsScreen quando a pausa ganhou o acesso — uma fonte só
 * para controles, textos e CSS; quem muda um slider muda nos dois lugares.
 * No tema "placar esportivo BR" (2026-11-26) é o formulário do vestiário:
 * painel de placar com linhas zebradas; os inputs nativos ficam intactos
 * (range/checkbox/select com accent-color — solução nativa e acessível).
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
import { el, injectStyleOnce, MEDIA_COMPACT, SB_CHAMFER } from './screens/screenTheme';

/** Passos dos sliders, em pontos percentuais (teclado: uma seta = um passo). */
const VOLUME_STEP_PCT = 5;
const SENSITIVITY_STEP_PCT = 10;

export interface SettingsSheet {
  /** O painel pronto para ser anexado (classe .settings-sheet). */
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
 * Tokens --ui-* vêm do :root (src/theme/tokens.ts) — nada é redeclarado aqui.
 * Os inputs NÃO têm clip-path, então o foco deles pode usar outline normal
 * (a regra "anel interno" do tema só vale para peças chanfradas).
 */
const SETTINGS_SHEET_CSS = `
/* Formulário do vestiário: painel de placar com as linhas de ajuste. */
.settings-sheet {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: min(560px, 94vw);
  padding: 24px 22px 22px; /* topo maior: a fita BR ocupa 6px */
  background: var(--ui-panel);
  color: var(--ui-text);
  text-align: left;
  border: 1px solid var(--ui-edge);
  border-left: 5px solid var(--ui-yellow);
  clip-path: ${SB_CHAMFER};
}
.settings-sheet::before { /* fita BR no topo (a ex-posição do grampo) */
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: var(--ui-stripe);
  pointer-events: none;
}

/* Linhas em zebra (--ui-panel-2 alternado): tabela de placar, não papel. */
.settings-row {
  display: grid;
  grid-template-columns: 180px 1fr 56px;
  align-items: center;
  gap: 4px 12px;
  padding: 8px 10px 9px;
}
.settings-row:nth-child(even) { background: var(--ui-panel-2); }
.settings-label {
  font-size: 15px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.2;
}
/* Slider nativo: visor escuro de placar segurando o trilho; thumb/preenchido
   amarelos via accent-color (nativo e acessível — teclado/leitor intactos). */
.settings-range {
  width: 100%;
  height: 26px;
  padding: 0 8px;
  background: var(--ui-led-bg);
  border: 1px solid var(--ui-edge);
  accent-color: var(--ui-yellow);
  cursor: pointer;
}
.settings-range:focus-visible { outline: 2px solid var(--ui-focus); outline-offset: 2px; }
/* Valor em %: dígitos de placar eletrônico, sempre tabulares. */
.settings-value {
  font-weight: 700;
  text-align: right;
  color: var(--ui-led);
  font-variant-numeric: tabular-nums;
}
.settings-checkbox {
  width: 24px;
  height: 24px;
  justify-self: start;
  accent-color: var(--ui-yellow);
  cursor: pointer;
}
.settings-checkbox:focus-visible { outline: 2px solid var(--ui-focus); outline-offset: 2px; }
.settings-select {
  font: inherit;
  padding: 6px 10px;
  color: var(--ui-text);
  background: var(--ui-panel-2);
  border: 1px solid var(--ui-edge);
}
.settings-select:focus-visible { outline: 2px solid var(--ui-focus); outline-offset: 2px; }
/* Desabilitado mas legível: é informação ("o jogo está em pt-BR"), não ação. */
.settings-select:disabled { color: var(--ui-text); opacity: 1; cursor: not-allowed; }
.settings-note { grid-column: 2 / -1; font-size: 12.5px; color: var(--ui-text-dim); }

@media ${MEDIA_COMPACT} {
  .settings-sheet { gap: 8px; padding: 18px 14px 16px; }
  .settings-row { grid-template-columns: 112px 1fr 48px; padding: 6px 8px 7px; }
  .settings-label { font-size: 13px; }
}
`;
