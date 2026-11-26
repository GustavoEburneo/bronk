# TECH: arquitetura e convenções

> Fonte da verdade sobre **como** o jogo é construído. Só o `tech-lead` edita.

## Stack

**Three.js + TypeScript (strict) + Vite + Vitest.** *(decidido em 2026-11-16 para a POC)*

- **Three.js**: pedido do autor do projeto; dá controle fino de instancing (`InstancedMesh` com escrita
  direta de matrizes), que é exatamente o que o risco de hordas exige; ecossistema e documentação amplos.
- **Descartado (por ora): Babylon.js** — motor mais completo e opinativo; para esta POC o controle
  direto do Three.js basta. Reavaliar se a POC reprovar no orçamento de desempenho.
- `three` é **pinado em versão exata** (não segue semver; cada minor pode quebrar API), com
  `@types/three` na mesma minor. Upgrade de three é tarefa consciente, nunca `npm update`.
- Sem backend nesta POC.

## Fronteiras (valem para qualquer stack)

1. Regras de jogo puras: sem motor, sem tela, sem rede, com aleatoriedade injetada e cobertas por teste.
2. Conteúdo como dado: tabelas tipadas e validadas na inicialização.
3. Apresentação (render, áudio, entrada) consome regras e dados, e não o contrário.
4. Interface lê o estado e dispara ações, sem conhecer o interior da simulação.
5. Servidor não confia no cliente; persistência atrás de uma interface.

## Orçamento de desempenho (POC)

- **60 FPS com 500 inimigos vivos** em desktop médio; tempo de simulação < 4 ms/frame.
- Medição pelo próprio HUD: FPS (média móvel dos deltas de rAF), `simMs` (cronômetro em volta dos
  ticks) e `renderMs` (em volta do draw), nos pixel ratios 1 e 1.5.
- Se `simMs` estoura, o gargalo é CPU/simulação; se o FPS cai com `simMs` baixo, é GPU/render.
- **As cartas do carteiro entram neste orçamento, sem orçamento novo**: o pior caso técnico é a
  capacidade do pool, **`CARD_POOL_CAPACITY = 32`** (constante em `characters.ts`); em jogo o teto
  real é `maxLive` (3 no carteiro — regra do GDD). Colisão carta×inimigo é O(cartas × inimigos) ≤
  32 × 500 = 16 mil testes de distância ao quadrado por tick — ordens de grandeza abaixo dos 4 ms.
  No render, as cartas custam 1 `InstancedMesh` (1 draw call a mais). Medição: os mesmos `simMs`
  e FPS do HUD, numa run com `?personagem=carteiro&spawn=25`.
- Tamanho de download e tempo de carregamento: a definir depois da POC.

## Estrutura de pastas

Fluxo de dependências: `data` ← `sim` ← (`render`, `audio`, `ui`, `app`) ← `main.ts`. Nunca o
contrário.

```
src/
├── main.ts     # raiz de composição: valida dados, lê overrides de URL, orquestra menu ⇄ partida
├── app/        # loop de timestep fixo (handle com stop()), input (teclado → InputFrame), medição
├── sim/        # regras puras: SEM three, SEM DOM, SEM WebAudio, SEM imports de render/ui/audio; RNG injetado
│   └── systems/  # um sistema por arquivo, ordem fixa de execução no tick
├── data/       # tabelas de constantes tipadas + validação na inicialização
│   ├── tables.ts      # GameData agrega tudo (characters, maps, enemyTypes; player/bite/arena saíram)
│   ├── upgrades.ts    # melhorias (stat-alvo ability.* genérico; ids NÃO mudam)
│   ├── characters.ts  # personagens (id, nome, stats base, habilidade) + constantes das cartas
│   ├── enemies.ts     # tipos de inimigo (EnemyTypeDef[]) — ver "Tipos de inimigo como dado"
│   └── maps.ts        # mapas (id, nome, playable, parâmetros de arena)
├── render/     # contexto WebGL (vida do app) + cena de partida (vida da partida)
│   └── cardInstances.ts  # InstancedMesh das cartas (mesmo padrão de orbes/inimigos)
├── audio/      # som 100% sintetizado por WebAudio, espelha o render — ver "Áudio sintetizado"
└── ui/         # HUD e overlays da partida; telas de menu
    └── screens/   # início → personagem → mapa (módulos DOM + wizard linear)
        ├── screenFlow.ts      # wizard: ordem das telas, voltar/Esc, callback onPlay(seleção)
        ├── screenTheme.ts     # tema compartilhado das telas (CSS injetado + helpers DOM)
        ├── startScreen.ts
        ├── characterScreen.ts # cards gerados de data.characters
        └── mapScreen.ts       # cards gerados de data.maps (1 jogável + slots "em breve")
```

Na sim, os módulos de habilidade:

```
src/sim/systems/ability.ts      # despacho por habilidade equipada (world.ability.kind), exaustivo (never)
src/sim/systems/biteAttack.ts   # habilidade "mordida" (capivara) — ALVO ÚNICO
src/sim/systems/cardAbility.ts  # cartas — lançamento, voo (ida/volta) e dano (um sistema)
src/sim/systems/smokeAbility.ts # habilidade "fumaça" (churrasqueiro) — pulso em área sem mira
src/sim/pool.ts                 # EnemyPool, OrbPool e CardPool (SoA, swap-remove, mesma convenção)
```

## Estado de aplicação: menu ⇄ partida *(decidido em 2026-11-17)*

`main.ts` continua sendo a raiz de composição e ganha uma **máquina de estados explícita de dois
estados**: `'menu' | 'match'`. As telas são **módulos DOM em `src/ui/screens/`** — cada tela expõe
`{ show(), hide() }` e dispara callbacks; o `screenFlow.ts` encadeia início → personagem → mapa
(com "voltar" entre elas) e entrega um único callback `onPlay({ characterId, mapId })`. Telas leem
`data.characters`/`data.maps` para montar os cards e **não conhecem a sim** (fronteira 4).
**Regra (fronteira 2)**: os cards são gerados das tabelas — personagem ou mapa novo é uma linha
nova em `characters.ts`/`maps.ts`, **sem tocar na UI**. *(A primeira versão das telas usou
literais locais para destravar o paralelismo da leva; a troca pela leitura das tabelas está em
entrega pelo ui-engineer — o estado descrito aqui é o final.)*

Ciclo de vida:

- **Boot (uma vez)**: valida dados, **valida os ids de `?melhorias=` já no boot** (fail fast:
  sem `?personagem=` o mundo só nasce depois das telas, e um id inválido tardio deixaria a tela
  preta), cria renderer-contexto, input, mouseLook, HUD e overlays (morte e panfletos). Estado
  inicial: `'match'` se `?personagem=` válido está na URL (pulo de telas, ver Overrides); senão
  `'menu'` com o `screenFlow` na tela de início.
- **`startMatch(seleção)`** (menu → match): `renderer.beginMatch(data, seleção)` monta a cena;
  `createWorld(data, rng, seleção)` cria o world (quem cria/destrói o world é o `main.ts`, e só
  ele); `applyUpgradesById` aplica `?melhorias`; esconde `#screens`, mostra `#hud`, inicia o
  gameLoop. **`startGameLoop` devolve um handle `{ stop(): void }`** (coberto por teste em
  `gameLoop.test.ts`: cancela o frame agendado e barra até um frame tardio do navegador) — em
  menu não há loop rodando.
- **Restart** ("Jogar de novo", `#restart-btn` no overlay de morte): recria só o world, com a
  **mesma seleção** e os mesmos overrides (`?melhorias`/`?seed` valem no restart, como hoje). A
  cena não é recriada.
- **"Menu"** (`#menu-btn` no overlay de morte, ao lado de "Jogar de novo"): `handle.stop()`,
  `renderer.endMatch()` (dispose de geometrias/materiais/texturas da cena), solta a referência do
  world (pools são arrays simples, nada a liberar), esconde HUD e overlays e mostra o wizard **na
  tela de seleção de personagem** — não na de início. Motivo: re-jogar com outro personagem é o
  caso comum pós-morte; a tela de início é cerimônia de entrada. *(decidido; rótulos do GDD)*
- Em menu, as telas são um overlay DOM **opaco** (`#screens`) sobre o canvas; nada desenha.
- **Menu de pausa (2026-11-19):** Esc/P em match (sem escolha aberta, sem fim de run) alterna o
  `pauseOverlay` (`#pause-overlay`, `src/ui/pauseOverlay.ts`); o gameLoop lê
  `isPaused: () => pauseOverlay.visible` e congela a sim como na escolha de melhoria (render e
  afterFrame vivos, acumulador zerado — coberto em `gameLoop.test.ts`). "Finalizar run" chama
  `abandonRun(world)` (sim entra em `gameOver` sem evento `playerDied`) e o afterFrame cuida do
  resto; "Sair pro menu principal" credita bananas e chama `returnToMenu('start')` (o parâmetro
  novo — o caminho da morte segue em `'character'`).
- **Meta-progressão (2026-11-19):** `createMetaStore(data)` em `src/meta/metaStore.ts` carrega o
  cofre (bananas + ranks de talento + álbum + conquistas + estatísticas de vida) do localStorage
  (`bronk.meta.v1`, campos novos ADITIVOS — cofre antigo carrega com eles zerados) UMA vez, vida
  do APP. A sim conta (`bananasEarned`, `kills`, `killsByType`, `cardsEarned`) e recebe
  `talentRanks` + `albumCopies` congelados via `MatchSelection` no `createStartingWorld`. O
  fechamento da run é **`meta.recordRun(RunRecord)`**, chamado UMA vez: no `afterFrame` na
  transição para o overlay de morte, OU no "Sair pro menu principal" da pausa (guardado por
  `status === 'running'` para nunca fechar duas vezes). `recordRun` credita bananas e
  figurinhas, acumula as estatísticas, avalia as conquistas (`evaluateAchievements`, pura, de
  `data/achievements.ts`), credita os prêmios e persiste numa escrita só; `buy()` da loja também
  reavalia (conquistas de compra). As telas (`shopScreen`, `achievementsScreen`, `albumScreen` —
  telas `'shop'`/`'achievements'`/`'album'` do screenFlow, todas início ⇄ tela) usam a API do
  store — UI nunca toca o storage. Override de verificação: `?bananas=N` credita no boot.
- **Álbum na sim (2026-11-19):** o drop por abate rola em **`world.dropRng`** (mulberry32 com
  `dropSeed` próprio — no main, `simSeed ^ 0x5eed`), NUNCA no `world.rng`: 1 roll por abate não
  pode mudar as sequências de spawn/crit dos testes congelados (determinismo e cenário de
  balance intactos). O bônus por tipo vira `world.albumDamageMult[typeIndex]` na criação do
  mundo e multiplica o dano em `applyAbilityHit` depois do crítico.

**Contrato de ids do `index.html` (o harness depende deles — não renomear):** `#game`, `#hud`,
`#death-overlay`, `#death-stats`, `#restart-btn`, `#upgrade-overlay`, `.flyer`, `#screens`
(container das telas) e `#menu-btn` (voltar ao menu, no overlay de morte). O harness nunca clica
em `#menu-btn`; com `--menu`, espera `#screens` visível.

No render, a divisão contexto/cena: `createRenderer(canvas, opts)` cria **uma vez** o
`WebGLRenderer`, câmera e resize (evita churn de contexto WebGL por partida);
`beginMatch(data, seleção)` monta a cena da partida (arena do mapa escolhido, instâncias de
inimigos/orbes/cartas dimensionadas pelos dados, a vista do personagem escolhido) e `endMatch()`
desfaz tudo que a cena alocou. `draw(world, alpha, frameDt)` exige cena montada.

## Personagens, habilidades e mapas como dado *(decidido em 2026-11-17)*

### Personagens (`src/data/characters.ts`)

```ts
interface CharacterStats { moveSpeed; maxHp; radius; contactIFrames }

type AbilityDef =
  | { kind: 'mordida'; damage; cooldown; range }
  | { kind: 'cartas';  damage; cooldown; range; projectileSpeed; cardRadius; maxLive }
  | { kind: 'fumaca';  damage; cooldown; range }  // range = raio da nuvem, centro-a-centro

interface CharacterDef { id: string; name: string; tagline: string;
                         stats: CharacterStats; ability: AbilityDef }
```

- Ids atuais: **`capivara`**, **`carteiro`** e **`churrasqueiro`** (aparecem em `?personagem=` e
  nos testes).
- `gameData.player` e `gameData.bite` **saem da tabela**: os stats base do player vivem em cada
  `CharacterDef` (os dois começam com os valores atuais da capivara; divergir é decisão de GDD) e
  a mordida vira a `ability` da capivara. `gameData.characters: CharacterDef[]` entra.
- A habilidade é **união discriminada**: parâmetro novo de habilidade = campo novo no ramo dela,
  tipado; nunca "campo opcional que só vale para um kind".
- Números do carteiro implementados conforme o GDD: dano 7, cooldown 1,2 s, alcance 7 u,
  velocidade 14 u/s, raio da carta 0,6 u, `maxLive` 3. Os valores seguem **hipótese do GDD** até
  jogadas reais — ajuste é mudança de tabela, não de código.
- Números do churrasqueiro conforme o GDD (fechamento do balanceamento, 2026-11-18): dano do
  pulso **6**, cooldown 1,0 s, raio da nuvem 2,0 u. O experimento 6 → 8 da rodada anterior foi
  **revertido** (DECISIONS 2026-11-18: a vantagem medida era ruído de cenário saturado); o
  comentário na linha da tabela registra a reversão para ninguém "corrigir" de volta.
- **Dois tetos distintos para as cartas**: `maxLive` (campo do `AbilityDef`, por personagem) é
  **regra de jogo do GDD** — máximo de cartas EM VOO; **`CARD_POOL_CAPACITY = 32`** (constante em
  `characters.ts`) é a **capacidade técnica fixa** do `CardPool` (dado do TECH, orçamento de
  desempenho). A validação de boot exige `maxLive <= CARD_POOL_CAPACITY`.
- Constantes das cartas que não variam por personagem vivem em `characters.ts`:
  `CARD_FLIGHT_TIMEOUT = 3` s (teto de segurança do voo, GDD) e `PROJECTILE_HIT_COOLDOWN = 0,2` s
  (janela de "1 acerto por passada", decisão do TECH).

### Derivação dos stats (sim)

- `World` ganha `characterIndex` (índice em `data.characters`), `ability` (referência à habilidade
  equipada) e `mapId`. `createWorld(data, rng, { characterId, mapId })`.
- `EffectiveStats` renomeia `bite*` → **`abilityDamage` / `abilityRange` / `abilityCooldown`** e
  ganha `playerRadius` (cache do base; nenhuma melhoria o altera hoje). `baseStatValue`/
  `effectiveStatValue` passam a receber o personagem: `ability.*` resolve contra a habilidade
  equipada, `player.*` contra os stats do personagem, `xp.*` contra `gameData.xp` como hoje.
- `player.biteCooldown` vira `player.abilityCooldown` (um cooldown, o da habilidade equipada).

### Melhorias sobre a habilidade equipada

- `UpgradeStatId`: `bite.damage|range|cooldown` viram **`ability.damage|range|cooldown`** —
  slots genéricos aplicados à habilidade equipada, seja ela qual for. **Os ids das melhorias
  (`pimenta`, `bocao`, `cafe`…) NÃO mudam**: comandos de verificação com `?melhorias=` continuam
  válidos.
- `UpgradeDef` ganha **`characterId?: string`** (filtro de pool): quando presente, a melhoria só
  entra no sorteio (e no `?melhorias=`) para aquele personagem. Isso acomoda os dois desfechos
  possíveis do GDD: pool único genérico (ninguém usa o filtro) ou panfletos com sabor por
  personagem (entradas filtradas). `?melhorias=` com id filtrado para outro personagem → `Error`
  (build inválida é bug do chamador, como hoje).
- Extensão futura (não implementar agora): stat-alvo específico de um kind (ex.:
  `cartas.projectileSpeed`) exigirá `characterId` compatível — a validação barra o resto.
- **Resolvido pelo GDD (2026-11-17)**: pool único genérico — nomes e textos dos panfletos são os
  mesmos para todos os personagens (os textos em `upgrades.ts` já não citam "mordida"); ninguém
  usa o filtro `characterId` por ora. Sabor por personagem segue como hipótese futura, que a
  estrutura suporta sem mudança de código da sim.

### Mapas (`src/data/maps.ts`)

```ts
interface MapDef { id: string; name: string; playable: boolean;
                   arena: { halfSize: number }; tagline?: string;
                   spawnSchedule?: SpawnPhase[] } // obrigatório se playable (2026-11-19)
```

- Ids e nomes (decididos no GDD): **`cidade`** (Avenida em Obras) e **`feira`** (Feira de
  Domingo, jogável desde 2026-11-19) + slots bloqueados **`orla`** (Orla no Feriadão) e
  **`laje`** (Festa na Laje). Ids são estáveis e minúsculos; aparecem em `?mapa=`.
- **`tagline?: string`** é o texto de jogador do card (a linha do mapa jogável, fixada no GDD);
  entra junto com a migração das telas para as tabelas (ui-engineer, mesma leva).
- **`spawnSchedule`** é a curva de dificuldade DO MAPA (ver "Cronograma de spawn") — cada mapa
  tem a própria fauna.
- `gameData.arena` **saiu**: `arena.halfSize` vive no `MapDef`; o world lê a arena do mapa
  escolhido. Desde 2026-11-19 o **render escolhe o cenário pelo `map.id`** (`createMapArena` no
  renderer: `cidade` → avenida, `feira` → feira; id sem cenário lança no boot).
- `mapScreen` renderiza cards de todos os mapas; `playable: false` = card bloqueado, não
  selecionável. Com 2+ jogáveis, seleção no modelo da de personagem (dígito seleciona, Enter
  confirma).
- O HUD da partida exibe `CharacterDef.name` e **`MapDef.name`** na primeira linha.

### Validação (`src/data/validate.ts`)

Entram na validação de boot (lança nomeando o campo, como hoje):

- characters: ids únicos e não vazios; name/tagline não vazios; stats finitos e > 0; campos da
  habilidade (damage/cooldown/range) finitos e > 0 em todos os kinds; mordida **e fumaça** (mesma
  convenção centro-a-centro): `range > stats.radius + MAX(radius dos tipos de inimigo)` —
  alcance menor que a soma dos raios nunca atingiria nem um inimigo encostado, habilidade
  inútil é erro de tabela; cartas: `maxLive` inteiro em [1, 128],
  `maxLive <= CARD_POOL_CAPACITY` e **anti-tunneling**
  `projectileSpeed × SIM_DT < cardRadius + MIN(radius dos tipos)` (a carta não pode atravessar
  nem o menor inimigo num tick). *(Os dois cheques usavam `enemies.radius` quando o inimigo era
  único; os extremos entram com a tabela de tipos — ver "Tipos de inimigo como dado".)*
- maps: ids únicos; name não vazio; ao menos 1 `playable`; para cada mapa jogável,
  `spawn.ringMaxRadius < arena.halfSize` e `spawnSchedule` presente e válido (regras na seção
  do cronograma).
- album (2026-11-19): `dropChance` em (0, 1]; degraus com `copies` inteiro ≥ 1 e
  `copies`/`damageBonus` estritamente crescentes; cópias abaixo do 1º degrau dão bônus 0.
- achievements (2026-11-19): ids únicos; exibíveis não vazios; `reward` inteiro ≥ 0; condição
  com números inteiros ≥ 1 (segundos: finitos > 0); `enemyTypeId`, quando presente, existe em
  `enemyTypes` (switch exaustivo — condição nova sem validação não compila).
- upgrades: `characterId`, quando presente, existe em characters; o cheque de clamps ("nenhum
  stat ≤ 0 com tudo no teto") roda **por personagem**, já que `ability.*` depende do equipado.

## Habilidade "cartas que voltam" (carteiro) *(decidido em 2026-11-17)*

A mordida vira a habilidade da capivara; as cartas são um **sistema novo da sim**, não um caso
especial da mordida.

**Módulos e ordem no tick** (a ordem é fixa; mudanças de ordem quebram o determinismo):

1. `playerMovement` → **2. `playerRegen`** *(novo em 2026-11-18, ver "Passivas e efeitos de
acerto")* → 3. `enemySpawn` → 4. `enemyAI` → **5. `ability` (despacho por
`world.ability.kind`: `mordida` → `biteAttack`, `cartas` → `cardAbility`, `fumaca` →
`smokeAbility`; `default` exaustivo com `never` — kind novo sem caso não compila)** →
6. `xpOrbs` → 7. `contactDamage` → 8. `openPendingUpgradeChoice`.

**Regras das cartas** (parâmetros vêm de `AbilityDef` + stats efetivos; valores seguem hipótese
do GDD):

- **Lançamento**: quando `abilityCooldown` vence, lança 1 carta mirando o inimigo `Chasing` mais
  próximo dentro de `abilityRange`; **sem alvo no alcance, NÃO arremessa e o cooldown não gasta**
  (segura em 0 e tenta no próximo tick) — convenção única das 3 habilidades (ver seção abaixo),
  coberta por teste. O facing só entra como
  fallback de direção quando o alvo está exatamente sobre o player (vetor de mira nulo). Teto de
  cartas em voo (`maxLive`) ou pool técnico cheio também **adiam** o lançamento da mesma forma —
  nunca perdido em silêncio.
- **Voo como máquina de estados explícita**: `Outgoing` (linha reta a `projectileSpeed`;
  acumula distância percorrida; ao atingir `abilityRange` → `Returning`) e `Returning` (homing na
  posição ATUAL do player a `projectileSpeed`; capturada quando `dist < playerRadius + cardRadius`
  → slot liberado). Teto de segurança: a carta some após `CARD_FLIGHT_TIMEOUT` (3 s) de voo, com
  ou sem captura. **GameOver congela o mundo inteiro, cartas incluídas — nenhum caso especial.**
  *(decidido; GDD alinhado em 2026-11-17; coberto por teste)*
- **Dano por contato** em qualquer fase: colisão por soma de raios. Inimigo atingido ganha
  `projectileHitCooldown` (`Float32Array` no `EnemyPool`, `PROJECTILE_HIT_COOLDOWN` = 0,2 s) e
  não leva dano de **nenhuma** carta enquanto o timer corre. É o mecanismo barato (um array, sem
  rastrear pares carta×inimigo, imune ao swap-remove) que garante no máximo 1 hit por passada e
  permite acertar o mesmo inimigo na ida **e** na volta. Só inimigos `Chasing` tomam dano, como
  na mordida.
- **Pooling**: `CardPool` em `src/sim/pool.ts`, mesma convenção dos demais (SoA, capacidade fixa
  = `CARD_POOL_CAPACITY`, swap-remove, zero alocação em runtime): `posX/posZ/prevX/prevZ`,
  `dirX/dirZ`, `traveled`, `age`, `phase` (Uint8). O limite em jogo é `maxLive` (regra de jogo),
  checado no lançamento. O tick salva `prev*` das cartas junto com as demais entidades.

**Contrato sim→render**: idêntico ao de orbes/inimigos — `src/render/cardInstances.ts` cria 1
`InstancedMesh` (capacidade `CARD_POOL_CAPACITY`, geometria chapada pequena com textura janky de
envelope), lê o `CardPool`, interpola `prev→pos` com `alpha` e seta `mesh.count = cards.count`.
Giro/balanço da carta é enfeite do render (função do tempo de frame), **não** estado da sim. A
cena do `beginMatch` só cria `cardInstances` (e a vista do carteiro) quando o personagem
escolhido usa cartas; a vista do player é montada por personagem no `beginMatch`.

**Convenção de render (contrato com o harness)**: o mesh do corpo do player de **qualquer**
personagem tem `name = 'player-body'` (`PLAYER_BODY_NAME` em `src/render/playerView.ts`;
implementado nos três personagens). O spy de posição do harness
(`installPositionSpy` em `tools/verify/headless.mjs`) procura por esse nome. Regra permanente:
personagem novo nomeia o mesh do corpo assim.

**Testes da sim** (implementados em `src/sim/tests/cardAbility.test.ts` e
`determinism.test.ts`): ida→volta→captura (incluindo homing na posição ATUAL do player);
despawn de segurança aos 3 s; 1 hit por passada e hit na ida e na volta (via
`projectileHitCooldown`); **sem alvo no alcance não arremessa e o cooldown não gasta**; teto de
cartas em voo adia o lançamento segurando o cooldown em 0; mira no mais próximo (e só em
`Chasing`); gameOver congela as cartas; melhorias genéricas (cafe/bocao/pimenta) sobre a base do
carteiro; determinismo com seed fixa **para os três personagens**.

## Mordida alvo único + fumaça: convenção das habilidades *(alinhado em 2026-11-18)*

A mordida da capivara é **ALVO ÚNICO** (GDD/DECISIONS 2026-11-18 — substitui a mordida em área
da POC; qualquer texto antigo que descreva "todos no raio" está errado) e o churrasqueiro entra
com a fumaça. Regras implementadas:

- **Mordida (`biteAttack.ts`)**: quando o cooldown vence, morde **apenas** o inimigo `Chasing`
  mais próximo com distância centro-a-centro ≤ alcance — **borda inclusiva** (inimigo exatamente
  no alcance é alvo), exatamente 1 por disparo, dano cheio. **Empate exato de distância →
  o primeiro na ordem interna do pool** (comparação estrita `<` no scan): determinístico, mesmo
  com a ordem do pool mudando por swap-remove — o critério é "primeiro do pool AGORA", estável
  dentro do tick. `Spawning`/`Dying` nunca são alvo.
- **Fumaça (`smokeAbility.ts`)**: pulso instantâneo (dura 1 tick), sem mira e sem projétil,
  centrado no player: dano efetivo a **todos** os `Chasing` a até `abilityRange` efetivo
  (centro-a-centro, convenção da mordida), sem limite de alvos e sem janela de imunidade entre
  pulsos (o espaçamento é o próprio cooldown). Sem pool e sem estado próprio — O(inimigos) uma
  vez por pulso, dentro do orçamento existente sem orçamento novo; a nuvem visual é enfeite de
  render, a hitbox só existe no tick do pulso.
- **Convenção ÚNICA das 3 habilidades, sem alvo elegível**: **não dispara, não emite evento e o
  cooldown segura em 0** (tenta de novo no próximo tick; o primeiro inimigo que entrar no
  alcance/raio leva o golpe imediatamente). Quando dispara, o resto negativo acumulado do
  cooldown carrega para o próximo intervalo. Coberta por teste nas três.

**Eventos da sim (`SimEvent` em `world.ts`)**: `biteFired`, `cardFired`, `smokeFired`,
**`enemyHit`** *(novo em 2026-11-18, ver "Áudio sintetizado")*, `enemyDied`, `levelUp`,
`playerDied`. São **efêmeros**: o array `world.events` é esvaziado no início do tick seguinte.
Ordem dentro do lote de um golpe: evento de disparo (`*Fired`) → `enemyHit` → `enemyDied`s.

**Contrato do `enemyHit`** —
`{ type: 'enemyHit'; count: number; critCount: number; x: number; z: number }`:
**um evento por aplicação de dano de habilidade por tick**, agregado, nunca um por inimigo:

- mordida: 1 evento com `count: 1` por disparo;
- fumaça: 1 evento por pulso com `count` = inimigos atingidos pelo pulso;
- cartas: 1 evento **por carta por tick** em que ela feriu alguém, com `count` = inimigos
  feridos por aquela carta naquele tick (a janela `projectileHitCooldown` já limita a cadência).

`critCount` = quantos desses acertos foram críticos (0 sem Dado no build) — o feedback do
crítico na v1 é SONORO (GDD, "Áudio v1"), então o evento carrega a informação; `x`/`z` =
posição do primeiro inimigo atingido do lote (precedente do `enemyDied`; habilita pan/efeito
posicional depois). Golpe que não fere ninguém não emite `enemyHit` — e, pela convenção das
habilidades, nem `*Fired`. Emitir 1 evento agregado em vez de N é decisão de contrato: o
consumidor (áudio) toca UM som modulado por `count`/`critCount`, nunca N vozes — o teto de
vozes começa no formato do dado, não só no throttle.

**Convenção de render para "a habilidade disparou"**: o render **NÃO consome `world.events`**
(vida curta demais: 0 ou N ticks por frame). Ele deriva o instante do disparo de "cooldown
recém-recarregado" — `secondsSinceAbilityFired` em `playerView.ts`
(`stats.abilityCooldown − player.abilityCooldown`). A derivação é **1:1 com o evento** porque,
pela convenção acima, sem alvo o cooldown segura em 0 (o valor fica igual ao cooldown inteiro,
fora da janela visual — sem flash falso). **Premissa registrada: cooldown base > janela visual**
(flash 0,15 s; pulso da fumaça `SMOKE_PULSE_SECONDS` = 0,3 s — cooldown ≤ janela acenderia o
efeito permanentemente); blindada por guarda na montagem da vista do churrasqueiro
(`createPlayerView` lança `Error` se `cooldown <= 0.3`), contra linha futura da tabela.

**Feedback visual por habilidade** (`playerView.ts`; a linguagem visual segue a regra de dano):

- **Mordida**: **arco direcional de ~64°** (`RingGeometry` de `π/2.8`) apontado ao `Chasing`
  mais próximo (mesma regra de alvo da sim, replicada só como feedback), com a ponta expandindo
  até o alcance real. **Não** é anel 360°: anel cheio leria como dano em área — que agora é
  **linguagem exclusiva do pulso em área** do churrasqueiro.
- **Cartas**: sem anel; o feedback é a própria carta em voo + braço/bolsa no arremesso.
- **Fumaça**: nuvem com **anel de borda escalado todo frame por `stats.abilityRange`** — a borda
  comunica o raio REAL do pulso (Bocão a alarga); anel de choque expande até a borda no disparo;
  tufos (1 `InstancedMesh` de 16 instâncias, 1 draw call, matrizes escritas direto no buffer)
  redemoinham sempre DENTRO do raio real e são enfeite sem hitbox.
- **`PlayerView.update(world, alpha, frameDt)` ganhou `frameDt`** (propagado por
  `renderer.draw`): tempo de FRAME que alimenta só enfeites vivos com a sim pausada (ondular da
  fumaça — mesmo padrão do giro das cartas em `cardInstances`); tudo que é posição/raio/pulso
  deriva do estado da sim e congela com ela.
- Texturas novas no padrão existente de `jankTextures.ts`: `createApronTexture` (avental) e
  `createSmokeTexture` (tufos da nuvem).

**Testes da sim**: `biteAttack.test.ts` (alvo único com N no raio, borda inclusiva, empate
determinístico, sem alvo segura cooldown sem evento, Spawning/Dying nunca roubam alvo,
determinismo com seed) e `smokeAbility.test.ts` (todos no raio, fora do raio poupado, sem alvo
segura cooldown sem evento, sem imunidade entre pulsos, gameOver congela, melhorias genéricas
sobre a fumaça).

## Tipos de inimigo como dado *(decidido em 2026-11-18)*

`gameData.enemies` deixa de ser o inimigo único: vira **tabela `enemyTypes: EnemyTypeDef[]`**
(`src/data/enemies.ts`, mesmo padrão de `characters.ts`/`maps.ts`) + config global mínima.
O game-designer define os números; o formato é este:

```ts
// Comportamento como união discriminada (mesma convenção do AbilityDef):
// parâmetro novo de comportamento = campo novo no ramo dele, tipado.
type EnemyBehaviorDef =
  | { kind: 'chase' }    // persegue o player (a IA da POC; Cone, Rato, Britadeira…)
  | {
      kind: 'flyby';     // voa reto na direção da posição do player NO SPAWN (Pombo, Maritaca)
      /** Distância ao CENTRO da arena (u) além da qual despawna sem XP. */
      despawnRadius: number;
      /** Teto de segurança (s) de voo; despawna sem XP. */
      despawnAfter: number;
    }
  | {
      kind: 'investida'; // mira parado + arrancada reta (Carrinho, 2026-11-19)
      windup: number;     // s parado re-mirando o player (telegraph)
      chargeTime: number; // s de arrancada na direção congelada
    };

interface EnemyTypeDef {
  id: string;        // estável, minúsculo (ex.: 'cone' — o inimigo atual vira a 1ª linha)
  name: string;      // exibível (álbum, conquistas, debug)
  icon: string;      // emoji exibível (figurinha do álbum; novo em 2026-11-19)
  behavior: EnemyBehaviorDef;
  moveSpeed: number;
  maxHp: number;
  radius: number;
  contactDamage: number;
  xpValue: number;
  spawnStateDuration: number;
  dyingStateDuration: number;
}
```

**O que fica GLOBAL (decidido)**: `enemies.maxAlive` (capacidade do pool — orçamento de
desempenho do TECH, não regra por tipo; `?inimigos=` segue funcionando) e o **anel de spawn**
(`spawn.ringMinRadius/ringMaxRadius` — o anel existe para nascer fora da vista da câmera, que
não depende do tipo). Tudo que era comportamento/atributo do inimigo vai para o `EnemyTypeDef`.
Os parâmetros de despawn do flyby (40 u / 15 s no GDD) são **campos do ramo na tabela**, não
constantes de código: são regra de jogo com valores em hipótese — ajuste é mudança de tabela.

### Comportamento `flyby` (Pombo de Obra) *(decidido em 2026-11-18)*

- **Onde mora**: em `enemyAI.ts`, com **switch por `behavior.kind` dentro do loop** (exaustivo
  com `never`, mesmo padrão do despacho de habilidade — comportamento novo sem caso não
  compila). Sistema separado duplicaria a iteração do pool e espalharia a máquina de estados;
  a FSM Spawning → Chasing → Dying é a MESMA para todos os comportamentos — o kind só muda o
  movimento e a regra de despawn.
- **Direção fixada no spawn**: `enemySpawn` calcula a direção normalizada spawn→player (posição
  do player NAQUELE instante) e a grava no pool; o flyby **nunca vira**. O `EnemyPool` ganha
  **`dirX`/`dirZ: Float32Array`** (escritos no spawn, copiados no swap-remove; o chase não os
  usa). Knockback desloca a POSIÇÃO e não toca em `dirX`/`dirZ` — "deslocado mas mantém a
  direção de voo" (GDD) sai de graça.
- **Tempo de voo = `stateTime` em Chasing** (já acumula por estado): nenhum array novo para o
  teto de `despawnAfter`.
- **Despawn silencioso**: além de `despawnRadius` do CENTRO da arena (não do player) **e se
  AFASTANDO do centro** (`dir·pos > 0` — um produto escalar), ou após `despawnAfter` de voo →
  `freeEnemy` direto, **sem estado Dying, sem evento `enemyDied` e sem orbe de XP**. A condição
  de afastamento é obrigatória: o anel de spawn é relativo ao PLAYER, então perto da borda o
  pombo pode nascer já além do raio de despawn voando para dentro — sem o produto escalar ele
  despawnaria no primeiro tick. Morto pelo jogador → Dying normal + orbe (`xpValue` do tipo),
  como os demais.
- **Todo o resto é inimigo comum**: alvo elegível das 3 habilidades quando Chasing; dano de
  contato normal (i-frames valem); leva crítico e knockback; `Spawning`/`Dying` iguais.
- Validação de boot do ramo: `despawnRadius` e `despawnAfter` finitos e > 0; o cheque
  anti-tunneling e o de alcance usam o `radius` do tipo como os demais.

### Comportamento `investida` (Carrinho de Feira) *(decidido em 2026-11-19)*

- Mesmo lugar dos demais: caso novo no switch de `enemyAI.ts`. O ciclo mira→arrancada deriva de
  **`stateTime % (windup + chargeTime)`** — zero estado novo no pool. Na fase de mira
  (`< windup`) fica parado re-escrevendo `dirX`/`dirZ` para o player (o render encara `dir`,
  que vira o telegraph de graça); na arrancada anda `moveSpeed` na direção congelada, com
  **clamp na arena** (±(halfSize − radius), mesmo clamp de spawn/knockback — a arrancada é reta
  e passaria da borda). Knockback desloca a posição sem tocar em `dir`, como no flyby.
- Facing no render: `enemyInstances` passou a usar `behavior.kind !== 'chase'` para "encara a
  direção do pool" (flyby e investida), em vez de listar kinds.

### Cronograma de spawn (a curva de dificuldade é DADO DO MAPA — `MapDef.spawnSchedule`) *(movido em 2026-11-19)*

```ts
// em src/data/enemies.ts (formato) e src/data/maps.ts (uma tabela por mapa):
interface SpawnPhase {
  fromTime: number;                 // s de partida em que a fase passa a valer
  weights: Record<string, number>;  // enemyTypeId → peso relativo (>= 0)
}
interface MapDef { /* … */ spawnSchedule?: SpawnPhase[] } // obrigatório se playable
spawn: { baseRatePerSec; rateGrowthPerMinute; ringMinRadius; ringMaxRadius } // global: só taxa e anel
```

Desde 2026-11-19 **não existe cronograma global**: cada mapa jogável traz o seu
(`cidadeSpawnSchedule`, `feiraSpawnSchedule` em `enemies.ts`), e `createWorld` compila o do
mapa escolhido. Taxa (`baseRatePerSec`/`rateGrowthPerMinute`) e anel seguem globais — a
identidade do mapa está em QUAIS tipos QUANDO, não na vazão.

- A cada spawn, o tipo é **sorteado por peso** na fase vigente (a última com
  `fromTime <= world.time`), com **1 chamada extra de `rng.next()`** — muda as sequências de
  seeds existentes, o teste de determinismo segue válido (mesma seed ⇒ mesmo resultado).
- `Record` por id é o formato da TABELA (legível para o GD); `createWorld` **compila uma vez**
  para forma indexada (índices de tipo + pesos acumulados por fase) — a sim não faz lookup de
  string em runtime.
- Curva de dificuldade = `schedule` (quais tipos quando) + `rateGrowthPerMinute` (quantos).
  **Escalar stats de inimigo no tempo (ex.: HP crescente) NÃO está no formato** — se o GD
  quiser, é extensão de tabela e decisão em aberto, não improviso em código.
- Validação de boot: ids únicos e não vazios; todos os campos finitos e > 0; mapa jogável
  **precisa** de `spawnSchedule`; cronograma não vazio, `fromTime` iniciando em 0 e
  **estritamente crescente**, pesos ≥ 0 com soma > 0 por
  fase, toda chave existente em `enemyTypes`. Cheques que usavam `enemies.radius` passam a usar
  o extremo correto da tabela: alcance de habilidade `range > stats.radius + MAX(radius dos
  tipos)` (todo tipo encostado precisa ser atingível) e anti-tunneling
  `projectileSpeed × SIM_DT < cardRadius + MIN(radius dos tipos)` (o menor inimigo é o que a
  carta atravessaria).

### Sim: `typeIndex` por slot

- `EnemyPool` ganha **`typeIndex: Uint8Array`** (teto de 256 tipos é folga; capacidade segue
  `maxAlive`). `enemySpawn` escreve `typeIndex` como escreve posição; `freeEnemy` o copia no
  swap-remove. `hp` inicial, raio de clamp etc. saem do tipo sorteado.
- Sistemas que liam `data.enemies.*` passam a ler **`data.enemyTypes[pool.typeIndex[i]]`**
  (enemyAI: moveSpeed/durações; contactDamage: radius/contactDamage — o raio de toque entra no
  loop; xpOrbs: xpValue capturado na morte; cardAbility: o `hitRadius` sai do pré-cálculo e
  entra no loop por inimigo). 600 leituras indexadas por tick são ruído no orçamento de 4 ms —
  **não** criar cache SoA de stats por tipo antes de o `simMs` do HUD acusar.
- A fronteira não muda: a sim não conhece three; o render lê `typeIndex` do pool e
  `data.enemyTypes` para as durações.

### Render: um `InstancedMesh` POR TIPO (decidido)

- **Escolha**: `enemyInstances.ts` passa a manter **1 `InstancedMesh` por `EnemyTypeDef`**,
  cada um com geometria/textura próprias (primitivas desproporcionais + `jankTextures`, o
  estilo da casa), todos com capacidade `maxAlive` (pior caso: horda inteira de um tipo;
  600 × 16 floats × 4 B ≈ 38 KB por buffer — irrelevante).
- **Por quê**: tipos visuais distintos exigem geometria/textura distintas, logo 1 draw call
  por tipo é o custo MÍNIMO de qualquer solução; com 2–5 tipos são +1 a +4 draw calls sobre o
  frame atual — nada contra o orçamento de 60 FPS/600 vivos (o gargalo medido é fill
  rate/instâncias, não contagem de draws nessa ordem de grandeza).
- **Descartado**: um único `InstancedMesh` com variação por instância — exigiria geometria
  única + variação via shader/atlas, brigando com o estilo "primitiva tosca por tipo" e
  complicando o dispose, para economizar meia dúzia de draw calls que não doem.
- **Mapeamento**: a instância i deixa de corresponder ao slot i do pool. A cada frame, UMA
  passada no pool escreve a matriz de cada inimigo no buffer do mesh do seu `typeIndex`, num
  cursor por tipo; ao final, `mesh.count = cursor` de cada tipo. As matrizes são reescritas
  inteiras por frame, como hoje. Medição: mesma régua do HUD (`renderMs`/FPS) com
  `?spawn=25&seed=42`.

## Passivas e efeitos de acerto: armor, regen, crítico e knockback *(decidido em 2026-11-18; alinhado ao GDD "Melhorias novas")*

O pipeline de stats existente (`createEffectiveStats` + cache recalculado por `applyUpgrade`)
**já comporta stats fora de `ability.*`** (`player.moveSpeed`, `xp.gainMultiplier`…), inclusive
stats **derivados sem campo base na tabela de personagem** (precedente:
`XP_GAIN_BASE_MULTIPLIER`). Os 4 stats novos seguem esse molde:

- **`UpgradeStatId` novos (nomes FINAIS, iguais aos do GDD)**: `player.contactArmor`,
  `player.hpRegen`, `ability.critChance`, `ability.knockback`. Todos **derivados com base 0**
  (constantes em `upgrades.ts`: `CONTACT_ARMOR_BASE`, `HP_REGEN_BASE`, `CRIT_CHANCE_BASE`,
  `KNOCKBACK_BASE`, todas `= 0`) — base 0 obriga as melhorias a usarem `flatPerStack`
  (percentual sobre base 0 é no-op; a validação de boot rejeita efeito só-percentual em stat de
  base 0). **Atenção de manutenção**: `ability.critChance`/`ability.knockback` são os primeiros
  `ability.*` que NÃO resolvem contra campo do `AbilityDef` — `baseStatValue` devolve a
  constante derivada; não existe campo novo nas tabelas de personagem, e ninguém deve
  "corrigir" isso criando um.
- **`EffectiveStats` novos**: `contactArmor` (redução PLANA do dano de contato por golpe, em
  HP), `hpRegenPerSec` (HP/s), `critChance` (fração 0..1), `knockback` (u por acerto).
  Números, textos e tetos: tabela do GD (capacete/soro/dado/rodo).

### Onde cada um é consumido

- **`contactArmor`** → `contactDamage.ts`, no único ponto onde dano de contato é calculado:
  `dano = max(CONTACT_DAMAGE_MIN, tipo.contactDamage − stats.contactArmor)`, com
  **`CONTACT_DAMAGE_MIN = 1`** (constante nomeada): armor nunca zera dano (regra do GDD "dói no
  mínimo 1"; o clamp no código blinda contra linha futura da tabela). Aplica por golpe, após a
  janela de i-frames, como hoje.
- **`hpRegenPerSec`** → sistema novo **`playerRegen.ts`** (item 2 da ordem do tick, logo após o
  movimento): `hp = min(maxHp, hp + regen × dt)`, só com player vivo. Com regen 0 é no-op —
  inserir o sistema não muda nenhum resultado existente (determinismo preservado). Congela com
  a sim (pausa do Panfleto/morte: o tick não roda). Regen é contínuo: **não emite evento**.
  Rodar ANTES do dano de contato é decisão: regen não ressuscita nem salva no tick do golpe
  letal — a morte do tick vence.
- **`critChance` e `knockback`** → helpers compartilhados em **`src/sim/combat.ts`** (módulo de
  helpers de acerto, não é sistema — não entra na ordem do tick), consumidos pelos 3 sistemas
  de habilidade:

```ts
/** Multiplicador de dano do crítico (regra do Dado Viciado, GDD). */
export const CRIT_DAMAGE_MULTIPLIER = 2;   // em upgrades.ts, junto das bases derivadas

// src/sim/combat.ts
/**
 * Rola crítico para UM inimigo atingido. Com critChance 0 NÃO consome RNG
 * (curto-circuito): builds sem Dado preservam as sequências de seed existentes
 * — os testes de determinismo atuais não mudam.
 */
export function rollCrit(world: World): boolean;

/**
 * Empurra o inimigo `i` em `stats.knockback` u na direção player→inimigo
 * (TODAS as habilidades, carta incluída — a direção é do player, não do
 * projétil: regra do GDD). No-op com knockback 0. Posição clampada em
 * `±(arenaHalfSize − tipo.radius)` (mesmo clamp do spawn). Vetor nulo
 * (inimigo exatamente sobre o player) → empurra na direção do facing
 * (mesmo fallback do arremesso de carta). Não toca em prev* (o render
 * interpola o tranco em 1 frame — é o visual desejado) nem em dirX/dirZ
 * (o flyby mantém a direção de voo).
 */
export function applyKnockback(world: World, enemyIndex: number): void;
```

- **Ordem fixa dentro de UM acerto** (nos 3 sistemas de habilidade, por inimigo atingido):
  `rollCrit` → aplica dano (`abilityDamage × (crit ? CRIT_DAMAGE_MULTIPLIER : 1)`) →
  `applyKnockback` → checagem de morte/transição para Dying. O golpe letal TAMBÉM empurra (o
  corpo morre empurrado); `Spawning`/`Dying` nunca são acertados, então "knockback não afeta
  Spawning/Dying" já vale pela regra de alvo. A rolagem é por inimigo, na ordem do scan do
  pool — determinística com a seed.
- **Rolagem consome RNG**: com Dado no build, cada inimigo atingido consome 1 `rng.next()` —
  as sequências mudam SÓ nesses builds; determinismo (mesma seed ⇒ mesmo resultado) segue
  coberto pelos testes existentes.
- **Sem colisão inimigo×inimigo no jogo** (limitação declarada do cenário de balanceamento):
  sobreposição já é o comportamento normal — knockback não cria problema novo e não precisa de
  resolução de contato. A interação com anti-tunneling também é nula: o deslocamento é
  instantâneo e as cartas re-escaneiam por tick; `projectileHitCooldown` já impede acerto
  duplo no mesmo tranco.
- **Descartados pelo GDD nesta leva (registro)**: espinhos e explosão de orbe — os endereços
  seguem válidos se voltarem (espinhos → `contactDamage.ts`; explosão de orbe → `xpOrbs.ts`).

## Áudio sintetizado — `src/audio/` *(decidido em 2026-11-18)*

Primeiro som do jogo: **hit no inimigo**. Módulo novo `src/audio/` espelhando o render:
consome sim e dados, nunca o contrário (fronteira 3). **100% sintetizado por WebAudio**
(`OscillatorNode` + buffers de ruído gerados uma vez) — **zero assets**, coerente com a
decisão "arte 100% por código". A sim segue pura: **nenhum import de audio na sim, nenhum
`AudioContext` fora de `src/audio/`**.

### Contrato do módulo (`createAudio(): GameAudio`)

```ts
interface GameAudio {
  unlock(): void;                 // idempotente; tenta resume() do AudioContext
  beginMatch(): void;             // zera estado de partida (throttle, lastTickCount)
  endMatch(): void;               // para e desconecta TODA voz viva; nada vaza entre partidas
  update(world: World): void;     // lê world.events; chamado 1×/frame no afterFrame
  setMasterVolume(v: number): void; // 0..1 — terreno para a tela CONFIGURAÇÕES futura
  dispose(): void;                // fecha o AudioContext (vida do app)
}
```

- **Vida do app, não da partida**: o `AudioContext` e o `GainNode` master são criados uma vez
  (contextos por página são recurso finito; recriar por partida é churn). `beginMatch`/
  `endMatch` casam com os do render: `endMatch` varre o conjunto de vozes ativas
  (`oscillator.stop()` + `disconnect`) e reseta o estado — nenhum nó de áudio sobrevive à
  partida. Toda voz one-shot também se auto-limpa no `ended`.
- **Leitura de eventos SEM consumo destrutivo** (mesma regra do render: ler, nunca `splice` —
  o tick limpa no início do seguinte), com uma regra a mais, obrigatória: **`update` guarda
  `world.tickCount` e só processa eventos quando ele avançou desde a última chamada**. Sem
  isso, frames sem tick novo (monitor de 144 Hz, pausa do Panfleto, gameOver) re-tocariam os
  eventos do último tick a cada frame. Limitação registrada e aceita: num frame com N > 1
  ticks (hitch), só os eventos do último tick estão no array — perder sons num hitch é
  comportamento desejável, não bug.
- **Ponto de chamada**: `main.ts` liga `audio.update(world)` no `afterFrame` do gameLoop (ao
  lado do `hud.update`) — o gameLoop não muda.

### Autoplay (onde mora o unlock)

`AudioContext` só sai de `suspended` com gesto do usuário. Decisão: o **unlock mora no
`main.ts`** (raiz de composição), em dois ganchos: (1) o clique de JOGAR das telas de menu —
o caminho normal sempre tem gesto antes da partida; (2) um listener one-shot de
`pointerdown`/`keydown` na janela, para o caminho `?personagem=` que pula as telas (o primeiro
clique/tecla do jogador destrava). `unlock()` é idempotente e **nunca lança**: se o `resume()`
falhar ou não existir `AudioContext`, o módulo fica mudo em silêncio.

### Teto de vozes e throttle (obrigatório)

20 hits/s não viram 20 osciladores/s: **(1)** o próprio contrato do `enemyHit` já agrega — o
pulso da fumaça que acerta N inimigos é UM evento e toca UM som ("1 som por ativação por tick,
nunca 1 por inimigo" é regra de design do GDD, inegociável); **(2)** teto global
**`MAX_SFX_VOICES = 8`** vozes simultâneas — evento que chega com o teto cheio é descartado,
nunca enfileirado; **(3)** intervalo mínimo de re-disparo **por tipo de som**: hit com
**`HIT_MIN_INTERVAL = 0,1 s`** (teto de 10 hits/s fixado no GDD; excedente descartado, nunca
enfileirado — som atrasado é pior que ausente). Buffers de ruído são pré-gerados no unlock e
compartilhados — zero alocação de buffer por disparo.

**Modulação do toc de hit (mapeamento evento → síntese, caráter no GDD "Áudio v1")**: pitch e
ganho sorteados por hit (variação anti-enjoo — aleatoriedade de APRESENTAÇÃO, fora da sim:
`Math.random` é permitido aqui); `count >= 3` → −30% de pitch e +25% de ganho ("acertei o
bolo"); `critCount > 0` → −25% de pitch e +30% de ganho (feedback principal do crítico na v1,
zero VFX). Números de síntese são hipótese de ouvido do audio-designer.

**Volume na v1 (GDD)**: sem controle exposto ao jogador — `setMasterVolume` fica como API
interna (terreno das Configurações futuras) com ganho master conservador calibrado de ouvido.

### Headless e testes

- O harness roda chromium headless: o módulo **nunca lança** por contexto ausente/suspenso —
  todo caminho degrada para silêncio. `verify:headless` segue sendo a verificação (console
  limpo inclui o áudio); som de verdade é conferido por pessoa.
- Vitest roda em environment node, **sem `AudioContext`**: a sim não importa áudio (testes da
  sim intocados). O módulo de áudio **não tem teste unitário por ora** — a lógica testável
  (dedup por `tickCount`, throttle) pode ganhar teste puro se for extraída sem WebAudio, mas
  não antes de existir o segundo som.
- Sons futuros (level-up, morte, disparos) consomem os eventos que **já existem** — entra som
  novo sem tocar na sim. Qual evento ganha som é decisão de GD/audio-designer.

## Cenário de balanceamento como convenção de teste *(fixado em 2026-11-18)*

`src/sim/tests/balance.sim.test.ts` roda a simulação de balanceamento do GDD ("Balanceamento do
trio", **FECHADO** em 2026-11-18) como teste. É convenção, não detalhe de implementação — rodada
futura de balanceamento muda ESTE cenário conscientemente, não improvisa outro:

- **Cenário de estresse**: `spawn=25` (base/s; crescimento por minuto da tabela segue valendo),
  seed **42**, **3 min**, bot parado (1º panfleto sempre), dano de contato neutralizado para
  isolar a ofensa. **O teto do pool de inimigos (`enemies.maxAlive` = 600 em `tables.ts`) é
  parte DECLARADA do cenário**: a população pinada no teto (atingido aos ~27 s com a capivara)
  É o critério de "oferta > capacidade" satisfeito — o teste assere o crescimento monotônico
  das janelas de 30 s, não um número fino.
- **Métricas (as do GDD fechado)**: *(1, primária)* identidade por ativação — capivara com
  cooldown segurado em 0 por falta de alvo ≤ 30% do tempo, carteiro ≥ 50% dos arremessos com
  2+ acertos, churrasqueiro ≥ 3 inimigos/pulso após o 1º min; *(2)* **saturação da oferta ≥ 90%
  só para os kits de área** (kills ÷ (kills + vivos ao final); medido ~94% cada); *(3)* piso de
  viabilidade — DPS realizado ≥ 90% do **teto teórico de alvo único do próprio kit** (dano ÷
  cooldown; cartas contam ida+volta).
- **A capivara fica FORA da régua de vazão de propósito** (alvo único é identidade; kills dela
  sob estresse são característica, não alvo). As faixas em % da capivara e a ordem
  churrasqueiro × carteiro foram **aposentadas** (mediam taxa de spawn; a ordem é ruído de
  ±0,1% — virou hipótese para jogadas humanas, ver risco abaixo).
- O que o teste **assere**: saturação ≥ 90% dos dois kits de área, piso ≥ 90% dos três,
  crescimento monotônico da população no estresse e sanidade (todos disparam/matam, métricas de
  identidade medidas e em faixa válida). As métricas de identidade saem com os alvos no
  `console.log` e voltam ao game-designer — limiar fino asserido viraria teste frágil. Limite
  declarado: sem colisão entre inimigos a densidade é irrealista; vale como ordem de grandeza.
- **Com a tabela de tipos e a curva nova, o cenário é CONGELADO à parte da curva real**
  *(decidido em 2026-11-18; GDD "Proteção das métricas fechadas")*: o teste constrói seu
  próprio `GameData` (clone do real) pinando **1 tipo só — o `cone` com os stats vigentes —,
  `schedule` de fase única `{ fromTime: 0, weights: { cone: 1 } }` e a CURVA ANTIGA**
  (base efetiva 25/s do cenário + `rateGrowthPerMinute = 3,0` — a tabela real muda para
  2,0/4,5 e o cenário NÃO acompanha). Motivo: as réguas do trio medem as HABILIDADES; se o
  teste seguisse tabela real, cada ajuste de curva do GD mudaria as medições e reabriria o
  balanceamento fechado. Balancear a CURVA é cenário próprio (abaixo), nunca este.
- **Cenário da CURVA (novo, separado)**: curva e mix REAIS da tabela, **dano de contato
  LIGADO**, seed 42, bots `idle` e `orbit` — critérios do GDD ("Curva de dificuldade": idle
  morre em 45–90 s; orbit ≥ 3 min e ≤ 8 min; kits de área ≤ 10 min; pombo acerta idle
  ≥ 1×/min e orbit < 0,2×/min). Vive em teste próprio (ex.: `difficulty.sim.test.ts`),
  asserindo faixas LARGAS; o fino sai em `console.log` para o GD, como no cenário do trio.
  O harness não precisa de nada novo: `?seed=`/`?spawn=` seguem bastando para runs jogáveis.

## Comandos

| Comando | Faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento (Vite) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | testes da sim (Vitest, environment node) |
| `npm run build` | typecheck + build de produção |
| `npm run preview` | serve a build de produção |
| `npm run verify:headless` | verificação jogável em headless com orçamento de tempo (ver seção abaixo) |

## Verificação jogável

A sessão de 2026-11-17 travou num bot improvisado que jogava até o sorteio dar o build certo, sem
timeout. Para não repetir:

- **Verificar jogando = `npm run verify:headless`** (`tools/verify/headless.mjs`): sobe e derruba o
  próprio servidor, joga com um bot, coleta erros de console, HUD e screenshot, e aborta sozinho ao
  estourar o orçamento (padrão 90 s, exit 2). Opções: `--params "spawn=25&seed=42"`,
  `--shot evidencia.png`, `--bot orbit|idle`, `--duration 20`, `--budget 90`, `--menu` (telas de
  menu, ver abaixo).
- **Estado específico entra por URL, nunca jogando até a sorte dar o build**. Overrides atuais:
  - `?melhorias=cafe,cafe,bocao` — build por id (`src/data/upgrades.ts`), na criação do mundo e
    no restart;
  - `?seed=42` — semente fixa da sim (inteiro > 0): runs reproduzíveis;
  - `?tempo=400` — inicia `world.time` em N segundos (vale na criação E no restart): verifica
    fases tardias do cronograma de spawn sem jogar até lá (taxa e fase leem `world.time`; o
    `spawnAccumulator` parte de 0, como num mundo novo). Nota: `readNumber` exige valor > 0,
    então `?tempo=0` é ignorado — equivalente ao padrão;
  - `?inimigos=`, `?spawn=`, `?res=`, `?snap=0` — estresse/depuração, como antes;
  - **`?personagem=capivara|carteiro|churrasqueiro`** — **pula as telas** e inicia a partida
    direto com o personagem (ids de `src/data/characters.ts`);
  - **`?mapa=cidade`** *(novo)* — mapa da partida (ids de `src/data/maps.ts`, só jogáveis);
    padrão: o primeiro mapa jogável.
- **Regras dos overrides com as telas**: o pulo de telas acontece **se e somente se**
  `?personagem=` está presente e é válido; `?mapa=` sem `?personagem=` é ignorado (as telas
  mandam). Id inválido em qualquer um → `Error` no boot (vira erro de console; o harness falha,
  como deve). **Todos os demais overrides continuam funcionando e aplicam-se ao mundo criado,
  inclusive quando as telas são puladas** — `?melhorias`/`?seed` valem na criação e no restart,
  como hoje. Sem `?personagem=`, os overrides ficam guardados e aplicam-se ao mundo criado quando
  o jogador chegar ao jogo pelas telas (mesmo caminho de código).
- **Verificação de partida**: sem `--menu`, o harness injeta `personagem=capivara` nos params
  quando o override está ausente — ele sempre encontra o jogo RODANDO (`#hud`, overlays) ao abrir
  a página; verificação de partida nunca navega pelas telas de menu.
- **Verificação das telas de menu**: `npm run verify:headless -- --menu --shot x.png --duration 2`
  abre **sem** injetar `?personagem=`, espera `#screens` visível, aguarda a duração e fotografa;
  sem bot e sem leitura de HUD; erros de console reprovam, como sempre.
- **Orçamento**: no máximo 3 runs por verificação, dentro do orçamento do harness cada. Não provou
  dentro do orçamento → relate "não verificado" com o motivo. Estourar orçamento é achado que volta
  ao orquestrador, nunca razão para insistir.
- **Proibido**: `npm run dev`, `vite` ou `vitest` sem `run` (watch) em foreground — não retornam e
  travam a sessão. Servidor fora do harness só em background e derrubado ao final da tarefa.
  Qualquer script de automação novo tem timeout global próprio que mata navegador e servidor.

## Convenções de código

- Tipagem estrita. Nada de tipos genéricos que escondem erro.
- Funções pequenas, nomes que dizem a intenção. Comentário explica o porquê.
- Constantes de jogo nas tabelas de dados, com nome.
- Estado de entidade como máquina de estados explícita.
- Objetos criados em rajada usam pool.
- Nunca commitar segredos.

## Definição de pronto

- Verificações automáticas passam (tipos, testes, build).
- Regra nova tem teste.
- Recurso jogável passou em 1 run curta do `verify:headless` (screenshot + console limpo) ou foi
  jogado pela pessoa. Uma run com evidência basta; dezenas de runs não valem mais que uma.
- Mudança de código passou pelo `code-reviewer`.
- GDD, TECH e código dizem a mesma coisa.

## Riscos técnicos

| Risco | Plano |
|---|---|
| Hordas em 3D no navegador abaixo da taxa de quadros alvo | Protótipo de estresse com desenho em lote antes de escolher o estilo de arte |
| Vazamento de GPU ao recriar a cena por partida (menu ⇄ match) | `endMatch` dá dispose de tudo que `beginMatch` criou; medir `renderer.info.memory` (geometries/textures) ao voltar ao menu — deve voltar ao valor pós-boot |
| Spy de posição do harness acoplado à geometria da capivara | **Mitigado (2026-11-17)**: convenção `name='player-body'` implementada nos três personagens (`playerView.ts`) e o spy do `tools/verify/headless.mjs` procura pelo nome. Regra permanente: personagem novo nomeia o mesh do corpo assim |
| Capivara alvo único pode frustrar em jogada real (hipótese de risco ALTO do GDD: sob estresse ela abate ~2% da oferta — gap estrutural de 1 kill por cooldown, que número de tabela não resolve; a mordida em área da POC limpava bolos, mudança sensível para quem joga desde então) | Validar em **playtest humano** (critério no GDD: sobrevivência ≥ 75% do melhor do trio + sensação de "justa cercada"); fallback já desenhado no GDD ("mordida e rabanada", até 2 alvos) — só entra se o playtest reprovar, e aí é rodada nova de design + sim, não ajuste de tabela. No mesmo espírito, o dano do pulso do churrasqueiro foi revertido 8 → 6 (experimento registrado no DECISIONS): não perseguir ruído do cenário saturado com número de tabela |
| Carta atravessar inimigo num tick (tunneling) em `projectileSpeed` alto | Validação de boot (em vigor em `validate.ts`): `projectileSpeed × SIM_DT < cardRadius + MIN(radius dos tipos)`; se um dia precisar de velocidade maior, sub-passos no voo da carta |
| Múltiplos `InstancedMesh` de inimigo (1 por tipo) estourarem o orçamento de render | Improvável (2–5 draw calls a mais); medir `renderMs`/FPS do HUD com `?spawn=25&seed=42` após a entrega dos tipos — regressão aqui reabre a decisão "um mesh por tipo" antes de otimizar |
| Áudio quebrar headless/autoplay (AudioContext suspenso, erro de console reprovando o harness) | Regra de módulo: `unlock()` idempotente que nunca lança; todo caminho degrada para silêncio; `verify:headless` com console limpo é o teste de regressão — rodar 1 run após a entrega do áudio |
| Vazamento de nós WebAudio entre partidas (vozes órfãs somando ao master) | `endMatch` do áudio varre e desconecta o conjunto de vozes ativas (espelho do dispose do render); vozes one-shot auto-limpam no `ended` |
| Dedup de eventos de áudio por frame (re-tocar o último tick em frames sem tick novo) | Contrato registrado: `update` só processa eventos quando `world.tickCount` avançou; é a primeira coisa a conferir se um som "metralhar" |
