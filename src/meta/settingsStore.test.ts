/**
 * Cofre de configurações: padrões, clamps, persistência e sanitização de
 * carga. Usa storage falso em memória, como os testes do metaStore — o módulo
 * degrada para memória sem storage, e os testes exercitam essa borda.
 */
import { describe, expect, it } from 'vitest';
import type { SettingsStorage } from './settingsStore';
import {
  createSettingsStore,
  SETTINGS_STORAGE_KEY,
  SENSITIVITY_MIN,
  SENSITIVITY_MAX,
  SENSITIVITY_DEFAULT,
  VOLUME_DEFAULT,
} from './settingsStore';

function fakeStorage(initial?: string): SettingsStorage & { map: Map<string, string> } {
  const map = new Map<string, string>();
  if (initial !== undefined) map.set(SETTINGS_STORAGE_KEY, initial);
  return {
    map,
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => void map.set(key, value),
  };
}

describe('createSettingsStore', () => {
  it('começa nos padrões sem save anterior', () => {
    const settings = createSettingsStore(fakeStorage());
    expect(settings.volume).toBe(VOLUME_DEFAULT);
    expect(settings.mouseSensitivity).toBe(SENSITIVITY_DEFAULT);
    expect(settings.language).toBe('pt-BR');
  });

  it('setVolume persiste e um store novo recarrega o valor', () => {
    const storage = fakeStorage();
    createSettingsStore(storage).setVolume(0.35);
    expect(createSettingsStore(storage).volume).toBe(0.35);
  });

  it('setMouseSensitivity persiste e um store novo recarrega o valor', () => {
    const storage = fakeStorage();
    createSettingsStore(storage).setMouseSensitivity(1.8);
    expect(createSettingsStore(storage).mouseSensitivity).toBe(1.8);
  });

  it('setVolume clampa para 0..1', () => {
    const settings = createSettingsStore(fakeStorage());
    settings.setVolume(2.5);
    expect(settings.volume).toBe(1);
    settings.setVolume(-1);
    expect(settings.volume).toBe(0);
  });

  it('setMouseSensitivity clampa para a faixa permitida', () => {
    const settings = createSettingsStore(fakeStorage());
    settings.setMouseSensitivity(999);
    expect(settings.mouseSensitivity).toBe(SENSITIVITY_MAX);
    settings.setMouseSensitivity(0);
    expect(settings.mouseSensitivity).toBe(SENSITIVITY_MIN);
  });

  it('setters ignoram valores não finitos', () => {
    const settings = createSettingsStore(fakeStorage());
    settings.setVolume(Number.NaN);
    settings.setMouseSensitivity(Number.POSITIVE_INFINITY);
    expect(settings.volume).toBe(VOLUME_DEFAULT);
    expect(settings.mouseSensitivity).toBe(SENSITIVITY_DEFAULT);
  });

  it('carga ignora JSON inválido e cai nos padrões', () => {
    const settings = createSettingsStore(fakeStorage('{lixo'));
    expect(settings.volume).toBe(VOLUME_DEFAULT);
    expect(settings.mouseSensitivity).toBe(SENSITIVITY_DEFAULT);
  });

  it('carga sanitiza tipos errados e clampa valores fora da faixa', () => {
    const settings = createSettingsStore(
      fakeStorage(JSON.stringify({ volume: 'alto', mouseSensitivity: 50 })),
    );
    expect(settings.volume).toBe(VOLUME_DEFAULT); // tipo errado cai no padrão
    expect(settings.mouseSensitivity).toBe(SENSITIVITY_MAX); // fora da faixa clampa
  });

  it('funciona sem storage (degrada para memória)', () => {
    const settings = createSettingsStore(undefined);
    settings.setVolume(0.5);
    expect(settings.volume).toBe(0.5);
  });

  it('notifica assinantes a cada mudança', () => {
    const settings = createSettingsStore(fakeStorage());
    let calls = 0;
    settings.subscribe(() => {
      calls += 1;
    });
    settings.setVolume(0.2);
    settings.setMouseSensitivity(2);
    expect(calls).toBe(2);
  });
});
