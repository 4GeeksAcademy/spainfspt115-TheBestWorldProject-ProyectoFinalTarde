import { killEnemy } from "./EnemyManager";

export function launchProjectiles (scene, enemy, count) {
  const {x: px, y:py} = scene.player;
  if (!enemy || !enemy.active) return;

  enemy.setData("pendingProjectiles", 1);

  for (let i = 0; i < 1; i++) {
    scene.time.delayedCall(i * 250, () => {
      if (!enemy.active) return;

      const projectile = scene.physics.add
        .sprite(px, py, "projectile_move", 0)
        .setScale(2.5);

      projectile.body.setSize(25, 25);

      scene.physics.add.existing(projectile);
      scene.projectiles.add(projectile);
      projectile.play("projectile_move", true);

      projectile.flipX = enemy.x < px;

      scene.physics.moveToObject(projectile, enemy, 1000);

      scene.physics.add.overlap(projectile, enemy, () => {
        if (!enemy.active) {
          projectile.destroy();
          return;
        }

        if (projectile.getData("exploding")) return;

        projectile.setData("exploding", true);

        projectile.body.stop();
        projectile.play("projectile_explode", true);

        projectile.once(
          Phaser.Animations.Events.ANIMATION_COMPLETE,
          (animation) => {
            if (animation.key === "projectile_explode")
            {
              projectile.destroy();

              let pending = enemy.getData("pendingProjectiles") - 1;
              enemy.setData("pendingProjectiles", pending);

              if (pending === 0) {
                killEnemy(enemy, scene);
              }
            }
          }
        );
      });
    });
  }
}
