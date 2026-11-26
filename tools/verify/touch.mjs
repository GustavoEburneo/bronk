// Verificação de TOQUE (celular emulado): contexto mobile (hasTouch +
// isMobile → pointer coarse), joystick arrastado na esquerda, câmera na
// direita, botão de pulo pressionado; mede se o player ANDOU e screenshota.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright-core';

const root = '/home/luiz_eburneo/projetos/BRonk';
const port = 5199;
const shotDir = process.argv[2] ?? '.';

const shell = path.join(
  os.homedir(),
  '.cache/ms-playwright/chromium_headless_shell-1255/chrome-headless-shell-linux64/chrome-headless-shell',
);
const extraLibs = path.join(os.homedir(), '.cache/ms-playwright/extra-libs');
if (!existsSync(shell)) throw new Error('chromium headless shell ausente');

const server = spawn('npm', ['exec', '--', 'vite', '--port', String(port), '--strictPort'], {
  cwd: root,
  detached: true,
  stdio: 'ignore',
});
const base = `http://localhost:${port}/`;

async function waitForServer(url) {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* ainda subindo */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('vite não subiu');
}

let browser = null;
try {
  await waitForServer(base);
  browser = await chromium.launch({
    executablePath: shell,
    args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
    env: {
      ...process.env,
      LD_LIBRARY_PATH: [extraLibs, process.env.LD_LIBRARY_PATH].filter(Boolean).join(':'),
    },
  });
  // Celular deitado: viewport de iPhone em landscape, toque ligado.
  // Sem isMobile: no headless shell a emulação mobile zera as coordenadas dos
  // toques CDP (clientX/Y = 0); hasTouch basta para (pointer: coarse).
  const context = await browser.newContext({
    viewport: { width: 844, height: 390 },
    hasTouch: true,
  });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`[console] ${m.text()}`);
  });
  page.on('pageerror', (e) => errors.push(`[pageerror] ${e}`));

  // 1) MENU no celular: screenshot e JOGAR por toque.
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#screens:not([hidden])', { timeout: 15000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(shotDir, 'touch-menu.png') });

  // 2) Partida direto (mesmo atalho do verify): mede movimento por toque.
  await page.goto(`${base}?personagem=capivara`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#hud:not([hidden])', { timeout: 15000 });
  await page.waitForTimeout(2500);

  // Spy de posição do verify:headless (mesma técnica): intercepta
  // onBeforeRender da instância de three do jogo e lê o mesh 'player-body'.
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
  await page.waitForTimeout(400);
  // Instrumentação: conta os pointer events que chegam ao canvas.
  await page.evaluate(() => {
    window.__ev = { down: 0, move: 0, types: new Set() };
    const c = document.querySelector('#game');
    c.addEventListener('pointerdown', (e) => {
      window.__ev.down++;
      window.__ev.types.add(e.pointerType);
      window.__ev.lastDown = `${e.pointerType} client=${e.clientX},${e.clientY} page=${e.pageX},${e.pageY} screen=${e.screenX},${e.screenY}`;
    });
    c.addEventListener('pointermove', (e) => {
      window.__ev.move++;
      window.__ev.types.add(e.pointerType);
    });
  });
  const posBefore = await page.evaluate(() => ({ x: window.__pos.x, z: window.__pos.z }));

  // Toques sintéticos por PointerEvent DESPACHADO NA PÁGINA: o CDP
  // Input.dispatchTouchEvent deste headless shell zera as coordenadas
  // (client/page/screen = 0,0 — hit-test certo, coords não), então o arrasto
  // é injetado direto no canvas. Isto exercita o caminho real do jogo
  // (touchControls → merge → sim); num aparelho real o navegador entrega os
  // mesmos PointerEvents com coordenadas.
  const hold = (x0, y0, x1, y1, ms, id) =>
    page.evaluate(
      async ([ax0, ay0, ax1, ay1, ams, aid]) => {
        const canvas = document.querySelector('#game');
        const fire = (type, x, y) =>
          canvas.dispatchEvent(
            new PointerEvent(type, {
              pointerType: 'touch',
              pointerId: aid,
              clientX: x,
              clientY: y,
              bubbles: true,
              cancelable: true,
            }),
          );
        const sleep = (t) => new Promise((r) => setTimeout(r, t));
        fire('pointerdown', ax0, ay0);
        const steps = 6;
        for (let i = 1; i <= steps; i++) {
          fire('pointermove', ax0 + ((ax1 - ax0) * i) / steps, ay0 + ((ay1 - ay0) * i) / steps);
          await sleep(40);
        }
        await sleep(ams);
        fire('pointerup', ax1, ay1);
      },
      [x0, y0, x1, y1, ms, id],
    );
  // Tap solto na esquerda: abre e fecha o joystick sem travar nada.
  await hold(60, 300, 60, 300, 60, 9);

  // HUD antes/depois: o relógio prova sim viva; a posição, lemos pelo texto
  // "na sua cola" não dá — então screenshot com o joystick NA TELA:
  const movePromise = hold(180, 300, 180, 240, 2600, 1);
  await page.waitForTimeout(1200);
  const stickMid = await page.evaluate(() => {
    const s = document.querySelector('.tc-stick');
    const k = document.querySelector('.tc-stick-knob');
    return { hidden: s.hidden, left: s.style.left, knob: k.style.transform };
  });
  console.log(`joystick no meio do arrasto: ${JSON.stringify(stickMid)}`);
  await page.screenshot({ path: path.join(shotDir, 'touch-game.png') });
  await movePromise;

  const posAfter = await page.evaluate(() => ({ x: window.__pos.x, z: window.__pos.z }));
  const moved = Math.hypot(posAfter.x - posBefore.x, posAfter.z - posBefore.z);

  // Arrasto de câmera na direita: não pode dar erro.
  await hold(640, 200, 500, 220, 300, 2);

  // Botão de PULO: pointerdown/up direto no botão (segura e solta).
  await page.evaluate(async () => {
    const b = document.querySelector('.tc-jump');
    const fire = (type) =>
      b.dispatchEvent(
        new PointerEvent(type, { pointerType: 'touch', pointerId: 7, bubbles: true, cancelable: true }),
      );
    fire('pointerdown');
    await new Promise((r) => setTimeout(r, 400));
    fire('pointerup');
  });

  // Botão de pulo visível? (pointer: coarse deve exibi-lo)
  const jumpVisible = await page.evaluate(() => {
    const b = document.querySelector('.tc-jump');
    return b !== null && getComputedStyle(b).display !== 'none';
  });
  const stickShown = await page.evaluate(
    () => document.querySelector('.tc-stick') instanceof HTMLElement,
  );

  await page.waitForTimeout(800);
  console.log(`botão de pulo visível: ${jumpVisible}`);
  console.log(`joystick no DOM: ${stickShown}`);
  console.log(`andou com o joystick: ${moved.toFixed(2)} u`);
  const ev = await page.evaluate(() => ({
    down: window.__ev.down,
    move: window.__ev.move,
    types: [...window.__ev.types],
  }));
  console.log(`pointer events no canvas: down=${ev.down} move=${ev.move} types=${ev.types}`);
  console.log(`último pointerdown: ${await page.evaluate(() => window.__ev.lastDown)}`);
  const hud = await page.locator('#hud').textContent();
  console.log(`HUD: ${hud}`);
  console.log(errors.length === 0 ? 'erros de console: nenhum' : errors.join('\n'));
  const ok = jumpVisible && moved > 2 && errors.length === 0;
  console.log(ok ? 'TOQUE: OK' : 'TOQUE: FALHOU');
} finally {
  await browser?.close().catch(() => {});
  if (server.pid !== undefined) {
    try {
      process.kill(-server.pid, 'SIGTERM');
    } catch {
      /* já morreu */
    }
  }
}
