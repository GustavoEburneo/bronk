# GDD: documento de design do jogo

> Fonte da verdade sobre **o que** o jogo é. Só o `game-designer` edita.
> Cada item tem um estado: **decidido**, **hipótese** (o protótipo vai testar) ou **em aberto**.

## Visão em uma frase

Survivors-like 3D para navegador com tema de caos cotidiano brasileiro: você escolhe um personagem com
uma habilidade base única e sobrevive a hordas pela cidade. *(decidido)*

## Referências

Megabonk e PokéBonk, como referência de gênero e de ritmo. Elenco, nomes e arte são originais. *(decidido)*

## Pilares

1. Entende-se em três segundos: tema e objetivo claros só de olhar. *(decidido)*
2. Cada personagem muda o jeito de jogar, não só os números. *(decidido)*
3. A cidade participa: o cenário é perigo e ferramenta. *(hipótese)*

## Plataforma e público

- Navegador, desktop primeiro. Celular: *em aberto*.
- 3D, tosco de propósito (referência: Megabonk): primitivas low-poly com proporções exageradas, texturas de canvas desenhadas "mal", render interno em baixa resolução com upscale pixelado, vertex snapping estilo PS1 e animação dura sem easing. O humor vem do tema brasileiro, não de memes de terceiros. *(decidido)*
- Público inicial (Brasil ou global) e idioma: *em aberto*.

## Loop principal

Mover, atacar automaticamente com a habilidade base, coletar experiência, subir de nível e escolher
melhorias, enfrentar chefe ao fim da run. *(decidido em linhas gerais; números em aberto)*

Formato da escolha de melhorias ao subir de nível: **"Panfleto na Esquina"**, detalhado na seção
abaixo. *(decidido em 2026-11-16; substitui o level-up provisório da POC, que dava +dano fixo — o
`levelDamageBonus` sai da tabela de dados)*

## Escolha de melhorias: "Panfleto na Esquina" *(decidido em 2026-11-16)*

**O que o jogador faz:** ao subir de nível, a simulação **pausa totalmente** (o render continua).
Uma mão entra pela lateral da tela e estende **3 panfletos** de papel mal diagramado — Comic Sans,
clip-arts toscos, "PROMOÇÃO!!!" — cada um com o nome da melhoria e o efeito em uma linha. Clique ou
teclas 1/2/3 escolhem; o jogo retoma. **O que ganha:** a melhoria escolhida, empilhável até um teto.
**Por que repete:** cada tela é uma decisão de build sob as opções sorteadas, com um reroll para
apostar. O humor está no objeto (o panfleto feio), conforme as diretrizes de tema.

Regras:

- **3 opções** sorteadas do pool, sem repetição na mesma tela.
- **1 reroll grátis por level-up** ("pedir outro panfleto"): re-sorteia as 3 opções.
- **Sem raridade na v1.** Cada melhoria tem níveis empilháveis com teto (tabela abaixo). Melhoria
  no teto sai do sorteio.

Casos de borda:

- Vários level-ups no mesmo tick → telas em fila, uma por vez, cada uma com seu próprio reroll.
- Pool esgotado (tudo no teto) → panfleto único **"Trocado"** (cura 20 HP), repetível.
- Restam só 1 ou 2 melhorias elegíveis (menos que 3, pool não esgotado) → a tela oferece apenas as
  restantes, **sem** completar com o "Trocado" (que segue exclusivo do pool 100% esgotado).
- Menos de 3 opções elegíveis (incluindo o panfleto único do "Trocado") → o reroll é permitido na
  regra, mas devolve o mesmo conjunto; a UI oculta o botão de reroll nesses casos.
- Morte e level-up no mesmo tick → a morte vence; nenhuma tela abre.

Alternativas descartadas para a v1 (registro em DECISIONS): "Caiu do Caminhão" (escolha espacial sem
pausa — candidata a drop de elite no futuro) e "Pega ou Passa" (raspadinha sequencial — candidata a
evento especial no futuro).

### Melhorias iniciais

As melhorias de dano, alcance e cooldown valem para a **habilidade base equipada** (mordida da
capivara, cartas do carteiro, fumaça do churrasqueiro), não só para a mordida: os stat-alvos `bite.*` viram `ability.*`.
É a versão mais barata: um pool único, zero conteúdo de melhoria por personagem. Nomes e textos
dos panfletos são os mesmos para todos; sabor por personagem (ex.: variações do nome por
habilidade) é hipótese futura. *(decidido em 2026-11-17)*

Base da capivara (POC): mordida 10 dano / 0,8 s / 2,2 u; velocidade 8; HP 100; ímã 3,5 u;
i-frames 0,6 s. Bases do carteiro e do churrasqueiro: seção Personagens. **Todos os valores abaixo são ponto de
partida**: o `systems-engineer` simula e devolve os números, e o GDD é ajustado. *(valores: hipótese)*

| Melhoria | Efeito por nível | Teto | Stat-alvo |
|---|---|---|---|
| Pimenta no Dente | +25% dano da habilidade base | 5 | `ability.damage` |
| Abriu o Bocão | +20% alcance da habilidade base | 4 | `ability.range` |
| Café Passado na Hora | −12% cooldown da habilidade base (piso 0,35 s) | 4 | `ability.cooldown` |
| Chinelo Ligeiro | +10% velocidade de movimento | 4 | `player.moveSpeed` |
| Marmita Reforçada | +20 HP máx e cura 20 na hora | 5 | `player.maxHp` |
| Ímã de Geladeira Gigante | +50% raio do ímã de XP | 3 | `xp.magnetRadius` |
| Capa de Chuva de Saco de Lixo | +0,25 s de i-frames (teto 1,1 s) | 2 | `player.contactIFrames` |
| Figurinha Premiada | +25% XP por orbe | 3 | multiplicador novo sobre `xpValue` |
| Trocado *(fallback)* | cura 20 HP; só aparece com o pool esgotado | ∞ | — |

**Regra de empilhamento** *(decidido; é a regra implementada e testada)*: percentuais empilham de
forma **linear aditiva sobre a base** — `valor = base × (1 ± percentual × stacks) + plano × stacks` —
nunca composição multiplicativa (`base × fator^stacks`). Todo número "no teto" citado neste
documento segue essa fórmula.

### Melhorias novas — passivas e de acerto *(novo em 2026-11-18; comportamento: decidido para a leva; valores: hipótese)*

**O que o jogador faz:** as mesmas escolhas de panfleto, agora com builds que não são só "bater
mais": aguentar pancada, regenerar, apostar em acerto crítico ou empurrar a horda. **O que
ganha:** 4 eixos novos de build sobre os 8 existentes (pool sorteável vai de 8 para 12). **Por
que repete:** defesa × regen × crit × knockback combinam diferente com cada personagem (knockback
salva a capivara e atrapalha o churrasqueiro — de propósito), então a mesma oferta lê diferente
por run.

| Melhoria | id | Efeito por nível (texto do panfleto) | Teto | Stat-alvo (novo) |
|---|---|---|---|---|
| Capacete de Obra Emprestado | `capacete` | "−2 de dano por pancada (dói no mínimo 1)" | 2 | `player.contactArmor` |
| Soro Caseiro | `soro` | "+0,5 de HP por segundo" | 3 | `player.hpRegen` |
| Dado Viciado | `dado` | "15% de chance de dano em dobro" | 3 | `ability.critChance` |
| Rodo de Enchente | `rodo` | "empurra 0,5 u quem você acerta" | 3 | `ability.knockback` |

**Stat-alvos novos (`UpgradeStatId`)**: `player.contactArmor`, `player.hpRegen`,
`ability.critChance`, `ability.knockback` — todos **derivados com base 0** (mesmo padrão do
`xp.gainMultiplier`): nenhum campo novo nas tabelas de personagem; o efeito é 100% plano
(`flatPerStack`), coerente com a regra linear aditiva. Onde a base derivada mora no código é
definição do `tech-lead`.

Regras e casos de borda *(decididos)*:

- **Capacete (defesa)** — redução **plana**, não percentual *(decidido)*: lê imediato no
  panfleto, custa uma subtração, e escala do jeito certo com a tabela de inimigos — apaga o
  golpe fraco e deixa o forte doer (plana corta mais do fraco; percentual faria o contrário).
  Fórmula: `dano_de_contato_final = max(1, contactDamage do tipo − armor)` — **piso de dano 1,
  o risco nunca zera**. Aplica por acerto, depois da janela de i-frames. No teto (−4): Cone
  8→4, Rato 5→1, Britadeira 18→14, Pombo 10→6 (tabela na seção Inimigos).
- **Soro (regeneração)** — contínua por tick (0,5 HP/s × stacks, fração por tick; sem timer
  novo), clampada no `maxHp` efetivo. Congela com a sim (pausa do Panfleto, morte). **Não
  reverte morte**: HP que chegou a 0 no tick é morte; o regen só roda com o jogador vivo. Com
  HP cheio, não faz nada. No teto: 1,5 HP/s — nunca vence o pior caso de contato (8 HP a cada
  0,6 s de i-frames ≈ 13,3 HP/s): regen paga descuido, não paga ficar parado no bolo.
- **Dado (crítico)** — rolagem **por inimigo atingido, por aplicação de dano** (pulso de fumaça
  rola 1× por inimigo atingido; a carta rola por inimigo por passada; a mordida, no alvo único),
  com o **RNG injetado da sim** (determinismo com seed preservado). Crítico = dano efetivo
  **×2** (depois da Pimenta). O ×2 **não viola a regra linear**: não é empilhamento — é estado
  binário do acerto; o que empilha (a chance, +15%/stack, teto 45%) é plano e aditivo. Feedback
  do crítico na v1 é **sonoro** (ver seção Áudio) — zero VFX novo.
- **Rodo (knockback)** — deslocamento **instantâneo** de 0,5 u × stacks na direção
  jogador→inimigo, em todo acerto da habilidade; posição clampada na arena; não afeta
  `Spawning`/`Dying`; o Pombo é deslocado mas **mantém a direção de voo**. Anti-sinergia
  **deliberada** com o churrasqueiro (ele quer inimigos na nuvem): é escolha de build, não bug.
  Anti-stunlock conferido: no teto (1,5 u), um Cone (3,2 u/s) recupera 2,56 u por cooldown da
  capivara (0,8 s) — empurrão atrasa, não paralisa. **Caso a observar**: contra a Britadeira
  (1,8 u/s → 1,44 u por cooldown) o teto empata o avanço — se trivializar o tanque em playtest,
  a rodada futura dá a ela resistência a knockback (×0,5), não mexe no Rodo.
- **Dois efeitos no mesmo acerto**: crítico + knockback aplicam ambos, independentes. Toda cura
  (Marmita, Trocado, regen) clampa no `maxHp` efetivo do momento.

**Descartados nesta leva (registro)**:

- **Orbes explosivos (área ao coletar)**: caro (caminho novo de dano em área + VFX + som) e
  invade a linguagem de área do churrasqueiro — dano em área ao redor de um ponto é identidade
  exclusiva dele (pilar 2).
- **Espinhos de contato**: barato, mas premia levar pancada — somado a defesa+regen formaria um
  build de "tanque de rosto" que apaga o sinal central do gênero (contato = ruim) e embaça a
  leitura de risco do churrasqueiro. Reavaliar só se um personagem-tanque virar realidade.
- **Mais de 4 novas de uma vez**: pool de 12 sorteáveis com 3 opções/tela já dilui bastante o
  sorteio; crescer mais nesta leva derrubaria a chance de fechar build e viraria pressão no
  reroll.

**O que torna dispensável:** a dupla defesa+regen dispensa qualquer sistema de cura por drop no
chão nesta fase; o Dado dispensa uma segunda melhoria plana de dano; o Rodo estreia o knockback
como melhoria — o candidato "Entregador de gás" (DECISIONS 2026-11-18) deixa de ser
pré-requisito para testar a mecânica.

**Como saber se funcionou:**

- Taxa de escolha **quando ofertada** de cada nova entre **15% e 60%** (abaixo: texto não vende
  ou efeito fraco; acima: dominante demais).
- Capacete+Soro juntos em **≤ 70%** das runs longas (> 4 min) — acima disso a dupla defensiva
  está barata demais.
- O crítico é **percebido**: em playtest, o jogador nota "acertei forte" só pelo som; se
  ninguém notar, o feedback sonoro não basta e aí se discute VFX.

### Hipóteses a testar

- 3 opções por tela bastam (nem falta escolha, nem sobra leitura)?
- 1 reroll grátis por level-up é o número certo (vs. banco de rerolls por run)?
- A pausa total incomoda no ritmo da horda, na frequência atual de level-ups?

### Como saber se funcionou

- Tempo mediano na tela de escolha < 4 s.
- Nenhuma melhoria escolhida em mais de 40% dos level-ups (variedade de builds).
- Taxa de uso do reroll entre 15% e 40% (útil sem ser muleta).
- Builds visivelmente diferentes entre runs ao observar sessões de jogo.

## Fluxo de telas e estrutura de partida *(novo em 2026-11-17; fluxo: decidido)*

Fluxo: **início → seleção de personagem → seleção de mapa → jogo**. Substitui o comportamento da
POC de abrir direto na partida (que sai). As três telas seguem o estilo tosco decidido no
DECISIONS: fundo com textura de papel, Comic Sans, cards que parecem panfletos grampeados num
poste. Navegação por clique ou teclado (dígitos selecionam + Enter confirma; a tela de início usa
1–4, as demais 1/2/3); Esc volta uma tela (sem efeito na tela de início, que é a primeira). Sem
persistência de escolha entre sessões na v1 (sempre começa na tela de início).

### Tela de início — menu principal *(reescrita em 2026-11-18; layout, rótulos e textos: decididos — DECISIONS 2026-11-18)*

Substitui a tela "panfleto + Começar" da leva anterior. O botão **"Começar" sai** (o JOGAR o
substitui); a tela continua sem créditos e sem telas novas por trás dos botões desabilitados.

Layout: título de trabalho **"BRonk"** no topo (nome final: *em aberto*, segue devolvido ao
orquestrador), coluna de **5 botões** estilo panfleto abaixo dele, e a **caixinha do dev** (QR
Pix) como um panfleto menor no **canto inferior direito** — fora do caminho visual título → JOGAR.

Botões, na ordem (que também define os atalhos de teclado) *(CONQUISTAS e ÁLBUM: funcionais
desde 2026-11-19)*:

1. **JOGAR** — leva à **seleção de personagem**; o fluxo existente segue igual dali em diante.
2. **LOJA DE TALENTOS** — funcional: abre a loja de meta-progressão (ver seção
   "Meta-progressão: Loja de Talentos"); Esc/Voltar retornam ao início.
3. **CONFIGURAÇÕES** — desabilitado, carimbo torto **"EM BREVE"** (escopo: *em aberto*, ver
   seção Em aberto). É o **único** botão fechado do menu.
4. **CONQUISTAS** — funcional: abre o mural de conquistas (ver seção "Conquistas").
5. **ÁLBUM** — funcional: abre o álbum de figurinhas (ver seção "Meta-progressão: Álbum de
   Figurinhas").

O botão desabilitado usa o **mesmo padrão dos slots de mapa bloqueados**: visível, carimbo
torto "EM BREVE", e clique (ou atalho + Enter) dá o **mesmo feedback curto de negado** sem
navegar — padrão único de "ainda não existe" no jogo inteiro, zero arte nova de estado.

Teclado *(decidido)*:

- Dígitos **1–5** selecionam o botão correspondente; **Enter** (ou Espaço) confirma.
- **Sem seleção prévia, Enter/Espaço ativa o JOGAR direto** — preserva o caminho de 1 tecla do
  antigo "Começar".
- Confirmar o 3 (CONFIGURAÇÕES) dispara o feedback de negado, igual ao clique.
- **Esc não faz nada** (é a primeira tela do fluxo).

**Caixinha do dev (QR Pix de apoio ao autor)** *(textos: decididos)*:

- Convite, acima do QR: **"Gostou do caos? Paga um café pro dev."** — humor de situação (o café
  do dev), sem tom de pedido de esmola. "Pix" pode ser citado por nome (sistema público do BC);
  nenhuma marca de banco ou carteira aparece.
- O QR desta leva é **placeholder não escaneável**: padrão visual de QR falso (arte por código,
  como as demais texturas), com o mesmo carimbo torto **"EM BREVE"** por cima.
- Legenda sob o QR: **"Por enquanto este QR não paga nem o café."** — deixa explícito que ainda
  não funciona, no tom do jogo.
- O bloco **não é interativo** na v1: sem clique, sem atalho, sem navegação por teclado até ele.
  Quando o payload real entrar (DECISIONS 2026-11-18: fornecido pelo autor, nunca CPF/telefone/
  e-mail — o QR fica público no jogo), mudam **só o conteúdo do QR, a saída do carimbo e a
  legenda** (que vira **"Pix, e o troco é seu."**); convite e posição ficam.

Custo da tela: só UI e 1 textura de canvas (QR falso); zero sim, zero dados de jogo novos. O
ponto único no código onde o payload real entra é definição do `tech-lead`.

### Seleção de personagem

- Um card estilo panfleto por personagem jogável (v1: **Capivara**, **Carteiro** e
  **Churrasqueiro**), cada um com:
  nome, habilidade base em 1 linha e "o que muda no jeito de jogar" em 1 linha (textos vêm da
  tabela de Personagens).
- Sem cards bloqueados de personagens futuros na v1: a tela só promete o que existe. *(corte
  deliberado — cards bloqueados de personagem são hipótese futura; os mapas já cumprem o papel
  de "vem mais por aí")*

### Seleção de mapa *(atualizada em 2026-11-19: 2 mapas jogáveis)*

- **2 cards selecionáveis** (**Avenida em Obras** e **Feira de Domingo** — ver seção Mapas),
  cada um com nome e descrição em 1 linha, + **2 slots bloqueados** com carimbo **"EM BREVE"**
  (Orla, Laje).
- Com mais de um mapa liberado, a tela segue o **modelo da seleção de personagem**: dígito
  seleciona (adesivo "ESTE!"), clique ou Enter confirmam; a última escolha fica destacada na
  próxima visita.
- Clicar num slot bloqueado dá um feedback curto de negado e não navega; confirmar o card
  liberado inicia a run com o personagem e o mapa escolhidos.

### Menu de pausa *(novo em 2026-11-19)*

**Esc (ou P) durante a run** congela a simulação e abre o menu de pausa — um mural sobre o jogo
parado, no estilo das demais telas. Não abre durante a escolha de melhoria (a sim já está
pausada) nem na tela de fim de run. Com o ponteiro travado pelo mouse-look, o navegador consome
o primeiro Esc para soltar o cursor; o segundo pausa (P pausa de primeira).

Conteúdo: linha da run (personagem, tempo, nível, bananas na mochila) e o **build atual** —
habilidade equipada com os números efetivos de agora (dano/recarga/alcance já com melhorias e
talentos), passivas da run com stacks (×n/teto) e linha de efeito, e os talentos da loja
comprados (chips, pois valem sempre).

Ações, em coluna de panfletos:

1. **Continuar** — fecha a pausa (Esc também).
2. **CONFIGURAÇÕES** — "EM BREVE", mesmo padrão de negado do menu principal (escopo segue em
   aberto).
3. **Finalizar run** — encerra a run na hora: vai para a tela de **Fim da run** normal (bananas
   creditadas; dali "Jogar de novo" ou "Menu"). Sem som de morte: desistir não é morrer.
4. **Sair pro menu principal** — credita as bananas da mochila e volta direto à **tela de
   início** (diferente do "Menu" pós-morte, que volta à seleção de personagem: quem sai pela
   pausa pediu o menu, não a revanche).

### Morte e volta ao menu

- A tela de morte ganha dois botões: **"Jogar de novo"** (reinicia direto com o mesmo personagem
  e mapa) e **"Menu"** (volta à tela de **seleção de personagem**, não à de início). *(decidido —
  reconciliação do orquestrador em 2026-11-17: o caso comum pós-morte é re-jogar, muitas vezes
  trocando de personagem; a tela de início é cerimônia de entrada e só adicionaria um clique.
  Rótulos implementados: "Jogar de novo" e "Menu", como pedido)*
- Sem menu de pausa durante a partida nesta leva (fora de escopo).

### Requisito de verificação

- As telas precisam ser **puláveis por parâmetro de URL** (personagem e mapa direto na URL,
  caindo na partida), para o harness `verify:headless` do TECH continuar funcionando. Formato do
  parâmetro: definição do `tech-lead`.

### Hipóteses e como saber se funcionou

- O fluxo de 3 telas não cansa em sessões repetidas: do clique em "Começar" até a partida em
  **< 15 s** na primeira sessão e **< 6 s** nas seguintes.
- Com 3 personagens, cada um é escolhido em **20–50%** das runs; se um ficar abaixo de 15%,
  investigar o card (texto não vende) ou a habilidade (não atrai). *(era 35–65% com 2
  personagens; faixa recalibrada em 2026-11-18 com a entrada do churrasqueiro)*
- Ninguém clica em slot bloqueado mais de 1 vez por sessão (o "EM BREVE" comunica) — vale também
  para os botões desabilitados da tela de início.
- A caixinha do Pix **não atrapalha o caminho até JOGAR**: o tempo tela de início → partida segue
  dentro dos **< 15 s** (1ª sessão) / **< 6 s** (seguintes) acima, e ninguém tenta escanear ou
  clicar o QR placeholder mais de 1 vez por sessão (o carimbo "EM BREVE" no QR comunica). Se ao
  observar alguém travar na caixinha antes de achar o JOGAR, o ajuste barato é reduzir o QR, não
  movê-lo.

## Personagens

| Personagem | Habilidade base | O que muda no jeito de jogar | Estado |
|---|---|---|---|
| Capivara | Mordida automática | Briga colada: curto alcance, ritmo rápido | **no protótipo** |
| Carteiro | Cartas que voltam (bumerangue) | Briga à distância: a carta atravessa a horda na ida e na volta | **no protótipo** (v1 mínima) |
| Churrasqueiro | Baforadas de fumaça ao redor | Briga no meio da horda: ser cercado é o plano | **no protótipo** (v1 mínima) |
| Motoboy | Dano por velocidade | Quanto mais rápido, mais forte | hipótese |
| Vendedor de praia | Planta guarda-sóis e isopores | Defesa de território | hipótese |
| DJ de paredão | Ondas de som no ritmo | Acertar a batida amplia o alcance | hipótese |

Personagens do primeiro protótipo: capivara e carteiro. *(decidido em 2026-11-17)* Terceiro
personagem: **churrasqueiro** *(decidido em 2026-11-18 — DECISIONS; fecha o trio de ritmos:
capivara média distância, carteiro longa, churrasqueiro contato)*. As colunas "Habilidade base"
e "O que muda no jeito de jogar" dos personagens **no protótipo** são o texto de jogador da
`tagline` do card de seleção, no formato "habilidade — o que muda", exatamente como implementado.

Diferenciações que seguem como **hipóteses futuras** (fora desta leva; não apagar):

- Capivara: rápida na água, onde os inimigos ficam lentos (exige água no mapa).
- Carteiro: cães que perseguem só ele; pontos de entrega espalhados pelo mapa com recompensa.

### Capivara — "Mordida" *(alvo único confirmado em 2026-11-18; valores: hipótese)*

**O que o jogador faz:** anda colado na horda escolhendo quem fica dentro do alcance curto — a
mordida automática acerta **1 inimigo por disparo**, o mais próximo. **O que ganha:** o melhor
dano sustentado de alvo único do trio (12,5 DPS base), sem depender de trajetória nem de
densidade. **Por que repete:** cada passo decide o próximo alvo; é o personagem de "derrubar um
por vez" que serve de régua para os outros dois.

Comportamento *(decidido em 2026-11-18 — resolve a contradição GDD×código apontada pela
simulação do `systems-engineer`; este texto substitui a mordida em área da POC)*:

- Quando o cooldown vence, morde **apenas o inimigo `Chasing` mais próximo** com distância
  centro-a-centro ≤ alcance. **Exatamente 1 inimigo por disparo**, dano cheio. Empate exato de
  distância → determinístico (o primeiro na ordem interna do pool).
- **Sem alvo no alcance → não morde e o cooldown não gasta** (segura em 0 e tenta no próximo
  tick) — mesma regra das cartas e da fumaça; as três habilidades seguem uma única convenção.
  *(A POC disparava a mordida no vazio, gastando cooldown; alinhado em 2026-11-18.)*
- Inimigos em `Spawning` ou mortos nunca são alvo — só `Chasing`, como nas outras habilidades.

Por que alvo único: o GDD sempre descreveu "mordida no inimigo mais próximo", e as réguas do
carteiro (~11,7 vs 12,5 DPS) e do churrasqueiro (48% em alvo único; empata com 2 na nuvem) foram
escritas sobre essa premissa. A POC implementou área (todos no raio) — e fumaça em área de 2,0 u
contra mordida em área de 2,2 u fazia do churrasqueiro uma capivara pior, violando o pilar 2.
Dano em área ao redor do jogador agora é **identidade exclusiva do churrasqueiro**.

**Risco registrado — hipótese de risco ALTO (validar jogando; decidido em 2026-11-18, rodada de
fechamento):** sob o estresse calibrado a capivara abate **menos de 1% da oferta** (32 kills na
re-medição pós-leva de 2026-11-18 contra ~5.000 de cada kit de área; era 107 no fechamento — a
diferença é ruído de trajetória, ver nota de re-medição no Balanceamento do trio) — e nem a
horda padrão ela limpa com bot parado (DPS ≈ 92% do teto teórico do kit, população no teto do
pool). O gap é **estrutural** (1 kill por cooldown),
não de número. A aposta aceita: no jogo real há melhorias, level-ups e um jogador que anda e
escolhe alvo — ela é a personagem de "derrubar um por vez", não de limpar tela. **Como saber se
funcionou:** nas jogadas humanas, tempo de sobrevivência dela ≥ 75% do melhor do trio nas mesmas
condições, e a sensação de "justa cercada" na observação. Se reprovar, o fallback já desenhado é
a **"mordida e rabanada"** — a mordida passa a acertar **até 2** inimigos mais próximos no
alcance (diferencial mínimo que preserva "área de verdade é do churrasqueiro") — e isso é rodada
nova de design + simulação, só se o playtest pedir. Ajustar dano/cooldown na tabela **não
resolve** este risco (não muda o teto estrutural); voltar à área segue descartado. A mudança
também é sensível para quem joga desde a POC — a mordida em área limpava bolos.

Valores: 10 dano / 0,8 s de cooldown / 2,2 u de alcance; velocidade 8; HP 100; ímã 3,5 u;
i-frames 0,6 s. Régua: 10/0,8 = **12,5 DPS em alvo único, o teto do trio** — carteiro ≈ 11,7
(ida+volta) e churrasqueiro 6,0, de propósito. *(valores: hipótese, em teste na POC)*

Feedback de i-frames (vale para todos os personagens, herdado da capivara): o personagem pisca
alternando visível/invisível, podendo ficar **invisível por frames inteiros**. **Aceito** como
leitura de invencibilidade dentro do estilo tosco. *(anotado em 2026-11-17; se ao jogar a
invisibilidade confundir — "cadê meu personagem?" no meio da horda —, o ajuste barato é trocar
o sumiço por pisca de cor/transparência, sem mudar a duração dos i-frames)*

### Carteiro v1 — "Cartas que Voltam" *(novo em 2026-11-17; comportamento: decidido para a leva; valores: hipótese)*

**O que o jogador faz:** o ataque continua automático (como a mordida), mas o jogador se
reposiciona depois do arremesso: a carta volta para a posição **atual** dele, então andar muda o
caminho da volta e arrasta a carta pela horda. **O que ganha:** dano em linha que atravessa
inimigos, na ida e na volta, com alcance bem maior que a mordida. **Por que repete:** cada
arremesso é uma micro-decisão de posicionamento — ficar parado dobra o dano num alvo, andar de
lado varre a horda.

Comportamento (decidido para a leva):

- Arremessa **1 carta** por ativação, mirando o inimigo mais próximo (mesma regra da mordida).
  Sem inimigo dentro do alcance de arremesso → não arremessa e o cooldown não gasta.
- A carta vai em **linha reta** na direção do alvo até a distância máxima de arremesso, depois
  **volta perseguindo a posição atual do jogador**.
- **Atravessa inimigos** (sem limite de perfuração na v1). Cada inimigo sofre dano **no máximo
  1× na ida e 1× na volta** (lista de atingidos por trecho).
- Captura por **soma de raios**: a carta some ("pegou de volta") quando a distância ao **centro**
  do jogador fica menor que raio do jogador (0,5 u) + raio da carta (0,6 u) ≈ **1,1 u do centro**
  (0,6 u da borda do corpo). Também some após **3 s** de voo (teto de segurança). *(alinhado à
  implementação em 2026-11-17; **hipótese visual a validar jogando**: capturar a 0,6 u da borda
  pode ler como "a carta sumiu antes de chegar na mão" — se incomodar, o ajuste barato é um raio
  de captura próprio, menor que o raio de acerto, sem mexer no dano)*
- O cooldown conta a partir do **arremesso**, não da volta. Máximo de **3 cartas em voo** (teto
  do pool); cooldown pronto sem carta disponível → arremessa assim que uma voltar.

Valores iniciais *(hipótese — o `systems-engineer` simula contra a base da capivara e devolve)*:

| Parâmetro | Valor | Stat-alvo |
|---|---|---|
| Dano por acerto | 7 | `ability.damage` |
| Cooldown | 1,2 s | `ability.cooldown` (piso 0,35 s) |
| Alcance de arremesso | 7 u | `ability.range` |
| Velocidade da carta | 14 u/s | fixo na v1 |
| Raio de acerto da carta | 0,6 u | fixo na v1 |

Régua de balanceamento: alvo único parado leva ida + volta = 14 de dano a cada 1,2 s (~11,7 DPS),
um pouco abaixo dos 12,5 DPS da mordida — a vantagem do carteiro é alcance e multi-acerto, não
dano bruto num alvo só.

Casos de borda:

- Inimigo morre na ida → a carta segue e pode acertar outros; não acerta quem já morreu.
- Pausa do Panfleto → a **posição** das cartas congela junto com a sim (a pausa é total); o
  **giro** da carta é enfeite de render e continua girando, coerente com "a simulação pausa, o
  render continua". *(aceito em 2026-11-17 — o mundo parado com as cartas ainda rodopiando até
  reforça o tosco)*
- Morte do jogador → o **mundo inteiro congela, cartas incluídas** (o overlay de morte cobre a
  tela); nada se move nem acerta a partir do tick seguinte. No próprio tick da morte a habilidade
  ainda resolve (ordem fixa do tick — ver o caso de borda equivalente na seção do churrasqueiro).
  *(alinhado à implementação em 2026-11-17 — mais simples que "as cartas somem" e invisível sob
  o overlay)*
- Com Café no teto (cooldown 1,2 × (1 − 0,12×4) ≈ **0,62 s**) e Bocão no teto (alcance
  7 × (1 + 0,2×4) = **12,6 u**), o tempo de voo cresce e
  chega-se perto do teto de 3 cartas em voo — é para esse cenário que o teto existe.

Demais stats do carteiro na v1: **iguais aos da capivara** (HP 100, velocidade 8, ímã 3,5 u,
i-frames 0,6 s) — versão mais barata; diferenciar stats defensivos é hipótese futura.

**O que torna dispensável:** o pool único de melhorias genéricas (ver Melhorias iniciais)
dispensa conteúdo de melhoria por personagem nesta leva; cães e pontos de entrega ficam
explicitamente fora (hipótese futura).

**Custo estimado:** código — entidade projétil com 2 estados (ida/volta) + pool; arte — 1 plano
com textura de canvas (envelope mal desenhado) girando, sem animação nova; conteúdo — 2 linhas
de texto no card de seleção.

Hipóteses a testar / como saber se funcionou:

- ≥ 50% dos arremessos acertam **2+ vezes** (somando ida e volta) contra a horda padrão.
  **Medido em 2026-11-18: 99% — passa.**
- Métricas de simulação: ver **Balanceamento do trio** — saturação de vazão **≥ 90% da oferta**
  no estresse (**medido: ~94% — passa**; confirmado na re-medição pós-leva de 2026-11-18) e
  piso de viabilidade ≥ 90% do teto teórico do próprio kit na horda padrão (**passa com
  folga**). *(substitui a faixa "120–220%
  dos kills da capivara", aposentada em 2026-11-18: com a mordida de alvo único a razão virou
  ~4.700% e voltou a medir taxa de spawn)* Os valores da tabela seguem **hipótese** até jogadas
  reais: a simulação não captura reposicionamento humano (a micro-decisão que é o coração da
  habilidade) nem a leitura visual da carta.
- Observação ao jogar: o jogador se reposiciona depois do arremesso (a volta é usada de propósito)?

### Churrasqueiro v1 — "Baforada de Fumaça" *(novo em 2026-11-18; comportamento: decidido para a leva; valores: hipótese)*

**O que o jogador faz:** o ataque continua automático e **sem mira** — a cada pulso, uma baforada
de fumaça centrada nele acerta tudo ao redor. O jogo dele é posicionamento invertido: em vez de
manter distância, ele **entra na horda e segura posição**, porque cada inimigo a mais dentro da
nuvem é dano de graça. **O que ganha:** dano em área em todos os inimigos ao redor, de uma vez,
sem depender de mira ou de trajetória. **Por que repete:** cada segundo é a decisão "aguento mais
um pulso aqui ou recuo?" — o trade-off entre risco de contato e inimigos na nuvem muda o tempo
todo, e errar o ponto de recuo custa a run.

A tagline do card (formato dos outros dois): **"Baforadas de fumaça ao redor — briga no meio da
horda: ser cercado é o plano"**.

Comportamento (decidido para a leva):

- A fumaça **não é dano contínuo de verdade**: é **pulsada**. A cada `cooldown` segundos dispara
  **1 pulso instantâneo** (dura 1 tick) que causa `dano` a **todos** os inimigos perseguindo
  (`Chasing`) a até `raio` do **centro atual do jogador** (distância centro-a-centro ≤ raio,
  mesma convenção de alcance da mordida). Sem limite de alvos por pulso na v1. A versão pulsada
  é deliberada: dá significado aos três stat-alvos genéricos do pool — Pimenta aumenta o dano do
  pulso, Bocão alarga a nuvem, Café acelera o ritmo das baforadas.
- **Sem mira e sem projétil**: o pulso é centrado no jogador, sempre. Não há alvo a escolher.
- **Sem inimigo dentro do raio → não pulsa e o cooldown não gasta** (segura em 0 e tenta no
  próximo tick) — mesma regra da mordida e das cartas; o primeiro inimigo que entrar na nuvem
  leva o pulso imediatamente.
- Cada pulso é um evento discreto: o mesmo inimigo leva dano cheio **a cada pulso** em que
  estiver no raio (não há janela de imunidade entre pulsos — o espaçamento é o próprio
  cooldown, que nunca fica abaixo do piso de 0,35 s do Café). Inimigo que entra e sai do raio
  **entre** pulsos não leva nada: a nuvem visual não é hitbox contínua.
- Pausa do Panfleto e morte seguem o padrão do jogo: a sim congela por inteiro, **nenhum pulso
  dispara nem timer anda**; a fumaça visual pode continuar ondulando (enfeite de render, como o
  giro das cartas na pausa).

Valores iniciais *(hipótese — o `systems-engineer` simula contra a base da capivara e devolve)*:

| Parâmetro | Valor | Stat-alvo |
|---|---|---|
| Dano por pulso | 6 | `ability.damage` |
| Cooldown (intervalo entre pulsos) | 1,0 s | `ability.cooldown` (piso 0,35 s) |
| Raio da nuvem | 2,0 u | `ability.range` |

Régua de balanceamento: contra **1 alvo**, 6 DPS — **48%** da capivara (12,5), de propósito: ele
é o pior do trio em alvo único. **Empata com a capivara com ~2 inimigos na nuvem e passa com
3+**; no meio do bolo (4–6 inimigos no raio), 24–36 DPS de área — é isso que paga o risco do
corpo a corpo. O raio de 2,0 u fica um pouco **abaixo** do alcance da mordida (2,2 u): ser
cercado é obrigatório, não opcional. Esta régua pressupõe a mordida de **alvo único** (confirmada
em 2026-11-18, seção da capivara): a diferenciação real do trio é estrutural — área × alvo único —,
não a diferença de 0,2 u de raio. *(O experimento com dano 8, prescrito na rodada anterior para
forçar churrasqueiro > carteiro sob estresse, foi **revertido em 2026-11-18**: aquela ordenação é
ruído de ±0,1% na simulação, e o 8 desalinhava esta régua — alvo único viraria 64% da capivara e
o empate na nuvem cairia para ~1,6 inimigo. A tabela acima, com dano 6, é o valor vigente.)*

Stats defensivos: **iguais aos da capivara** (HP 100, velocidade 8, ímã 3,5 u, i-frames 0,6 s) —
**decidido para a leva, pela versão mais barata** (mesmo racional do carteiro). Justificativa: os
i-frames de 0,6 s já limitam o dano de contato recebido por tempo, não por número de inimigos
encostando — estar cercado não multiplica o dano sofrido; e a capivara já luta quase colada
(2,2 u). "Tanque com mais HP base" fica como **hipótese futura**: se nos playtests ele morrer
cedo demais para sustentar o estilo (ver critérios abaixo), o ajuste barato é +HP na linha dele
na tabela de dados, sem código novo.

Casos de borda:

- Vários inimigos morrem no mesmo pulso → todos os orbes de XP caem normalmente (o pulso é só
  dano em lote; nada especial).
- Inimigos em `Spawning` ou mortos não levam dano — só `Chasing`, como nas outras habilidades.
- Café no teto: cooldown 1,0 × (1 − 0,12×4) = **0,52 s** (acima do piso de 0,35 s — o piso não é
  atingido pelo pool atual).
- Bocão no teto: raio 2,0 × (1 + 0,2×4) = **3,6 u** — a nuvem quase dobra (+80%); é o build que
  transforma o churrasqueiro em área de negação andante, e o cenário a observar em balanceamento.
- Pimenta no teto: 6 × (1 + 0,25×5) = **13,5 por pulso**.
- Morte e pulso no mesmo tick → **o pulso ainda resolve**: na ordem fixa do tick a habilidade
  roda antes do dano de contato, então no tick em que o jogador morre a baforada já saiu e os
  inimigos que ela matou morrem. O que a morte veta é a **tela de escolha** (regra do Panfleto:
  nenhuma tela abre); do tick seguinte em diante o mundo inteiro congela (padrão do jogo — o
  gameOver congela tudo, sem casos especiais, preservando o determinismo). Vale igual para
  mordida e cartas no tick da morte.

**O que torna dispensável:** a versão pulsada dispensa um sistema de dano contínuo com estado
por inimigo (DoT, ticks de queimadura, pareamento nuvem×inimigo) — é a implementação mais
barata possível de "dano em área ao redor"; o pool único de melhorias dispensa conteúdo de
melhoria próprio dele; e, com o trio de ritmos fechado (média/longa/contato), **nenhum
personagem novo é necessário para a tese do pilar 2** — os demais da tabela seguem hipótese sem
prazo.

**Custo estimado:** código — 1 sistema de sim novo (um teste de distância por inimigo quando o
pulso dispara; sem pool, sem projétil — mais simples que a mordida, que ainda escolhe alvo);
arte — modelo do personagem em primitivas (mesh do corpo com o nome convencionado do harness) e
o visual da nuvem/baforada por código no estilo tosco; conteúdo — 1 linha na tabela de
personagens com a tagline. Zero UI (os cards vêm da tabela).

Hipóteses a testar / como saber se funcionou:

- Métricas de simulação: ver **Balanceamento do trio** — saturação de vazão **≥ 90% da oferta**
  no estresse (**medido: ~94% — passa**; estável entre dano 6 e 8, confirmado na re-medição
  pós-leva de 2026-11-18); média de **≥ 3 inimigos atingidos por pulso** após o primeiro minuto
  da horda padrão (**medido: 16,2 na re-medição pós-leva; 8,1 no fechamento — ruído de
  trajetória, nota no Balanceamento — passa**; perto de 1 → o raio não comporta o estilo e ele
  vira uma capivara pior); piso de
  viabilidade ≥ 90% do teto teórico do próprio kit na horda padrão (**passa com folga**).
  *(substitui a faixa "150–300% dos kills da capivara" e a exigência "acima do carteiro",
  aposentadas em 2026-11-18: ambos os kits de área saturam a oferta e a diferença entre eles é
  ruído de ±0,1%)*
- **Hipótese para jogadas humanas** (a simulação não separa): "brigar colado paga mais do que
  varrer à distância" — com risco de contato e reposicionamento reais, o churrasqueiro deve
  render mais que o carteiro nas mãos de quem segura posição. Observar em playtest; não há
  métrica de sim para isso no cenário atual (bot parado, sem colisão).
- Tempo de sobrevivência médio em runs com o churrasqueiro **≥ 75%** do da capivara nas mesmas
  condições — o risco do corpo a corpo deve custar, mas não inviabilizar; abaixo disso, ativar a
  hipótese do tanque (+HP base).
- Observação ao jogar: o jogador **fica** no bolo de propósito (segura posição e recua tarde) em
  vez de fugir por reflexo como faria com a capivara? Se todo mundo joga ele igual à capivara, a
  tagline ou o feedback visual da nuvem não estão comunicando o estilo.

### Balanceamento do trio — métricas e faixas-alvo *(reescrito em 2026-11-18 — rodada de fechamento, sobre a medição do `systems-engineer` com a mordida de alvo único)*

**Resultado: o trio está fechado por simulação.** As três identidades passam com folga, a
saturação de vazão dos kits de área passa, e o piso de viabilidade passa. Única mudança que sai
desta rodada: o dano do pulso do churrasqueiro **volta de 8 para 6** (o 8 foi ajuste
experimental atrás de uma ordenação que se provou ruído — ver "o que morreu" abaixo). O degrau
seguinte de validação é **jogada humana**; nenhuma rodada nova de simulação está prescrita além
da re-medição única da reversão 8 → 6.

**Cenário de estresse (fixado em 2026-11-18):** `spawn=25`, seed 42, 3 min, bot parado, **teto
do pool de inimigos = 600 — parte declarada do cenário** *(confirmado: subir o teto só inflaria
uma métrica já saturada; a população pinada É o critério de "oferta > capacidade" satisfeito)*.
Critério medido: com a capivara, a população de vivos atinge o teto aos ~27 s e fica pinada a
run inteira; a oferta total é ~5.310 inimigos. Limites declarados do cenário: bot parado, horda
converge sem colisão (densidade irrealista), população pinada no teto — os resultados valem
como ordem de grandeza; o fino vem de jogadas humanas. **Adendo (leva de 2026-11-18, inimigos
novos): o cenário usa mix fixo de 100% Cone Revoltado** (o básico batizado) e a curva de spawn
antiga declarada acima — os tipos novos e a curva de dificuldade são camada separada (seção
Curva de dificuldade) e **não alteram estas métricas**.

| # | Métrica | Cenário | Alvo | Medido (2026-11-18) |
|---|---|---|---|---|
| 1 *(primária)* | Identidade por ativação | horda padrão | capivara: cooldown segurado em 0 por falta de alvo ≤ 30% do tempo; carteiro: ≥ 50% dos arremessos com 2+ acertos (ida+volta); churrasqueiro: média ≥ 3 inimigos/pulso após o 1º min | capivara 5%; carteiro 99%; churrasqueiro 16,2 (era 8,1 — nota de re-medição abaixo) — **todas passam** |
| 2 | Saturação de vazão (só os kits de área) | estresse | carteiro e churrasqueiro abatem **≥ 90% da oferta** cada | ~94% cada — **passam** (confirmado na re-medição pós-leva) |
| 3 | Piso de viabilidade | horda padrão | DPS realizado ≥ **90% do teto teórico de alvo único do próprio kit** (dano ÷ cooldown; carteiro conta ida+volta: 14/1,2) | capivara 92% (re-medição pós-leva; era 93,6%); carteiro e churrasqueiro passam com ordens de folga (o multi-acerto os põe muito acima do próprio teto de alvo único) |

**A capivara fica fora da régua de vazão — de propósito.** Sob estresse ela fez 32 kills na
re-medição pós-leva (<1% da oferta; 107 no fechamento — ruído de trajetória, nota abaixo): o
teto estrutural de alvo único é 1 kill por cooldown (máximo teórico 225 em 3 min), e nenhum
número de tabela muda isso sem mudar a regra. É registro de característica, não alvo a atingir;
o risco disso está na seção dela (hipótese de risco alto, validar jogando).

**Nota de re-medição (2026-11-18, pós-leva "passivas + inimigos"):** todas as réguas fechadas
seguem passando, mas os **números absolutos** desta seção mudaram **sem nenhuma mudança de regra
ou de tabela do trio**: o pool de panfletos foi de 8 → 12 (o bot escolhe outros panfletos) e o
sorteio de tipo de inimigo consome um `rng.next()` extra por spawn (muda todas as trajetórias
com a mesma seed). Lição registrada: **os absolutos são sensíveis a ruído de cenário; o contrato
são as réguas** (percentuais e faixas). Valores vigentes: identidades 5% / 99% / 16,2
inimigos-pulso; saturação ~94% cada; piso da capivara 92%; capivara 32 kills no estresse. Os
números antigos ficam citados nas entradas históricas do registro de mudanças, que não se
reescrevem.

O que morreu nesta rodada e por quê:

- **Faixas de vazão em % da capivara (carteiro 120–220%, churrasqueiro 150–300%)**: aposentadas.
  Com a mordida de alvo único a razão explodiu (~4.700% para ambos) e voltou a medir taxa de
  spawn: os dois kits de área matam ~tudo que spawna e a métrica re-satura no topo. Razão sobre
  um kit estruturalmente de alvo único não informa nada.
- **Ordem exigida churrasqueiro > carteiro na simulação**: aposentada como métrica. Com ambos
  saturando a oferta, a diferença medida é ruído (±0,1%; o sinal inverteu entre dano 6 e 8 do
  pulso). "Brigar colado paga mais do que varrer à distância" vira **hipótese para jogadas
  humanas** (onde risco de contato e reposicionamento existem de verdade). Com ela cai a
  cláusula de ajuste "subir o dano do pulso (6 → 8)", que só perseguia esse ruído.
- **Piso antigo ("DPS ≥ 90% da capivara na horda padrão")**: aposentado — saturou ao contrário
  (carteiro 916%, churrasqueiro 940%): com alvo único a capivara não limpa nem a horda padrão
  com bot parado (população no teto), então "% da capivara" mede o teto DELA, não viabilidade.
  O piso novo (métrica 3) compara cada kit consigo mesmo e pega o que um piso deve pegar: kit
  quebrado (cooldown travado, acerto que não sai), independente dos outros personagens.

As métricas de jogo humano de cada personagem (sobrevivência, observação do reposicionamento do
carteiro, segurar posição do churrasqueiro) seguem nas seções deles e são agora o critério
principal de balanceamento fino.

## Mapas *(novo em 2026-11-17)*

| Mapa | Em uma linha | Estado |
|---|---|---|
| **Avenida em Obras** | Pista urbana, cones de trânsito por todo lado, prédios ao fundo — a obra nunca termina | **decidido** (nome do mapa atual; cenário já existe) |
| **Feira de Domingo** | Barracas de lona, chão de terra batida e carrinho desgovernado — leve o troco e corra | **decidido em 2026-11-19** (jogável; bestiário próprio na seção "Inimigos — Feira de Domingo") |
| Orla no Feriadão | Praia lotada: areia que atrasa, guarda-sóis como obstáculo | hipótese (slot "em breve") |
| Festa na Laje | Lajes vizinhas ligadas por tábuas, pouco espaço para errar | hipótese (slot "em breve") |

**Cada mapa tem a própria fauna** *(decidido em 2026-11-19)*: o cronograma de spawn (quais
tipos aparecem e quando) é **dado do mapa**, não configuração global — trocar de mapa é trocar
de inimigos, de ritmo e de prioridades, não só de cenário. A linha da **Feira de Domingo** acima
é o texto de jogador do card, como implementado.

A linha da **Avenida em Obras** acima é o **texto de jogador** do card, fixado exatamente como
implementado: "Pista urbana, cones de trânsito por todo lado, prédios ao fundo — a obra nunca
termina". O antigo prefixo "A avenida da POC:" era contexto interno de documento, nunca texto de
tela — removido do card e da tabela. *(fixado em 2026-11-17)*

Os dois mapas futuros (Orla, Laje) existem na v1 **apenas como nome em slot bloqueado**. As
linhas de conceito servem só para dar cara ao card; o design real de cada um é trabalho futuro
e pode mudar. A Feira saiu desse grupo em 2026-11-19 ao virar o 2º mapa jogável.

## Inimigos — Avenida em Obras *(novo em 2026-11-18; comportamento: decidido para a leva; valores: hipótese)*

**O que o jogador faz:** lê a silhueta e prioriza — o que matar primeiro, o que contornar, do
que fugir. **O que ganha:** XP proporcional ao risco de cada tipo. **Por que repete:** o mix
muda com o tempo da partida (cronograma abaixo), então a prioridade certa de agora está errada
daqui a dois minutos.

O inimigo único da POC é **batizado** e vira a primeira linha de uma **tabela de tipos**
(`gameData.enemies` deixa de ser um bloco único). O teto global de vivos (**600**) e o anel de
spawn (**24–32 u**) ficam onde estão, compartilhados por todos os tipos.

| Tipo | Papel tático | Comportamento | Vel. (u/s) | HP | Raio (u) | Dano de contato | XP | Spawn/Dying (s) |
|---|---|---|---|---|---|---|---|---|
| **Cone Revoltado** | massa de pressão (o básico da POC, batizado — stats inalterados) | persegue o jogador | 3,2 | 20 | 0,45 | 8 | 1 | 0,4 / 0,25 |
| **Rato de Entulho** | rusher frágil | persegue (mesma IA do Cone, stats diferentes) | 5,0 | 6 | 0,35 | 5 | 1 | 0,3 / 0,2 |
| **Britadeira Desgovernada** | tanque lento | persegue (mesma IA do Cone, stats diferentes) | 1,8 | 90 | 0,7 | 18 | 6 | 0,6 / 0,35 |
| **Pombo de Obra** | atravessador em linha reta | voa reto (único padrão de movimento novo) | 7,0 | 12 | 0,4 | 10 | 2 | 0,4 / 0,2 |

Racional por tipo:

- **Cone Revoltado**: o mapa já é "cones de trânsito por todo lado" — o inimigo onipresente
  SER o cone é a piada mais barata possível; zero mudança de stat ou regra.
- **Rato de Entulho**: morre para **1 acerto de qualquer habilidade base** (HP 6 ≤ pulso 6,
  carta 7, mordida 10) — é pressão de movimento, não de vida: chega antes e força o jogador a
  andar. XP 1 (morre fácil).
- **Britadeira Desgovernada**: 90 HP = 9 mordidas base (7,2 s de atenção da capivara), ~7
  passadas de carta, 15 pulsos de fumaça (mas apanha junto com o bolo). Dano 18 por pancada
  (quase 1/5 do HP base) + corpo largo (raio 0,7) que atrapalha rota. XP **6** — o prêmio
  justifica o investimento.
- **Pombo de Obra**: no spawn, mira a **posição do jogador naquele instante** e voa **reto**
  a 7,0 u/s (jogador anda a 8 — esquiva lateral resolve); **não vira nunca**. Pune ficar
  parado — pressão direta sobre o "segurar posição" do churrasqueiro: o plano dele passa a ter
  custo. Elegível como alvo das habilidades como qualquer vivo; dano de contato normal
  (i-frames valem). **Despawn silencioso, sem orbe de XP**, ao passar de **40 u do centro** ou
  após **15 s** de voo (teto de segurança); morto pelo jogador, deixa XP 2 normal.

**Cronograma de spawn** *(valores: hipótese)* — pesos por faixa de tempo da partida; o tipo é
sorteado **a cada spawn** com estes pesos (a taxa TOTAL vem da Curva de dificuldade; os pesos
só dividem o total). Transição de faixa é instantânea no timestamp — sem interpolação, mais
barato e imperceptível no caos:

| Faixa | Cone | Rato | Britadeira | Pombo |
|---|---|---|---|---|
| 0:00–1:00 | 100% | — | — | — |
| 1:00–2:30 | 75% | 25% | — | — |
| 2:30–4:00 | 55% | 30% | 15% | — |
| 4:00–6:00 | 40% | 30% | 20% | 10% |
| 6:00+ | 30% | 30% | 25% | 15% |

Casos de borda:

- Teto de 600 vale para a **soma** de todos os tipos; spawn adiado como hoje, seja qual for o
  tipo sorteado.
- Knockback (Rodo) empurra qualquer tipo; o Pombo desloca mas mantém a direção de voo (regra na
  seção das melhorias novas).
- Capacete aplica sobre o dano de contato do tipo, com piso 1 (tabela de dano pós-armor na
  seção das melhorias novas).

**Custo:** Rato e Britadeira são linhas de tabela + o suporte único a tipos no pool (índice de
tipo por inimigo — trabalho de engenharia que os três compartilham) + 2 modelos de primitivas
(+1 `InstancedMesh` por tipo no render). O **Pombo é o único com IA nova** (voo reto + regra de
despawn) — é o **corte natural** se a leva apertar: a versão mais barata da frente é Rato +
Britadeira.

**Descartados nesta rodada (registro):** "cone possuído" como tipo NOVO (o cone virou o básico
batizado); "operário de britadeira" (humor em pessoas não — a britadeira desgovernada sozinha
carrega a piada e respeita as diretrizes de tema); um 4º tipo novo nesta leva.

**O que torna dispensável:** escalada de HP por tempo nesta leva (mix + taxa entregam a curva);
elites e chefes nesta leva; "variedade de inimigos" como item futuro vago.

**Como saber se funcionou:**

- Identificação de relance: em playtest, o jogador nomeia a função dos 4 tipos sem ajuda após
  1 run ("esse é rápido", "esse aguenta", "esse atravessa").
- O Pombo pune parados: na sim, **no cenário sem contato** (ver Curva de dificuldade — com
  contato ligado o bot morre aos ~17–70 s e o Pombo só entra aos 4 min, não medível lá), acerta
  o bot idle **≥ 1×/min** nas faixas em que spawna e o bot orbit **< 0,2×/min**.
- A Britadeira muda rota (observação: o jogador contorna ou deixa por último, em vez de tratar
  igual ao Cone).
- O mix novo não dispara o XP: **level-ups aos 5 min ≤ 16**, medidos **no cenário sem contato**
  (com contato ligado nenhum bot chega aos 5 min); acima disso, recalibrar `xpValue` ou
  `baseToNext` em rodada com números — não antes.

## Inimigos — Feira de Domingo *(novo em 2026-11-19; comportamento: decidido para a leva; valores: hipótese)*

**O que o jogador faz:** o mesmo jogo de prioridades da avenida, com um verbo novo — **desviar
no tempo certo** da investida do Carrinho (telegraph de 0,9 s parado mirando, depois arrancada
reta). **Por que é outro mapa de verdade:** a fauna é 100% própria (cronograma do mapa) e
aperta mais cedo — o Carrinho entra aos 45 s.

Teto global de vivos (600) e anel de spawn (24–32 u) compartilhados, como na avenida.

| Tipo | Papel tático | Comportamento | Vel. (u/s) | HP | Raio (u) | Dano de contato | XP | Spawn/Dying (s) |
|---|---|---|---|---|---|---|---|---|
| **Galinha de Quintal** | rusher em bando | persegue (IA do Cone, stats diferentes) | 5,4 | 6 | 0,35 | 5 | 1 | 0,3 / 0,2 |
| **Carrinho de Feira Desembestado** | investida telegrafada | **investida** (padrão novo): para 0,9 s re-mirando o jogador, arranca reto por 1,2 s | 9,5 (na arrancada) | 35 | 0,5 | 14 | 3 | 0,5 / 0,3 |
| **Abacaxi Casca-Grossa** | tanque | persegue (IA do Cone, stats diferentes) | 1,6 | 110 | 0,75 | 20 | 7 | 0,6 / 0,35 |
| **Maritaca Tagarela** | atravessadora | voa reto (regra do Pombo; despawn silencioso a 40 u afastando-se ou 13 s) | 8,0 | 10 | 0,4 | 9 | 2 | 0,35 / 0,2 |

Racional por tipo:

- **Galinha**: o rusher da feira — mais rápida que o Rato e dominante nos pesos: a pressão da
  feira é numérica e vem cedo.
- **Carrinho**: o único padrão de movimento novo da leva. Durante o **windup** fica parado
  re-mirando (o corpo encara o jogador — telegraph legível); na **arrancada** a direção congela
  (mover-se depois que ele arrancou é a esquiva). Knockback desloca sem mudar a direção da
  arrancada (regra do Pombo); a arrancada **clampa na borda** da arena. Pune ficar parado E
  andar sem olhar.
- **Abacaxi**: tanque acima da Britadeira (110 HP, dano 20) — a feira é o mapa "mais difícil
  mais cedo". XP 7 paga o investimento.
- **Maritaca**: flyby mais rápida que o Pombo (8,0 vs 7,0) — a esquiva lateral precisa ser mais
  esperta; mesmas regras de despawn silencioso sem XP.

**Cronograma de spawn da feira** *(valores: hipótese; vive no `MapDef.spawnSchedule`)*:

| Faixa | Galinha | Carrinho | Abacaxi | Maritaca |
|---|---|---|---|---|
| 0:00–0:45 | 100% | — | — | — |
| 0:45–2:00 | 70% | 30% | — | — |
| 2:00–3:30 | 50% | 30% | 20% | — |
| 3:30–5:30 | 35% | 30% | 20% | 15% |
| 5:30+ | 25% | 30% | 25% | 20% |

**Como saber se funcionou:** o jogador descreve a esquiva do Carrinho sem ajuda após 1 run
("ele trava, mira e vem — sai da frente"); a feira MATA mais cedo que a avenida no playtest
(fases antecipadas + tanque maior); nenhum Carrinho preso vibrando na borda (o clamp segura).

## Curva de dificuldade *(novo em 2026-11-18; direção: decidida; números: hipótese a simular)*

**Direção: mais difícil, com começo um pouco mais quente.** Evidência: no jogo normal
(1,5/s + 3/min) o começo é morno e o fim não mata ninguém competente — e o padrão do gênero é
começo acessível, aperto crescente e **morte quase certa** num horizonte alvo. A dificuldade
nova vem de **duas alavancas novas** (mix de tipos por tempo + taxa de spawn) — **sem mexer**
em dano/HP dos kits dos personagens, fechados em 2026-11-18.

**Horizonte de sobrevivência alvo** *(decidido como meta de design da v1)*: jogador mediano
morre entre **4 e 6 min**; morte quase certa **até 8 min** para qualquer um. (Duração de run e
condição de vitória seguem em aberto; até lá, a morte no horizonte é o fim desenhado da run e o
placar é o tempo.)

Curva de spawn nova *(hipótese)*:

| Parâmetro | Atual | Novo |
|---|---|---|
| `spawn.baseRatePerSec` | 1,5 | **2,0** |
| `spawn.rateGrowthPerMinute` | 3,0 | **4,5** |

Âncora de design: aos 5 min a taxa chega a 2,0 + 4,5×5 = **24,5/s** — praticamente o cenário de
estresse (25/s) em que os kits de área saturam e a capivara afoga. **O minuto 5 do jogo normal É
o estresse**: é ali que a run deve estar decidida. Demais parâmetros (anel 24–32 u, teto 600,
tabela de XP) ficam como estão; quando a oferta passa a capacidade de matar, a pressão final vem
da densidade, não de spawn infinito — o teto de 600 segura o custo.

**Proteção das métricas fechadas de 2026-11-18** *(decidido)*: o cenário de balanceamento do
trio (spawn 25, seed 42, 3 min, teto 600) fica **congelado como está, com mix fixo de 100% Cone
Revoltado** — identidade, saturação e piso continuam medidos nele, intocados. A curva de
dificuldade é **camada separada**, medida em cenário próprio: curva nova + cronograma de mix +
**dano de contato LIGADO** (o cenário do trio o neutraliza; este não).

**Veredito pós-medição** *(2026-11-18, mesma data — recalibração sobre a medição do
`systems-engineer`)*: as três faixas de bot da primeira versão desta seção falharam por larga
margem (idle 17,1 s vs 45–90 s; orbit 70,2 s vs 3–8 min; kits de área morrendo junto da
capivara) — e a decomposição mostra que **quem governa a morte do bot é o modelo de contato,
não o spawn**: ~7,9 s até o 1º contato (anel 24 u ÷ Cone a 3,2 u/s) + ~7,5 s engolfado
(100 HP ÷ (8 de dano ÷ 0,6 s de i-frames) ≈ 13,3 HP/s). Com a curva antiga dá quase o mesmo —
a faixa 45–90 s nunca foi alcançável. Decisão de design:

- **O modelo de contato FICA** (i-frames 0,6 s, dano por tipo, HP 100). Morrer engolfado em
  ~7,5 s é a sensação certa do gênero — tempo de pânico e fuga, não de almoço — e mexer nele
  agora, sem nenhuma jogada humana, recalibraria às cegas tudo que foi desenhado sobre ele
  (Capa, Capacete, o risco do churrasqueiro). **Alavanca registrada**: se o playtest humano
  disser "começo punitivo demais", o ajuste é no modelo de contato — fórmula do engolfado:
  `tempo = HP ÷ (contactDamage ÷ i-frames)` — com 1 rodada de re-medição; **não** é a curva
  de spawn.
- **As faixas de bot viram guardas de regressão, recalibradas para o medido** — o bot é proxy
  fraco declarado: o idle é um jogador degenerado, e o orbit fecha o círculo sobre o próprio
  rastro a cada ~17 s (kiting humano em espiral aberta dura mais). **O critério que decide a
  curva passa a ser humano** (hipótese de playtest abaixo).
- **A curva de spawn nova (2,0 + 4,5/min) fica**: o começo é governado pelo contato, mas o
  meio e o fim são governados pela densidade — a âncora "minuto 5 ≈ estresse" continua de pé.

**Guardas de regressão** (simulação headless, seed 42, curva e mix novos, contato ligado —
faixas largas de propósito; medido em 2026-11-18):

- Bot **idle** (capivara) morre entre **10 e 30 s** *(medido: 17,1 s)* — guarda do "1º contato
  + engolfado"; fora da faixa, mudou o anel, a velocidade do Cone ou o modelo de contato.
- Bot **orbit** (capivara, melhor raio) morre entre **45 e 120 s** *(medido: 70,2 s)*.
- Os **três personagens** no orbit caem na **mesma faixa 45–120 s** *(medido: ~70 s os três)* —
  a morte do bot é dominada pelo contato, não pela vazão do kit; um kit fugindo muito da faixa
  é achado a investigar, não meta.

**Cenário extra sem contato** *(decidido — cobre os critérios que a morte precoce do bot
esconde)*: bot **imortal** (contato neutralizado, como no cenário do trio), curva + mix novos,
**7 min**, seed 42. Mede: Pombo acerta o bot idle **≥ 1×/min** nas faixas em que spawna e o
orbit **< 0,2×/min**; **level-ups aos 5 min ≤ 16**. É 1 cenário headless barato; adiar isso
para playtest deixaria o ritmo de XP sem guarda nenhuma até lá.

**Critério principal** *(hipótese de playtest humano — é quem decide a curva)*: jogador mediano
morre entre **4 e 6 min**, morte quase certa até 8, e a morte lê como "errei/afoguei", nunca
"morri do nada". O começo deve ler "quente mas escapável": parado e engolfado mata em ~7,5 s,
mas andar resolve os 2 primeiros minutos.

Nota de risco cruzado: o horizonte da **capivara** pode ficar abaixo dos 4–6 min — o risco alto
dela já está registrado na seção própria; o critério dela (sobrevivência ≥ 75% do melhor do
trio) passa a ser medido **na curva nova**.

**O que torna dispensável:** condição de vitória na v1 (a morte no horizonte é o fim desenhado);
escalada de HP por tempo (ver Inimigos); qualquer "modo difícil" separado nesta fase.

## Áudio v1 — som de hit *(novo em 2026-11-18; caráter: decidido; arquitetura: do tech-lead)*

Todo o áudio nasce como a arte: **sintetizado por código (WebAudio), tosco de propósito, zero
assets externos**. Esta leva especifica só o **som de hit no inimigo**; a arquitetura (vozes,
mixagem, ponto de escuta dos eventos) é definição do `tech-lead`.

**Caráter do hit** — um **"toc" de tábua de obra**: percussivo, curto (**40–80 ms**), ataque
imediato (< 5 ms) e decaimento exponencial; corpo de oscilador triangular com fundamental
sorteada em **180–240 Hz por hit** (≈ ±15% de pitch) + um estalo de ruído branco de ~10 ms no
ataque. **Seco**: sem reverb, sem delay — combina com o resto do jank.

Regras *(decididas como design; números de síntese são hipótese de ouvido)*:

- **Variação anti-enjoo** (20 hits/s é o caso normal no meio da run): pitch sorteado por hit na
  faixa acima e ganho ±20%; se o pitch sair a menos de 3% do anterior, re-sorteia uma vez
  (nunca dois tocs seguidos idênticos).
- **Agregação por ativação** *(regra de design, inegociável)*: **1 som por ativação de
  habilidade por tick, nunca 1 por inimigo** — pulso de fumaça com 15 atingidos = 1 toc; carta
  varando 4 num tick = 1 toc. Com **3+ atingidos**, o toc desce ~30% de pitch e sobe +25% de
  ganho: "acertei o bolo" vira um som mais gordo, não uma metralhadora.
- **Crítico (Dado Viciado)**: mesmo toc com **−25% de pitch e +30% de ganho** — é o feedback
  principal do crítico na v1 (nenhum VFX novo).
- **Teto global: 10 sons de hit/s**; excedentes são **descartados**, nunca enfileirados (som
  atrasado é pior que som ausente).
- Pausa do Panfleto / morte: a sim congelada não gera eventos, então nenhum hit novo toca; o
  que já soa termina o decay naturalmente.
- Volume: **sem controle na v1** (o escopo das Configurações segue em aberto — volume é o
  candidato óbvio de lá); ganho master conservador, calibrado de ouvido.

**Backlog de sons** (1 linha, sem especificação — leva futura): morte de inimigo, level-up /
entrada do panfleto, dano no jogador, coleta de orbe, clique de UI.

**O que torna dispensável:** assets de áudio externos; VFX dedicado de crítico (o som cobre).

**Como saber se funcionou:** ouvir 30 s de estresse (spawn 25) sem fadiga — se virar serra
elétrica, baixar o teto ou alargar a faixa de pitch; de olhos fechados dá para distinguir hit
único × pulso no bolo × crítico.

## Meta-progressão: "Loja de Talentos" *(novo em 2026-11-19; formato: decidido; custos e valores: hipótese)*

Referência direta: PowerUps do Vampire Survivors. Primeira progressão ENTRE runs do jogo.

- **Moeda: banana.** Cada abate rende 1 banana (`gameData.bananas.perKill`), contada na HUD
  durante a run e creditada no cofre UMA vez, no fim da run (tela de morte mostra o ganho).
  O cofre persiste em localStorage (`bronk.meta.v1`) — sem backend na POC.
- **Loja no menu principal:** botão LOJA DE TALENTOS (atalho 2) na tela de início, no mesmo
  mural de cartazes das outras telas. Cada talento é um cartaz com ícone, efeito por nível,
  pips de nível (●●○○○) e o preço do próximo nível; sem saldo ou esgotado, o clique dá o
  feedback de negado padrão. Esc/Voltar retornam ao início.
- **Talentos são bônus permanentes e genéricos** (valem para qualquer personagem), aplicados
  na MESMA fórmula linear das melhorias da run: percentual/absoluto somados sobre o valor
  base do stat, antes do clamp (o piso/teto mais apertado entre melhorias e talentos vence).
  Comprar não tem volta na v1 (sem reembolso).
- **Tabela v1 (8 talentos; custos crescentes por nível — valores: hipótese):** Feijoada
  Completa (+5% dano ×5), Casca Grossa (+10 HP ×3), Tênis de Camelô (+4% velocidade ×3),
  Despertador Velho (−5% recarga ×3, piso 0,35 s compartilhado com o Café), Chá da Vizinha
  (+0,2 HP/s ×2), Bolso Fundo (+20% ímã ×2), Crachá de Esforçado (+10% XP ×3), Pé de Coelho
  Falsificado (+2% crítico ×3).

### Como saber se funcionou

- Jogador que morre cedo sente que "sobrou alguma coisa" da run (o crédito aparece na morte).
- Os primeiros talentos saem em 1–3 runs; esvaziar a loja leva muitas (calibrar custos com
  bananas/run medidas pelo systems-engineer).
- Nenhum talento quebra as réguas de identidade do trio (os percentuais são menores que os
  das melhorias de dentro da run de propósito).

## Conquistas *(novo em 2026-11-19; formato: decidido; números: hipótese)*

**O que o jogador faz:** nada de novo — joga; as conquistas reconhecem o que ele já fez.
**O que ganha:** o carimbo FEITO! no mural **e um prêmio em bananas**, creditado uma única vez
no desbloqueio. **Por que importa:** o prêmio amarra conquista → loja → talento — jogar bem
acelera a meta-progressão (promovida da mecânica candidata de 2026-11-18, que era "sem bônus";
o prêmio em moeda entra junto com a economia de bananas e não dá poder direto).

- **25 conquistas na v1**, em 6 grupos: primeiros passos (jogar runs), combate (abates por run
  e acumulados, caças por tipo — Pombo, Britadeira, Galinha, Carrinho), sobrevivência (5/10
  min, nível 10/20, e a **Rapidinha**: morrer em menos de 30 s — rir da derrota é tema do
  jogo), meta-progressão (compras na loja, bananas acumuladas), elenco (3 personagens, 2
  mapas) e álbum (1ª figurinha, 8 bichos, 1 set completo).
- **Quando avalia:** no fim de CADA run (morte ou desistência) e em cada compra da loja.
  Desistir conta como run jogada; a Rapidinha exige **morrer** de verdade.
- **Onde aparece:** tela CONQUISTAS no menu (mural de cartazes: desbloqueado = papel vivo +
  FEITO! + "prêmio recebido"; trancado = papel desbotado com a meta e o prêmio à vista — a
  conquista é um contrato legível, não surpresa escondida) e o fim de run anuncia cada
  desbloqueio da run ("🏆 Conquista: … (+N 🍌)").
- **Condições são dado** (tabela `data.achievements`), não código solto: validadas no boot,
  avaliadas por função pura, testáveis sem UI.

**Como saber se funcionou:** nas 3 primeiras runs o jogador desbloqueia 3+ conquistas (o começo
do mural anda rápido de propósito); os prêmios encurtam visivelmente o caminho até o 1º talento;
ninguém pergunta "o que essa conquista queria" (descrição = meta).

## Meta-progressão: Álbum de Figurinhas *(novo em 2026-11-19; formato: decidido; números: hipótese)*

**O que o jogador faz:** abate inimigos, como sempre — cada abate tem **4% de chance** de
dropar a **figurinha daquele tipo** (creditada na hora, sem item no chão para catar no caos).
**O que ganha:** cópias acumulam no cofre e, ao bater os degraus, dão **bônus de dano contra
aquele tipo**. **Por que repete:** conhecer o bicho é bater mais forte nele — o álbum
transforma o grind natural do gênero em progressão legível e dá motivo para revisitar mapas
(as figurinhas da feira só caem na feira, porque a fauna é do mapa).

- **Degraus** *(valores: hipótese)*: 1 cópia → **+5%**, 5 → **+10%**, 15 → **+20%**, 40 →
  **+35%** de dano contra o tipo. O **maior degrau vale** (não soma); "COMPLETO!" no último.
- O bônus multiplica o dano de habilidade **depois do crítico**, só contra o tipo da figurinha;
  congelado na criação do mundo (como os talentos — o álbum só cresce no fim da run).
- A figurinha usa nome/ícone do próprio bestiário; a tela ÁLBUM mostra cópias, bônus atual e
  "faltam K pra +X%"; tipo nunca dropado aparece desbotado com "???" no lugar do ícone
  (mistério de álbum de banca). A HUD mostra "🃏 N" quando a 1ª figurinha da run cai.
- Drop por abate real: despawn silencioso (Pombo/Maritaca fugindo) não dropa.

**Como saber se funcionou:** em ~3 runs o jogador tem o 1º degrau de 2–3 tipos e NOTA o bicho
morrendo mais rápido; jogadores escolhem mapa também pela figurinha que falta; a chance de 4%
não vira ruído (se ninguém perceber drops, subir a chance ou dar feedback mais forte — medir
antes de mexer).

## Mecânicas candidatas

| Mecânica | Resumo | Estado |
|---|---|---|
| Gambiarra | Fundir dois itens quaisquer numa arma improvisada, no lugar de evoluções fixas | hipótese |
| Dívida | Inimigos-boleto não dão dano: cobram juros sobre a renda até você pagar num ponto do mapa; empréstimo dá poder imediato e atrai um cobrador de elite | hipótese |
| A run é um dia | Manhã de trânsito, chuva de verão que alaga as partes baixas, noite de festa; o chefe final é a Segunda-feira | hipótese |
| Perigos da cidade | Ônibus que cruza a avenida e atropela tudo, buracos, ladeiras que dão embalo | hipótese |
| Companheiro | Vira-lata resgatado que sobe de nível e busca itens distantes | hipótese |
| Objetivo por personagem | Cada personagem tem uma tarefa própria na run, para forçar o deslocamento pelo mapa | hipótese |

**Promovidas em 2026-11-19** (saíram desta tabela para seções próprias): **Álbum de
figurinhas** (virou "Meta-progressão: Álbum de Figurinhas" — drop por abate + bônus por tipo,
em vez dos pacotinhos/páginas da hipótese) e **Conquistas** (virou a seção "Conquistas" — a
hipótese era sem bônus; a versão promovida premia em bananas). Os botões CONQUISTAS e ÁLBUM da
tela de início saíram do "EM BREVE" junto.

Descartado: escolha de melhorias em formato de buffet por quilo.

## Diretrizes de tema

- Humor sobre situações e objetos do cotidiano, não sobre grupos de pessoas.
- Sem marcas reais, personagens ou nomes de terceiros.

## Em aberto

- **Nome final do jogo** (a tela de início usa o título de trabalho "BRonk"). *(novo em 2026-11-17)*
- **Escopo das Configurações** (volume? remapear teclas? resolução?): o botão existe desabilitado
  na tela de início; o que ele abrirá é decisão futura. Com o áudio entrando (seção Áudio v1),
  **volume é o candidato óbvio** do escopo. *(novo em 2026-11-18; anotado na leva do som)*
- **Payload real do Pix da caixinha do dev**: o autor fornece (DECISIONS 2026-11-18 — nunca
  CPF/telefone/e-mail, o QR fica público); até lá, placeholder "EM BREVE". *(novo em 2026-11-18)*
- Duração da run e condição de vitória.
- Progressão entre runs além de loja, conquistas e álbum (todas na v1 desde 2026-11-19;
  reembolso/reset de talentos e exibir o saldo de bananas fora da loja ficam em aberto).
- **Feedback de drop de figurinha dentro da run** (toast? som próprio?): hoje é só o contador
  🃏 na HUD e o resumo no fim de run. *(novo em 2026-11-19)*
- **Toast de conquista dentro da run**: hoje o anúncio vive no fim de run. *(novo em 2026-11-19)*
- Modelo de negócio e onde publicar.
- Conta e ranking: necessários na primeira versão?

## Registro de mudanças

### 2026-11-19 — fechamento da V0: Feira de Domingo + conquistas + álbum (sistemas afetados, para o orquestrador redistribuir)

- **Mapa 2 jogável**: Feira de Domingo, com cenário próprio (terra batida + barracas) e
  **bestiário 100% próprio** (nova seção "Inimigos — Feira de Domingo": Galinha, Carrinho com o
  comportamento novo `investida`, Abacaxi, Maritaca). O cronograma de spawn virou **dado do
  mapa** (`MapDef.spawnSchedule`); a seleção de mapa agora tem 2 liberados + 2 EM BREVE, no
  modelo da seleção de personagem.
- **Conquistas** (nova seção): 25, condições declarativas como dado, prêmio em bananas no
  desbloqueio, tela CONQUISTAS funcional (atalho 4), anúncio no fim de run.
- **Álbum de Figurinhas** (nova seção): 4% de drop por abate no RNG próprio da sim, cópias
  persistidas, degraus 1/5/15/40 → +5/10/20/35% de dano contra o tipo, tela ÁLBUM funcional
  (atalho 5), contador 🃏 na HUD e no fim de run.
- **Sistemas:** sim ganha `kills`/`killsByType`/`cardsEarned`/`albumDamageMult`/`dropRng` e o
  caso `investida` na IA; cofre (`metaStore`) ganha álbum, conquistas, estatísticas de vida e
  `recordRun` (fechamento único da run — bananas, figurinhas, desbloqueios); tabela ganha
  `data.album`/`data.achievements` e `EnemyTypeDef.icon`; só CONFIGURAÇÕES segue EM BREVE no
  menu.

### 2026-11-19 — menu de pausa na run (sistemas afetados, para o orquestrador redistribuir)

- **Nova seção** "Menu de pausa" no fluxo de telas: Esc/P congela a sim e mostra o build atual
  (habilidade efetiva, passivas com stacks, talentos) + Continuar / Configurações (EM BREVE) /
  Finalizar run / Sair pro menu principal.
- **Sistemas:** gameLoop ganha pausa externa (`isPaused`); sim ganha `abandonRun` (gameOver por
  desistência, sem evento de morte); "Sair pro menu principal" credita bananas e abre a tela de
  início (o "Menu" pós-morte segue indo à seleção de personagem).

### 2026-11-19 — meta-progressão "Loja de Talentos" + bananas (sistemas afetados, para o orquestrador redistribuir)

- **Nova seção** "Meta-progressão: Loja de Talentos": 1 banana por abate, cofre persistido em
  localStorage, loja no menu principal com 8 talentos permanentes na fórmula linear das
  melhorias. Custos e valores: hipótese a calibrar com bananas/run medidas.
- **Tela de início:** botão novo LOJA DE TALENTOS (atalho 2, funcional); CONFIGURAÇÕES,
  CONQUISTAS e ÁLBUM descem para 3–5, seguem "EM BREVE".
- **Sistemas:** sim conta `bananasEarned` (abate via habilidade); `data.talents` +
  `data.bananas` novos na tabela; `MatchSelection.talentRanks` entra na criação do mundo;
  HUD mostra as bananas da run; tela de morte mostra o crédito.

### 2026-11-18 — veredito pós-medição da curva de dificuldade (recalibração; sistemas afetados, para o orquestrador redistribuir)

A medição do `systems-engineer` (idle 17,1 s; orbit 70,2 s; kits de área junto; estável nas
seeds 7/42/123) derrubou as três faixas de bot da seção Curva de dificuldade e expôs a causa:
**o modelo de contato governa a morte do bot, não o spawn** (1º contato ~7,9 s + engolfado
~7,5 s = `HP ÷ (contactDamage ÷ i-frames)`; a curva antiga dá quase o mesmo).

- **Decisão (a) — faixas recalibradas para o medido e rebaixadas a guardas de regressão**:
  idle 10–30 s; orbit 45–120 s; os três personagens na mesma faixa de orbit. Bot declarado
  proxy fraco (idle é jogador degenerado; orbit fecha o círculo sobre o próprio rastro).
  O critério que decide a curva passa a ser o **playtest humano** (mediano morre em 4–6 min).
- **Decisão (b) — modelo de contato NÃO muda** (i-frames 0,6 s / dano por tipo / HP 100):
  ~7,5 s engolfado é a sensação certa do gênero, e mexer nele sem jogada humana recalibraria
  às cegas Capa, Capacete e o risco do churrasqueiro. Alavanca registrada na seção para o caso
  de o playtest reprovar o começo (1 rodada de re-medição se puxada). A curva de spawn nova
  (2,0 + 4,5/min) fica.
- **Decisão (c) — cenário extra SEM contato aprovado** (bot imortal, curva + mix novos, 7 min,
  seed 42) para os critérios que a morte precoce esconde: Pombo ≥ 1×/min no idle e < 0,2×/min
  no orbit; level-ups aos 5 min ≤ 16. Critérios anotados também na seção Inimigos.
- **Decisão (d) — absolutos do trio atualizados com causa anotada** (nota de re-medição na
  seção): pool de panfletos 8 → 12 + um `rng.next()` extra por spawn mudam trajetórias com a
  mesma seed; réguas todas seguem passando (identidades 5%/99%/16,2; saturação ~94%; piso 92%;
  capivara 32 kills). Entradas históricas do registro não foram reescritas.
- **Afeta:** `systems-engineer` (cenário sem contato novo + apertar os testes `// MEDIDO vs
  GDD:` às guardas novas — os medidos cabem nelas: 17,1 ∈ 10–30 s, 70,2 ∈ 45–120 s).
  **Nenhum número de tabela de jogo muda; zero código de jogo.**

### 2026-11-18 — leva "passivas + inimigos da obra + curva de dificuldade + som de hit" (sistemas afetados, para o orquestrador redistribuir)

Quatro frentes especificadas; todos os valores novos são **hipótese** — o `systems-engineer`
simula e devolve, e o GDD ajusta.

- **4 melhorias novas** (Capacete de Obra Emprestado −2 dano de contato com piso 1, Soro Caseiro
  +0,5 HP/s, Dado Viciado +15% crit ×2, Rodo de Enchente +0,5 u de knockback por acerto), com
  **4 `UpgradeStatId` novos** (`player.contactArmor`, `player.hpRegen`, `ability.critChance`,
  `ability.knockback`), todos derivados de base 0 (padrão do `xp.gainMultiplier`). Afeta:
  `data` (4 entradas em `upgrades.ts` + ids novos), `sim` (armor no dano de contato com piso 1;
  regen por tick; rolagem de crit com o RNG injetado; deslocamento de knockback com clamp na
  arena — **cada regra nova pede teste**), `tech-lead` (onde mora a base dos stats derivados).
  Descartados com registro: orbes explosivos (caro + invade a área do churrasqueiro) e espinhos
  de contato (premia levar pancada).
- **Inimigos viram tabela de tipos** — básico batizado **Cone Revoltado** (stats inalterados) +
  **Rato de Entulho** (rusher frágil), **Britadeira Desgovernada** (tanque) e **Pombo de Obra**
  (voo em linha reta, único padrão novo; corte natural se a leva apertar), com **cronograma de
  pesos de spawn por faixa de tempo** (tabela na seção Inimigos). Afeta: `data` (lista de tipos
  + tabela de pesos), `sim` (índice de tipo no pool de inimigos; sorteio ponderado por faixa;
  IA de voo reto + despawn do pombo — pede teste), `render` (3 modelos de primitivas; +1
  `InstancedMesh` por tipo).
- **Curva de dificuldade: mais difícil** — `baseRatePerSec` 1,5 → **2,0**;
  `rateGrowthPerMinute` 3,0 → **4,5** (minuto 5 ≈ cenário de estresse). Horizonte alvo: jogador
  mediano morre em **4–6 min**, morte quase certa até 8. **Cenário de balanceamento do trio
  congelado** (mix 100% Cone + curva antiga) — as métricas fechadas de 2026-11-18 não mudam; a
  dificuldade é camada separada com critérios próprios (bot idle morre em 45–90 s; bot orbit
  ≥ 3 min e ≤ 8 min; contato ligado). Afeta: `data` (2 números do spawn),
  `systems-engineer` (cenário novo de dificuldade + re-medição dos critérios de bots; o teste
  de balanceamento do trio **não muda** — só ganha o mix fixo declarado).
- **Som de hit especificado em caráter** (toc de tábua 40–80 ms, pitch aleatório ±15%, 1 som
  por ativação/tick — nunca 1 por inimigo —, teto 10 sons/s, crítico mais grave e mais forte).
  Arquitetura de áudio (WebAudio, vozes, mixagem): definição do `tech-lead`. Afeta: domínio
  novo de apresentação (fronteira 3 do TECH), **zero sim**. Backlog de sons futuros registrado
  sem especificação.
- **O que a leva torna dispensável:** cura por drop no chão; escalada de HP por tempo; elites e
  chefes nesta leva; condição de vitória na v1; o "Entregador de gás" como pré-requisito do
  knockback; VFX dedicado de crítico; assets externos de áudio.

### 2026-11-18 — reconciliação pós-revisão de código: matemática dos tetos + morte/pulso (só documento; nada a redistribuir)

O código e os testes estavam certos; o GDD estava errado. Nenhuma mudança de comportamento.

- **Tetos recalculados com a regra implementada (linear aditiva, `base × (1 ± % × stacks)`)** —
  os casos de borda usavam composição multiplicativa (`base × fator^stacks`): Café do
  churrasqueiro 0,60 → **0,52 s**; Bocão do churrasqueiro 4,15 → **3,6 u**; Pimenta do
  churrasqueiro 18,3 → **13,5**; Café do carteiro 0,72 → **0,62 s**; Bocão do carteiro (achado
  extra, mesmo vício) 14,5 → **12,6 u**; "Pimenta no teto 24,4" do registro da rodada de
  fechamento (achado extra) → **18**. Regra de empilhamento registrada em "Melhorias iniciais"
  para não reincidir.
- **Redação "morte e pulso no mesmo tick" corrigida**: na ordem fixa do tick a habilidade roda
  antes do dano de contato, então no tick da morte o pulso/mordida/carta **ainda resolve**; o que
  a morte veta é a tela de escolha (regra existente do Panfleto). Mudar a ordem quebraria o
  determinismo (TECH: gameOver congela tudo, sem casos especiais). Linha da morte do carteiro
  alinhada à mesma redação.

### 2026-11-18 — fechamento do balanceamento do trio (rodada final; sistemas afetados, para o orquestrador redistribuir)

Rodada de fechamento sobre a medição do `systems-engineer` com a mordida de alvo único já
implementada e testada (estresse: spawn 25, seed 42, 3 min, teto do pool 600). Identidades dos
três passam com folga na horda padrão (capivara 5% de cooldown ocioso, carteiro 99% de
arremessos com 2+ acertos, churrasqueiro 8,1 inimigos/pulso).

- **Decisão A — capivara segue alvo único puro, sem compensação de regra.** Sob estresse ela
  abate ~2% da oferta (107 kills vs ~5.000 de cada kit de área) — gap estrutural (1 kill por
  cooldown), não de número; a decisão estrutural da rodada anterior fica de pé. Registrada como
  **hipótese de risco alto** na seção dela, com critério de jogada humana (sobrevivência ≥ 75%
  do melhor do trio + "justa cercada") e fallback desenhado ("mordida e rabanada": até 2 alvos)
  que só entra se o playtest reprovar — e aí é rodada nova de design + sim. Afeta: nada agora.
- **Decisão B — faixas de vazão em % da capivara aposentadas** (viraram ~4.700%: medem taxa de
  spawn de novo). Vazão vira **saturação da oferta** (≥ 90% para os dois kits de área; medido
  ~94% cada) e a **identidade por ativação é promovida a métrica primária**. A ordem
  churrasqueiro > carteiro na sim é aposentada (ruído de ±0,1%; o sinal inverteu entre dano 6 e
  8) e vira hipótese de jogo humano. Afeta: só documento.
- **Decisão C — dano do pulso do churrasqueiro volta de 8 para 6.** O 8 só se sustentava no
  ruído da ordenação e desalinhava as réguas internas (alvo único 64% em vez de 48%, empate na
  nuvem ~1,6, Pimenta no teto 18 — era "24,4", vício multiplicativo corrigido em 2026-11-18).
  Com 6, a seção inteira volta a ser verdadeira sem reescrita.
  **Afeta: `data`** (linha do churrasqueiro: dano do pulso 8 → 6) **e `systems-engineer`**
  (re-medição ÚNICA pós-reversão: identidade ≥ 3 inimigos/pulso na horda padrão e saturação
  ≥ 90% da oferta no estresse — nenhuma rodada além dessa está prescrita).
- **Decisão D — piso de viabilidade redefinido**: DPS na horda padrão ≥ 90% do **teto teórico
  de alvo único do próprio kit** (dano ÷ cooldown; carteiro conta ida+volta). Medido: capivara
  93,6% (passa); kits de área passam com ordens de folga. O piso antigo em % da capivara
  saturou ao contrário (916%/940% — media o teto DELA) e morreu. Afeta: só documento.
- **Decisão E — teto do pool 600 confirmado** como parte declarada do cenário de estresse
  (nenhuma mudança técnica pedida): a população pinada é o próprio critério de "oferta >
  capacidade" satisfeito, e subir o teto só inflaria uma métrica já saturada.
- **O que isso torna dispensável:** rodadas novas de simulação de balanceamento do trio (além
  da re-medição única da decisão C) — o degrau seguinte é jogada humana; a cláusula de ajuste
  "subir o dano do pulso 6 → 8"; e as três réguas percentuais antigas sobre a capivara.

### 2026-11-18 — mordida vira alvo único + métricas de balanceamento novas (sistemas afetados, para o orquestrador redistribuir)

Resolve as duas contradições GDD×código achadas pela simulação do churrasqueiro (evidência do
`systems-engineer`: mordida implementada em área desde a POC vs réguas escritas para alvo único;
faixa de DPS 120–180% inatingível porque a métrica satura em ~100% na horda padrão).

- **Decisão A — mordida é alvo único** (o GDD sempre disse "no inimigo mais próximo"; a POC
  implementou área): 1 inimigo por disparo, o `Chasing` mais próximo no alcance (empate →
  primeiro na ordem do pool). Dano em área ao redor do jogador vira identidade exclusiva do
  churrasqueiro (pilar 2). Afeta: `sim` (`biteAttack.ts` — escolher 1 alvo em vez de varrer o
  raio; regra nova pede teste, incluindo determinismo com seed fixa), `render` (checar se algum
  efeito visual da mordida lê como área — se houver, passa a ler errado), `data` **zero** (os
  valores 10/0,8/2,2 ficam). **Risco a validar jogando:** mudança sensível para quem joga desde
  a POC (a mordida em área limpava bolos).
- **Decisão C — mordida sem alvo não dispara e não gasta cooldown** (segura em 0 e tenta no
  próximo tick), alinhando as 3 habilidades numa única convenção; o texto do churrasqueiro
  ("mesma regra da mordida e das cartas") passa a ser verdadeiro. Afeta: `sim` (mesmo
  arquivo/teste da decisão A).
- **Decisão B — métricas de balanceamento novas** (seção "Balanceamento do trio"): a faixa por
  DPS na horda padrão satura (mede taxa de spawn) e vira **piso de viabilidade** (≥ 90%); a
  métrica primária nova é **kills totais em 3 min sob estresse** (spawn calibrado para a oferta
  superar a capacidade da capivara), com faixas carteiro **120–220%**, churrasqueiro **150–300%**
  e ordem exigida churrasqueiro > carteiro > capivara. Afeta: `systems-engineer` (re-simulação:
  calibrar e fixar o spawn de estresse pelo critério objetivo, medir os três com a mordida de
  alvo único, devolver números); nenhum código de jogo além das decisões A/C.
- **O que isso torna dispensável:** a mordida em área da POC (substituída); a faixa "DPS % na
  horda padrão" como alvo de balanceamento (vira piso); e qualquer mecanismo futuro de limitar
  alvos da fumaça para diferenciá-la da mordida — a diferenciação agora é estrutural (área ×
  alvo único).

### 2026-11-18 — churrasqueiro v1 "Baforada de Fumaça" (sistemas afetados, para o orquestrador redistribuir)

Implementa a decisão de 2026-11-18 do DECISIONS (terceiro personagem: Churrasqueiro).

- **Churrasqueiro v1** especificado em Personagens (comportamento decidido: pulso de área sem
  mira centrado no jogador, a cada `cooldown`, acertando todos os `Chasing` no `raio`; sem
  inimigo no raio não pulsa e o cooldown não gasta; valores hipótese: 6 dano / 1,0 s / 2,0 u;
  stats defensivos iguais aos da capivara). Afeta: `data` (linha nova em `characters.ts` +
  ramo novo `fumaca` na união discriminada `AbilityDef`, com validação de boot do ramo —
  definição do `tech-lead`), `sim` (habilidade `fumaca` nova no despacho do sistema `ability`;
  regra nova pede teste, incluindo determinismo com seed fixa para o terceiro personagem),
  `render` (visual da nuvem/baforada por código + modelo do personagem com o mesh do corpo no
  nome convencionado do harness), `ui` **zero** (cards de seleção vêm da tabela de dados).
- Tabela de personagens: churrasqueiro = **no protótipo** (v1 mínima), com a tagline do card
  fixada: "Baforadas de fumaça ao redor — briga no meio da horda: ser cercado é o plano".
  Anotado que as colunas da tabela são o texto de jogador dos cards.
- Referências cruzadas atualizadas: seleção de personagem agora lista 3 cards; melhorias
  genéricas citam a fumaça; métrica de escolha de personagem recalibrada de 35–65% (2
  personagens) para **20–50%** (3 personagens).
- **O que isso torna dispensável:** dano contínuo com estado (DoT/pareamento nuvem×inimigo) —
  a versão pulsada o substitui; conteúdo de melhoria próprio do personagem (pool único serve);
  e novos personagens nesta fase — o trio de ritmos (média/longa/contato) fecha a tese do
  pilar 2.
- Nenhum item novo em aberto; visual exato da fumaça (leitura do raio no estilo tosco) é
  definição de render, com o requisito de jogador de que a borda da nuvem comunique o alcance.

### 2026-11-18 — tela de início vira menu principal (sistemas afetados, para o orquestrador redistribuir)

Implementa as duas decisões de 2026-11-18 do DECISIONS (menu novo + chave Pix adiada).

- **Tela de início reescrita** (decidido): título "BRonk" + 4 botões (JOGAR funcional →
  seleção de personagem; CONFIGURAÇÕES, CONQUISTAS e ÁLBUM desabilitados "EM BREVE" no mesmo
  padrão visual e de feedback dos slots de mapa bloqueados) + caixinha do dev com QR Pix
  **placeholder não escaneável** carimbado "EM BREVE". Teclado: 1–4 + Enter; Enter/Espaço sem
  seleção ativa JOGAR; Esc sem efeito. Textos fixados na seção. Afeta: `ui`
  (`startScreen.ts` — layout novo, atalhos, feedback de negado reaproveitado do `mapScreen`),
  arte por código (textura de QR falso no padrão das jankTextures). O ponto único de código para
  o payload real do QR é definição do `tech-lead`.
- **O que isso torna dispensável:** o botão "Começar" sai; nenhuma tela nova nesta leva (os 3
  botões desabilitados não abrem nada, e o padrão de negado dos mapas é reaproveitado).
- **Conquistas** entra nas mecânicas candidatas (hipótese, 1 linha); botões CONQUISTAS e ÁLBUM
  ligados às mecânicas candidatas correspondentes — saem do "EM BREVE" só quando a mecânica for
  especificada. Nada a implementar delas nesta leva.
- Novos itens em aberto: escopo das Configurações; payload real do Pix.
- Critério de validação novo no fluxo de telas: a caixinha do Pix não pode atrasar o caminho até
  JOGAR (mesmos tetos de < 15 s / < 6 s).
- Zero mudança em `sim` e `data`; o fluxo a partir do JOGAR é o existente, intocado.

### 2026-11-17 — passe de alinhamento pós-implementação da leva "telas + carteiro" (só documento)

Reconciliação GDD ↔ código no fim da leva. Nenhuma mudança de comportamento pedida — **nada a
redistribuir**; o código já implementa o descrito.

- **"Menu" da tela de morte**: destino alinhado à reconciliação do orquestrador (DECISIONS
  2026-11-17) — leva à **seleção de personagem**, não à tela de início. Rótulos "Jogar de novo"
  e "Menu" confirmados como implementados.
- **Captura da carta**: texto alinhado à regra implementada (soma de raios: ≈ 1,1 u do centro do
  jogador / 0,6 u da borda). **Nova hipótese visual**: a captura pode ler "sumiu antes de chegar
  na mão" — validar jogando antes de criar um raio de captura próprio.
- **Morte com cartas em voo**: "somem" → "o mundo inteiro congela, cartas incluídas" (regra
  implementada; invisível sob o overlay, e mais simples).
- **Card da Avenida em Obras**: texto de jogador fixado sem o prefixo interno "A avenida da POC:".
- **Evidência preliminar de balanceamento**: carteiro ≈ 97% do DPS da capivara em simulação de
  3 min (alvo 90–130%); valores seguem hipótese até jogadas reais.
- **Detalhes visuais anotados como aceitos**: giro da carta continua na pausa do Panfleto
  (enfeite de render; a posição congela com a sim); pisca de i-frames pode deixar o personagem
  invisível por frames inteiros (herdado da capivara), com ajuste barato registrado caso confunda.

### 2026-11-17 — telas + carteiro v1 (sistemas afetados, para o orquestrador redistribuir)

- **Nova seção "Fluxo de telas e estrutura de partida"** (fluxo: decidido). Afeta: `ui` (3 telas
  novas + 2 botões na tela de morte), `app` (estados de aplicação: menu → partida),
  `tools/verify` (override de URL para pular as telas — definir com o `tech-lead`).
- **Nova seção "Mapas"**: mapa da POC nomeado **Avenida em Obras** (decidido); Feira de Domingo,
  Orla no Feriadão e Festa na Laje como slots "EM BREVE" (hipótese). Afeta: `ui` (cards), `data`
  (id do mapa).
- **Carteiro v1** especificado em Personagens ("Cartas que Voltam"; comportamento decidido,
  valores hipótese). Afeta: `sim` (entidade carta com estados ida/volta + pool, sistema de
  arremesso), `data` (tabela do carteiro), `render` (visual da carta), `ui` (card de seleção).
- **Melhorias genéricas**: stat-alvos `bite.*` → `ability.*`, valendo para a habilidade base
  equipada (decidido). Afeta: `data` (upgrades), `sim` (aplicação de melhorias), textos dos
  panfletos ("mordida" → "habilidade").
- Tabela de personagens: capivara e carteiro = **no protótipo**; água da capivara e
  cães/entregas do carteiro preservados como hipóteses futuras.
- Novo item em aberto: nome final do jogo.
