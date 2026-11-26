/**
 * Tela de CONFIGURAÇÕES do menu (destravada em 2026-11-23): título, dica e o
 * panfleto de ajustes COMPARTILHADO com o sub-painel da pausa
 * (ui/settingsSheet.ts — controles, textos e CSS vivem lá; esta tela só
 * emoldura). A tela lê e escreve APENAS via GameSettings; quem aplica os
 * efeitos (áudio, câmera) é o integrador, assinante do cofre.
 */
import type { GameSettings } from '../../meta/settingsStore';
import { createSettingsSheet } from '../settingsSheet';
import { el, injectScreenThemeOnce, blurWithin, type Screen } from './screenTheme';

export function createSettingsScreen(
  parent: HTMLElement,
  settings: GameSettings,
  onBack: () => void,
): Screen {
  injectScreenThemeOnce();

  const root = document.createElement('section');
  root.className = 'screen settings-screen';
  root.setAttribute('aria-label', 'Configurações');
  root.hidden = true;

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'screen-back';
  backButton.textContent = '← Voltar (Esc)';
  backButton.addEventListener('click', () => onBack());

  const title = el('h1', 'screen-title', 'Configurações');
  const hint = el('p', 'screen-hint', 'Os ajustes valem na hora e ficam salvos neste navegador.');

  const sheet = createSettingsSheet(settings, 'settings');

  root.append(backButton, title, hint, sheet.root);
  parent.append(root);

  return {
    show(): void {
      sheet.sync();
      root.hidden = false;
      backButton.focus({ preventScroll: true });
    },
    hide(): void {
      root.hidden = true;
      blurWithin(root);
    },
  };
}
