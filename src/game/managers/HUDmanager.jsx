import { HEART_FRAMES } from "./AnimationManager";
import { playFx } from "./AudioManager";
import { animateScaleText } from "./Effects";

export function createHUD(scene, maxLives = 3) {
  const width = scene.sys.game.config.width;
  const MULTIPLIER_GAP = 56; // separación extra respecto al score

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
      fill: "#0f0",
      stroke: "#000",
      strokeThickness: 4,
    })
    .setOrigin(0, 0);

  const rightOfScore = () => {
    const b = textScore.getBounds();
    return b.x + b.width;
  };

  // === MULTIPLIER ===
  const textMultiplier = scene.add
    .text(rightOfScore() + MULTIPLIER_GAP, textScore.y, "x1", {
      fontSize: "28px",
      fill: "#fff2cc",
      stroke: "#000000",
      strokeThickness: 4,
    })
    .setOrigin(0, 0)
    .setVisible(false)
    .setDepth(2000);

  // === helpers color ===
  function lerpHex(fromHex, toHex, t01) {
    const from = Phaser.Display.Color.HexStringToColor(fromHex);
    const to = Phaser.Display.Color.HexStringToColor(toHex);
    const steps = 100;
    const step = Math.round(Phaser.Math.Clamp(t01, 0, 1) * steps);
    const c = Phaser.Display.Color.Interpolate.ColorWithColor(from, to, steps, step);
    return Phaser.Display.Color.RGBToString(c.r, c.g, c.b, 255, "#");
  }

  function colorForMultiplier(m) {
    const t = (Phaser.Math.Clamp(m, 2, 10) - 2) / (10 - 2);
    return lerpHex("#fff2cc", "#ff0000", t);
  }

  // === SCORE ===
  function updateScore(score, animate = true) {
    textScore.setText("SCORE: " + (score ?? 0));

    textMultiplier.x = rightOfScore() + MULTIPLIER_GAP;
    textMultiplier.y = textScore.y;

    if (animate) animateScaleText(scene, textScore);
  }

  // === MULTIPLICADOR ===
  function updateMultiplier(multiplier) {
    if (multiplier <= 1) {
      textMultiplier.setVisible(false);
      return;
    }

    textMultiplier.setVisible(true);
    textMultiplier.setText("x" + multiplier);

    textMultiplier.x = rightOfScore() + MULTIPLIER_GAP;
    textMultiplier.y = textScore.y;

    textMultiplier.setStyle({ fill: colorForMultiplier(multiplier) });

    animateScaleText(scene, textMultiplier);
  }

  // === PODERES ===
  const powerConfigs = {
    fuego: { color: "#ff0000" },
    hielo: { color: "#00bfff" },
    rayo:  { color: "#ffff00" },
  };

  const powers = {};
  const powerNames = Object.keys(powerConfigs);

  powerNames.forEach((name, i) => {
    const x = width / 2 - 150 + i * 150;
    const y = 80;

    const text = scene.add
      .text(x, y, `-${name.toUpperCase()}`, {
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
    if (!createHUD._emptyAlreadyNotified) createHUD._emptyAlreadyNotified = false;

    if (hearts[livesLeft]) {
      const heart = hearts[livesLeft];
      heart.stop();
      heart.play("heart_break");
      if (livesLeft === 1) playFx(scene, "last_live_fx");

      if (livesLeft === 0 && !createHUD._emptyAlreadyNotified) {
        createHUD._emptyAlreadyNotified = true;
        scene.time.delayedCall(0, () => { try { onEmpty?.(); } catch (e) {} });
      }

      heart.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        heart.setFrame(HEART_FRAMES.EMPTY);
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

    power.text.setColor("#000000");

    const timer = scene.time.addEvent({
      delay: 1000,
      repeat: steps - 1,
      callback: () => {
        elapsed++;

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

  return {
    hearts,
    textScore,
    powers,
    updateScore,
    fillHearts,
    loseLife,
    setPowerCooldown,
    textMultiplier,
    updateMultiplier,
  };
}
