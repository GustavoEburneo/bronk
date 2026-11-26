import * as THREE from 'three';

/**
 * Vertex snapping estilo PS1: cada vértice é agarrado a uma grade de tela, e a
 * silhueta treme quando algo se move. Faz parte do estilo "tosco de propósito"
 * (ver docs/DECISIONS.md) — não é bug.
 */

// Vector2 compartilhado por todos os materiais; mutado no resize do renderer.
const snapGrid = new THREE.Vector2(240, 135);

let snapEnabled = true;

/** Liga/desliga o efeito (depuração via ?snap=0): grade gigante ≈ sem snap. */
export function setSnapEnabled(enabled: boolean): void {
  snapEnabled = enabled;
  if (!enabled) snapGrid.set(1e6, 1e6);
}

/** Grade = metade da resolução interna: tremor visível sem desmontar a forma. */
export function setSnapResolution(width: number, height: number): void {
  if (!snapEnabled) return;
  snapGrid.set(Math.max(2, width / 2), Math.max(2, height / 2));
}

/** Injeta o snap no shader e devolve o próprio material (uso encadeado). */
export function applyVertexSnap<T extends THREE.Material>(material: T): T {
  material.onBeforeCompile = (shader) => {
    shader.uniforms['uSnapGrid'] = { value: snapGrid };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform vec2 uSnapGrid;')
      .replace(
        '#include <project_vertex>',
        // Só vértices à frente da câmera (w > 0): atrás dela a divisão por w
        // produz deslocamentos arbitrários que deformam superfícies grandes.
        '#include <project_vertex>\n' +
          'if (gl_Position.w > 0.0) {\n' +
          '  gl_Position.xy = floor(gl_Position.xy / gl_Position.w * uSnapGrid + 0.5) / uSnapGrid * gl_Position.w;\n' +
          '}',
      );
  };
  return material;
}
