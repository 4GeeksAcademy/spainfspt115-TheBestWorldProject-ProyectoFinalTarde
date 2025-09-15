import { killEnemy } from "./EnemyManager";

export function launchProjectiles (scene, enemy, count) {
  const {x: px, y:py} = scene.player;
  if (!enemy || !enemy.active) return;

  enemy.setData("pendingProjectiles", count);

  for (let i = 0; i < count; i++) {
    scene.time.delayedCall(i * 75, () => {
      if (!enemy.active) return;

      const projectile = scene.add.circle(px, py, 5, 0x00ffff);
      scene.physics.add.existing(projectile);
      scene.projectiles.add(projectile);

      scene.physics.moveToObject(projectile, enemy, 1500);

      scene.physics.add.overlap(projectile, enemy, () => {
        if (!enemy.active) {
          projectile.destroy();
          return;
        }

        projectile.destroy();
        let pending = enemy.getData("pendingProjectiles") - 1;
        enemy.setData("pendingProjectiles", pending);

        if (pending <= 0) {
          killEnemy(enemy, scene);
        }
      });
    });
  }
}
