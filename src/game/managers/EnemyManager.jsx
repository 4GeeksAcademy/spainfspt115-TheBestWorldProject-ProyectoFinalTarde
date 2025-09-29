import { playFx } from "./AudioManager";
import { getRandomWord, getWordPool } from "./WordManager";

const letterSpacing = 24;

export function spawnEnemy(scene, speed = 85) {
  const { width, height } = scene.sys.game.config;

  const side = Phaser.Math.Between(0, 2);
  let x, y;
  if (side === 0) { y = Phaser.Math.Between(0, height); x = width + 50; }
  if (side === 1) { x = Phaser.Math.Between(0, width); y = height + 50; }
  if (side === 2) { y = Phaser.Math.Between(0, height); x = -50; }

  // palabra -> tipo
  let word, enemyType, enemySubType;

  do {
    word = getRandomWord(scene);

    const dupOnScreen = scene.enemies
      .getChildren()
      .some(enemy => enemy.active && enemy.getData && enemy.getData("word") === word);

    if (dupOnScreen) {
      enemyType = undefined;
      continue;
    }

    if (word.length >= 4 && word.length < 7) {
      enemySubType = "";
      enemyType = "slime";
    }
    else if (word.length >= 7 && word.length < 10) {
      enemySubType = "";
      enemyType = "orc";
    }
    else if (word.length >= 10 && word.length < 14) {
      enemySubType = "";
      enemyType = "vampire";
    }

    const pool = getWordPool();

    if (word.length === 14 && pool.giga_slime.length > 0) {
      word = Phaser.Utils.Array.GetRandom(pool.giga_slime);
      enemySubType = "giga_slime";
      enemyType = "slime";
    } else if (word.length === 15 && pool.giga_orc.length > 0) {
      word = Phaser.Utils.Array.GetRandom(pool.giga_orc);
      enemySubType = "giga_orc";
      enemyType = "orc";
    } else if (word.length >= 16 && pool.giga_vampire.length > 0) {
      word = Phaser.Utils.Array.GetRandom(pool.giga_vampire);
      enemySubType = "giga_vampire";
      enemyType = "vampire";
    }

  } while (!enemyType);

  const enemy = scene.physics.add.sprite(x, y, `${enemyType}_run`);
  enemy.setOrigin(0.5).setScale(2.0);

  switch (enemyType) {
    case "slime":
      enemy.body.setSize(34, 34);
      if (enemySubType === "giga_slime") {
        enemy.setScale(4);
        enemy.setData("speed", 30);
        speed = 30;
      } else {
        enemy.setData("speed", 85);
      }
      break;

    case "orc":
      enemy.body.setSize(42, 42);
      if (enemySubType === "giga_orc") {
        enemy.setScale(4);
        enemy.setData("speed", 30);
        speed = 30;
      } else {
        enemy.setData("speed", 85);
      }
      break;

    case "vampire":
      enemy.body.setSize(40, 40);

      if (enemySubType === "giga_vampire") {
        enemy.setScale(4);
        enemy.setData("speed", 30);
        speed = 30;
      } else {
        enemy.setData("speed", 85);
      }
      break;
  }

  scene.enemies.add(enemy);

  const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, scene.player.x, scene.player.y);
  const dir = getDirectionFromAngle(angle);
  enemy.setData("direction", dir);

  enemy.play(`${enemyType}_run_${dir}`);

  enemy.setData("type", enemyType);
  enemy.setData("subType", enemySubType);
  enemy.setData("word", word);
  enemy.setData("typed", "");
  enemy.setData("pendingProjectiles", 0);
  enemy.setData("wordLetters", []);
  enemy.setData("attacking", false);
  enemy.setData("dying", false);

  // letras
  const startX = enemy.x - (word.length * letterSpacing) / 2;
  const lettersArray = [];
  for (let i = 0; i < word.length; i++) {
    const posX = startX + i * letterSpacing;
    const posY = enemy.y + 40;
    const letter = scene.add.text(posX, posY, word[i], {
      fontSize: "28px",
      fill: "#fff",
    }).setOrigin(0.5);

    letter.baseOffsetX = posX - enemy.x;
    letter.baseOffsetY = posY - enemy.y;
    letter.shakeOffset = 0;
    lettersArray.push(letter);
  }
  enemy.setData("wordLetters", lettersArray);

  scene.physics.moveToObject(enemy, scene.player, speed);
  return enemy;
}

export function getDirectionFromAngle(angle) {
  const deg = Phaser.Math.RadToDeg(angle);
  if (deg >= -45 && deg <= 45) return "right";
  if (deg > 45 && deg < 135) return "down";
  if (deg >= 135 || deg <= -135) return "left";
  return "up"; // -135 < deg < -45
}

// muerte con animacion antes de destruir
export function killEnemy(enemy, scene) {
  if (!enemy || !enemy.active) return;
  if (enemy.getData("dying")) return;

  enemy.setData("dying", true);
  enemy.setData("__inputDead", true);

  const type = enemy.getData("type");
  const dir = enemy.getData("direction");
  const key = `${type}_death_${dir}`;

  if (enemy.body) {
    updateSpeedEnemy(scene, enemy, 0);
    enemy.body.enable = false;
  }

  enemy.play(key);
  enemy.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + key, () => {
    enemy.getData("wordLetters")?.forEach((letter) => letter.destroy());
    enemy.destroy();
  });
}

// ataque con animacion antes de quitar vida
export function enemyAttack(enemy, scene) {
  if (!enemy || !enemy.active) return;
  if (enemy.getData("attacking")) return;

  enemy.setData("attacking", true);
  enemy.setData("__inputDead", true);

  const type = enemy.getData("type");
  const subType = enemy.getData("subType");
  const dir = enemy.getData("direction");
  const key = `${type}_attack_${dir}`;

  enemy.play(key);

  if (type === "orc" || subType === "giga_orc") playFx(scene, "orc_attack_fx");
  if (type === "slime" || subType === "giga_slime") playFx(scene, "slime_attack_fx");
  if (type === "vampire" || subType === "giga_vampire") playFx(scene, "vampire_attack_fx");
  enemy.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + key, () => {
    const lives = scene.player.loseLife();
    scene.hud.loseLife(lives, () => {
      if (scene.enemySpawner) scene.enemySpawner.paused = true;
      scene.enemies.getChildren().forEach(cenemy => {
        if (cenemy.body) {
          cenemy.body.enable = false;
          cenemy.body.stop?.();
        }
        cenemy.anims?.stop();
      });

      scene.player.playDeath(() => {
        scene.gameOver?.();
      });
    });

    enemy.getData("wordLetters")?.forEach((letter) => letter.destroy());
    enemy.destroy();
  });
}

export function updateEnemyWordPosition(enemy) {
  if (!enemy || !enemy.active) return;

  const letters = enemy.getData("wordLetters");
  if (!letters || letters.length === 0) return;

  const word = enemy.getData("word");
  letters.forEach((letter, i) => {
    const baseX = enemy.x + (letter.baseOffsetX ?? (i * letterSpacing - (word.length * letterSpacing) / 2));
    const baseY = enemy.y + (letter.baseOffsetY ?? 40);
    letter.x = baseX + (letter.shakeOffset || 0);
    letter.y = baseY;
  });
}

export function updateSpeedEnemy(scene, enemy, speed = enemy.getData("speed")) {
  const enemySpeed = enemy.getData("speed");
  if (enemySpeed != speed) {
    scene.physics.moveToObject(enemy, scene.player, speed);
  } else {
    scene.physics.moveToObject(enemy, scene.player, enemySpeed);
  }
}
