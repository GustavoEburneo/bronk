import type { World } from '../sim/world';
import type { HitPlayback } from './hitGate';
import { MAX_SFX_VOICES, createHitGate } from './hitGate';

/**
 * Áudio 100% sintetizado por WebAudio (TECH, "Áudio sintetizado") — zero
 * assets, zero dependência. Espelha o render: consome a sim (lê world.events
 * como o render lê o estado, nunca destrutivamente), e a sim NUNCA importa
 * este módulo. Todo caminho degrada para SILÊNCIO: headless/autoplay
 * bloqueado/contexto ausente não pode quebrar nada nem sujar o console.
 */
export interface GameAudio {
  /** Idempotente; tenta criar/resumir o AudioContext. NUNCA lança. */
  unlock(): void;
  /** Zera estado de partida (dedup por tick, throttle). */
  beginMatch(): void;
  /** Para e desconecta TODA voz viva; nada vaza entre partidas. */
  endMatch(): void;
  /** Lê world.events; chamado 1×/frame no afterFrame do gameLoop. */
  update(world: World): void;
  /** 0..1 — ligado ao slider de volume da tela CONFIGURAÇÕES (via main.ts). */
  setMasterVolume(v: number): void;
  /** Fecha o AudioContext (vida do app). */
  dispose(): void;
}

// ---------------------------------------------------------------------------
// Síntese do "toc" de hit (caráter no GDD "Áudio v1"; números finais são
// hipótese de ouvido deste módulo — ajustar aqui, nunca na sim).
// ---------------------------------------------------------------------------

/** Ganho master conservador, calibrado de ouvido; o volume escolhido na tela
 * CONFIGURAÇÕES multiplica por cima (setMasterVolume). */
const MASTER_GAIN_DEFAULT = 0.3;

/** Fundamental do toc sorteada por hit em [180, 240] Hz (GDD: ≈ ±15%). */
const TOC_FREQ_MIN = 180;
const TOC_FREQ_MAX = 240;
/** Re-sorteia uma vez se o novo pitch sair a < 3% do anterior (anti-enjoo). */
const TOC_FREQ_MIN_DELTA = 0.03;

/** Pico do envelope do corpo do toc; ±20% sorteado por reprodução. */
const TOC_PEAK_GAIN = 0.4;
const TOC_GAIN_JITTER = 0.2;

/** Ataque < 5 ms (GDD): rampa linear até o pico. */
const TOC_ATTACK_SECONDS = 0.003;
/**
 * Constante de tempo do decay exponencial do corpo. τ = 13 ms deixa o toc a
 * ~1% do pico aos ~60 ms — dentro dos 40–80 ms do GDD, seco, sem cauda.
 */
const TOC_DECAY_TAU = 0.013;
/** Vida total da voz; o oscilador para aqui e dispara a auto-limpeza. */
const TOC_STOP_SECONDS = 0.09;

/** Estalo de ruído do ataque: ~10 ms de ruído branco, decay bem curto. */
const CLICK_GAIN_RATIO = 0.7; // relativo ao pico do corpo
const CLICK_DECAY_TAU = 0.004;
const CLICK_STOP_SECONDS = 0.03;

/**
 * Modulações do evento (GDD "Áudio v1"):
 * - `count >= 3` → −30% pitch, +25% ganho ("acertei o bolo", pulso pesado);
 * - `critCount > 0` → −25% pitch, +30% ganho (feedback do Dado Viciado).
 * Quando as DUAS valem, o CRÍTICO vence (decisão documentada): o som é o
 * único feedback do crítico na v1 — perder a leitura do Dado custa mais do
 * que perder a do bolo, que já tem feedback visual (a horda morrendo).
 */
const HEAVY_HIT_COUNT = 3;
const HEAVY_PITCH_MULT = 0.7;
const HEAVY_GAIN_MULT = 1.25;
const CRIT_PITCH_MULT = 0.75;
const CRIT_GAIN_MULT = 1.3;

/** Buffer de ruído compartilhado (pré-gerado no unlock; zero alocação por disparo). */
const NOISE_BUFFER_SECONDS = 0.1;

interface Voice {
  sources: AudioScheduledSourceNode[];
  nodes: AudioNode[];
}

export function createAudio(): GameAudio {
  const gate = createHitGate();
  const voices = new Set<Voice>();

  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let noiseBuffer: AudioBuffer | null = null;
  let masterVolume = 1;
  let disposed = false;
  let lastBaseFreq = 0;

  function unlock(): void {
    if (disposed) return;
    try {
      if (ctx === null) {
        const Ctor =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (Ctor === undefined) return; // ambiente sem WebAudio: mudo em silêncio
        ctx = new Ctor();
        master = ctx.createGain();
        master.gain.value = MASTER_GAIN_DEFAULT * masterVolume;
        master.connect(ctx.destination);
        noiseBuffer = createNoiseBuffer(ctx);
      }
      if (ctx.state === 'suspended') {
        // resume() sem gesto rejeita a promise: engolir é a degradação certa.
        void ctx.resume().catch(() => {});
      }
    } catch {
      // Qualquer falha de WebAudio degrada para silêncio — nunca lança,
      // nunca loga (console limpo é contrato do verify:headless).
      ctx = null;
      master = null;
      noiseBuffer = null;
    }
  }

  function stopVoice(voice: Voice): void {
    for (const source of voice.sources) {
      try {
        source.onended = null;
        source.stop();
      } catch {
        // stop() em fonte já parada lança em algumas implementações — ignorar.
      }
    }
    for (const node of voice.nodes) node.disconnect();
  }

  /** Sorteio de apresentação (Math.random é permitido AQUI, nunca na sim). */
  function rollBaseFreq(): number {
    let freq = TOC_FREQ_MIN + Math.random() * (TOC_FREQ_MAX - TOC_FREQ_MIN);
    if (lastBaseFreq > 0 && Math.abs(freq - lastBaseFreq) / lastBaseFreq < TOC_FREQ_MIN_DELTA) {
      // Nunca dois tocs seguidos idênticos: re-sorteia UMA vez (GDD).
      freq = TOC_FREQ_MIN + Math.random() * (TOC_FREQ_MAX - TOC_FREQ_MIN);
    }
    lastBaseFreq = freq;
    return freq;
  }

  function playToc(context: AudioContext, out: GainNode, noise: AudioBuffer, hit: HitPlayback): void {
    let pitchMult = 1;
    let gainMult = 1;
    if (hit.critCount > 0) {
      pitchMult = CRIT_PITCH_MULT;
      gainMult = CRIT_GAIN_MULT;
    } else if (hit.count >= HEAVY_HIT_COUNT) {
      pitchMult = HEAVY_PITCH_MULT;
      gainMult = HEAVY_GAIN_MULT;
    }

    const freq = rollBaseFreq() * pitchMult;
    const peak =
      TOC_PEAK_GAIN * gainMult * (1 + (Math.random() * 2 - 1) * TOC_GAIN_JITTER);
    const t0 = context.currentTime;

    // Corpo: triângulo com ataque de 3 ms e decay exponencial — o "toc".
    const osc = context.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    const oscGain = context.createGain();
    oscGain.gain.setValueAtTime(0, t0);
    oscGain.gain.linearRampToValueAtTime(peak, t0 + TOC_ATTACK_SECONDS);
    oscGain.gain.setTargetAtTime(0, t0 + TOC_ATTACK_SECONDS, TOC_DECAY_TAU);
    osc.connect(oscGain);
    oscGain.connect(out);

    // Estalo: ~10 ms do buffer de ruído compartilhado no ataque.
    const click = context.createBufferSource();
    click.buffer = noise;
    const clickGain = context.createGain();
    clickGain.gain.setValueAtTime(peak * CLICK_GAIN_RATIO, t0);
    clickGain.gain.setTargetAtTime(0, t0, CLICK_DECAY_TAU);
    click.connect(clickGain);
    clickGain.connect(out);

    const voice: Voice = { sources: [osc, click], nodes: [osc, oscGain, click, clickGain] };
    voices.add(voice);
    // Auto-limpeza no fim da voz; o corpo (osc) é a fonte mais longa.
    osc.onended = () => {
      voices.delete(voice);
      for (const node of voice.nodes) node.disconnect();
    };

    osc.start(t0);
    osc.stop(t0 + TOC_STOP_SECONDS);
    click.start(t0);
    click.stop(t0 + CLICK_STOP_SECONDS);
  }

  return {
    unlock,

    beginMatch(): void {
      gate.reset();
    },

    endMatch(): void {
      // Espelho do dispose do render: nenhum nó sobrevive à partida.
      for (const voice of voices) stopVoice(voice);
      voices.clear();
      gate.reset();
    },

    update(world: World): void {
      // O gate roda SEMPRE (mesmo mudo): dedup por tickCount e throttle ficam
      // coerentes, e destravar o áudio no meio da partida não re-toca nada.
      const hits = gate.collect(world, performance.now() / 1000);
      if (hits.length === 0) return;
      if (ctx === null || master === null || noiseBuffer === null) return;
      if (ctx.state !== 'running') return; // suspenso: agendar soaria atrasado
      for (const hit of hits) {
        if (voices.size >= MAX_SFX_VOICES) break; // teto: descarta, nunca enfileira
        try {
          playToc(ctx, master, noiseBuffer, hit);
        } catch {
          // Falha de síntese degrada para silêncio; o frame segue intacto.
        }
      }
    },

    setMasterVolume(v: number): void {
      masterVolume = Math.min(1, Math.max(0, v));
      if (master !== null) master.gain.value = MASTER_GAIN_DEFAULT * masterVolume;
    },

    dispose(): void {
      if (disposed) return;
      disposed = true;
      for (const voice of voices) stopVoice(voice);
      voices.clear();
      master?.disconnect();
      master = null;
      noiseBuffer = null;
      if (ctx !== null) {
        try {
          void ctx.close().catch(() => {});
        } catch {
          // fechar contexto já fechado lança em algumas implementações
        }
        ctx = null;
      }
    },
  };
}

/** Ruído branco pré-gerado uma vez no unlock e compartilhado entre as vozes. */
function createNoiseBuffer(context: AudioContext): AudioBuffer {
  const length = Math.max(1, Math.floor(context.sampleRate * NOISE_BUFFER_SECONDS));
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let i = 0; i < samples.length; i += 1) samples[i] = Math.random() * 2 - 1;
  return buffer;
}
