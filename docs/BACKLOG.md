# Backlog

> Mantido pelo `orchestrator`. O que entrou, o que está em andamento e o que foi concluído.

_(nenhuma leva em andamento)_

## Entregue (2026-11-18) — Melhorias novas + bestiário da Avenida + curva de dificuldade + som de hit

Escopo (pedido do autor em 2026-11-18): (1) melhorias novas escolhíveis na run, incluindo
passivas (+defesa, regen...); (2) novos tipos de inimigo temáticos do mapa "Avenida em Obras";
(3) rebalanceamento com curva de dificuldade (direção a decidir pelo game-designer com
evidência); (4) primeiro som do jogo: efeito de hit no inimigo (sintetizado, 100% por código).
Fechada com 186 testes verdes, typecheck/build limpos, evidências em
`docs/evidencias-poc/avenida-inimigos/`; decisões de 2026-11-18 no DECISIONS.

| # | Tarefa | Responsável | Estado |
|---|---|---|---|
| 32 | GDD: melhorias novas (com passivas), bestiário temático com cronograma de spawn, curva de dificuldade, caráter do som de hit | game-designer | feito (2026-11-18): 4 melhorias (capacete/soro/dado/rodo), 3 inimigos novos + cone batizado, direção MAIS DIFÍCIL (base 2,0; growth 4,5/min; mediano morre em 4–6 min), "toc" de tábua com 1 som por ativação |
| 33 | TECH: tabela de tipos de inimigo (pool com typeIndex, pesos por tempo), stats passivos na sim, arquitetura de áudio WebAudio (eventos, autoplay, vozes, ciclo de vida) | tech-lead | feito (2026-11-18): TECH com 4 seções novas; defesa PLANA com dano mínimo 1; evento `enemyHit` agregado; cenário de balanceamento congelado |
| 34 | Tabelas + sim: EnemyTypeDef[], spawn por pesos, flyby do pombo, melhorias/stats novos (armor/regen/crit/knockback), curva, evento enemyHit + testes (cenário do trio congelado + difficulty.sim.test novo) | systems-engineer | feito (2026-11-18): 176 testes verdes (eram 120), typecheck/build OK, 1 run headless limpa; MEDIÇÃO da curva divergiu do GDD (idle 17 s vs 45–90; orbit 70 s vs 180–480 — modelo de contato domina) → devolvido ao game-designer |
| 34b | Veredito do game-designer sobre a curva medida (faixas vs modelo de contato) + atualização dos registros defasados do trio | game-designer | feito (2026-11-18): faixas recalibradas como guardas de regressão (idle 10–30 s, orbit 45–120 s), modelo de contato INTOCADO (alavanca de playtest registrada), cenário sem contato aprovado, absolutos do trio atualizados com nota de causa |
| 34c | Apertar guardas nos testes + cenário sem contato (pombo/min, level-ups aos 5 min ≤ 16) | systems-engineer | feito (2026-11-18): 178 testes verdes; guardas batem (17,1 s / 70,2 s / trio 68,5–70,2 s); pombo 4,0/min no idle e 0,0/min no orbit (identidade confirmada); level-ups aos 5 min: 10 (teto 16) |
| 35 | Render dos tipos novos (InstancedMesh por tipo, estilo tosco) + comportamento especial se houver | gameplay-engineer | feito (2026-11-18): 4 InstancedMesh (dimensões derivadas do radius — dívida antiga do cone morta), rato/britadeira/pombo toscos com rotação por instância, override `?tempo=N`, 3 runs headless limpas (60 FPS na régua), evidências em `docs/evidencias-poc/avenida-inimigos/` |
| 36 | Som de hit sintetizado (WebAudio) integrado ao loop, com unlock no menu e throttle | audio-designer | feito (2026-11-18): `src/audio/` novo (toc triangular 180–240 Hz + estalo de ruído; crit vence lote; gate puro com 8 testes), unlock nunca lança, 186 testes verdes, headless limpo; caráter final aguarda ESCUTA do autor (roteiro no backlog da leva) |
| 37 | Revisão pelo code-reviewer + verificação jogável no harness + fechamento de docs | code-reviewer / orchestrator | feito (2026-11-18): 0 bloqueantes; 1 doc (override `?tempo=` no TECH, aplicado pelo tech-lead) e 2 sugestões aplicadas pelo orquestrador (desempate da carta espelha a mordida; validação `despawnRadius <= halfSize` dos mapas jogáveis); suite verde pós-correções |

## Entregue (2026-11-17) — Escolha de melhorias "Panfleto na Esquina" (decisão de 2026-11-16)

Escopo: no level-up a sim pausa e um overlay DOM mostra 3 panfletos (melhorias sorteadas sem
repetição), com 1 reroll grátis por level-up; level-ups empilhados formam fila; pool esgotado
mostra o panfleto "Trocado" (cura 20 HP); morte no mesmo tick vence o level-up. O
`levelDamageBonus` fixo sai. Melhorias iniciais e valores: ver GDD (tabela do game-designer).

| # | Tarefa | Responsável | Estado |
|---|---|---|---|
| 12 | Atualizar GDD (loop principal + tabela de melhorias) | game-designer | feito (2026-11-16) |
| 13 | Tabela de melhorias em `src/data` + `applyUpgrade` puro em `src/sim` + fila de level-ups + testes | systems-engineer | feito (2026-11-16): 59 testes verdes, typecheck limpo |
| 14 | Pausa da sim no `gameLoop` durante a escolha (render segue) | gameplay-engineer | feito (2026-11-16): 61 testes verdes, incl. harness headless do loop |
| 15 | Overlay DOM dos panfletos (3 opções, teclas 1/2/3, reroll) no padrão do overlay de morte | ui-engineer | feito (2026-11-16): validado em headless, evidências em `docs/evidencias-poc/panfletos/` |
| 16 | Revisão pelo `code-reviewer` + verificação jogável com evidência | code-reviewer | feito (2026-11-17): 1 bloqueante corrigido (flash da mordida lia stats base em `playerView.ts`), testes de reroll degenerado adicionados (63 verdes), reverificado em headless (`7-anel-pos-cafe-bocao.png`) |

## Em andamento — POC (fatia jogável + teste de estresse de hordas)

Escopo: capivara-placeholder (primitivas), WASD, câmera que segue, hordas instanciadas que perseguem,
mordida automática em área, orbes de XP com ímã, level-up simples (dano+), dano de contato com
i-frames, morte com overlay de reinício, HUD com HP / nível / vivos / FPS / simMs / renderMs.

Fora de escopo da POC: chefe, tela de escolha de melhorias, segundo personagem, mecânica de água,
áudio, mobile, save, arte final.

| # | Tarefa | Estado |
|---|---|---|
| 1 | Scaffold Vite + TS strict + Three.js pinado + Vitest | feito (2026-11-16) |
| 2 | Tabelas de dados (`src/data`) com validação na inicialização | feito (2026-11-16) |
| 3 | Núcleo da sim pura (`src/sim`): world, rng, pool, tick, movimento | feito (2026-11-16) |
| 4 | Loop de timestep fixo + input + render mínimo (arena, player, câmera) | feito (2026-11-16) |
| 5 | Hordas: spawn em anel, FSM, perseguição, InstancedMesh | feito (2026-11-16) |
| 6 | Mordida automática + morte de inimigo + drop de orbes | feito (2026-11-16) |
| 7 | Coleta/ímã de XP + level-up | feito (2026-11-16) |
| 8 | Dano de contato + i-frames + morte do player + overlay | feito (2026-11-16) |
| 9 | HUD completo + medição (FPS, simMs, renderMs) | feito (2026-11-16) |
| 10 | Passe de estresse (300/600/1000 inimigos) com tabela de resultados | parcial: medido em headless (CPU); falta medição em desktop com GPU real |
| 11 | Revisão pelo `code-reviewer` + verificação jogável com evidência | feito (2026-11-16): aprovado sem bloqueios; 2 achados "corrigir em seguida" aplicados e reverificados |

## Resultados do passe de estresse

Medição preliminar de 2026-11-16, em Chromium **headless com render por software** (WSL2, sem GPU):
os FPS abaixo NÃO representam um desktop real — o dado confiável desta medição é o custo de CPU da
simulação (`simMs`), que responde metade do risco. Evidências em `docs/evidencias-poc/`.

| Cenário | Vivos | simMs | renderMs (submissão CPU) | FPS (software render) |
|---|---|---|---|---|
| `?spawn=25`, jogo normal ~6 s | 162 | 0,03 ms | 0,32 ms | 24* |
| `?inimigos=600&spawn=300` | 600/600 | 0,36 ms | 0,39 ms | 17* |

\* FPS limitado pelo rasterizador por software do headless; sem significado para o orçamento.

**Conclusão parcial:** com 600 inimigos a simulação custa 0,36 ms/frame — 11× abaixo do orçamento de
4 ms. O lado GPU precisa ser medido num desktop real: abrir `npm run dev` e visitar
`http://localhost:5173/?inimigos=1000&spawn=300&dpr=1.5` (e `dpr=1`), anotando FPS/renderMs do HUD.

Overrides de URL para o estresse: `?inimigos=N` (teto de vivos), `?spawn=N` (taxa base/s), `?dpr=N` (teto de pixel ratio).
Overrides para verificação: `?melhorias=cafe,cafe,bocao` (build por id na criação e no restart), `?seed=N` (sim reproduzível).

## Concluído

- 2026-11-18 — Terceiro personagem: Churrasqueiro + mordida alvo único (tarefas 27–31, decisões
  de 2026-11-18): "Baforada de Fumaça" (pulso em área a cada 1,0 s, 6 de dano, raio 2,0 u) na sim
  com 120 testes verdes; modelo tosco + nuvem com anel no raio real; de bônus estrutural, a
  mordida da capivara virou ALVO ÚNICO (alinhando código ao GDD e fechando o trio: alvo único /
  linha à distância / área colado) com arco direcional no lugar do anel; convenção única das 3
  habilidades (sem alvo não gasta cooldown); balanceamento FECHADO com métricas que não saturam
  (identidade 5%/99%/22,6; saturação da oferta 94%/94% ≥ 90%; piso por teto do próprio kit) e
  experimento dano 8 revertido a 6; revisado (0 bloqueantes, achados aplicados), verificado em
  headless (60 FPS, console limpo, evidência em `docs/evidencias-poc/churrasqueiro/`); GDD
  (incl. correção da matemática linear dos tetos) e TECH alinhados. UI intocada: o card veio da
  tabela, como projetado.
- 2026-11-18 — Tela inicial: menu principal + caixinha Pix (tarefas 24–26, decisões de
  2026-11-18): JOGAR funcional + CONFIGURAÇÕES/CONQUISTAS/ÁLBUM "EM BREVE" (padrão dos mapas,
  atalhos 1–4), caixinha do dev com QR placeholder determinístico em canvas (não escaneável,
  `pointer-events: none`), textos do GDD; `PIX_PAYLOAD` como ponto de troca (carimbo e legenda
  já derivam dele — a leva futura só gera o QR real). Revisado (0 bloqueantes; achado e
  sugestões aplicados), 95 testes verdes, --menu e ciclo menu→JOGAR→partida verificados com
  evidências em `docs/evidencias-poc/tela-inicial/`.
- 2026-11-17 — Telas de menu + carteiro mínimo (tarefas 17–23, decisões de 2026-11-17): fluxo
  início → personagem → mapa → jogo (telas data-driven de `data.characters`/`data.maps`, estilo
  panfleto, teclado+mouse, Esc volta); carteiro jogável com "Cartas que Voltam" (FSM ida/volta,
  pool 32/máx 3 em voo, dano nos dois trechos, 95 testes verdes, balanceamento simulado: 97% do
  DPS da capivara, alvo 90–130%); máquina de estados menu⇄partida com `beginMatch`/`endMatch`
  sem vazamento de GPU; overrides `?personagem=`/`?mapa=`; harness com `--menu` e spy por
  `name='player-body'`; revisado (0 bloqueantes; achados aplicados) e verificado de ponta a
  ponta com evidências em `docs/evidencias-poc/telas-carteiro/`. GDD e TECH alinhados ao
  implementado.
- 2026-11-17 — Verificação jogável com orçamento (ver DECISIONS): harness `npm run verify:headless`
  (timeout global testado, exit 2; server próprio derrubado em qualquer saída), overrides
  `?melhorias=`/`?seed=` com teste da sim (66 verdes), regras no TECH e nos agentes
  (gameplay-engineer, qa-tester, orchestrator), 5 vite órfãos de 16/11 finalizados, libs do
  Chromium movidas do scratchpad efêmero para `~/.cache/ms-playwright/extra-libs/`.
- 2026-11-17 — Escolha de melhorias "Panfleto na Esquina" (tarefas 12–16): GDD atualizado,
  tabela de 8 melhorias + fallback "Trocado", sim pura com fila/reroll/clamps (63 testes verdes),
  pausa no gameLoop com render ativo, overlay DOM dos panfletos (teclas 1/2/3, reroll, fila),
  revisada e verificada jogando em headless (evidências em `docs/evidencias-poc/panfletos/`).
- 2026-11-16 — POC jogável + teste de estresse implementada (Three.js + TS strict + Vite + Vitest):
  27 testes verdes, typecheck e build limpos, jogada de ponta a ponta em navegador sem erros de
  console (evidências em `docs/evidencias-poc/`), revisada pelo `code-reviewer` sem bloqueios.
- 2026-11-16 — Reorganização do repositório: docs em `docs/`, time em `.claude/agents/`,
  originais preservados em `_backup-originais/`.

## Pendente (pós-POC)

- **QR Pix real**: aguarda o autor fornecer o payload copia-e-cola (ou chave aleatória/EVP +
  nome + cidade — nunca CPF/telefone/e-mail; ver DECISIONS 2026-11-18). Entra em `PIX_PAYLOAD`
  (`src/ui/screens/startScreen.ts`) + geração do QR (tech-lead define a abordagem; nenhuma lib
  hoje) + caixinha deixa de ser `aria-hidden`/`pointer-events: none`.
- **Escopo das CONFIGURAÇÕES** (o que o botão abrirá) e especificação de **Conquistas** e
  **Álbum** (mecânicas candidatas no GDD) — os botões saem do "EM BREVE" quando especificados.

- **Medir o estresse em desktop com GPU real** (tarefa 10): FPS/renderMs do HUD com
  `?inimigos=1000&spawn=300` em `dpr=1` e `dpr=1.5` — agora também com `personagem=carteiro` e
  com os 4 tipos de inimigo (`?tempo=400` ativa a fase final do cronograma).
- **ESCUTA do som de hit pelo autor** (o toc nunca foi ouvido por humano; números de síntese são
  hipótese de ouvido): roteiro — (1) capivara no jogo normal: toc curto de madeira, sempre
  levemente diferente; (2) `?personagem=churrasqueiro&spawn=25&seed=42` + um clique: UM toc mais
  grave/forte por pulso (~1/s), nunca metralhadora; (3) `?melhorias=dado,dado,dado`: crítico
  desce de tom e sobe de volume de olhos fechados; (4) morrer e reiniciar/voltar ao menu: nenhum
  som vaza, menu silencioso. Critério do GDD: 30 s de estresse sem virar serra elétrica.
- Acabamento visual dos 3 inimigos novos (rato/britadeira/pombo — "provisório", mesmo status dos
  personagens; pupila do pombo some de longe) e dívida de draw calls (11 com os 4 tipos por
  grupos de material; reduzível a 1–2/tipo com atlas UV se um dia doer) — technical-artist.
- Carteiro, próximas fatias (GDD, hipóteses): cães que perseguem só ele; pontos de entrega com
  recompensa. Hipóteses visuais a validar jogando: captura da carta a 0,6 u da borda ("sumiu antes
  da mão"?); pisca de i-frames some com o personagem por frames inteiros.
- Visual do carteiro e textura do envelope são provisórios — polimento com o `technical-artist`.
- Limpeza trivial: ramo morto no `deathOverlay.ts` (callback `onBackToMenu` opcional, mas o main
  sempre passa — apontado pelo tech-lead em 2026-11-17).
- Cosmético (revisão de 2026-11-18): flash visual falso único ao escolher Café com o cooldown
  correndo (`playerView.ts`, `secondsSinceAbilityFired` — vale para as 3 habilidades). O conserto
  sugerido na revisão (`min()` na subtração) NÃO resolve; o correto é detectar a RECARGA do
  cooldown (aumento entre frames) com estado por vista. Uma ocorrência por escolha, pior caso.
- **Playtest humano do trio** (próximo degrau do balanceamento, GDD fechado em 2026-11-18):
  sobrevivência da capivara alvo único (hipótese de RISCO ALTO; fallback "mordida e rabanada"
  pronto no GDD), churrasqueiro > carteiro nas mãos de quem segura posição, reposicionamento do
  carteiro, captura da carta (0,6 u da borda) e pisca de i-frames. Agora TAMBÉM decide a curva
  de dificuldade nova: horizonte "mediano morre em 4–6 min" e começo "quente porém acessível"
  (se reprovar, a alavanca é o modelo de contato — fórmula no GDD — nunca a curva de spawn);
  e as 4 melhorias novas (capacete/soro/dado/rodo: o rodo no teto empata o avanço da
  britadeira — fallback de resistência ×0,5 do tanque já desenhado).
- Frequência-alvo de level-ups por minuto (afeta a hipótese "a pausa incomoda" e `baseToNext`/`growthPerLevel`); candidato: curva-alvo proposta pelo systems-engineer com simulação.
  Observação da reverificação (2026-11-17): em dezenas de runs automatizadas (spawn 15–25, teto
  600), o bot raramente passou de 2–3 level-ups — a dificuldade crua pode estar alta e/ou a curva
  de XP lenta; dado para o game-designer cruzar com a curva-alvo (pode ser só o bot jogando mal).
- Como medir os critérios de validação da escolha de melhorias (tempo na tela, taxa de reroll): HUD/console ou anotação manual — decidir junto da tarefa 15.
- Avaliar grade espacial para separação de inimigos, se o visual de sobreposição incomodar.

### Dívidas registradas pela revisão de código (sugestões, nenhuma bloqueia)

- Eventos da sim: hoje nenhum código de produção os consome e o `enemyDied` aloca objeto no loop
  quente; decidir entre remover, fila pré-alocada, ou consumidor real (áudio/efeitos virão a usar).
  `world.events` também retém o `playerDied` após o gameOver.
- Geometrias do render hard-codam valores que espelham as tabelas (`ConeGeometry(0.45…)` vs
  `enemies.radius`): derivar do `data` para hitbox e visual não dessincronizarem.
- `validateGameData` exige tudo > 0, mas campos como `rateGrowthPerMinute` são semanticamente
  zeráveis: lista explícita de campos que aceitam zero. (A subárvore `upgrades` já tem validação
  própria desde a tarefa 13; `levelDamageBonus` não existe mais.)
- Pureza da sim garantida só por convenção + grep: avaliar `tsconfig` próprio de `src/sim` sem
  `lib: DOM` ou regra de lint de fronteira.
- Anel de spawn pode aparecer no canto superior da tela (alcance visível ~31,5 u > ringMin 24):
  conferir visualmente; se confirmar, subir `ringMinRadius` ou começar a névoa em ~30.
- Testes faltantes: mordida AoE atinge N e poupa fora do alcance no mesmo tick; inimigo `Dying`
  não causa dano de contato.
- `dispose()` do renderer incompleto e nunca chamado (irrelevante enquanto o app vive a página).
- Clamp do `biteCooldown` se algum dia `bite.cooldown < 1/60`; micro-ajustes (hypot redundante no
  movimento, texto "inimigos em tela" no overlay, reset da câmera no restart).

Da revisão da fatia "Panfleto na Esquina" (2026-11-16, nenhuma bloqueia):

- `UpgradeChoice.options` exposto como `number[]` mutável à UI: tipar `readonly number[]`
  (compila sem mudança de lógica; `rerollChoice` reatribui o array).
- `upgradeOverlay` registra keydown no `window` sem `dispose()`: sem vazamento hoje (singleton),
  registrar dispose por paridade caso overlays passem a ser recriados.
- `validate.ts`: `effect.min`/`max` sem checagem de finitude — `NaN` desliga o clamp calado;
  exigir `Number.isFinite` quando definidos.
- ~~UI poderia unificar variáveis de estilo num `:root`~~ — feito em 2026-11-26: tokens únicos
  em `src/theme/tokens.ts` (repaginação "placar esportivo BR"; ver DECISIONS).
- Decisão em aberto (game-designer/autor): com exatamente 3 elegíveis no pool, o reroll devolve
  o mesmo conjunto reordenado mas o botão aparece (reroll inútil). Ocultar exigiria a sim expor
  contagem de elegíveis ou flag `rerollChangesOptions`. GDD atual não é violado.
- Telemetria dos critérios de validação da escolha (tempo na tela, taxa de reroll): não
  implementada; decidir HUD/console vs anotação manual.
