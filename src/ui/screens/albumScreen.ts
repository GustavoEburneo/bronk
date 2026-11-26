/**
 * Tela do Álbum de Figurinhas (GDD 2026-11-19): uma figurinha por tipo de
 * inimigo (`data.enemyTypes` — nome/ícone vêm de lá), com as cópias
 * acumuladas, o bônus de dano ATUAL contra o tipo e o próximo degrau
 * ("faltam K pra +10%") — o álbum é progressão legível: o jogador sempre sabe
 * o que ganha e quanto falta. Tipo sem figurinha fica desbotado com "???" no
 * lugar do ícone (mistério de álbum de banca). A tela só LÊ (MetaStore);
 * quem credita drops é o cofre, no fim da run.
 */
import { gameData } from '../../data/tables';
import { albumDamageBonus, nextAlbumTier } from '../../data/album';
import type { MetaStore } from '../../meta/metaStore';
import {
  el,
  injectScreenThemeOnce,
  injectStyleOnce,
  blurWithin,
  MEDIA_COMPACT,
  type Screen,
} from './screenTheme';

/** Percentual exibível de uma fração (0.05 → "5%"). */
function percentLabel(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}

export function createAlbumScreen(parent: HTMLElement, meta: MetaStore, onBack: () => void): Screen {
  injectScreenThemeOnce();
  injectStyleOnce('album-screen-style', ALBUM_CSS);

  const types = gameData.enemyTypes;
  const album = gameData.album;

  const root = document.createElement('section');
  root.className = 'screen album-screen';
  root.setAttribute('aria-label', 'Álbum de figurinhas');
  root.hidden = true;

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'screen-back';
  backButton.textContent = '← Voltar (Esc)';
  backButton.addEventListener('click', () => onBack());

  const title = el('h1', 'screen-title', 'Álbum de Figurinhas');
  // Instruções impressas no topo da página direita, como nos álbuns de banca.
  const hint = el(
    'p',
    'album-hint',
    'Todo abate tem uma chance pequena de dropar a figurinha do bicho. Junte cópias: cada degrau aumenta o seu dano contra ele.',
  );
  // Linha de progresso impressa na página esquerda.
  const counter = el('p', 'album-counter', '');

  // Álbum ABERTO na mesa: capa aparecendo por trás, duas páginas lado a lado
  // com vinco costurado no meio. As figurinhas se dividem meio a meio entre as
  // páginas, em ordem de leitura (esquerda primeiro).
  const leftGrid = el('div', 'album-cards', null);
  leftGrid.setAttribute('role', 'list');
  const rightGrid = el('div', 'album-cards', null);
  rightGrid.setAttribute('role', 'list');

  // Arte-d'água das páginas: bichos gigantes desbotados em verde + logo torto,
  // como a arte de fundo impressa nos álbuns de banca (referência: álbum de
  // COPA, páginas creme com a arte verde-bandeira atrás dos slots).
  function watermark(icons: string[], withLogo: boolean): HTMLElement {
    const wm = el('div', 'album-watermark', null);
    wm.setAttribute('aria-hidden', 'true');
    icons.forEach((icon, i) => wm.append(el('span', `wm-icon wm-${i}`, icon)));
    if (withLogo) wm.append(el('span', 'wm-logo', 'COPA DO CAOS'));
    return wm;
  }
  const icons = types.map((t) => t.icon);
  const rightIcons = icons.slice(3, 6).length > 0 ? icons.slice(3, 6) : icons.slice(0, 3);

  const pageLeft = el('div', 'album-page album-page-left', null);
  pageLeft.append(
    watermark(icons.slice(0, 3), false),
    el('p', 'album-page-title', 'Seleção Bichos da Rua'),
    counter,
    leftGrid,
    el('span', 'album-page-num', '12'),
  );
  const pageRight = el('div', 'album-page album-page-right', null);
  pageRight.append(watermark(rightIcons, true), hint, rightGrid, el('span', 'album-page-num', '13'));

  const book = el('div', 'album-book', null);
  book.append(pageLeft, pageRight);

  root.append(backButton, title, book);
  parent.append(root);

  /** Re-renderiza tudo do estado atual (drops acontecem fora da tela). */
  function renderAll(): void {
    let totalCopies = 0;
    let typesCollected = 0;
    leftGrid.textContent = '';
    rightGrid.textContent = '';
    const mid = Math.ceil(types.length / 2);

    types.forEach((def, index) => {
      const copies = meta.copiesOf(def.id);
      totalCopies += copies;
      if (copies > 0) typesCollected++;

      const collected = copies > 0;
      // Slot do álbum: moldura tracejada impressa na página; a figurinha
      // colada (torta, com borda branca e brilho) cobre o slot quando dropa.
      const card = el('div', collected ? 'album-slot filled' : 'album-slot empty', null);
      card.setAttribute('role', 'listitem');

      const sticker = el('div', collected ? `album-sticker p${index % 3}` : 'album-sticker', null);
      // Sem figurinha: mistério de álbum — "???" no lugar do ícone, nome
      // visível (o jogador já viu o bicho na arena; o mistério é a figurinha).
      sticker.append(el('span', 'album-icon', collected ? def.icon : '???'));

      card.append(
        el('span', 'album-num', `Nº ${String(index + 1).padStart(2, '0')}`),
        sticker,
        el('span', 'album-name', def.name),
        el('span', 'album-copies', collected ? `×${copies} no álbum` : 'ainda não dropou'),
      );

      const bonus = albumDamageBonus(album, copies);
      if (bonus > 0) {
        card.append(el('span', 'album-bonus', `+${percentLabel(bonus)} de dano contra ele`));
      }

      const next = nextAlbumTier(album, copies);
      if (next !== null) {
        card.append(
          el(
            'span',
            'album-next',
            `faltam ${next.copies - copies} pra +${percentLabel(next.damageBonus)}`,
          ),
        );
      } else {
        // Último degrau: set completo — flâmula de craque garantido.
        card.append(el('span', 'card-chosen', 'CRAQUE!'), el('span', 'album-next', 'bônus no talo'));
      }

      (index < mid ? leftGrid : rightGrid).append(card);
    });

    counter.textContent =
      `🃏 ${totalCopies} figurinha${totalCopies === 1 ? '' : 's'} · ` +
      `${typesCollected} de ${types.length} bichos colecionados`;
  }

  return {
    show(): void {
      renderAll(); // a run pode ter dropado desde a última visita
      root.hidden = false;
      backButton.focus({ preventScroll: true });
    },
    hide(): void {
      root.hidden = true;
      blurWithin(root);
    },
  };
}

const ALBUM_CSS = `
/* ====== Álbum de figurinhas de COPA, aberto, banca de jornal BR ======
   Sub-estilo PRÓPRIO de propósito: o álbum é um objeto IMPRESSO dentro do
   jogo, não interface de transmissão — por isso não usa os painéis chanfrados
   do tema (só botão de voltar e título, externos ao livro, vêm do tema).
   Um livro aberto: capa verde-escura de álbum de Copa aparecendo pelas
   bordas, duas páginas creme lado a lado com vinco costurado no meio, tinta
   de impressão VERDE-BANDEIRA, slots numerados impressos e figurinhas
   coladas tortas com borda branca e brilho. */

/* Livro maior que a janela + center cortaria o topo (mesmo fix das
   conquistas): ancora no topo; com suporte, centra só quando cabe. */
#screens .album-screen { justify-content: flex-start; padding-top: 52px; }
@supports (justify-content: safe center) {
  #screens .album-screen { justify-content: safe center; }
}

/* O livro aberto: álbum de banca de papel fininho — sem capa dura; em volta
   só a beiradinha da capa verde de Copa e a sombra do caderno sobre a mesa. */
.album-book {
  position: relative;
  display: flex;
  width: min(1280px, 95vw);
  padding: 5px 6px 9px;
  background: linear-gradient(180deg, #1d5c38 0%, #133f26 100%);
  border-radius: 4px;
  box-shadow: 9px 12px 18px rgba(0, 0, 0, 0.55);
}
/* Vinco central: a sombra do miolo grampeado entre as duas páginas. */
.album-book::before {
  content: '';
  position: absolute;
  z-index: 2;
  top: 5px;
  bottom: 9px;
  left: 50%;
  width: 46px;
  transform: translateX(-50%);
  background: linear-gradient(90deg, transparent 0%, rgba(70, 80, 90, 0.35) 50%, transparent 100%);
  pointer-events: none;
}

/* Páginas: papel creme de gráfica; TODA a tinta da página é verde-bandeira
   de impressão — só as figurinhas coladas têm cor de verdade. */
.album-page {
  position: relative;
  overflow: hidden;
  flex: 1 1 0;
  min-width: 0;
  padding: 22px 20px 40px;
  text-align: center;
  color: #0a7a3c;
}
.album-page-left {
  border-radius: 3px 0 0 3px;
  background: linear-gradient(90deg, #fdfdf6 0%, #f3f4e4 78%, #e2ecdd 96%, #cfdcc8 100%);
}
.album-page-right {
  border-radius: 0 3px 3px 0;
  background: linear-gradient(90deg, #cfdcc8 0%, #e2ecdd 4%, #f3f4e4 22%, #fdfdf6 100%);
}

/* Arte-d'água: bichos gigantes desbotados em verde + logo torto, sob os slots
   (a arte de fundo monocromática dos álbuns impressos). A inclinação aqui é
   DIEGÉTICA — arte impressa em diagonal na página, não UI torta do panfleto. */
.album-watermark {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.album-page > :not(.album-watermark) { position: relative; z-index: 1; }
.wm-icon {
  position: absolute;
  font-size: clamp(120px, 16vw, 230px);
  line-height: 1;
  /* hue-rotate é FILTRO DE COR (tinge o emoji de verde-bandeira), não
     transform decorativo — era 165deg (azul), virou 80deg (verde). */
  filter: grayscale(1) sepia(1) hue-rotate(80deg) saturate(3.2) brightness(1.1);
  opacity: 0.16;
}
.wm-0 { top: 4%; left: -4%; transform: rotate(-14deg); }
.wm-1 { top: 34%; right: -6%; transform: rotate(10deg); }
.wm-2 { bottom: -6%; left: 24%; transform: rotate(-6deg); }
.wm-logo {
  position: absolute;
  top: 38%;
  left: 6%;
  font-size: clamp(54px, 7vw, 110px);
  font-weight: bold;
  font-style: italic;
  letter-spacing: 2px;
  color: rgba(46, 155, 94, 0.18);
  -webkit-text-stroke: 2px rgba(10, 122, 60, 0.3);
  transform: rotate(-12deg);
  white-space: nowrap;
}

/* Número de página, no canto externo, em verde de impressão. */
.album-page-num {
  position: absolute;
  bottom: 12px;
  font-size: 14px;
  font-weight: bold;
  font-style: italic;
  color: #2e9b5e;
}
.album-page-left .album-page-num { left: 20px; }
.album-page-right .album-page-num { right: 20px; }

/* Cabeçalho: texto impresso em itálico verde, reto (impressão de gráfica —
   o torto é só das figurinhas coladas). */
.album-page-title {
  display: inline-block;
  margin: 0 0 4px;
  font-size: clamp(16px, 1.9vw, 23px);
  font-weight: bold;
  font-style: italic;
  letter-spacing: 3px;
  color: #0a7a3c;
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.8);
}

/* Progresso impresso na página, no mesmo verde. */
.album-counter {
  margin: 0 auto 14px;
  max-width: 480px;
  padding-bottom: 3px;
  font-size: 14px;
  font-weight: bold;
  font-style: italic;
  font-variant-numeric: tabular-nums;
  color: #2e9b5e;
  border-bottom: 2px dotted #8fd0a8;
}

/* Grade de slots impressa em cada página. */
.album-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(146px, 1fr));
  gap: 18px 14px;
  width: 100%;
}

/* Slot: retângulo de moldura verde impresso na página — como no álbum de
   Copa —, com o número grande em verde dentro; moldura RETA (é impressão de
   gráfica; torta só a figurinha colada). */
#screens .album-slot {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-height: 196px;
  padding: 6px 8px 8px;
  background: rgba(255, 255, 255, 0.22);
  border: 2px solid #8fd0a8;
  border-radius: 2px;
}
.album-num {
  font-size: 17px;
  font-weight: bold;
  letter-spacing: 1px;
  font-variant-numeric: tabular-nums;
  color: #2e9b5e;
}

/* A figurinha: borda branca grossa, fundo colorido e brilho de plástico. */
.album-sticker {
  position: relative;
  display: grid;
  place-items: center;
  width: 92px;
  height: 92px;
  overflow: hidden;
  border: 5px solid #ffffff;
  border-radius: 6px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2), 2px 3px 0 rgba(0, 0, 0, 0.25);
}
/* Fundos das figurinhas: família dourado/verde/azul BR (era dourado/rosa/azul). */
.album-sticker.p0 { background: linear-gradient(160deg, #ffe066 0%, #ffb03a 100%); }
.album-sticker.p1 { background: linear-gradient(160deg, #9be3a8 0%, #2e9b5e 100%); }
.album-sticker.p2 { background: linear-gradient(160deg, #d2f4ff 0%, #7cc6ff 100%); }
/* Brilho diagonal de figurinha plastificada. */
.album-slot.filled .album-sticker::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(115deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0) 34%);
}
/* Colada por criança: cada uma torta pra um lado — inclinação DIEGÉTICA (é a
   figurinha colada no objeto impresso, não a UI torta do panfleto). */
.album-cards .album-slot:nth-child(odd) .album-sticker { transform: rotate(-3deg); }
.album-cards .album-slot:nth-child(even) .album-sticker { transform: rotate(2.4deg); }

/* Slot vazio: só a moldura impressa, com a arte-d'água aparecendo atrás e o
   mistério "???" em verde clarinho — como os quadros vazios do álbum. */
.album-slot.empty .album-sticker {
  transform: none;
  border: 0;
  box-shadow: none;
  background: transparent;
}
.album-slot.empty { color: #5fb380; }
.album-slot.empty .album-icon { color: #9ed4b4; font-weight: bold; }

.album-icon { font-size: 34px; line-height: 1.1; letter-spacing: 2px; }
.album-name { font-size: 14.5px; font-weight: bold; line-height: 1.1; }
.album-copies { font-size: 12px; font-weight: bold; font-style: italic; }
.album-slot.empty .album-copies { font-weight: normal; }
.album-bonus { font-size: 12px; font-weight: bold; }
/* Linha "faltam K": legenda impressa no rodapé do slot. */
.album-next {
  margin-top: auto;
  align-self: stretch;
  padding-top: 4px;
  font-size: 11px;
  font-style: italic;
  border-top: 1px dotted #8fd0a8;
}

/* Texto promocional impresso em itálico verde, reto — o "Complete do nº X ao
   Y com a figurinha chave e ganhe um Bicho de Pelúcia" do álbum. */
.album-hint {
  margin: 4px auto 14px;
  max-width: 540px;
  font-size: 13px;
  font-weight: bold;
  font-style: italic;
  color: #0a7a3c;
}

/* Corte PRÓPRIO de 900px além do MEDIA_COMPACT do tema: é a DOBRA do álbum —
   abaixo disso as duas páginas lado a lado não cabem e o livro "fecha" numa
   coluna (página esquerda em cima da direita, vinco escondido, emenda das
   folhas no encontro das duas). */
@media (max-width: 900px) {
  .album-book { flex-direction: column; }
  .album-book::before { display: none; }
  .album-page-left {
    border-radius: 3px 3px 0 0;
    background: linear-gradient(180deg, #fdfdf6 0%, #f3f4e4 85%, #dfe9d6 100%);
  }
  .album-page-right {
    border-radius: 0 0 3px 3px;
    background: linear-gradient(180deg, #dfe9d6 0%, #f3f4e4 12%, #fdfdf6 100%);
  }
}

@media ${MEDIA_COMPACT} {
  .album-book { padding: 4px 4px 7px; }
  .album-page { padding: 16px 12px 32px; }
  .album-cards { grid-template-columns: repeat(auto-fill, minmax(128px, 1fr)); gap: 16px 10px; }
  #screens .album-slot { min-height: 170px; }
  .album-sticker { width: 72px; height: 72px; }
  .album-icon { font-size: 28px; }
  .album-counter { font-size: 13px; }
  .album-page-title { letter-spacing: 2px; }
}
`;
