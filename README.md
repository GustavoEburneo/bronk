# BRonk

Survivors-like 3D para navegador com tema de caos cotidiano brasileiro: escolha um personagem com uma
habilidade base única e sobreviva a hordas pela cidade.

## Documentação

- [docs/GDD.md](docs/GDD.md) — design do jogo (**o que** o jogo é). Só o `game-designer` edita.
- [docs/TECH.md](docs/TECH.md) — arquitetura e convenções (**como** é construído). Só o `tech-lead` edita.
- [docs/DECISIONS.md](docs/DECISIONS.md) — registro de decisões. Mantido pelo `orchestrator`.
- [docs/BACKLOG.md](docs/BACKLOG.md) — o que está feito, em andamento e pendente.

## Time de agentes

As definições do time (orchestrator, game-designer, tech-lead, engenheiros, QA etc.) estão em
`.claude/agents/`, registradas como subagentes do Claude Code. O ponto de entrada de qualquer pedido
é o `orchestrator`.

## POC (em construção)

Protótipo mínimo jogável que também é o teste de estresse de hordas: Three.js + TypeScript + Vite.

```bash
npm install
npm run dev        # abre o jogo no navegador
npm run typecheck  # checagem de tipos
npm run test       # testes da simulação (Vitest)
npm run build      # build de produção
```

> Os arquivos originais do diretório (antes da reorganização de 2026-11-16) estão preservados em
> `_backup-originais/`.
