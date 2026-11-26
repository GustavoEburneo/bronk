// Harness de verificação jogável em headless, com orçamento de tempo.
//
// Sobe o próprio servidor Vite, abre o jogo no Chromium headless, joga com um
// bot simples, coleta erros de console, o HUD e uma screenshot, e SEMPRE
// termina: um timeout global mata tudo e sai com código 2. Nenhum laço aqui
// roda sem teto — é a resposta à sessão de 2026-11-17 que travou num bot
// caçando RNG sem timeout.
//
// Uso:
//   npm run verify:headless -- [opções]
//     --params "spawn=25&seed=42&melhorias=cafe,cafe"  query string do jogo
//     --shot caminho.png   screenshot ao final (evidência)
//     --bot orbit|idle     orbit (padrão): orbita o centro da arena; idle: parado
//     --duration 20        segundos de jogo observados (padrão 20)
//     --budget 90          orçamento TOTAL em segundos (padrão 90); estourou → exit 2
//     --port 5199          porta do servidor próprio (strictPort)
//     --menu               verifica as TELAS DE MENU: abre sem ?personagem=,
//                          espera #screens visível, aguarda --duration e
//                          fotografa; sem bot, sem HUD
//
// Estado específico (build de melhorias, semente) entra por `--params`
// (?melhorias=/?seed= do jogo), nunca jogando até o sorteio cooperar.
//
// Saída: 0 = ok (zero erros de console); 1 = erro observado ou falha de
// infraestrutura; 2 = estourou o orçamento.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright-core';

// ---------------------------------------------------------------------------
// Opções e orçamento global
// ---------------------------------------------------------------------------

const opts = parseArgs(process.argv.slice(2));
const BUDGET_MS = opts.budget * 1000;

const budgetTimer = setTimeout(() => {
  console.error(`TIMEOUT: orçamento de ${opts.budget}s estourado — abortando.`);
  // process.exit dispara o handler de 'exit', que derruba server e navegador.
  process.exit(2);
}, BUDGET_MS);

/** Processos a derrubar em QUALQUER saída (sucesso, erro ou timeout). */
const cleanup = { server: null, browser: null };
process.on('exit', () => {
  if (cleanup.server !== null) {
    try {
      process.kill(-cleanup.server.pid, 'SIGTERM');
    } catch {
      /* já morreu */
    }
  }
  if (cleanup.browser !== null) {
    // close() é async e 'exit' não espera; o kill do processo é síncrono.
    try {
      cleanup.browser.process()?.kill('SIGTERM');
    } catch {
      /* já morreu */
    }
  }
});
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => process.exit(1));
}

// ---------------------------------------------------------------------------
// Execução
// ---------------------------------------------------------------------------

let exitCode = 1;
try {
  exitCode = await run();
} catch (error) {
  console.error(`FALHA: ${error?.message ?? error}`);
  exitCode = 1;
} finally {
  clearTimeout(budgetTimer);
  if (cleanup.browser !== null) await cleanup.browser.close().catch(() => {});
}
process.exit(exitCode);

async function run() {
  const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');

  const shell = path.join(
    os.homedir(),
    '.cache/ms-playwright/chromium_headless_shell-1255/chrome-headless-shell-linux64/chrome-headless-shell',
  );
  if (!existsSync(shell)) {
    console.error(
      `Chromium headless não encontrado em ${shell}.\n` +
        'Instale com: npx playwright-core install chromium-headless-shell',
    );
    return 1;
  }
  // O sistema (WSL2 enxuto) não tem NSS/NSPR/ALSA; as .so vivem ao lado do
  // cache do Chromium. Para repopular: baixar libnspr4/libnss3/libasound2 via
  // `apt download` e extrair com `dpkg -x` para esta pasta.
  const extraLibs = path.join(os.homedir(), '.cache/ms-playwright/extra-libs');
  if (!existsSync(path.join(extraLibs, 'libnspr4.so'))) {
    console.error(`libs de sistema do Chromium não encontradas em ${extraLibs} (ver comentário no script).`);
    return 1;
  }

  // Servidor próprio, em grupo de processos novo para o kill alcançar o node
  // que o shim de .bin/vite inicia.
  cleanup.server = spawn('npm', ['exec', '--', 'vite', '--port', String(opts.port), '--strictPort'], {
    cwd: root,
    detached: true,
    stdio: 'ignore',
  });
  const base = `http://localhost:${opts.port}/`;
  await waitForServer(base);

  const browser = await chromium.launch({
    executablePath: shell,
    args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
    env: {
      ...process.env,
      LD_LIBRARY_PATH: [extraLibs, process.env.LD_LIBRARY_PATH].filter(Boolean).join(':'),
    },
  });
  cleanup.browser = browser;
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`[console] ${m.text()}`);
  });
  page.on('pageerror', (e) => errors.push(`[pageerror] ${e}`));

  // O jogo abre no menu; verificação de PARTIDA sempre pula as telas com
  // ?personagem= (regra do TECH), capivara por padrão. Com --menu, nada é
  // injetado: o alvo são as próprias telas.
  const search = new URLSearchParams(opts.params);
  if (!opts.menu && !search.has('personagem')) search.set('personagem', 'capivara');
  const qs = search.toString();
  const url = qs.length > 0 ? `${base}?${qs}` : base;
  const mode = opts.menu ? 'telas de menu' : `bot ${opts.bot}`;
  console.log(`abrindo ${url} (${mode}, ${opts.duration}s, orçamento ${opts.budget}s)`);
  await page.goto(url, { waitUntil: 'networkidle' });

  if (opts.menu) {
    await page.waitForSelector('#screens:not([hidden])', { timeout: 10_000, state: 'visible' });
    await page.waitForTimeout(opts.duration * 1000);
    if (opts.shot !== null) {
      await page.screenshot({ path: opts.shot });
      console.log(`screenshot: ${opts.shot}`);
    }
    if (errors.length > 0) {
      console.error(`erros de console (${errors.length}):`);
      for (const line of errors) console.error(`  ${line}`);
      console.error('VERIFICAÇÃO: FALHOU');
      return 1;
    }
    console.log('erros de console: nenhum');
    console.log('VERIFICAÇÃO: OK');
    return 0;
  }

  const outcome = opts.bot === 'orbit' ? await orbitBot(page, opts.duration * 1000) : await idleBot(page, opts.duration * 1000);

  const hud = (await page.locator('#hud').textContent().catch(() => null)) ?? '(HUD ilegível)';
  console.log(`HUD ao final: ${hud.replace(/\s+/g, ' ').trim()}`);
  console.log(`desfecho do bot: ${outcome}`);

  if (opts.shot !== null) {
    await page.screenshot({ path: opts.shot });
    console.log(`screenshot: ${opts.shot}`);
  }

  if (errors.length > 0) {
    console.error(`erros de console (${errors.length}):`);
    for (const line of errors) console.error(`  ${line}`);
    console.error('VERIFICAÇÃO: FALHOU');
    return 1;
  }
  console.log('erros de console: nenhum');
  console.log('VERIFICAÇÃO: OK');
  return 0;
}

// ---------------------------------------------------------------------------
// Bots (todos os laços têm teto de tempo herdado de `ms`)
// ---------------------------------------------------------------------------

async function idleBot(page, ms) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const state = await uiState(page);
    if (state === 'dead') return `morreu parado após ${elapsed(t0)}s`;
    if (state === 'upgrade') await pickAnyFlyer(page);
    await page.waitForTimeout(500);
  }
  return `sobreviveu parado por ${elapsed(t0)}s`;
}

/**
 * Orbita o centro da arena (o kiting clássico do gênero): calibra tecla→direção
 * medindo o deslocamento real e persegue um alvo que circula em raio 18 u.
 * Level-up: escolhe um panfleto qualquer e segue. Morte encerra cedo.
 */
async function orbitBot(page, ms) {
  await installPositionSpy(page);
  const cal = await calibrateKeys(page);
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const state = await uiState(page);
    if (state === 'dead') return `morreu após ${elapsed(t0)}s de órbita`;
    if (state === 'upgrade') {
      await pickAnyFlyer(page);
      continue;
    }
    const pos = await page.evaluate(() => ({ x: window.__pos.x, z: window.__pos.z }));
    const ang = (Date.now() / 3000) % (Math.PI * 2);
    const tx = Math.cos(ang) * 18 - pos.x;
    const tz = Math.sin(ang) * 18 - pos.z;
    let bestKey = 'w';
    let bestDot = -Infinity;
    for (const [key, dir] of Object.entries(cal)) {
      const dot = dir.x * tx + dir.z * tz;
      if (dot > bestDot) {
        bestDot = dot;
        bestKey = key;
      }
    }
    await page.keyboard.down(bestKey);
    await page.waitForTimeout(250);
    await page.keyboard.up(bestKey);
  }
  return `sobreviveu orbitando por ${elapsed(t0)}s`;
}

/**
 * Lê a posição do player sem tocar em src/: intercepta
 * Object3D.prototype.onBeforeRender da MESMA instância de three que o jogo usa
 * (URL resolvida pelo Vite) e reconhece o corpo do personagem pela convenção
 * do TECH: o mesh do corpo de qualquer personagem chama-se 'player-body'.
 */
async function installPositionSpy(page) {
  await page.evaluate(async () => {
    const src = await (await fetch('/src/render/renderer.ts')).text();
    const m = /from\s+"([^"]+three\.js[^"]*)"/.exec(src);
    if (!m) throw new Error('módulo three não encontrado no renderer transformado');
    const THREE = await import(m[1]);
    window.__pos = { x: 0, z: 0 };
    const orig = THREE.Object3D.prototype.onBeforeRender;
    THREE.Object3D.prototype.onBeforeRender = function (...args) {
      if (this.isMesh === true && this.name === 'player-body') {
        const e = this.matrixWorld.elements;
        window.__pos.x = e[12];
        window.__pos.z = e[14];
      }
      return orig.apply(this, args);
    };
  });
}

/** Mede para onde cada tecla move de verdade (a câmera gira o frame de input). */
async function calibrateKeys(page) {
  const cal = {};
  for (const key of ['w', 'a', 's', 'd']) {
    const before = await page.evaluate(() => ({ x: window.__pos.x, z: window.__pos.z }));
    await page.keyboard.down(key);
    await page.waitForTimeout(350);
    await page.keyboard.up(key);
    const after = await page.evaluate(() => ({ x: window.__pos.x, z: window.__pos.z }));
    const dx = after.x - before.x;
    const dz = after.z - before.z;
    const n = Math.hypot(dx, dz) || 1;
    cal[key] = { x: dx / n, z: dz / n };
  }
  return cal;
}

async function uiState(page) {
  if ((await page.locator('#death-overlay:not([hidden])').count()) > 0) return 'dead';
  if ((await page.locator('#upgrade-overlay:not([hidden])').count()) > 0) return 'upgrade';
  return 'running';
}

/** Fecha a escolha de level-up com o primeiro panfleto (o bot não tem build). */
async function pickAnyFlyer(page) {
  await page.waitForTimeout(450); // janela anti clique-duplo do overlay
  await page
    .locator('#upgrade-overlay .flyer')
    .first()
    .click()
    .catch(() => {});
  await page.waitForTimeout(250);
}

// ---------------------------------------------------------------------------
// Infra
// ---------------------------------------------------------------------------

async function waitForServer(url) {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* ainda subindo */
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`servidor não respondeu em ${url} após 15s`);
}

function elapsed(t0) {
  return ((Date.now() - t0) / 1000).toFixed(0);
}

function parseArgs(argv) {
  const out = { params: '', shot: null, bot: 'orbit', duration: 20, budget: 90, port: 5199, menu: false };
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    const value = argv[i + 1];
    switch (key) {
      case '--params':
        out.params = value ?? '';
        i++;
        break;
      case '--shot':
        out.shot = value ?? null;
        i++;
        break;
      case '--bot':
        if (value !== 'orbit' && value !== 'idle') throw new Error(`--bot inválido: ${value}`);
        out.bot = value;
        i++;
        break;
      case '--menu':
        out.menu = true;
        break;
      case '--duration':
      case '--budget':
      case '--port': {
        const n = Number(value);
        if (!Number.isFinite(n) || n <= 0) throw new Error(`${key} inválido: ${value}`);
        out[key.slice(2)] = n;
        i++;
        break;
      }
      default:
        throw new Error(`opção desconhecida: ${key}`);
    }
  }
  if (out.duration * 1000 >= BUDGET_PAD(out.budget)) {
    throw new Error(
      `--duration ${out.duration}s não cabe no orçamento de ${out.budget}s ` +
        '(reserve ~10s para subir server/navegador)',
    );
  }
  return out;
}

/** Orçamento útil para o jogo: o total menos a reserva de infraestrutura. */
function BUDGET_PAD(budgetSeconds) {
  return (budgetSeconds - 10) * 1000;
}
