import * as THREE from 'three';
import { applyVertexSnap } from './retro';

/**
 * Props de natureza toscos compartilhados entre mapas (2026-11-24): árvore de
 * praça, coqueiro de orla, pedra de encosta e cerca de fazenda — primitivas
 * desproporcionais no estilo da casa. A FÁBRICA cria geometria e materiais UMA
 * vez e todas as instâncias do mapa os compartilham (menos alocação; o
 * disposeHierarchy do renderer é idempotente e libera sem efeito colateral).
 * Sem colisão, como todo o cenário: são ambientação, nunca obstáculo.
 */
export interface NatureProps {
  /** Árvore de praça: tronco + 2 copas esféricas desproporcionais. */
  arvore(rnd: () => number): THREE.Group;
  /** Coqueiro de orla: tronco curvo em segmentos + leque de folhas + coco. */
  coqueiro(rnd: () => number): THREE.Group;
  /** Pedra de encosta: esfera facetada esticada, meio enterrada. */
  pedra(rnd: () => number): THREE.Mesh;
  /** Segmento reto de cerca de madeira ao longo do +X local. */
  cerca(length: number): THREE.Group;
}

export function createNatureProps(): NatureProps {
  const troncoMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x6b4a2a }));
  const copaMaterials = [
    applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x3f6d2e })),
    applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x4d7a35 })),
  ];
  const folhaMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x3e7a33 }));
  const cocoMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x5a3c22 }));
  const pedraMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x7d7a72 }));
  const madeiraMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x8a6a44 }));

  const troncoGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2.2, 5);
  const copaGeometry = new THREE.SphereGeometry(1, 6, 5);
  const coqueiroSegGeometry = new THREE.CylinderGeometry(0.11, 0.16, 1.5, 5);
  // Folha com a origem na BASE (translate +X): gira em leque sem recentrar.
  const folhaGeometry = new THREE.BoxGeometry(2.0, 0.07, 0.45);
  folhaGeometry.translate(1.0, 0, 0);
  const cocoGeometry = new THREE.SphereGeometry(0.16, 5, 4);
  const pedraGeometry = new THREE.SphereGeometry(1, 5, 4);
  const mouraoGeometry = new THREE.BoxGeometry(0.14, 1.1, 0.14);

  return {
    arvore(rnd: () => number): THREE.Group {
      const tree = new THREE.Group();
      const tronco = new THREE.Mesh(troncoGeometry, troncoMaterial);
      tronco.position.y = 1.0;
      tree.add(tronco);
      const copas = 2;
      for (let i = 0; i < copas; i++) {
        const copa = new THREE.Mesh(copaGeometry, copaMaterials[i % copaMaterials.length]!);
        const s = 1.2 + rnd() * 0.8;
        copa.scale.set(s, s * (0.8 + rnd() * 0.3), s);
        copa.position.set((rnd() - 0.5) * 1.1, 2.4 + i * 0.8 + rnd() * 0.5, (rnd() - 0.5) * 1.1);
        tree.add(copa);
      }
      tree.rotation.z = (rnd() - 0.5) * 0.12; // torta, regra da casa
      tree.rotation.y = rnd() * Math.PI * 2;
      return tree;
    },

    coqueiro(rnd: () => number): THREE.Group {
      const palm = new THREE.Group();
      // Tronco curvo: 3 segmentos empilhados com inclinação acumulada.
      const lean = 0.1 + rnd() * 0.14;
      let x = 0;
      let y = 0;
      for (let i = 0; i < 3; i++) {
        const angle = lean * (i + 0.5);
        const seg = new THREE.Mesh(coqueiroSegGeometry, troncoMaterial);
        seg.rotation.z = -angle;
        seg.position.set(x + Math.sin(angle) * 0.7, y + Math.cos(angle) * 0.7, 0);
        palm.add(seg);
        x += Math.sin(angle) * 1.4;
        y += Math.cos(angle) * 1.4;
      }
      // Leque de 5 folhas caídas + coco na copa.
      for (let i = 0; i < 5; i++) {
        const folha = new THREE.Mesh(folhaGeometry, folhaMaterial);
        folha.position.set(x, y + 0.15, 0);
        folha.rotation.y = (i / 5) * Math.PI * 2 + rnd() * 0.6;
        folha.rotation.z = -0.3 - rnd() * 0.3;
        palm.add(folha);
      }
      const coco = new THREE.Mesh(cocoGeometry, cocoMaterial);
      coco.position.set(x + 0.18, y - 0.1, 0.1);
      palm.add(coco);
      palm.rotation.y = rnd() * Math.PI * 2;
      return palm;
    },

    pedra(rnd: () => number): THREE.Mesh {
      const rock = new THREE.Mesh(pedraGeometry, pedraMaterial);
      rock.scale.set(0.6 + rnd() * 1.0, 0.5 + rnd() * 0.5, 0.6 + rnd() * 1.0);
      rock.position.y = rock.scale.y * 0.55; // meio enterrada
      rock.rotation.y = rnd() * Math.PI;
      return rock;
    },

    cerca(length: number): THREE.Group {
      const fence = new THREE.Group();
      const posts = Math.max(2, Math.round(length / 2.2) + 1);
      for (let i = 0; i < posts; i++) {
        const mourao = new THREE.Mesh(mouraoGeometry, madeiraMaterial);
        mourao.position.set((i / (posts - 1)) * length - length / 2, 0.55, 0);
        mourao.rotation.z = ((i * 7919) % 10) * 0.01 - 0.05; // torto determinístico
        fence.add(mourao);
      }
      for (const railY of [0.5, 0.88]) {
        const rail = new THREE.Mesh(
          new THREE.BoxGeometry(length, 0.09, 0.05, 8, 1, 1),
          madeiraMaterial,
        );
        rail.position.y = railY;
        fence.add(rail);
      }
      return fence;
    },
  };
}
