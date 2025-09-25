// managers/BackgroundManager.jsx
const TILE = 16;
const SCALE = 2;
const DRAW_SIZE = TILE * SCALE;

const FLOOR_TILES = {
  base: [36, 39, 120, 123],
  patterns: [344, 345, 346, 369, 370, 372, 373, 374],
  borders: {
    top: [37, 38],
    right: [67, 95],
    bottom: [121, 122],
    left: [64, 92],
  },
};

function pick(arr) {
  return arr[(Math.random() * arr.length) | 0];
}

// === Animaciones decorativas globales ===
function ensureDecorAnimations(scene) {
  if (!scene.anims.exists("vase_shine")) {
    scene.anims.create({
      key: "vase_shine",
      frames: scene.anims.generateFrameNumbers("vase", { start: 0, end: 15 }),
      frameRate: 6,
      repeat: -1,
    });
  }

  if (!scene.anims.exists("torch_yellow_anim")) {
    scene.anims.create({
      key: "torch_yellow_anim",
      frames: scene.anims.generateFrameNumbers("torch_yellow", { start: 0, end: 7 }),
      frameRate: 8,
      repeat: -1,
    });
  }

  if (!scene.anims.exists("torch_yellow_slow")) {
    scene.anims.create({
      key: "torch_yellow_slow",
      frames: scene.anims.generateFrameNumbers("torch_yellow", { start: 0, end: 7 }),
      frameRate: 4,
      repeat: -1,
    });
  }
}

/* ================================
   GAMEPLAY BACKGROUND
================================ */
export function createBackground(scene, {
  mixPatterns = true,
  withBorders = true,
  patternChance = 0.2,
  vaseMin = 3,
  vaseMax = 6,
  pillarMin = 2,
  pillarMax = 4,
  torchMin = 3,
  torchMax = 6,
} = {}) {
  const { width, height } = scene.sys.game.config;
  const cols = Math.ceil(width / DRAW_SIZE);
  const rows = Math.ceil(height / DRAW_SIZE);

  // === Suelo ===
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let frame = pick(FLOOR_TILES.base);
      if (mixPatterns && Math.random() < patternChance) {
        frame = pick(FLOOR_TILES.patterns);
      }
      scene.add.sprite(c * DRAW_SIZE, r * DRAW_SIZE, "set1", frame)
        .setOrigin(0).setScale(SCALE).setDepth(-30);
    }
  }

  // === Bordes ===
  if (withBorders) {
    for (let c = 0; c < cols; c++) {
      scene.add.sprite(c * DRAW_SIZE, 0, "set1", pick(FLOOR_TILES.borders.top))
        .setOrigin(0).setScale(SCALE).setDepth(-20);

      scene.add.sprite(c * DRAW_SIZE, (rows - 1) * DRAW_SIZE, "set1", pick(FLOOR_TILES.borders.bottom))
        .setOrigin(0).setScale(SCALE).setDepth(-20);
    }

    for (let r = 0; r < rows; r++) {
      scene.add.sprite(0, r * DRAW_SIZE, "set1", pick(FLOOR_TILES.borders.left))
        .setOrigin(0).setScale(SCALE).setDepth(-20);

      scene.add.sprite((cols - 1) * DRAW_SIZE, r * DRAW_SIZE, "set1", pick(FLOOR_TILES.borders.right))
        .setOrigin(0).setScale(SCALE).setDepth(-20);
    }
  }

  // === Vasijas ===
  ensureDecorAnimations(scene);
  const vaseCount = Phaser.Math.Between(vaseMin, vaseMax);
  for (let i = 0; i < vaseCount; i++) {
    const gx = Phaser.Math.Between(1, cols - 2);
    const gy = Phaser.Math.Between(1, rows - 2);
    const x = gx * DRAW_SIZE + DRAW_SIZE / 2;
    const y = gy * DRAW_SIZE + DRAW_SIZE / 2;
    scene.add.sprite(x, y, "vase", 0)
      .setDepth(-5).setScale(SCALE).play("vase_shine");
  }

  // === Pilares (cabeza + base) ===
  const pillarCount = Phaser.Math.Between(pillarMin, pillarMax);
  for (let i = 0; i < pillarCount; i++) {
    const gx = Phaser.Math.Between(2, cols - 3);
    const gy = Phaser.Math.Between(2, rows - 4);
    const x = gx * DRAW_SIZE;
    const y = gy * DRAW_SIZE;

    scene.add.sprite(x, y, "pillar", 0)
      .setOrigin(0).setScale(SCALE).setDepth(-10);

    scene.add.sprite(x, y + DRAW_SIZE, "pillar", 1)
      .setOrigin(0).setScale(SCALE).setDepth(-10);
  }

  // === Antorchas ===
  const torchCount = Phaser.Math.Between(torchMin, torchMax);
  for (let i = 0; i < torchCount; i++) {
    const gx = Phaser.Math.Between(1, cols - 2);
    const gy = Phaser.Math.Between(1, rows - 2);
    const x = gx * DRAW_SIZE + DRAW_SIZE / 2;
    const y = gy * DRAW_SIZE + DRAW_SIZE / 2;
    scene.add.sprite(x, y, "torch_yellow", 0)
      .setDepth(-5).setScale(SCALE).play("torch_yellow_anim");
  }
}

/* ================================
   MENU BACKGROUND
================================ */
export function createMenuBackground(scene) {
  const { width, height } = scene.sys.game.config;
  const cols = Math.ceil(width / DRAW_SIZE);
  const rows = Math.ceil(height / DRAW_SIZE);

  // Suelo plano
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      scene.add.sprite(c * DRAW_SIZE, r * DRAW_SIZE, "set1", 36)
        .setOrigin(0).setScale(SCALE).setDepth(-30);
    }
  }

  ensureDecorAnimations(scene);

  // Antorchas en esquinas simetricas
  const corners = [
    { x: 120, y: 120 },
    { x: width - 120, y: 120 },
    { x: 120, y: height - 120 },
    { x: width - 120, y: height - 120 },
  ];
  corners.forEach(p => {
    const torch = scene.add.sprite(p.x, p.y, "torch_yellow", 0)
      .setScale(SCALE).setDepth(-5).play("torch_yellow_anim");
    scene.tweens.add({
      targets: torch,
      alpha: { from: 1, to: 0.6 },
      duration: 1500,
      yoyo: true,
      repeat: -1
    });
  });

  // Pilares laterales
  const yMid = height / 2 - DRAW_SIZE;
  [160, width - 160].forEach(x => {
    scene.add.sprite(x, yMid, "pillar", 0).setOrigin(0.5).setScale(SCALE).setDepth(-10);
    scene.add.sprite(x, yMid + DRAW_SIZE, "pillar", 1).setOrigin(0.5).setScale(SCALE).setDepth(-10);
  });
}

/* ================================
   LOADING BACKGROUND
================================ */
export function createLoadingBackground(scene) {
  const { width, height } = scene.sys.game.config;
  const cols = Math.ceil(width / DRAW_SIZE);
  const rows = Math.ceil(height / DRAW_SIZE);

  // Suelo oscuro
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      scene.add.sprite(c * DRAW_SIZE, r * DRAW_SIZE, "set1", 39)
        .setOrigin(0).setScale(SCALE).setDepth(-30);
    }
  }

  ensureDecorAnimations(scene);

  // Antorchas arriba a izquierda y derecha
  const torchPositions = [
    { x: 100, y: 100 },
    { x: width - 100, y: 100 },
  ];
  torchPositions.forEach(p => {
    const torch = scene.add.sprite(p.x, p.y, "torch_yellow", 0)
      .setScale(SCALE).setDepth(-5).play("torch_yellow_anim");
    scene.tweens.add({
      targets: torch,
      alpha: { from: 1, to: 0.7 },
      duration: 1200,
      yoyo: true,
      repeat: -1
    });
  });

  // Vasijas decorativas en la parte baja
  const vaseY = height - 120;
  const vaseLeft = scene.add.sprite(150, vaseY, "vase", 0)
    .setScale(SCALE).setDepth(-5).play("vase_shine");
  const vaseRight = scene.add.sprite(width - 150, vaseY, "vase", 0)
    .setScale(SCALE).setDepth(-5).play("vase_shine");

  // Overlay parpadeante
  const overlay = scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.25).setDepth(-4);
  scene.tweens.add({
    targets: overlay,
    alpha: { from: 0.25, to: 0.5 },
    duration: 2000,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut"
  });

  // Particulas suaves de chispa en segundo plano
  scene.add.particles(0, 0, "spark", {
    x: { min: 0, max: width },
    y: { min: 0, max: height },
    lifespan: 4000,
    speedY: { min: -15, max: -30 },
    scale: { start: 0.3, end: 0 },
    alpha: { start: 0.4, end: 0 },
    frequency: 400,
    quantity: 1,
    emitting: true
  }).setDepth(-6);
}

/* ================================
   GAME OVER BACKGROUND
================================ */
export function createGameOverBackground(scene) {
  const { width, height } = scene.sys.game.config;
  const cols = Math.ceil(width / DRAW_SIZE);
  const rows = Math.ceil(height / DRAW_SIZE);

  // Suelo base oscuro
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      scene.add.sprite(c * DRAW_SIZE, r * DRAW_SIZE, "set1", 39)
        .setOrigin(0).setScale(SCALE).setDepth(-30);
    }
  }

  // Overlay rojo
  scene.add.rectangle(width / 2, height / 2, width, height, 0x660000, 0.7).setDepth(-5);

  ensureDecorAnimations(scene);

  // Antorchas simetricas
  const torchPositions = [
    { x: width / 2 - 200, y: height / 2 },
    { x: width / 2 + 200, y: height / 2 }
  ];
  torchPositions.forEach(p => {
    scene.add.sprite(p.x, p.y, "torch_yellow", 0)
      .setScale(SCALE).setDepth(-5).play("torch_yellow_slow");
  });

  // Particulas tipo ceniza
  scene.add.particles(0, 0, "spark", {
    x: { min: 0, max: width },
    y: 0,
    lifespan: 5000,
    speedY: { min: 40, max: 100 },
    scale: { start: 0.5, end: 0 },
    alpha: { start: 0.9, end: 0 },
    frequency: 150,
    quantity: 3,
    emitting: true
  }).setDepth(-4);
}

/* ================================
   SETTINGS BACKGROUND
================================ */
export function createSettingsBackground(scene) {
  const { width, height } = scene.sys.game.config;
  const cols = Math.ceil(width / DRAW_SIZE);
  const rows = Math.ceil(height / DRAW_SIZE);

  // Suelo base liso
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      scene.add.sprite(c * DRAW_SIZE, r * DRAW_SIZE, "set1", 36)
        .setOrigin(0).setScale(SCALE).setDepth(-30);
    }
  }

  // Overlay suave
  const overlay = scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.25).setDepth(-5);
  scene.tweens.add({
    targets: overlay,
    alpha: { from: 0.2, to: 0.4 },
    duration: 3000,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut"
  });

  // Polvo flotante
  scene.add.particles(0, 0, "spark", {
    x: { min: 0, max: width },
    y: { min: 0, max: height },
    lifespan: 6000,
    speedY: { min: -20, max: -40 },
    scale: { start: 0.4, end: 0 },
    alpha: { start: 0.5, end: 0 },
    frequency: 300,
    quantity: 2,
    emitting: true
  }).setDepth(-4);
}
