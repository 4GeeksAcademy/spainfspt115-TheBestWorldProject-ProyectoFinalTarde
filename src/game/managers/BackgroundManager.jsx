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

  // === 1) Suelo ===
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

  // === 2) Bordes ===
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

  // === 3) Vasijas ===
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

  // === 4) Pilares (cabeza + base) ===
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

  // === 5) Antorchas ===
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

  // Suelo fijo (frame 36 = liso)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      scene.add.sprite(c * DRAW_SIZE, r * DRAW_SIZE, "set1", 36)
        .setOrigin(0).setScale(SCALE).setDepth(-30);
    }
  }

  ensureDecorAnimations(scene);

  // Antorchas en esquinas
  const positions = [
    { x: 40, y: 40 },
    { x: width - 40, y: 40 },
    { x: 40, y: height - 40 },
    { x: width - 40, y: height - 40 },
  ];
  positions.forEach(p => {
    scene.add.sprite(p.x, p.y, "torch_yellow", 0)
      .setScale(SCALE).setDepth(-5).play("torch_yellow_anim");
  });
}

/* ================================
   LOADING BACKGROUND
================================ */
export function createLoadingBackground(scene) {
  const { width, height } = scene.sys.game.config;
  const cols = Math.ceil(width / DRAW_SIZE);
  const rows = Math.ceil(height / DRAW_SIZE);

  if (!scene.textures.exists("set1")) {
    scene.add.rectangle(width / 2, height / 2, width, height, 0x111111).setDepth(-30);
    return;
  }

  const tex = scene.textures.get("set1");
  const total = tex.frameTotal;
  const candidates = [36, 39, 120, 123];
  const baseFrame = candidates.find(f => f < total) ?? 36;

  // Suelo uniforme
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      scene.add.sprite(c * DRAW_SIZE, r * DRAW_SIZE, "set1", baseFrame)
        .setOrigin(0).setScale(SCALE).setDepth(-30);
    }
  }

  // Vasijas decorativas
  ensureDecorAnimations(scene);
  const vaseCount = Phaser.Math.Between(2, 3);
  for (let i = 0; i < vaseCount; i++) {
    const x = Phaser.Math.Between(100, width - 100);
    const y = Phaser.Math.Between(100, height - 100);
    scene.add.sprite(x, y, "vase", 0)
      .setScale(SCALE).setDepth(-5).play("vase_shine");
  }
}

/* ================================
   GAME OVER BACKGROUND
================================ */
export function createGameOverBackground(scene) {
  const { width, height } = scene.sys.game.config;
  const cols = Math.ceil(width / DRAW_SIZE);
  const rows = Math.ceil(height / DRAW_SIZE);

  // Suelo base (frame 39)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      scene.add.sprite(c * DRAW_SIZE, r * DRAW_SIZE, "set1", 39)
        .setOrigin(0).setScale(SCALE).setDepth(-30);
    }
  }

  // Overlay rojo oscuro
  scene.add.rectangle(width / 2, height / 2, width, height, 0x550000, 0.5).setDepth(-5);

  ensureDecorAnimations(scene);

  // Antorchas lentas aleatorias
  for (let i = 0; i < 3; i++) {
    const x = Phaser.Math.Between(100, width - 100);
    const y = Phaser.Math.Between(100, height - 100);
    scene.add.sprite(x, y, "torch_yellow", 0)
      .setScale(SCALE).setDepth(-5).play("torch_yellow_slow");
  }
}
