export function createAnimations(scene) {
  // ---- HEARTS ----
  if (!scene.anims.exists("heart_break")) {
    scene.anims.create({
      key: "heart_break",
      frames: scene.anims.generateFrameNumbers("heart", { start: 85, end: 97 }),
      frameRate: 15,
      repeat: 0,
    });
  }

  if (!scene.anims.exists("heart_fill")) {
    const fill = scene.anims
      .generateFrameNumbers("heart", { start: 102, end: 112 })
      .reverse();

    scene.anims.create({
      key: "heart_fill",
      frames: fill,
      frameRate: 15,
      repeat: 0,
    });
  }

  // ---- ENEMIGOS ----
  const types = [
    { key: "slime",   run: "slime_run",   attack: "slime_attack",   death: "slime_death" },
    { key: "orc",     run: "orc_run",     attack: "orc_attack",     death: "orc_death" },
    { key: "vampire", run: "vampire_run", attack: "vampire_attack", death: "vampire_death" },
  ];

  types.forEach(type => {
    makeDirectionalAnims(scene, type.run,    `${type.key}_run`,    12, true);
    makeDirectionalAnims(scene, type.attack, `${type.key}_attack`, 12, false);
    makeDirectionalAnims(scene, type.death,  `${type.key}_death`,  12, false);
  });

  // ---- PLAYER ----
  if (!scene.anims.exists("player_idle")) {
    scene.anims.create({
      key: "player_idle",
      frames: scene.anims.generateFrameNumbers("player_idle"),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!scene.anims.exists("player_attack")) {
    scene.anims.create({
      key: "player_attack",
      frames: scene.anims.generateFrameNumbers("player_attack"),
      frameRate: 16,
      repeat: 0,
    });
  }

  if (!scene.anims.exists("player_hit")) {
    scene.anims.create({
      key: "player_hit",
      frames: scene.anims.generateFrameNumbers("player_hit"),
      frameRate: 8,
      repeat: 0,
      duration: 400,
    });
  }

  if (!scene.anims.exists("player_death")) {
    scene.anims.create({
      key: "player_death",
      frames: scene.anims.generateFrameNumbers("player_death"),
      frameRate: 16,
      repeat: 0,
    });
  }

  // ---- PROJECTILE ----
  if (!scene.anims.exists("projectile_move")) {
    scene.anims.create({
      key: "projectile_move",
      frames: scene.anims.generateFrameNumbers("projectile_move"),
      frameRate: 18,
      repeat: -1,
    });
  }

  if (!scene.anims.exists("projectile_explode")) {
    scene.anims.create({
      key: "projectile_explode",
      frames: scene.anims.generateFrameNumbers("projectile_explode"),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true,
    });
  }
}

function makeDirectionalAnims(scene, sheetKey, baseKey, frameRate = 12, loop = false) {
  const tex = scene.textures.get(sheetKey);
  if (!tex) return;

  const src = tex.getSourceImage();
  const framew = 64;
  const frameh = 64;
  const cols = Math.floor(src.width / framew);
  const rows = Math.floor(src.height / frameh);

  const DIRS = ["down", "up", "left", "right"];

  for (let row = 0; row < Math.min(rows, 4); row++) {
    const start = row * cols;
    const end = start + cols - 1;
    const key = `${baseKey}_${DIRS[row]}`;

    if (scene.anims.exists(key)) continue;

    scene.anims.create({
      key,
      frames: scene.anims.generateFrameNumbers(sheetKey, { start, end }),
      frameRate,
      repeat: loop ? -1 : 0,
    });
  }
}

export const HEART_FRAMES = {
  FULL: 102,
  EMPTY: 112,
};
