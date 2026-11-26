import * as THREE from 'three';
import {
  AWNING_VARIANTS,
  BUILDING_VARIANTS,
  FAVELA_VARIANTS,
  createAsphaltTexture,
  createAwningTexture,
  createBuildingTexture,
  createCalcadaoTexture,
  createCrateTexture,
  createCurbTexture,
  createDirtGroundTexture,
  createFavelaTexture,
  createMorroGroundTexture,
  createRoadLineTexture,
  createSandTexture,
  makeRng,
} from './jankTextures';
import { applyVertexSnap } from './retro';
import { createNatureProps } from './props';
import type { GroundHeightFn } from './terrain';
import { CORCOVADO_X, CORCOVADO_Z } from './terrain';

/**
 * Rua de cidade tosca: asfalto rabiscado, faixas tortas, guia zebrada e prédios
 * inclinados atrás da névoa. `halfSize` vem do MapDef do mapa escolhido
 * (`gameData.arena` saiu da tabela — decisão de 2026-11-17).
 */
export function createArena(halfSize: number): THREE.Group {
  const group = new THREE.Group();
  const half = halfSize;
  const size = half * 2;

  // Chão de asfalto (tile de 4×4 unidades; a repetição à vista faz parte do tosco).
  const asphalt = createAsphaltTexture();
  asphalt.wrapS = THREE.RepeatWrapping;
  asphalt.wrapT = THREE.RepeatWrapping;
  asphalt.repeat.set(half / 2, half / 2);
  // Subdividido: com um quad único, os cantos ficam atrás da câmera e o
  // vertex snapping deformaria a parte visível (flicker ao mover).
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size, 24, 24),
    applyVertexSnap(new THREE.MeshLambertMaterial({ map: asphalt })),
  );
  floor.rotation.x = -Math.PI / 2;
  group.add(floor);

  group.add(createRoadLines(size));
  addBorders(group, half, size);
  addBuildings(group, half);
  addCityDetails(group, half);

  return group;
}

/**
 * Feira de Domingo tosca: chão de terra batida, mureta de caixotes na borda e
 * anel de barracas de lona listrada fora da área jogável (no lugar dos
 * prédios da cidade). Mesmas restrições do cenário da cidade: geometria
 * grande subdividida (vertex snapping PS1 deformaria o quad único) e nenhuma
 * colisão fora da arena.
 */
export function createFeiraArena(halfSize: number): THREE.Group {
  const group = new THREE.Group();
  const half = halfSize;
  const size = half * 2;

  // Chão de terra batida (tile de 4×4 unidades, como o asfalto da cidade).
  const dirt = createDirtGroundTexture();
  dirt.wrapS = THREE.RepeatWrapping;
  dirt.wrapT = THREE.RepeatWrapping;
  dirt.repeat.set(half / 2, half / 2);
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size, 24, 24),
    applyVertexSnap(new THREE.MeshLambertMaterial({ map: dirt })),
  );
  floor.rotation.x = -Math.PI / 2;
  group.add(floor);

  addCrateBorders(group, half, size);
  addMarketStalls(group, half);
  addFeiraDetails(group, half);

  return group;
}

/** Bordas da arena da feira: mureta baixa de caixotes de madeira. */
function addCrateBorders(group: THREE.Group, half: number, size: number): void {
  const crate = createCrateTexture();
  crate.wrapS = THREE.RepeatWrapping;
  crate.repeat.set(size / 2, 1);
  const material = applyVertexSnap(new THREE.MeshLambertMaterial({ map: crate }));

  // Eixo longo subdividido: as pontas ficam atrás da câmera (ver chão).
  const geometryX = new THREE.BoxGeometry(size + 1, 0.9, 0.6, 24, 1, 1);
  const geometryZ = new THREE.BoxGeometry(0.6, 0.9, size + 1, 1, 1, 24);
  for (const sign of [-1, 1]) {
    const wallZ = new THREE.Mesh(geometryX, material);
    wallZ.position.set(0, 0.45, sign * (half + 0.3));
    const wallX = new THREE.Mesh(geometryZ, material);
    wallX.position.set(sign * (half + 0.3), 0.45, 0);
    group.add(wallZ, wallX);
  }
}

/**
 * Anel de barracas fora da arena, cada uma torta e com lona de cor própria.
 * Como os prédios da cidade: atrás da névoa no centro, aparecem perto da
 * borda, sem colisão. Barraca = bancada de madeira + 4 pernas + lona de duas
 * águas (caixa fina inclinada) com variante de listra alternada.
 */
function addMarketStalls(group: THREE.Group, half: number): void {
  const rnd = makeRng(2027);

  const woodMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x8a6a44 }));
  const crateMaterial = applyVertexSnap(
    new THREE.MeshLambertMaterial({ map: createCrateTexture() }),
  );
  const awningMaterials: THREE.MeshLambertMaterial[] = [];
  for (let v = 0; v < AWNING_VARIANTS; v++) {
    awningMaterials.push(
      applyVertexSnap(new THREE.MeshLambertMaterial({ map: createAwningTexture(v) })),
    );
  }

  const perSide = 8;
  for (let side = 0; side < 4; side++) {
    for (let slot = 0; slot < perSide; slot++) {
      const stall = new THREE.Group();
      const width = 4.5 + rnd() * 2.5;
      const depth = 2.6 + rnd() * 1.2;
      const counterH = 1 + rnd() * 0.25;
      const roofH = 2.6 + rnd() * 0.8;

      // Bancada (caixote largo) + pernas tortas.
      const counter = new THREE.Mesh(
        new THREE.BoxGeometry(width, counterH, depth),
        crateMaterial,
      );
      counter.position.y = counterH / 2;
      stall.add(counter);

      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) {
          const leg = new THREE.Mesh(
            new THREE.BoxGeometry(0.16, roofH, 0.16),
            woodMaterial,
          );
          leg.position.set(
            sx * (width / 2 - 0.2),
            roofH / 2,
            sz * (depth / 2 - 0.15),
          );
          leg.rotation.z = (rnd() - 0.5) * 0.08;
          stall.add(leg);
        }
      }

      // Lona de duas águas: duas caixas finas inclinadas, listra da variante.
      const awning = awningMaterials[Math.floor(rnd() * AWNING_VARIANTS) % AWNING_VARIANTS]!;
      const slope = 0.42 + rnd() * 0.12;
      for (const sz of [-1, 1]) {
        const sheet = new THREE.Mesh(
          new THREE.BoxGeometry(width + 0.7, 0.08, depth / 2 + 0.55),
          awning,
        );
        sheet.position.set(0, roofH + 0.28, sz * (depth / 4 + 0.12));
        sheet.rotation.x = -sz * slope;
        stall.add(sheet);
      }

      // Posição no anel, torta como os prédios (fora da área jogável).
      const along = -half + 5 + slot * ((half * 2 - 10) / (perSide - 1)) + (rnd() - 0.5) * 3;
      const out = half + 2 + depth / 2 + rnd() * 2.5;
      stall.rotation.y = (side >= 2 ? Math.PI / 2 : 0) + (rnd() - 0.5) * 0.2;
      stall.rotation.z = (rnd() - 0.5) * 0.04;

      if (side === 0) stall.position.set(along, 0, -out);
      else if (side === 1) stall.position.set(along, 0, out);
      else if (side === 2) stall.position.set(-out, 0, along);
      else stall.position.set(out, 0, along);

      group.add(stall);
    }
  }
}

/** Duas "avenidas" cruzando o centro: faixa amarela pintada sem capricho. */
function createRoadLines(size: number): THREE.Group {
  const lines = new THREE.Group();

  const texture = createRoadLineTexture();
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, size / 8);
  // polygonOffset + altura maior afastam a faixa do chão no depth buffer
  // (sem isso ela pisca em z-fighting à distância).
  const material = applyVertexSnap(
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    }),
  );

  // Subdividida no comprimento: as pontas ficam atrás da câmera (ver chão).
  const geometry = new THREE.PlaneGeometry(0.45, size, 1, 24);
  for (const alongX of [false, true]) {
    const stripe = new THREE.Mesh(geometry, material);
    stripe.rotation.x = -Math.PI / 2;
    if (alongX) stripe.rotation.z = Math.PI / 2;
    stripe.position.y = 0.05;
    lines.add(stripe);
  }

  return lines;
}

/** Bordas da arena viram guia de calçada zebrada (amarelo/preto torto). */
function addBorders(group: THREE.Group, half: number, size: number): void {
  const curb = createCurbTexture();
  curb.wrapS = THREE.RepeatWrapping;
  curb.repeat.set(size / 4, 1);
  const material = applyVertexSnap(new THREE.MeshLambertMaterial({ map: curb }));

  // Eixo longo subdividido: as pontas ficam atrás da câmera (ver chão).
  const geometryX = new THREE.BoxGeometry(size + 1, 1, 0.5, 24, 1, 1);
  const geometryZ = new THREE.BoxGeometry(0.5, 1, size + 1, 1, 1, 24);
  for (const sign of [-1, 1]) {
    const wallZ = new THREE.Mesh(geometryX, material);
    wallZ.position.set(0, 0.5, sign * (half + 0.25));
    const wallX = new THREE.Mesh(geometryZ, material);
    wallX.position.set(sign * (half + 0.25), 0.5, 0);
    group.add(wallZ, wallX);
  }
}

/**
 * Anel de prédios fora da arena, cada um levemente girado e inclinado (torto de
 * propósito). Ficam atrás da névoa no centro e aparecem quando o jogador chega
 * perto da borda. Sem colisão: estão fora da área jogável.
 */
function addBuildings(group: THREE.Group, half: number): void {
  const rnd = makeRng(2026);

  const roofMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x3a3230 }));
  const wallMaterials: THREE.MeshLambertMaterial[] = [];
  for (let v = 0; v < BUILDING_VARIANTS; v++) {
    wallMaterials.push(
      applyVertexSnap(new THREE.MeshLambertMaterial({ map: createBuildingTexture(v) })),
    );
  }

  const perSide = 7;
  for (let side = 0; side < 4; side++) {
    for (let slot = 0; slot < perSide; slot++) {
      const width = 6 + rnd() * 5;
      const height = 6 + rnd() * 12;
      const depth = 5 + rnd() * 4;
      const along = -half + 6 + slot * ((half * 2 - 12) / (perSide - 1)) + (rnd() - 0.5) * 4;
      const out = half + 2.5 + depth / 2 + rnd() * 3;

      const wall = wallMaterials[Math.floor(rnd() * BUILDING_VARIANTS) % BUILDING_VARIANTS]!;
      const building = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), [
        wall,
        wall,
        roofMaterial,
        roofMaterial,
        wall,
        wall,
      ]);

      building.rotation.y = (side >= 2 ? Math.PI / 2 : 0) + (rnd() - 0.5) * 0.14;
      building.rotation.z = (rnd() - 0.5) * 0.05;

      if (side === 0) building.position.set(along, height / 2 - 0.2, -out);
      else if (side === 1) building.position.set(along, height / 2 - 0.2, out);
      else if (side === 2) building.position.set(-out, height / 2 - 0.2, along);
      else building.position.set(out, height / 2 - 0.2, along);

      group.add(building);
    }
  }
}

// ---------------------------------------------------------------------------
// Rio de Janeiro (2026-11-23): o primeiro mapa com RELEVO. O chão é a malha
// deformada pela MESMA função de altura que o resto do render usa para
// assentar as entidades (render/terrain.ts) — chão e pés nunca divergem.
// Revisão de 2026-11-23: o CORCOVADO virou RELEVO JOGÁVEL (pico dentro da
// arena, com o Cristo decorativo plantado no topo pela mesma função de
// altura — "escalar" é andar morro acima; o Cristo não colide, como todo o
// cenário). Cartões-postais que seguem fora da área jogável: Pão de Açúcar
// com bondinho, casario colorido no morro e a orla de Copacabana (calçadão de
// onda, areia, guarda-sóis e mar) na borda +Z. Sem colisão, como os prédios.
// ---------------------------------------------------------------------------

/**
 * Deforma uma malha de chão (já rotacionada para o plano XZ e TRANSLADADA
 * para a posição de mundo) com a função de altura, e recalcula as normais
 * para a luz acompanhar o morro. `lift` afasta forros decorativos do chão
 * base (complemento do polygonOffset contra z-fighting).
 */
function displaceGround(geometry: THREE.BufferGeometry, ground: GroundHeightFn, lift = 0): void {
  const positions = geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < positions.count; i++) {
    positions.setY(i, ground(positions.getX(i), positions.getZ(i)) + lift);
  }
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
}

export function createRioArena(halfSize: number, ground: GroundHeightFn): THREE.Group {
  const group = new THREE.Group();
  const half = halfSize;
  const size = half * 2;

  // Chão de morro deformado pelo relevo, estendido além da borda para dar
  // base aos cartões-postais (128×128 segmentos: com halfSize 110 isso dá
  // ~2,2 u por segmento — as lombadas pequenas do relevo têm sigma ~9 u e
  // precisam disso para o chão não divergir dos pés das entidades, que usam a
  // função exata; as pontas atrás da câmera não deformam com o vertex snapping).
  const morroGround = createMorroGroundTexture();
  morroGround.wrapS = THREE.RepeatWrapping;
  morroGround.wrapT = THREE.RepeatWrapping;
  morroGround.repeat.set((half + 30) / 2, (half + 30) / 2);
  const floorGeometry = new THREE.PlaneGeometry(size + 60, size + 60, 128, 128);
  floorGeometry.rotateX(-Math.PI / 2);
  displaceGround(floorGeometry, ground);
  const floor = new THREE.Mesh(
    floorGeometry,
    applyVertexSnap(new THREE.MeshLambertMaterial({ map: morroGround })),
  );
  group.add(floor);

  addCalcadao(group, half, ground);
  addPraia(group, half, ground);
  addMureta(group, half, size, ground);
  addCristoNoCorcovado(group, ground);
  addPaoDeAcucar(group, half);
  addCasarioDoMorro(group, half, ground);
  addRioDetails(group, half, ground);

  return group;
}

/**
 * Soma a altura do relevo ao Y de cada vértice (geometria já TRANSLADADA para
 * a posição de mundo). Diferente de displaceGround, PRESERVA a forma: usada na
 * mureta, que acompanha o morro sem deixar de ser uma mureta. As normais
 * originais ficam (o cisalhamento vertical é leve; recalcular arredondaria a
 * caixa).
 */
function raiseOnGround(geometry: THREE.BufferGeometry, ground: GroundHeightFn): void {
  const positions = geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < positions.count; i++) {
    positions.setY(i, positions.getY(i) + ground(positions.getX(i), positions.getZ(i)));
  }
  positions.needsUpdate = true;
}

/**
 * Calçadão de Copacabana: faixa com a onda de pedra portuguesa colada na
 * borda +Z, POR DENTRO da arena (o relevo deita ali — ver rioGroundHeight).
 * Forro sobre o chão: polygonOffset + lift, como as faixas da avenida.
 */
function addCalcadao(group: THREE.Group, half: number, ground: GroundHeightFn): void {
  const texture = createCalcadaoTexture();
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.set((half * 2) / 8, 1);
  const material = applyVertexSnap(
    new THREE.MeshLambertMaterial({
      map: texture,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    }),
  );

  const geometry = new THREE.PlaneGeometry(half * 2, 6, 48, 2);
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, 0, half - 3);
  displaceGround(geometry, ground, 0.06);
  group.add(new THREE.Mesh(geometry, material));
}

/**
 * Praia além da borda +Z: areia descendo ao mar (o declive vem da função de
 * altura), lâmina d'água plana e guarda-sóis de lona listrada tortos.
 */
function addPraia(group: THREE.Group, half: number, ground: GroundHeightFn): void {
  const rnd = makeRng(1962);

  const sand = createSandTexture();
  sand.wrapS = THREE.RepeatWrapping;
  sand.wrapT = THREE.RepeatWrapping;
  sand.repeat.set((half + 30) / 2, 5);
  const sandGeometry = new THREE.PlaneGeometry(half * 2 + 60, 20, 48, 6);
  sandGeometry.rotateX(-Math.PI / 2);
  sandGeometry.translate(0, 0, half + 10);
  displaceGround(sandGeometry, ground, 0.05);
  const sandMaterial = applyVertexSnap(
    new THREE.MeshLambertMaterial({
      map: sand,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    }),
  );
  group.add(new THREE.Mesh(sandGeometry, sandMaterial));

  // Mar: lâmina plana acima da areia afundada (a areia chega a ~-2,1; o mar
  // cobre a partir de -1,95). Basic, não Lambert: água "brilha" como os orbes.
  const seaGeometry = new THREE.PlaneGeometry(half * 2 + 160, 90, 24, 4);
  seaGeometry.rotateX(-Math.PI / 2);
  const sea = new THREE.Mesh(
    seaGeometry,
    applyVertexSnap(new THREE.MeshBasicMaterial({ color: 0x1f4e6e })),
  );
  sea.position.set(0, -1.95, half + 12 + 45);
  group.add(sea);

  // Guarda-sóis tortos na faixa de areia, com a lona listrada das barracas.
  const poleMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x8a6a44 }));
  for (let i = 0; i < 13; i++) {
    const x = -half + 8 + i * ((half * 2 - 16) / 12) + (rnd() - 0.5) * 5;
    const z = half + 3.5 + rnd() * 5;
    const base = ground(x, z);

    const umbrella = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.4, 5), poleMaterial);
    pole.position.y = 1.2;
    const canvasTexture = createAwningTexture(Math.floor(rnd() * AWNING_VARIANTS));
    const top = new THREE.Mesh(
      new THREE.ConeGeometry(1.6, 0.8, 7),
      applyVertexSnap(new THREE.MeshLambertMaterial({ map: canvasTexture })),
    );
    top.position.y = 2.4;
    umbrella.add(pole, top);
    umbrella.position.set(x, base, z);
    umbrella.rotation.z = (rnd() - 0.5) * 0.3; // enterrado de qualquer jeito
    group.add(umbrella);
  }
}

/**
 * Mureta branca baixa do calçadão em volta da arena (a borda jogável). Cada
 * trecho é transladado para a posição de mundo e ERGUIDO pelo relevo
 * (raiseOnGround): nos morros da borda a mureta sobe junto em vez de ficar
 * enterrada. Eixo longo bem subdividido (48) para acompanhar as encostas.
 */
function addMureta(group: THREE.Group, half: number, size: number, ground: GroundHeightFn): void {
  const material = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xcfc8b4 }));
  for (const sign of [-1, 1]) {
    const geometryX = new THREE.BoxGeometry(size + 1, 0.7, 0.45, 96, 1, 1);
    geometryX.translate(0, 0.35, sign * (half + 0.22));
    raiseOnGround(geometryX, ground);
    const geometryZ = new THREE.BoxGeometry(0.45, 0.7, size + 1, 1, 1, 96);
    geometryZ.translate(sign * (half + 0.22), 0.35, 0);
    raiseOnGround(geometryZ, ground);
    group.add(new THREE.Mesh(geometryX, material), new THREE.Mesh(geometryZ, material));
  }
}

/**
 * Cristo de braços abertos no TOPO do Corcovado jogável (revisão 2026-11-23):
 * a montanha agora é o próprio relevo (pico em CORCOVADO_X/Z — terrain.ts), e
 * o Cristo de primitivas brancas é plantado na altura que a MESMA função de
 * altura dá para o pico — subir o morro leva até os pés dele. Decorativo, sem
 * colisão, como todo o cenário. Aparece da névoa durante a subida.
 */
function addCristoNoCorcovado(group: THREE.Group, ground: GroundHeightFn): void {
  const stoneMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xe8e4da }));

  // Cristo: pedestal + túnica (cone truncado) + braços abertos + cabeça.
  const cristo = new THREE.Group();
  const pedestal = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 2.4), stoneMaterial);
  pedestal.position.y = 1.1;
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.6, 6.5, 6), stoneMaterial);
  body.position.y = 2.2 + 3.25;
  const arms = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.9, 1.0), stoneMaterial);
  arms.position.y = 7.6;
  arms.rotation.z = 0.04; // um braço levemente mais alto: o tosco da casa
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.75, 6, 5), stoneMaterial);
  head.position.y = 8.9;
  cristo.add(pedestal, body, arms, head);
  // No pico do relevo, de frente para o centro da arena (o Cristo olha a
  // cidade): yaw = direção do pico ao (0,0). Pedestal meio afundado no morro
  // (-0.3) para não flutuar na curvatura do topo.
  cristo.position.set(CORCOVADO_X, ground(CORCOVADO_X, CORCOVADO_Z) - 0.3, CORCOVADO_Z);
  cristo.rotation.y = Math.atan2(-CORCOVADO_X, -CORCOVADO_Z);
  group.add(cristo);
}

/**
 * Pão de Açúcar atrás do canto +X/-Z: os dois morros arredondados (Urca na
 * frente, Pão de Açúcar atrás) e o bondinho pendurado no cabo entre eles.
 */
function addPaoDeAcucar(group: THREE.Group, half: number): void {
  const rockMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x6e6256 }));

  // Meia-elipsoide: esfera esticada no Y e afundada — a silhueta do bloco.
  const urca = new THREE.Mesh(new THREE.SphereGeometry(9, 8, 7), rockMaterial);
  urca.scale.set(1, 1.6, 0.9);
  urca.position.set(half + 10, 5.5, -30);
  const pao = new THREE.Mesh(new THREE.SphereGeometry(12, 8, 7), rockMaterial);
  pao.scale.set(1, 1.9, 0.9);
  pao.position.set(half + 26, 9, -14);
  group.add(urca, pao);

  // Bondinho: cabo reto entre os topos e a cabininha pendurada no meio.
  const top1 = new THREE.Vector3(half + 10, 19.2, -30);
  const top2 = new THREE.Vector3(half + 26, 30, -14);
  const span = new THREE.Vector3().subVectors(top2, top1);
  const cable = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, span.length(), 4),
    applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x2a2824 })),
  );
  cable.position.copy(top1).addScaledVector(span, 0.5);
  cable.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    span.clone().normalize(),
  );
  const car = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 1.1, 1.6),
    applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xd9d4c4 })),
  );
  car.position.copy(top1).addScaledVector(span, 0.45);
  car.position.y -= 0.9;
  group.add(cable, car);
}

/**
 * Casario colorido atrás da borda -X: caixinhas com a textura de casinha (cor
 * própria por variante) e laje de concreto. Cada casinha é ASSENTADA no chão
 * real (`ground`, meio enterrada para a encosta não deixar canto no ar) —
 * correção de 2026-11-23: o degrau artificial `out * 0.55` que simulava a
 * encosta deixava o casario FLUTUANDO acima do chão deformado de verdade.
 * Quem dá a subida agora é o próprio relevo (morros oeste em terrain.ts).
 */
function addCasarioDoMorro(group: THREE.Group, half: number, ground: GroundHeightFn): void {
  const rnd = makeRng(2127);
  const lajeMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x9a938a }));
  const wallMaterials: THREE.MeshLambertMaterial[] = [];
  for (let v = 0; v < FAVELA_VARIANTS; v++) {
    wallMaterials.push(
      applyVertexSnap(new THREE.MeshLambertMaterial({ map: createFavelaTexture(v) })),
    );
  }

  for (let i = 0; i < 28; i++) {
    const out = 3 + rnd() * 16; // distância além da borda (dentro do chão estendido)
    const x = -(half + out);
    const z = -44 + rnd() * 88;
    const w = 1.8 + rnd() * 1.2;
    const h = 1.8 + rnd() * 1.4;
    const d = 1.8 + rnd() * 1.2;
    // No chão REAL, meio enterrada (-0.35): na encosta o lado morro engole a
    // base e o lado vale não mostra canto flutuando.
    const base = ground(x, z) - 0.35;

    const house = new THREE.Group();
    const wall = wallMaterials[Math.floor(rnd() * FAVELA_VARIANTS) % FAVELA_VARIANTS]!;
    const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wall);
    box.position.y = h / 2;
    const laje = new THREE.Mesh(new THREE.BoxGeometry(w + 0.3, 0.14, d + 0.3), lajeMaterial);
    laje.position.y = h + 0.07;
    house.add(box, laje);
    house.position.set(x, base, z);
    house.rotation.y = (rnd() - 0.5) * 0.5;
    house.rotation.z = (rnd() - 0.5) * 0.06;
    group.add(house);
  }
}

// ---------------------------------------------------------------------------
// Ambientação pesada por mapa (2026-11-24): cada mapa ganha o recheio da sua
// identidade — a cidade é OBRA no entardecer (postes acesos, guindaste,
// andaimes, caçambas), a feira é MANHÃ DE INTERIOR (árvores, bandeirinhas,
// frutas e uma fazenda inteira no fundo) e o Rio é ORLA + MATA (coqueiros,
// mata nas encostas, barcos, quiosques). Tudo cenário SEM COLISÃO, no estilo
// tosco da casa; props dentro da arena são finos (postes, troncos) — o
// atravessar faz parte do jank assumido.
// ---------------------------------------------------------------------------

/**
 * Cidade: detalhe de obra no entardecer. Postes de luz ACESOS ao longo das
 * avenidas (lâmpada Basic + mancha de luz no asfalto — o céu do mapa é o
 * entardecer de sky.ts), bueiros no chão, e fora da borda o canteiro de
 * obras: guindaste, prédio em esqueleto, andaimes nos prédios, caçambas de
 * entulho, montes de areia/brita e placas zebradas. (As faixas de pedestre
 * de 2026-11-24 saíram no mesmo dia, a pedido do autor.)
 */
function addCityDetails(group: THREE.Group, half: number): void {
  const rnd = makeRng(1930);

  // Bueiros: círculos escuros espalhados no asfalto.
  const bueiroMaterial = applyVertexSnap(
    new THREE.MeshBasicMaterial({
      color: 0x26242a,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    }),
  );
  const bueiroGeometry = new THREE.CircleGeometry(0.5, 8);
  for (let i = 0; i < 8; i++) {
    const bueiro = new THREE.Mesh(bueiroGeometry, bueiroMaterial);
    bueiro.rotation.x = -Math.PI / 2;
    bueiro.position.set((rnd() - 0.5) * (half * 2 - 16), 0.04, (rnd() - 0.5) * (half * 2 - 16));
    group.add(bueiro);
  }

  // Postes de luz acesos ao longo das avenidas (o entardecer pede luz).
  const posteMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x4a4a52 }));
  const lampadaMaterial = applyVertexSnap(new THREE.MeshBasicMaterial({ color: 0xffd98a }));
  const manchaMaterial = new THREE.MeshBasicMaterial({
    color: 0xffc96b,
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  const hasteGeometry = new THREE.CylinderGeometry(0.09, 0.12, 4.4, 5);
  const bracoGeometry = new THREE.BoxGeometry(1.2, 0.12, 0.12);
  const lampadaGeometry = new THREE.BoxGeometry(0.5, 0.2, 0.3);
  const manchaGeometry = new THREE.CircleGeometry(2.6, 10);
  for (let i = 0; i < 10; i++) {
    const alongAvenueX = i < 5;
    const along = -40 + (i % 5) * 20;
    const side = i % 2 === 0 ? 1 : -1;
    const x = alongAvenueX ? along : side * 4;
    const z = alongAvenueX ? side * 4 : along;

    const poste = new THREE.Group();
    const haste = new THREE.Mesh(hasteGeometry, posteMaterial);
    haste.position.y = 2.2;
    const braco = new THREE.Mesh(bracoGeometry, posteMaterial);
    braco.position.set(-0.55, 4.3, 0);
    const lampada = new THREE.Mesh(lampadaGeometry, lampadaMaterial);
    lampada.position.set(-1.05, 4.2, 0);
    poste.add(haste, braco, lampada);
    // Braço apontando para a pista (o centro da avenida).
    poste.rotation.y = alongAvenueX ? (side > 0 ? Math.PI / 2 : -Math.PI / 2) : side > 0 ? Math.PI : 0;
    poste.rotation.z = (rnd() - 0.5) * 0.05;
    poste.position.set(x, 0, z);
    group.add(poste);

    const mancha = new THREE.Mesh(manchaGeometry, manchaMaterial);
    mancha.rotation.x = -Math.PI / 2;
    mancha.position.set(alongAvenueX ? x : x - side * 1.05, 0.03, alongAvenueX ? z - side * 1.05 : z);
    group.add(mancha);
  }

  // Caçambas de entulho tortas junto à guia, por fora.
  const cacambaMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xb0582a }));
  const entulhoMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x8a8a90 }));
  const cacambaGeometry = new THREE.BoxGeometry(2.6, 1.0, 1.3);
  const entulhoGeometry = new THREE.SphereGeometry(0.4, 5, 4);
  for (let i = 0; i < 4; i++) {
    const side = i % 2 === 0 ? 1 : -1;
    const x = i < 2 ? side * (half + 1.6) : -30 + i * 20;
    const z = i < 2 ? -20 + i * 30 : side * (half + 1.6);
    const cacamba = new THREE.Group();
    const caixa = new THREE.Mesh(cacambaGeometry, cacambaMaterial);
    caixa.position.y = 0.55;
    cacamba.add(caixa);
    for (let e = 0; e < 2; e++) {
      const entulho = new THREE.Mesh(entulhoGeometry, entulhoMaterial);
      entulho.position.set((rnd() - 0.5) * 1.6, 1.1, (rnd() - 0.5) * 0.6);
      cacamba.add(entulho);
    }
    cacamba.rotation.y = (i < 2 ? 0 : Math.PI / 2) + (rnd() - 0.5) * 0.3;
    cacamba.position.set(x, 0, z);
    group.add(cacamba);
  }

  // Montes de areia e brita do canteiro, fora da borda.
  const areiaMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xc9a86a }));
  const britaMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x8a8a90 }));
  const monteGeometry = new THREE.ConeGeometry(1.8, 1.3, 7);
  for (let i = 0; i < 5; i++) {
    const monte = new THREE.Mesh(monteGeometry, i % 2 === 0 ? areiaMaterial : britaMaterial);
    const side = Math.floor(rnd() * 4);
    const along = (rnd() - 0.5) * (half * 2 - 20);
    const out = half + 2 + rnd() * 3;
    if (side === 0) monte.position.set(along, 0.6, -out);
    else if (side === 1) monte.position.set(along, 0.6, out);
    else if (side === 2) monte.position.set(-out, 0.6, along);
    else monte.position.set(out, 0.6, along);
    monte.rotation.y = rnd() * Math.PI;
    group.add(monte);
  }

  // Guindaste amarelo: o marco da obra, recortado contra o entardecer.
  const guindasteMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xd9a21b }));
  const escuroMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x3a3630 }));
  const torre = new THREE.Mesh(new THREE.BoxGeometry(1.4, 28, 1.4), guindasteMaterial);
  torre.position.set(-(half + 16), 14, -18);
  const lanca = new THREE.Mesh(new THREE.BoxGeometry(20, 1.0, 1.0), guindasteMaterial);
  lanca.position.set(-(half + 16) + 7, 27.8, -18);
  lanca.rotation.y = 0.2;
  const contrapeso = new THREE.Mesh(new THREE.BoxGeometry(3, 1.6, 1.6), escuroMaterial);
  contrapeso.position.set(-(half + 16) - 4.5, 27.6, -17.2);
  const cabo = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 11, 4), escuroMaterial);
  cabo.position.set(-(half + 16) + 15.6, 22, -16.2);
  const gancho = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.5), escuroMaterial);
  gancho.position.set(-(half + 16) + 15.6, 16.2, -16.2);
  group.add(torre, lanca, contrapeso, cabo, gancho);

  // Prédio em esqueleto de concreto ao lado do guindaste.
  const concretoMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x8f8a82 }));
  const lajeGeometry = new THREE.BoxGeometry(10, 0.5, 8);
  const pilarGeometry = new THREE.BoxGeometry(0.5, 12.5, 0.5);
  for (let andar = 0; andar < 3; andar++) {
    const laje = new THREE.Mesh(lajeGeometry, concretoMaterial);
    laje.position.set(-(half + 10), 4 + andar * 4, 0);
    laje.rotation.y = 0.08;
    group.add(laje);
  }
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const pilar = new THREE.Mesh(pilarGeometry, concretoMaterial);
      pilar.position.set(-(half + 10) + sx * 4.4, 6.25, sz * 3.4);
      group.add(pilar);
    }
  }

  // Andaimes na frente de dois prédios (tubos + tábuas).
  const tuboMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x7a8086 }));
  const tabuaMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x8a6a44 }));
  const tuboVGeometry = new THREE.BoxGeometry(0.12, 6.5, 0.12);
  const tuboHGeometry = new THREE.BoxGeometry(4.6, 0.1, 0.1);
  const tabuaGeometry = new THREE.BoxGeometry(4.6, 0.1, 0.7);
  for (const [ax, az, turn] of [
    [10, -(half + 2.4), 0],
    [-(half + 2.4), 14, Math.PI / 2],
  ] as const) {
    const andaime = new THREE.Group();
    for (const sx of [-2.2, 2.2]) {
      for (const sz of [-0.4, 0.4]) {
        const tubo = new THREE.Mesh(tuboVGeometry, tuboMaterial);
        tubo.position.set(sx, 3.25, sz);
        andaime.add(tubo);
      }
    }
    for (const level of [2.2, 4.4]) {
      for (const sz of [-0.4, 0.4]) {
        const barra = new THREE.Mesh(tuboHGeometry, tuboMaterial);
        barra.position.set(0, level + 0.35, sz);
        andaime.add(barra);
      }
      const tabua = new THREE.Mesh(tabuaGeometry, tabuaMaterial);
      tabua.position.set(0, level, 0);
      tabua.rotation.z = (rnd() - 0.5) * 0.04;
      andaime.add(tabua);
    }
    andaime.rotation.y = turn + (rnd() - 0.5) * 0.08;
    andaime.position.set(ax, 0, az);
    group.add(andaime);
  }

  // Placas de obra zebradas (a mesma zebra da guia) em cavaletes.
  const placaMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ map: createCurbTexture() }));
  const pernaGeometry = new THREE.BoxGeometry(0.1, 1.0, 0.1);
  const placaGeometry = new THREE.BoxGeometry(2.2, 0.9, 0.1);
  for (let i = 0; i < 4; i++) {
    const placa = new THREE.Group();
    const tabela = new THREE.Mesh(placaGeometry, placaMaterial);
    tabela.position.y = 1.2;
    placa.add(tabela);
    for (const sx of [-0.9, 0.9]) {
      const perna = new THREE.Mesh(pernaGeometry, posteMaterial);
      perna.position.set(sx, 0.5, 0);
      placa.add(perna);
    }
    const corner = i % 4;
    const cx = (corner % 2 === 0 ? -1 : 1) * (half - 6);
    const cz = (corner < 2 ? -1 : 1) * (half + 1.8);
    placa.position.set(cx, 0, cz);
    placa.rotation.y = (rnd() - 0.5) * 0.6;
    placa.rotation.z = (rnd() - 0.5) * 0.08;
    group.add(placa);
  }
}

/**
 * Feira: manhã de interior. Árvores de praça atrás das barracas, varais de
 * bandeirinhas cruzando a arena de canto a canto, caixotes de fruta, a Kombi
 * do feirante, a igrejinha do largo — e uma FAZENDA inteira além da borda -X:
 * cerca de madeira, fileiras de plantação, espantalho, galinheiro e trator.
 */
function addFeiraDetails(group: THREE.Group, half: number): void {
  const rnd = makeRng(1964);
  const nature = createNatureProps();

  // Árvores de praça no anel de fora, entre as barracas.
  for (let i = 0; i < 14; i++) {
    const tree = nature.arvore(rnd);
    const side = i % 4;
    const along = (rnd() - 0.5) * (half * 2 - 12);
    const out = half + 6 + rnd() * 9;
    if (side === 0) tree.position.set(along, 0, -out);
    else if (side === 1) tree.position.set(along, 0, out);
    else if (side === 2) tree.position.set(-out, 0, along);
    else tree.position.set(out, 0, along);
    tree.scale.setScalar(1.1 + rnd() * 0.7);
    group.add(tree);
  }

  // Varais de bandeirinhas nas DIAGONAIS da arena (altura ~7 u: por cima de
  // todo mundo), pendurados em postes de madeira nos 4 cantos.
  const madeiraMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x8a6a44 }));
  const posteGeometry = new THREE.CylinderGeometry(0.08, 0.11, 7.4, 5);
  const corner = half - 2;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const poste = new THREE.Mesh(posteGeometry, madeiraMaterial);
      poste.position.set(sx * corner, 3.7, sz * corner);
      poste.rotation.z = (rnd() - 0.5) * 0.06;
      group.add(poste);
    }
  }
  const bandeiraGeometry = new THREE.BoxGeometry(0.55, 0.45, 0.05);
  const bandeiraMaterials = [0xd94f4f, 0x3f7ad9, 0xe8c23a, 0x4da84a, 0xd9742a].map((color) =>
    applyVertexSnap(new THREE.MeshLambertMaterial({ color })),
  );
  for (const diag of [1, -1]) {
    const fromX = -corner;
    const fromZ = -corner * diag;
    const toX = corner;
    const toZ = corner * diag;
    const flags = 32;
    const angle = Math.atan2(toZ - fromZ, toX - fromX);
    for (let i = 1; i < flags; i++) {
      const t = i / flags;
      const bandeira = new THREE.Mesh(
        bandeiraGeometry,
        bandeiraMaterials[i % bandeiraMaterials.length]!,
      );
      bandeira.position.set(
        fromX + (toX - fromX) * t,
        7.1 - 2.2 * (4 * t * (1 - t)), // barriga do varal
        fromZ + (toZ - fromZ) * t,
      );
      bandeira.rotation.y = -angle;
      bandeira.rotation.z = (rnd() - 0.5) * 0.3;
      group.add(bandeira);
    }
  }

  // Caixotes de fruta na boca das barracas (por fora da mureta).
  const caixoteMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ map: createCrateTexture() }));
  const caixoteGeometry = new THREE.BoxGeometry(1.1, 0.5, 0.8);
  const frutaGeometry = new THREE.SphereGeometry(0.18, 6, 5);
  const frutaMaterials = [0xe8862a, 0x9ac23a, 0x2f7a3a, 0xd9b02a].map((color) =>
    applyVertexSnap(new THREE.MeshLambertMaterial({ color })),
  );
  for (let i = 0; i < 10; i++) {
    const side = i % 4;
    const along = (rnd() - 0.5) * (half * 2 - 16);
    const out = half + 1.8 + rnd() * 2.5;
    const banca = new THREE.Group();
    const caixote = new THREE.Mesh(caixoteGeometry, caixoteMaterial);
    caixote.position.y = 0.25;
    banca.add(caixote);
    for (let f = 0; f < 3; f++) {
      const fruta = new THREE.Mesh(frutaGeometry, frutaMaterials[(i + f) % frutaMaterials.length]!);
      fruta.position.set((f - 1) * 0.3, 0.6, (rnd() - 0.5) * 0.3);
      banca.add(fruta);
    }
    if (side === 0) banca.position.set(along, 0, -out);
    else if (side === 1) banca.position.set(along, 0, out);
    else if (side === 2) banca.position.set(-out, 0, along);
    else banca.position.set(out, 0, along);
    banca.rotation.y = rnd() * Math.PI;
    group.add(banca);
  }

  // Kombi do feirante, estacionada de qualquer jeito atrás das barracas.
  const kombi = new THREE.Group();
  const kombiCorpo = new THREE.Mesh(
    new THREE.BoxGeometry(4.0, 1.7, 1.8),
    applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xd8e2e4 })),
  );
  kombiCorpo.position.y = 1.15;
  const kombiFaixa = new THREE.Mesh(
    new THREE.BoxGeometry(4.02, 0.7, 1.82),
    applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x3f7ad9 })),
  );
  kombiFaixa.position.y = 0.75;
  const kombiJanelas = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 0.5, 1.86),
    applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x2a3038 })),
  );
  kombiJanelas.position.y = 1.65;
  kombi.add(kombiCorpo, kombiFaixa, kombiJanelas);
  const rodaMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x1c1a20 }));
  const rodaGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 8);
  for (const sx of [-1.3, 1.3]) {
    for (const sz of [-0.95, 0.95]) {
      const roda = new THREE.Mesh(rodaGeometry, rodaMaterial);
      roda.rotation.x = Math.PI / 2;
      roda.position.set(sx, 0.35, sz);
      kombi.add(roda);
    }
  }
  kombi.position.set(14, 0, half + 6.5);
  kombi.rotation.y = 0.5;
  group.add(kombi);

  // Igrejinha do largo, o marco do mapa, atrás das barracas de +X.
  const igrejaMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xe8e2d4 }));
  const telhaMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xa05238 }));
  const igreja = new THREE.Group();
  const nave = new THREE.Mesh(new THREE.BoxGeometry(6, 3.5, 8), igrejaMaterial);
  nave.position.y = 1.75;
  const telhado = new THREE.Mesh(new THREE.ConeGeometry(4.6, 2.4, 4), telhaMaterial);
  telhado.position.y = 4.7;
  telhado.rotation.y = Math.PI / 4;
  telhado.scale.z = 1.3;
  const torreIgreja = new THREE.Mesh(new THREE.BoxGeometry(2, 6.5, 2), igrejaMaterial);
  torreIgreja.position.set(0, 3.25, 4.6);
  const torreTopo = new THREE.Mesh(new THREE.ConeGeometry(1.6, 1.4, 4), telhaMaterial);
  torreTopo.position.set(0, 7.2, 4.6);
  torreTopo.rotation.y = Math.PI / 4;
  const cruzV = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.0, 0.1), igrejaMaterial);
  cruzV.position.set(0, 8.3, 4.6);
  const cruzH = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.1), igrejaMaterial);
  cruzH.position.set(0, 8.4, 4.6);
  igreja.add(nave, telhado, torreIgreja, torreTopo, cruzV, cruzH);
  igreja.position.set(half + 12, 0, -8);
  igreja.rotation.y = -Math.PI / 2 + 0.1;
  group.add(igreja);

  // FAZENDA além da borda -X: cerca com porteira, plantação em fileiras,
  // espantalho, galinheiro e o tratorzinho.
  for (const sz of [-1, 1]) {
    const cerca = nature.cerca(42);
    cerca.rotation.y = Math.PI / 2;
    cerca.position.set(-(half + 4), 0, sz * 24);
    group.add(cerca);
  }
  const tufoGeometry = new THREE.ConeGeometry(0.35, 0.75, 5);
  const tufoMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x4d8a3a }));
  for (let row = 0; row < 5; row++) {
    for (let p = 0; p < 9; p++) {
      const tufo = new THREE.Mesh(tufoGeometry, tufoMaterial);
      tufo.position.set(
        -(half + 9 + row * 3.2) + (rnd() - 0.5) * 0.6,
        0.35,
        -18 + p * 4.5 + (rnd() - 0.5) * 1.2,
      );
      tufo.rotation.y = rnd() * Math.PI;
      group.add(tufo);
    }
  }
  // Espantalho de braços abertos no meio da roça.
  const espantalho = new THREE.Group();
  const estaca = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 2.2, 5), madeiraMaterial);
  estaca.position.y = 1.1;
  const bracos = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.1, 0.1), madeiraMaterial);
  bracos.position.y = 1.65;
  const camisa = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.8, 0.4),
    applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xb04038 })),
  );
  camisa.position.y = 1.4;
  const palhaMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xd9c27a }));
  const cabeca = new THREE.Mesh(new THREE.SphereGeometry(0.28, 6, 5), palhaMaterial);
  cabeca.position.y = 2.1;
  const chapeu = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.35, 6), palhaMaterial);
  chapeu.position.y = 2.42;
  espantalho.add(estaca, bracos, camisa, cabeca, chapeu);
  espantalho.position.set(-(half + 14), 0, -26);
  espantalho.rotation.y = 0.4;
  espantalho.rotation.z = 0.06;
  group.add(espantalho);
  // Galinheiro (o mapa tem galinha de sobra).
  const galinheiro = new THREE.Group();
  const casinha = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 1.2), madeiraMaterial);
  casinha.position.y = 0.6;
  const telhadoGalinheiro = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.1, 1.5), telhaMaterial);
  telhadoGalinheiro.position.y = 1.28;
  telhadoGalinheiro.rotation.z = 0.12;
  const portinha = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.5, 0.05),
    applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x2a2420 })),
  );
  portinha.position.set(0, 0.35, 0.62);
  galinheiro.add(casinha, telhadoGalinheiro, portinha);
  galinheiro.position.set(-(half + 8), 0, -31);
  galinheiro.rotation.y = -0.3;
  group.add(galinheiro);
  // Tratorzinho vermelho parado na roça.
  const trator = new THREE.Group();
  const tratorCorpo = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 1.0, 1.3),
    applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xb04038 })),
  );
  tratorCorpo.position.y = 0.95;
  const chamine = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6, 5), rodaMaterial);
  chamine.position.set(0.8, 1.7, 0);
  trator.add(tratorCorpo, chamine);
  const rodaTraseiraGeometry = new THREE.CylinderGeometry(0.62, 0.62, 0.3, 8);
  for (const sz of [-0.8, 0.8]) {
    const tras = new THREE.Mesh(rodaTraseiraGeometry, rodaMaterial);
    tras.rotation.x = Math.PI / 2;
    tras.position.set(-0.7, 0.62, sz);
    const frente = new THREE.Mesh(rodaGeometry, rodaMaterial);
    frente.rotation.x = Math.PI / 2;
    frente.position.set(0.85, 0.35, sz);
    trator.add(tras, frente);
  }
  trator.position.set(-(half + 18), 0, 8);
  trator.rotation.y = 2.1;
  group.add(trator);
}

/**
 * Rio: orla + mata. Coqueiros no calçadão (dentro da arena — tronco fino,
 * atravessável como todo cenário) e na areia, mata atlântica e pedras nas
 * ENCOSTAS dos morros (amostragem por rejeição na própria função de altura:
 * nunca no plano do spawn, nunca no cume do Corcovado), barcos no mar,
 * quiosques e trave de futebol na praia, e o anel de mureta do mirante em
 * volta do Cristo no topo.
 */
function addRioDetails(group: THREE.Group, half: number, ground: GroundHeightFn): void {
  const rnd = makeRng(2016);
  const nature = createNatureProps();

  // Coqueiros do calçadão (faixa plana da orla, dentro da arena).
  for (let i = 0; i < 10; i++) {
    const palm = nature.coqueiro(rnd);
    const x = -half + 12 + i * ((half * 2 - 24) / 9) + (rnd() - 0.5) * 6;
    const z = half - 5.5 + (rnd() - 0.5) * 2;
    palm.position.set(x, ground(x, z), z);
    palm.scale.setScalar(1.0 + rnd() * 0.35);
    group.add(palm);
  }
  // Coqueiros da areia, já fora da arena.
  for (let i = 0; i < 4; i++) {
    const palm = nature.coqueiro(rnd);
    const x = -half + 20 + rnd() * (half * 2 - 40);
    const z = half + 4 + rnd() * 5;
    palm.position.set(x, ground(x, z), z);
    group.add(palm);
  }

  // Mata e pedras nas encostas: rejeição na altura do relevo — aceita só
  // encosta (nem o plano do spawn, nem o cume do Corcovado, nem a orla).
  const scatter = (
    count: number,
    minHeight: number,
    maxHeight: number,
    place: (x: number, z: number, y: number) => void,
  ): void => {
    let placed = 0;
    for (let attempt = 0; attempt < count * 30 && placed < count; attempt++) {
      const x = (rnd() - 0.5) * (half * 2 - 16);
      const z = (rnd() - 0.5) * (half * 2 - 16);
      const h = ground(x, z);
      if (h < minHeight || h > maxHeight) continue;
      if (Math.hypot(x, z) < 32) continue; // o spawn nasce no plano limpo
      place(x, z, h);
      placed++;
    }
  };
  scatter(36, 2.5, 12, (x, z, y) => {
    const tree = nature.arvore(rnd);
    tree.position.set(x, y - 0.15, z);
    tree.scale.setScalar(0.9 + rnd() * 1.0);
    group.add(tree);
  });
  scatter(12, 1.5, 14, (x, z, y) => {
    const rock = nature.pedra(rnd);
    rock.position.x = x;
    rock.position.y += y - 0.3;
    rock.position.z = z;
    group.add(rock);
  });

  // Barcos no mar (y do mar: -1.95 — ver addPraia), dois deles à vela.
  const cascoGeometry = new THREE.BoxGeometry(3.2, 0.8, 1.4);
  const cascoColors = [0x3f7ad9, 0xd9742a, 0x4da84a, 0xd8d4c8];
  const mastroGeometry = new THREE.CylinderGeometry(0.06, 0.06, 2.6, 5);
  const velaGeometry = new THREE.BoxGeometry(0.06, 1.6, 1.1);
  const velaMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xe8e4da }));
  const mastroMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0x5a3c22 }));
  for (let i = 0; i < 4; i++) {
    const barco = new THREE.Group();
    const casco = new THREE.Mesh(
      cascoGeometry,
      applyVertexSnap(new THREE.MeshLambertMaterial({ color: cascoColors[i]! })),
    );
    casco.position.y = 0.25;
    barco.add(casco);
    if (i < 2) {
      const mastro = new THREE.Mesh(mastroGeometry, mastroMaterial);
      mastro.position.y = 1.7;
      const vela = new THREE.Mesh(velaGeometry, velaMaterial);
      vela.position.set(0.35, 1.9, 0);
      barco.add(mastro, vela);
    }
    barco.position.set(-80 + i * 52 + (rnd() - 0.5) * 16, -1.7, half + 24 + rnd() * 18);
    barco.rotation.y = rnd() * Math.PI * 2;
    barco.rotation.z = (rnd() - 0.5) * 0.08;
    group.add(barco);
  }

  // Quiosques de praia (balcão redondo + chapéu de palha) e trave de futebol.
  const palhaMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xc2a95a }));
  const balcaoMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xd8d4c8 }));
  for (const qx of [-34, 42]) {
    const quiosque = new THREE.Group();
    const balcao = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 1.1, 8), balcaoMaterial);
    balcao.position.y = 0.55;
    const chapeu = new THREE.Mesh(new THREE.ConeGeometry(2.4, 1.3, 8), palhaMaterial);
    chapeu.position.y = 2.7;
    const esteio = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.6, 5), mastroMaterial);
    esteio.position.y = 1.6;
    quiosque.add(balcao, chapeu, esteio);
    const qz = half + 4.5;
    quiosque.position.set(qx, ground(qx, qz), qz);
    quiosque.rotation.z = (rnd() - 0.5) * 0.06;
    group.add(quiosque);
  }
  const traveMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xe8e4da }));
  const trave = new THREE.Group();
  const traveGeometry = new THREE.BoxGeometry(0.1, 1.7, 0.1);
  for (const sx of [-1.6, 1.6]) {
    const posteTrave = new THREE.Mesh(traveGeometry, traveMaterial);
    posteTrave.position.set(sx, 0.85, 0);
    trave.add(posteTrave);
  }
  const travessao = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.1, 0.1), traveMaterial);
  travessao.position.y = 1.7;
  trave.add(travessao);
  const traveZ = half + 7;
  trave.position.set(-58, ground(-58, traveZ), traveZ);
  trave.rotation.y = 0.15;
  group.add(trave);

  // Mirante do Corcovado: anel de muretinhas em volta do Cristo, assentadas
  // no relevo — a recompensa visual de chegar ao topo.
  const miranteMaterial = applyVertexSnap(new THREE.MeshLambertMaterial({ color: 0xcfc8b4 }));
  const muretinhaGeometry = new THREE.BoxGeometry(3.2, 0.5, 0.3);
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const mx = CORCOVADO_X + Math.cos(angle) * 6.5;
    const mz = CORCOVADO_Z + Math.sin(angle) * 6.5;
    const muretinha = new THREE.Mesh(muretinhaGeometry, miranteMaterial);
    muretinha.position.set(mx, ground(mx, mz) + 0.2, mz);
    muretinha.rotation.y = -angle + Math.PI / 2;
    group.add(muretinha);
  }
}
