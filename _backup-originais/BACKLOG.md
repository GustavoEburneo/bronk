# TECH: arquitetura e convenções

> Fonte da verdade sobre **como** o jogo é construído. Só o `tech-lead` edita.

## Stack

*Em aberto.* Requisitos conhecidos: 3D no navegador, com centenas de inimigos em tela.
Candidatos a avaliar: Three.js e Babylon.js. Registrar a escolha, o motivo e as alternativas descartadas.

## Fronteiras (valem para qualquer stack)

1. Regras de jogo puras: sem motor, sem tela, sem rede, com aleatoriedade injetada e cobertas por teste.
2. Conteúdo como dado: tabelas tipadas e validadas na inicialização.
3. Apresentação (render, áudio, entrada) consome regras e dados, e não o contrário.
4. Interface lê o estado e dispara ações, sem conhecer o interior da simulação.
5. Servidor não confia no cliente; persistência atrás de uma interface.

## Orçamento de desempenho

*A definir:* taxa de quadros alvo, máximo de entidades em tela, tamanho do download, tempo de carregamento
e como medir cada um.

## Estrutura de pastas

*A definir pelo `tech-lead`.*

## Comandos

*A definir:* rodar, checar tipos, testar, gerar build.

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
- Recurso jogável foi jogado por alguém, com evidência.
- Mudança de código passou pelo `code-reviewer`.
- GDD, TECH e código dizem a mesma coisa.

## Riscos técnicos

| Risco | Plano |
|---|---|
| Hordas em 3D no navegador abaixo da taxa de quadros alvo | Protótipo de estresse com desenho em lote antes de escolher o estilo de arte |
