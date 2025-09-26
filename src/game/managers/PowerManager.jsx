import { floatingScore ,fireEffect, iceEffect, chainLightningEffect } from "./Effects";
import { killEnemy } from "./EnemyManager";

function getSize(scene) {
  const width = scene.width ?? scene.sys?.game?.config?.width ?? scene.scale.width;
  const height = scene.height ?? scene.sys?.game?.config?.height ?? scene.scale.height;
  return { width, height };
}

function isOnScreen(scene, obj, pad = 0) {
  const { width, height } = getSize(scene);
  return obj.x >= -pad && obj.x <= width + pad && obj.y >= -pad && obj.y <= height + pad;
}

function forceClearActiveEnemy(scene, enemyJustKilled = null) {
  if (!scene.activeEnemy) return;
  if (
    enemyJustKilled === scene.activeEnemy ||
    !scene.activeEnemy.active ||
    scene.activeEnemy.getData("__inputDead") ||
    scene.activeEnemy.getData("dying") ||
    scene.activeEnemy.getData("attacking") ||
    (scene.activeEnemy.getData("wordLetters")?.length === 0)
  ) {
    if (scene.activeEnemy.setStrokeStyle) scene.activeEnemy.setStrokeStyle();
    scene.activeEnemy = null;
  }
}

export function activatePower(scene, power) {
  const cooldowns = { fuego: 12, hielo: 10, rayo: 6 };
  const hudPower = scene.hud?.powers?.[power];
  if (!hudPower || !hudPower.ready) return;

  switch (power) {
    case "fuego": {
      fireEffect(scene);

      const victims = scene.enemies.getChildren().filter(enemy => enemy.active);
      victims.forEach(enemy => {

        if (enemy.getData("__doomed")) {
          killEnemy(enemy, scene);
          return;
        }

        const word = enemy.getData("word");
        const letters = enemy.getData("wordLetters") || [];

        const midLetter = letters[Math.floor(letters.length / 2)];
        letters.forEach((letter) => letter.destroy());
        
        const points = word.length;

        if (midLetter) {
          floatingScore(scene, midLetter.x, midLetter.y, points);
        }

        const currentScore = scene.player.getData("score") || 0;
        scene.player.setData("score", currentScore + points);
        scene.hud.updateScore(currentScore + points, true);

        enemy.setData("__inputDead", true);
        killEnemy(enemy, scene);

        // limpiar si era el activo
        if (scene.activeEnemy === enemy) forceClearActiveEnemy(scene, enemy);
      });

      forceClearActiveEnemy(scene);
      break;
    }

    case "hielo": {
      iceEffect(scene, 4000);

      // parar spawner
      if (scene.enemySpawner) scene.enemySpawner.paused = true;
      
      // congelar
      const frozen = scene.enemies.getChildren().filter(enemy => enemy.active);
      frozen.forEach(enemy => {

        if (enemy.getData("__doomed")) {
          killEnemy(enemy, scene);
          return;
        }
        
        enemy.setTint?.(0x00bfff);
        enemy.setData("__frozen", true);

        if (enemy.body) {
          enemy.setData("__wasEnabled", enemy.body.enable);
          enemy.body.enable = false;
          enemy.body.stop?.();
          enemy.body.setVelocity(0, 0);
        }
      });

      // descongelar
      scene.time.delayedCall(4000, () => {
        if (scene.enemySpawner) scene.enemySpawner.paused = false;

        frozen.forEach(enemy => {
          if (!enemy.active) return;
          enemy.clearTint?.();
          enemy.setData("__frozen", false);
          if (enemy.body) {
            enemy.body.enable = enemy.getData("__wasEnabled") ?? true;
            enemy.setData("__wasEnabled", null);

            if (scene.physics?.moveToObject) {
              scene.physics.moveToObject(enemy, scene.player, 80);
            }
          }
        });
      });
      break;
    }

    case "rayo": {
      const targets = scene.enemies
        .getChildren()
        .filter(enemy => enemy.active && isOnScreen(scene, enemy))
        .sort(
          (current, next) =>
            Phaser.Math.Distance.Between(scene.player.x, scene.player.y, current.x, current.y) -
            Phaser.Math.Distance.Between(scene.player.x, scene.player.y, next.x, next.y)
        )
        .slice(0, 3);

      if (targets.length > 0) {
        chainLightningEffect(scene, targets);

        targets.forEach((enemy, i) => {

          if (enemy.getData("__doomed")) {
            killEnemy(enemy, scene);
            return;
          }

          scene.time.delayedCall(i * 150, () => {
            if (!enemy.active) return;

            const word = enemy.getData("word");
            const letters = enemy.getData("wordLetters") || [];

            const midLetter = letters[Math.floor(letters.length / 2)];
            letters.forEach((letter) => letter.destroy());
            
            const points = word.length;

            if (midLetter) floatingScore(scene, midLetter.x, midLetter.y, points);

            const currentScore = scene.player.getData("score") || 0;
            scene.player.setData("score", currentScore + points);
            scene.hud.updateScore(currentScore + points, true);

            enemy.setData("__inputDead", true);
            killEnemy(enemy, scene);

            if (scene.activeEnemy === enemy) {
              forceClearActiveEnemy(scene, enemy);
            }
          });
        });
      }

      forceClearActiveEnemy(scene);
      break;
    }
  }

  scene.hud?.setPowerCooldown?.(power, cooldowns[power]);
}
