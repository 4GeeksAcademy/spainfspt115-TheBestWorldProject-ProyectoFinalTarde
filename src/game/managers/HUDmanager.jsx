import { HEART_FRAMES } from "./AnimationManager";
import { animateScaleText } from "./Effects";

export function createHUD(scene, maxLives = 3) {
  const width = scene.sys.game.config.width;

  // === VIDAS (corazones) ===
  const hearts = [];
  const totalWidth = maxLives * 50 + 120;
  const startX = width / 2 - totalWidth / 2;

  for (let i = 0; i < maxLives; i++) {
    const x = startX + i * 50;
    const heart = scene.add
      .sprite(x, 40, "heart", HEART_FRAMES.EMPTY)
      .setScale(1.5)
      .setDepth(1000);
    hearts.push(heart);
  }

  // === SCORE ===
  const textScore = scene.add
    .text(startX + maxLives * 50 + 20, 20, "SCORE: 0", {
      font: "28px Arial Black",
      fill: "#0f0",
      stroke: "#000",
      strokeThickness: 4,
    })
    .setOrigin(0, 0);

  function updateScore(score, animate = true) {
    textScore.setText("SCORE: " + (score ?? 0));
    if (animate) animateScaleText(scene, textScore);
  }

  // === PODERES ===
  const powerConfigs = {
    fuego: { color: "#ff0000" }, // rojo
    hielo: { color: "#00bfff" }, // azul
    rayo: { color: "#ffff00" },  // amarillo
  };

  const powers = {};
  const powerNames = Object.keys(powerConfigs);

  powerNames.forEach((name, i) => {
    const x = width / 2 - 150 + i * 150;
    const y = 80;

    const text = scene.add
      .text(x, y, `-${name.toUpperCase()}`, {
        font: "24px Arial Black",
        fill: powerConfigs[name].color,
        stroke: "#000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    powers[name] = {
      text,
      color: Phaser.Display.Color.HexStringToColor(powerConfigs[name].color),
      ready: true,
    };
  });

  // === ANIMACIONES VIDAS ===
  function fillHearts(sceneRef) {
    return new Promise((resolve) => {
      if (hearts.length === 0) return resolve();
      let done = 0;

      hearts.forEach((heart, i) => {
        sceneRef.time.delayedCall(i * 200, () => {
          heart.stop();
          heart.setFrame(HEART_FRAMES.EMPTY);
          heart.play("heart_fill");
          heart.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            heart.setFrame(HEART_FRAMES.FULL);
            done++;
            if (done === hearts.length) resolve();
          });
        });
      });
    });
  }

  function loseLife(livesLeft, onEmpty) {
    if (hearts[livesLeft]) {
      const heart = hearts[livesLeft];
      heart.stop();
      heart.play("heart_break");
      heart.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        heart.setFrame(HEART_FRAMES.EMPTY);
        if (livesLeft === 0 && typeof onEmpty === "function") {
          onEmpty();
        }
      });
    }
  }

  // === COOLDOWN DE PODERES ===
  function setPowerCooldown(name, duration) {
    const power = powers[name];
    if (!power) return;

    power.ready = false;
    const steps = duration;
    let elapsed = 0;

    // empieza negro
    power.text.setColor("#000000");

    const timer = scene.time.addEvent({
      delay: 1000,
      repeat: steps - 1,
      callback: () => {
        elapsed++;

        // interpolamos color negro → color base
        const base = power.color;
        const col = Phaser.Display.Color.Interpolate.ColorWithColor(
          Phaser.Display.Color.HexStringToColor("#000000"),
          base,
          steps,
          elapsed
        );

        const hexString = Phaser.Display.Color.RGBToString(col.r, col.g, col.b, 255, "#");
        power.text.setColor(hexString);

        if (elapsed >= steps) {
          power.ready = true;
          power.text.setColor(base.rgba);
          animateScaleText(scene, power.text);
          timer.remove();
        }
      },
    });
  }

  return { hearts, textScore, powers, updateScore, fillHearts, loseLife, setPowerCooldown };
}
