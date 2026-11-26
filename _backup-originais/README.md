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
- 3D. Estilo visual (low-poly ou sprites 2D em mundo 3D): *em aberto*.
- Público inicial (Brasil ou global) e idioma: *em aberto*.

## Loop principal

Mover, atacar automaticamente com a habilidade base, coletar experiência, subir de nível e escolher
melhorias, enfrentar chefe ao fim da run. *(decidido em linhas gerais; números em aberto)*

Formato da escolha de melhorias ao subir de nível: *em aberto*.

## Personagens

| Personagem | Habilidade base | O que muda no jeito de jogar | Estado |
|---|---|---|---|
| Capivara | Mordida | Rápida na água, onde os inimigos ficam lentos | hipótese |
| Carteiro | Joga cartas que voltam | Cães perseguem só ele; pontos de entrega dão recompensa | hipótese |
| Motoboy | Dano por velocidade | Quanto mais rápido, mais forte | hipótese |
| Vendedor de praia | Planta guarda-sóis e isopores | Defesa de território | hipótese |
| DJ de paredão | Ondas de som no ritmo | Acertar a batida amplia o alcance | hipótese |
| Churrasqueiro | Fumaça em área | Dano contínuo de curto alcance | hipótese |

Personagens do primeiro protótipo: capivara e carteiro. *(hipótese)*

## Mecânicas candidatas

| Mecânica | Resumo | Estado |
|---|---|---|
| Gambiarra | Fundir dois itens quaisquer numa arma improvisada, no lugar de evoluções fixas | hipótese |
| Dívida | Inimigos-boleto não dão dano: cobram juros sobre a renda até você pagar num ponto do mapa; empréstimo dá poder imediato e atrai um cobrador de elite | hipótese |
| A run é um dia | Manhã de trânsito, chuva de verão que alaga as partes baixas, noite de festa; o chefe final é a Segunda-feira | hipótese |
| Perigos da cidade | Ônibus que cruza a avenida e atropela tudo, buracos, ladeiras que dão embalo | hipótese |
| Álbum de figurinhas | Coleção permanente: pacotinhos caem dos inimigos e páginas completas dão bônus fixos | hipótese |
| Companheiro | Vira-lata resgatado que sobe de nível e busca itens distantes | hipótese |
| Objetivo por personagem | Cada personagem tem uma tarefa própria na run, para forçar o deslocamento pelo mapa | hipótese |

Descartado: escolha de melhorias em formato de buffet por quilo.

## Diretrizes de tema

- Humor sobre situações e objetos do cotidiano, não sobre grupos de pessoas.
- Sem marcas reais, personagens ou nomes de terceiros.

## Em aberto

- Duração da run e condição de vitória.
- Progressão entre runs além do álbum.
- Modelo de negócio e onde publicar.
- Conta e ranking: necessários na primeira versão?
