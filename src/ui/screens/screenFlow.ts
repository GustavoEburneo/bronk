import { createStartScreen } from './startScreen';
import { createCharacterScreen } from './characterScreen';
import { createMapScreen } from './mapScreen';
import { createShopScreen } from './shopScreen';
import { createAchievementsScreen } from './achievementsScreen';
import { createAlbumScreen } from './albumScreen';
import { createSettingsScreen } from './settingsScreen';
import type { MetaStore } from '../../meta/metaStore';
import type { GameSettings } from '../../meta/settingsStore';
import { injectScreenThemeOnce, type Screen } from './screenTheme';

/**
 * Seleção completa entregue ao fim do fluxo (início → personagem → mapa).
 * Ids vêm das tabelas (`data.characters`/`data.maps`); o integrador os
 * valida ao criar o mundo (`createWorld`).
 */
export interface PlaySelection {
  characterId: string;
  mapId: string;
}

/**
 * Pontos de entrada do fluxo: `'start'` no boot; `'character'` para a volta
 * ao menu pós-morte (TECH: re-jogar com outro personagem é o caso comum).
 */
export type ScreenFlowEntry = 'start' | 'character';

export interface ScreenFlow {
  readonly visible: boolean;
  /**
   * Mostra o container `#screens` na tela pedida (padrão: início).
   * Pode ser chamado de novo após `hide()` — o fluxo é reutilizável.
   */
  show(at?: ScreenFlowEntry): void;
  /**
   * Esconde o container e a tela atual. O fluxo NÃO se esconde sozinho ao
   * disparar `onPlay`: quem esconde é o integrador (TECH: `startMatch`
   * esconde `#screens` e mostra `#hud`).
   */
  hide(): void;
}

type ScreenId = 'start' | 'shop' | 'settings' | 'achievements' | 'album' | 'character' | 'map';

/**
 * Wizard linear das telas de menu: encadeia início → personagem → mapa, com
 * os desvios início ⇄ loja / configurações / conquistas / álbum, trata o
 * "voltar" (botão e
 * Esc voltam uma tela; na tela de início o Esc não faz nada) e entrega
 * `onPlay({ characterId, mapId })` ao confirmar o mapa.
 *
 * Cria o container `#screens` (overlay DOM opaco sobre o canvas — id do
 * contrato do TECH) e monta as telas dentro dele. Não conhece a simulação:
 * as telas leem `data.*` para os cards, os ids da seleção são validados pelo
 * integrador ao criar o mundo, e a loja compra via `meta` (MetaStore).
 */
export function createScreenFlow(
  onPlay: (selection: PlaySelection) => void,
  meta: MetaStore,
  settings: GameSettings,
): ScreenFlow {
  injectScreenThemeOnce();

  const container = document.createElement('div');
  container.id = 'screens';
  container.hidden = true;
  document.body.append(container);

  let visible = false;
  let current: ScreenId | null = null;
  let selectedCharacter: string | null = null;

  const startScreen = createStartScreen(container, {
    onStart: () => goTo('character'),
    onShop: () => goTo('shop'),
    onSettings: () => goTo('settings'),
    onAchievements: () => goTo('achievements'),
    onAlbum: () => goTo('album'),
  });

  const shopScreen = createShopScreen(container, meta, () => goTo('start'));
  const settingsScreen = createSettingsScreen(container, settings, () => goTo('start'));
  const achievementsScreen = createAchievementsScreen(container, meta, () => goTo('start'));
  const albumScreen = createAlbumScreen(container, meta, () => goTo('start'));

  const characterScreen = createCharacterScreen(container, {
    onConfirm(characterId) {
      selectedCharacter = characterId;
      goTo('map');
    },
    onBack() {
      goTo('start');
    },
  });

  const mapScreen = createMapScreen(container, {
    onConfirm(mapId) {
      if (selectedCharacter === null) {
        // O mapa só abre depois do personagem: chegar aqui sem seleção é bug do fluxo.
        throw new Error('mapa confirmado sem personagem selecionado — fluxo de telas fora de ordem');
      }
      onPlay({ characterId: selectedCharacter, mapId });
    },
    onBack() {
      goTo('character');
    },
  });

  const screens: Record<ScreenId, Screen> = {
    start: startScreen,
    shop: shopScreen,
    settings: settingsScreen,
    achievements: achievementsScreen,
    album: albumScreen,
    character: characterScreen,
    map: mapScreen,
  };

  function goTo(next: ScreenId): void {
    if (current !== null) screens[current].hide();
    current = next;
    if (next === 'character') {
      // Voltar do mapa (ou voltar ao menu) re-destaca a última escolha.
      characterScreen.show(selectedCharacter ?? undefined);
    } else {
      screens[next].show();
    }
  }

  // Esc volta uma tela (GDD). Só age com o fluxo visível: as teclas do menu
  // não podem vazar para a partida, nem as do jogo acionar o menu.
  const onKeyDown = (event: KeyboardEvent): void => {
    if (!visible || event.repeat || event.code !== 'Escape') return;
    if (
      current === 'character' ||
      current === 'shop' ||
      current === 'settings' ||
      current === 'achievements' ||
      current === 'album'
    ) {
      event.preventDefault();
      goTo('start');
    } else if (current === 'map') {
      event.preventDefault();
      goTo('character');
    }
  };
  window.addEventListener('keydown', onKeyDown);

  return {
    get visible(): boolean {
      return visible;
    },
    show(at: ScreenFlowEntry = 'start'): void {
      visible = true;
      container.hidden = false;
      goTo(at);
    },
    hide(): void {
      visible = false;
      container.hidden = true;
      if (current !== null) screens[current].hide();
      current = null;
    },
  };
}
