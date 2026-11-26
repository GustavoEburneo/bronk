// Fonte da UI (decisão 2026-11-26, "placar esportivo BR"): Barlow Condensed
// EMBARCADA via fontsource — o Vite empacota os woff2, zero CDN em runtime.
// Só os pesos usados pelo tema (500 corpo, 600 botões/chips, 700 números,
// 700 itálico letreiros) para segurar o bundle.
import '@fontsource/barlow-condensed/500.css';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/700-italic.css';
import { injectUiTokensOnce } from './theme/tokens';
import type { GameData } from './data/tables';
import { gameData } from './data/tables';
import { validateGameData } from './data/validate';
import type { MatchSelection, World } from './sim/world';
import { abandonRun, createWorld } from './sim/world';
import { applyUpgradesById, chooseUpgrade, findUpgradeIndex, rerollChoice } from './sim/upgrades';
import { mulberry32 } from './sim/rng';
import { createKeyboardInput, rotateFrameToCamera } from './app/input';
import { createMouseLook } from './app/mouseLook';
import { createPerf } from './app/perf';
import type { GameLoopHandle } from './app/gameLoop';
import { startGameLoop } from './app/gameLoop';
import { createRenderer } from './render/renderer';
import { createAudio } from './audio/audio';
import { setSnapEnabled } from './render/retro';
import { createHud } from './ui/hud';
import { createDeathOverlay } from './ui/deathOverlay';
import { createUpgradeOverlay } from './ui/upgradeOverlay';
import { createPauseOverlay } from './ui/pauseOverlay';
import type { ScreenFlowEntry } from './ui/screens/screenFlow';
import { createScreenFlow } from './ui/screens/screenFlow';
import type { RunRecord } from './meta/metaStore';
import { createMetaStore } from './meta/metaStore';
import { createSettingsStore } from './meta/settingsStore';

// Overrides por URL para o passe de estresse, sem tocar em código:
//   ?inimigos=1000  → enemies.maxAlive
//   ?spawn=50       → spawn.baseRatePerSec (enche a tela rápido)
//   ?res=540        → altura interna de render (padrão: NATIVA da janela, teto
//                     1080 — passe gráfico de 2026-11-24)
//   ?snap=1         → religa o vertex snapping PS1 (desligado por padrão desde
//                     o passe gráfico; era o contrário)
// Overrides para verificação (o estado desejado entra direto, sem jogar até o
// sorteio dar o build; valem também após o restart):
//   ?melhorias=cafe,cafe,bocao → aplica melhorias por id na criação do mundo
//   ?seed=42        → semente fixa da sim (inteiro > 0): runs reproduzíveis
//   ?tempo=400      → inicia world.time em N segundos: fases tardias do
//                     cronograma de spawn (e a taxa crescente) sem jogar até
//                     lá; vale na criação E no restart
// Overrides de seleção (TECH, "Verificação jogável"):
//   ?bananas=200    → credita N bananas no cofre ANTES do menu (verificação
//                     da loja sem grind; persiste como uma run que rendeu N)
//   ?personagem=capivara|carteiro → PULA as telas de menu e inicia a partida
//                     direto com o personagem (ids de src/data/characters.ts);
//                     id inválido → Error no boot
//   ?mapa=cidade    → mapa da partida (ids jogáveis de src/data/maps.ts);
//                     só vale junto com ?personagem= — sem ele, é ignorado
//                     (as telas mandam); padrão: o primeiro mapa jogável
// Sem ?personagem=, os demais overrides ficam guardados e aplicam-se ao mundo
// criado quando o jogador chega ao jogo pelas telas (mesmo caminho de código).
// Tokens de estilo em :root ANTES de qualquer tela/overlay nascer (todos
// consomem var(--ui-*); ver src/theme/tokens.ts).
injectUiTokensOnce();

const params = new URLSearchParams(window.location.search);
const data = applyUrlOverrides(gameData, params);
validateGameData(data);
const startingUpgrades = readStartingUpgrades(params);
// Fail fast: id inválido em ?melhorias= estoura AQUI, no boot — sem ?personagem=
// o mundo só nasce depois das telas, e o erro tardio deixaria a tela preta.
for (const id of startingUpgrades) findUpgradeIndex(data, id);
const seedOverride = readNumber(params, 'seed');
const startTimeOverride = readNumber(params, 'tempo');

const canvasOrNull = document.querySelector<HTMLCanvasElement>('#game');
const hudElementOrNull = document.querySelector<HTMLElement>('#hud');
if (!canvasOrNull || !hudElementOrNull) throw new Error('index.html sem #game ou #hud');
const canvas = canvasOrNull;
const hudElement = hudElementOrNull;

setSnapEnabled(params.get('snap') === '1');

// Contexto com a vida do APP, criado uma vez (TECH): renderer/câmera, input,
// mouse, HUD e overlays persistem entre partidas; a CENA entra por beginMatch.
const mouseLook = createMouseLook(canvas);
const input = createKeyboardInput(window);
const renderer = createRenderer(canvas, {
  // 0 = resolução nativa (padrão do passe gráfico 2026-11-24); ?res= força.
  renderHeight: readNumber(params, 'res') ?? 0,
  cameraLook: mouseLook,
  // Números de dano: preferência do jogador, aplicada na hora (lida por frame).
  showDamageNumbers: () => settings.showDamageNumbers,
});
const perf = createPerf();
const hud = createHud(hudElement);
// Cofre de meta-progressão (bananas + talentos), vida do APP como o renderer:
// carregado uma vez do localStorage; loja compra e fim de run credita via API.
const meta = createMetaStore(data);
const bananasOverride = readNumber(params, 'bananas');
if (bananasOverride !== undefined) meta.credit(Math.floor(bananasOverride));
// Vida do APP, como o renderer (TECH, "Áudio sintetizado"): o AudioContext é
// recurso finito — criado lazy no unlock(), nunca recriado por partida.
const audio = createAudio();

// Configurações do jogador (volume, sensibilidade do mouse, idioma), vida do
// APP como o cofre de meta: carregadas uma vez do localStorage. A tela
// CONFIGURAÇÕES escreve via API do cofre; quem APLICA nos donos dos efeitos é
// este módulo — no boot (valores salvos) e a cada mudança (assinatura).
const settings = createSettingsStore();
const applySettings = (): void => {
  audio.setMasterVolume(settings.volume);
  mouseLook.setSensitivity(settings.mouseSensitivity);
};
settings.subscribe(applySettings);
applySettings();

// ---------------------------------------------------------------------------
// Máquina de estados da aplicação: 'menu' ⇄ 'match' (TECH, decidido 2026-11-17)
// Transições: startMatch (menu → match) e returnToMenu (match → menu). O world
// e o loop só existem em 'match'; quem cria/destrói o world é este módulo.
// ---------------------------------------------------------------------------
type AppState = 'menu' | 'match';
let appState: AppState = 'menu';
let world: World | null = null;
let selection: MatchSelection | null = null;
let loop: GameLoopHandle | null = null;

const flow = createScreenFlow((picked) => {
  // O clique de JOGAR é o gesto que destrava o autoplay (TECH, "Autoplay"):
  // o caminho normal sempre passa por aqui antes da partida.
  audio.unlock();
  startMatch(picked);
}, meta, settings);

const overlay = createDeathOverlay(
  () => {
    // "Jogar de novo": recria só o world, com a MESMA seleção e os mesmos
    // overrides (?melhorias/?seed valem no restart). A cena não é recriada.
    world = createStartingWorld(requireSelection());
    overlay.hide();
  },
  () => {
    // "Menu": encerra a partida e volta à SELEÇÃO DE PERSONAGEM (DECISIONS
    // 2026-11-17: re-jogar trocando de personagem é o caso comum pós-morte).
    returnToMenu();
  },
);

// "Panfleto na Esquina": os callbacks releem o world atual (o restart troca o
// objeto) e checam o estado antes de agir — chamada inválida lança por
// contrato da sim, e clique + tecla podem chegar no mesmo frame.
const upgradeOverlay = createUpgradeOverlay({
  choose(optionIndex) {
    const choice = world?.upgradeChoice;
    if (world === null || choice === null || choice === undefined) return;
    if (optionIndex >= choice.options.length) return;
    chooseUpgrade(world, optionIndex);
    // Re-sincroniza já: a fila pode reabrir a escolha no mesmo instante.
    upgradeOverlay.sync(world);
    // Escolha fechou de vez (fila vazia): re-trava o ponteiro NESTE clique —
    // sem isso o jogador tinha que clicar na tela para a câmera voltar
    // (correção de 2026-11-24). Fila reaberta: a pausa segue e o lock espera.
    if (world.upgradeChoice === null) mouseLook.lock();
  },
  reroll() {
    if (world === null || world.upgradeChoice === null) return;
    if (!world.upgradeChoice.rerollAvailable) return;
    rerollChoice(world);
    upgradeOverlay.sync(world);
  },
});

// Menu de pausa (Esc/P na run): congela a sim via isPaused no gameLoop e
// mostra o build. As ações releem o world atual, como os outros overlays.
// Recebe o cofre de configurações: o sub-painel CONFIGURAÇÕES da pausa usa o
// mesmo panfleto do menu, e os ajustes aplicam na hora via o assinante acima.
const pauseOverlay = createPauseOverlay({
  resume() {
    pauseOverlay.hide();
    // Mesmo conserto da escolha de melhoria: o clique em Continuar re-trava
    // o ponteiro (Esc/P têm cooldown de lock no navegador; falha é silenciosa).
    mouseLook.lock();
  },
  endRun() {
    pauseOverlay.hide();
    // Vira gameOver pelo caminho normal: o afterFrame do próximo frame mostra
    // o "Fim da run" e credita as bananas — zero código especial de saída.
    if (world !== null) abandonRun(world);
  },
  exitToMenu() {
    pauseOverlay.hide();
    // Saída direta não passa pelo overlay de morte, então fecha a conta AQUI
    // (o returnToMenu solta a referência do world e bananas/figurinhas iriam
    // junto). Só com a run ainda rodando: em gameOver o afterFrame já fechou.
    if (world !== null && world.status === 'running') meta.recordRun(buildRunRecord(world));
    returnToMenu('start');
  },
}, settings);

// Esc (ou P) alterna a pausa — só com a run rodando e sem outro overlay por
// cima: na escolha de melhoria a sim já está pausada, e no fim de run os
// botões de lá mandam. Obs.: com o ponteiro travado, o navegador consome o
// primeiro Esc para soltar o lock; o segundo pausa (P pausa de primeira).
window.addEventListener('keydown', (event) => {
  if (event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;
  if (event.code !== 'Escape' && event.code !== 'KeyP') return;
  if (appState !== 'match' || world === null) return;
  if (world.status !== 'running' || world.upgradeChoice !== null || overlay.visible) return;
  event.preventDefault();
  if (pauseOverlay.visible) {
    // Esc/P dentro das CONFIGURAÇÕES da pausa volta ao menu de pausa; só o
    // próximo Esc/P (já no menu) retoma o jogo.
    if (!pauseOverlay.closeSettings()) pauseOverlay.hide();
  } else {
    // Solta o ponteiro para o clique alcançar os botões da pausa.
    mouseLook.unlock();
    pauseOverlay.show(world);
  }
});

// Boot: com ?personagem= válido pula as telas (ver Overrides); senão, menu.
const characterOverride = params.get('personagem');
if (characterOverride !== null) {
  // O pulo de telas não tem gesto antes da partida: o primeiro clique/tecla
  // do jogador destrava o áudio (one-shot; unlock é idempotente e nunca lança).
  const unlockOnce = (): void => {
    window.removeEventListener('pointerdown', unlockOnce);
    window.removeEventListener('keydown', unlockOnce);
    audio.unlock();
  };
  window.addEventListener('pointerdown', unlockOnce);
  window.addEventListener('keydown', unlockOnce);
  startMatch({ characterId: characterOverride, mapId: params.get('mapa') ?? undefined });
} else {
  hudElement.hidden = true;
  flow.show();
}

function startMatch(picked: MatchSelection): void {
  if (appState !== 'menu') throw new Error(`startMatch em estado ${appState}`);

  flow.hide();
  // Cena antes do world: id inválido falha aqui ou no createWorld — nos dois
  // casos é Error no boot, como manda o TECH.
  renderer.beginMatch(data, picked);
  audio.beginMatch();
  selection = picked;
  world = createStartingWorld(picked);
  hudElement.hidden = false;

  loop = startGameLoop({
    getWorld: () => requireWorld(),
    sampleInput: () => rotateFrameToCamera(input.sample(), mouseLook.yaw),
    draw: (currentWorld, alpha, frameDt) => renderer.draw(currentWorld, alpha, frameDt),
    perf,
    // Menu de pausa aberto: a sim congela como na escolha de melhoria.
    isPaused: () => pauseOverlay.visible,
    afterFrame: (currentWorld) => {
      hud.update(currentWorld, perf);
      // O áudio lê world.events como o render lê o estado (nunca consome
      // destrutivamente); o dedup por tickCount vive dentro do módulo.
      audio.update(currentWorld);
      if (currentWorld.upgradeChoice !== null && !upgradeOverlay.visible) {
        // Solta o ponteiro para o clique alcançar os panfletos; ao fechar, o
        // clique no canvas re-trava, como o jogo já faz.
        mouseLook.unlock();
      }
      upgradeOverlay.sync(currentWorld);
      if (currentWorld.status === 'gameOver' && !overlay.visible) {
        // Solta o ponteiro para o clique alcançar os botões de fim de run.
        mouseLook.unlock();
        // Fechamento ÚNICO por run (bananas, figurinhas, estatísticas e
        // conquistas): este bloco só roda na transição para o overlay
        // (visible trava até o restart/menu trocarem o world).
        const outcome = meta.recordRun(buildRunRecord(currentWorld));
        overlay.show(currentWorld, { newAchievements: outcome.newAchievements });
      }
    },
  });

  appState = 'match';
}

/**
 * Encerra a partida e volta às telas. `entry`: 'character' no caminho da morte
 * (re-jogar trocando de personagem é o caso comum — DECISIONS 2026-11-17);
 * 'start' no "Sair pro menu principal" da pausa (o jogador pediu o menu).
 */
function returnToMenu(entry: ScreenFlowEntry = 'character'): void {
  if (appState !== 'match') throw new Error(`returnToMenu em estado ${appState}`);

  loop?.stop();
  loop = null;
  overlay.hide();
  pauseOverlay.hide();
  renderer.endMatch();
  audio.endMatch();
  // Pools da sim são arrays simples: soltar a referência basta.
  world = null;
  selection = null;
  hudElement.hidden = true;

  appState = 'menu';
  flow.show(entry);
}

function requireWorld(): World {
  if (world === null) throw new Error('world ausente com o loop rodando');
  return world;
}

function requireSelection(): MatchSelection {
  if (selection === null) throw new Error('seleção ausente com a partida ativa');
  return selection;
}

/** Fecha a conta da run lendo o world (o cofre credita e avalia conquistas). */
function buildRunRecord(currentWorld: World): RunRecord {
  return {
    characterId: currentWorld.data.characters[currentWorld.characterIndex]!.id,
    mapId: currentWorld.mapId,
    timeSec: currentWorld.time,
    level: currentWorld.player.level,
    // Morte de verdade, não desistência: a Rapidinha exige morrer.
    died: currentWorld.player.state === 'dead',
    bananasEarned: currentWorld.bananasEarned,
    killsByType: currentWorld.killsByType,
    cardsEarned: currentWorld.cardsEarned,
  };
}

function createStartingWorld(matchSelection: MatchSelection): World {
  const simSeed = Math.floor(seedOverride ?? newSeed());
  const freshWorld = createWorld(
    data,
    mulberry32(simSeed),
    // Talentos e álbum entram em TODA partida (inclusive no restart, que relê
    // o cofre — a run recém-fechada pode ter rendido figurinhas novas).
    // dropSeed derivado da semente da sim: com ?seed= a run inteira (drops
    // incluídos) é reproduzível, sem compartilhar o MESMO stream do RNG.
    {
      ...matchSelection,
      talentRanks: meta.talentRanksArray(),
      albumCopies: meta.albumCopiesArray(),
      dropSeed: (simSeed ^ 0x5eed) >>> 0,
    },
  );
  // ?tempo=: createWorld não conhece tempo de partida — tudo que depende dele
  // (taxa de spawn e fase do cronograma em enemySpawn) lê world.time, e o
  // spawnAccumulator parte de 0 como num mundo novo. Setar o relógio basta.
  if (startTimeOverride !== undefined) freshWorld.time = startTimeOverride;
  applyUpgradesById(freshWorld, startingUpgrades);
  return freshWorld;
}

function newSeed(): number {
  // Fora da sim a aleatoriedade é livre; dentro dela, só via Rng injetado.
  return (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
}

function readStartingUpgrades(search: URLSearchParams): string[] {
  const raw = search.get('melhorias');
  if (raw === null) return [];
  return raw
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id.length > 0);
}

function readNumber(search: URLSearchParams, key: string): number | undefined {
  const raw = search.get(key);
  if (raw === null) return undefined;
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

function applyUrlOverrides(base: GameData, search: URLSearchParams): GameData {
  const copy = structuredClone(base);
  const maxAlive = readNumber(search, 'inimigos');
  if (maxAlive !== undefined) copy.enemies.maxAlive = Math.floor(maxAlive);
  const spawnRate = readNumber(search, 'spawn');
  if (spawnRate !== undefined) copy.spawn.baseRatePerSec = spawnRate;
  return copy;
}
