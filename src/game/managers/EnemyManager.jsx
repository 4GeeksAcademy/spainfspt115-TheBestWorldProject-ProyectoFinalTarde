import { getRandomWord } from "./WordManager";

const letterSpacing = 24;

export function spawnEnemy(scene, speed = 80) {
  const { width, height } = scene.sys.game.config;

  const side = Phaser.Math.Between(0, 2);
  let x, y;
  if (side === 0) { y = Phaser.Math.Between(0, height); x = width + 50; }
  if (side === 1) { x = Phaser.Math.Between(0, width); y = height + 50; }
  if (side === 2) { y = Phaser.Math.Between(0, height); x = -50; }

  // palabra -> tipo
  let word, enemyType;
  do {
    word = getRandomWord();
    if (word.length >= 4 && word.length <= 5) enemyType = "slime";
    else if (word.length >= 6 && word.length <= 8) enemyType = "orc";
    else if (word.length >= 9) enemyType = "vampire";
  } while (!enemyType);

  const enemy = scene.physics.add.sprite(x, y, `${enemyType}_run`);
  enemy.setOrigin(0.5).setScale(2.0);

  switch (enemyType) {
    case "slime":
      enemy.body.setSize(34, 34);
      break;
  
    case "orc":
      enemy.body.setSize(42, 42);
      break;

    case "vampire":
      enemy.body.setSize(40, 40);
      break;
  }

  scene.enemies.add(enemy);

  const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, scene.player.x, scene.player.y);
  const dir = getDirectionFromAngle(angle);
  enemy.setData("direction", dir);

  enemy.play(`${enemyType}_run_${dir}`);

  enemy.setData("type", enemyType);
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

  const type = enemy.getData("type");
  const dir = enemy.getData("direction");
  const key = `${type}_death_${dir}`;

  if(enemy.body) {
    updateSpeedEnemy(scene, enemy, 0);
    enemy.body.enable = false;
  }

  enemy.play(key);
  enemy.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + key, () => {
    enemy.getData("wordLetters")?.forEach((letter) => letter.destroy());
    enemy.destroy();
  });
}

// ataque con animación antes de quitar vida
export function enemyAttack(enemy, scene) {
  if (!enemy || !enemy.active) return;
  if (enemy.getData("attacking")) return;
  enemy.setData("attacking", true);

  const type = enemy.getData("type");
  const dir = enemy.getData("direction");
  const key = `${type}_attack_${dir}`;

  enemy.play(key);
  enemy.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + key, () => {
    scene.player.playHitAndThen(enemy.x, () => {
      // quitar vida
      const lives = scene.player.loseLife();
      // animacion de HUD y gameover despues del ultimo corazon
      scene.hud.loseLife(lives, () => {
        scene.player.playDeath(() => {
          scene.gameOver?.();
        });
      });
    });

    // limpieza
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

export function updateSpeedEnemy(scene, enemy, speed = 80) {
  scene.physics.moveToObject(enemy, scene.player, speed);
}
