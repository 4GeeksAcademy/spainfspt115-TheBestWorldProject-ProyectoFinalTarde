import Phaser from "phaser";
import { GameSettings } from "./GameSettings";

// --- temblor de letra para indicar error ---
export function shakeLetter(scene, letter) {
  if (!letter) return;

  // matar tween anterior sobre ese objeto para evitar solapamientos
  scene.tweens.killTweensOf(letter);

  // tweenear la propiedad 'shakeOffset' del objeto letter
  scene.tweens.add({
    targets: letter,
    shakeOffset: 8,
    duration: 80,
    yoyo: true,
    repeat: 2,
    ease: "Sine.easeInOut",
    onComplete: () => {
      // reset seguro
      letter.shakeOffset = 0;
    }
  });
}

// --- flash para indicar error en toda la palabra ---
export function flashError(scene, wordGroup) {
  if (!wordGroup) return;
  scene.tweens.add({
    targets: wordGroup.getChildren(),
    alpha: 0.6,
    yoyo: true,
    repeat: 1,
    duration: 80,
  });
}

// --- animacion de aparicion de palabra ---
export function spawnWordEffect(scene, letters) {
  letters.forEach((letter, i) => {
    letter.setScale(0).setAlpha(0);
    scene.tweens.add({
      targets: letter,
      scale: 1,
      alpha: 1,
      duration: 400,
      ease: "Back.Out",
      delay: i * 50, // efecto cascada
    });
  });
}

// --- explosion de palabra ---
export function explodeWord(scene, wordGroup) {
  if (!wordGroup) return;

  const items = Array.isArray(wordGroup) ? wordGroup : wordGroup.getChildren?.() || [];
  if (items.length === 0) return;

  items.forEach(letter => {
    const angle = Phaser.Math.Between(0, 360);
    const distance = Phaser.Math.Between(50, 150);
    const dx = distance * Math.cos(angle * (Math.PI / 180));
    const dy = distance * Math.sin(angle * (Math.PI / 180));

    scene.tweens.add({
      targets: letter,
      x: letter.x + dx,
      y: letter.y + dy,
      alpha: 0,
      scale: 2,
      angle: Phaser.Math.Between(-180, 180),
      duration: 500,
      ease: "Power1",
      onComplete: () => letter.destroy(),
    });
  });
}

// --- texto flotante de "+puntos" ---
export function floatingScore(scene, x, y, points = 10) {
  const floatText = scene.add.text(x, y, `+${points}`, {
    fontSize: "36px",
    fill: "#00ff88",
    fontStyle: "bold",
    stroke: "#ffffff",
    strokeThickness: 4,
    shadow: {
      offsetX: 2,
      offsetY: 2,
      color: "#00ffcc",
      blur: 0,
      fill: true
    }
  }).setOrigin(0.5);

  const dx = Phaser.Math.Between(-20, 20);
  const dy = Phaser.Math.Between(70, 100);

  scene.tweens.add({
    targets: floatText,
    y: y - dy,
    x: x + dx,
    alpha: { from: 1, to: 0 },
    scale: { from: 1.3, to: 1 },
    duration: 1600,
    ease: "Cubic.easeOut",
    onComplete: () => floatText.destroy(),
  });
}

// --- animacion de escaldado de texto ---
export function animateScaleText(scene, target) {
  if (!target) return;

  target.setScale(0).setAlpha(0);

  // Animacion de aparicion
  scene.tweens.add({
    targets: target,
    scale: { from: 0, to: 1.2 },
    alpha: { from: 0, to: 1 },
    ease: "Back.Out",
    duration: 500,
    onComplete: () => {
      // Rebote suave hacia tamaño normal
      scene.tweens.add({
        targets: target,
        scale: { from: 1.2, to: 1 },
        ease: "Bounce.Out",
        duration: 400,
      });
    },
  });

  // Efecto de resplandor en el borde
  target.setStyle({ stroke: "#00ffff", strokeThickness: 8 });
  scene.time.delayedCall(250, () => {
    target.setStyle({ stroke: "#000", strokeThickness: 4 });
  });
}

// --- FIRE ---
export function fireEffect(scene) {
  if (GameSettings.accessibility.flash) {
    scene.cameras.main.flash(200, 255, 100, 0);
  }
  if (GameSettings.accessibility.shake) {
    scene.cameras.main.shake(150, 0.01);
  }

  const { x, y } = scene.player;

  const explosion = scene.add.particles(x, y, "fire", {
    speed: { min: -300, max: 300 },
    angle: { min: 0, max: 360 },
    lifespan: { min: 500, max: 800 },
    scale: { start: 1.0, end: 0 },
    quantity: 40,
    tint: [0xff2200, 0xff6600, 0xffff00],
    blendMode: "ADD",
  });

  const sparks = scene.add.particles(x, y, "spark", {
    speed: { min: -200, max: 200 },
    lifespan: { min: 400, max: 700 },
    scale: { start: 0.4, end: 0 },
    quantity: 25,
    tint: [0xffcc00, 0xffee88, 0xffffff],
    blendMode: "ADD",
  });

  const smoke = scene.add.particles(x, y, "fire", {
    speed: { min: -100, max: 100 },
    lifespan: { min: 800, max: 1200 },
    alpha: { start: 0.5, end: 0 },
    scale: { start: 0.8, end: 2.0 },
    quantity: 15,
    tint: [0x111111, 0x333333, 0x552200],
    blendMode: "NORMAL",
  });

  scene.time.delayedCall(900, () => explosion.stop());
  scene.time.delayedCall(1000, () => sparks.stop());
  scene.time.delayedCall(1200, () => smoke.stop());
}

// --- ICE ---
export function iceEffect(scene, duration = 4000) { 
  if (GameSettings.accessibility.flash) {
    scene.cameras.main.flash(200, 255, 100, 0);
  }
  if (GameSettings.accessibility.shake) {
    scene.cameras.main.shake(150, 0.01);
  }

  const { x, y } = scene.player;

  const snow = scene.add.particles(x, y, "ice", {
    speed: { min: -120, max: 120 },
    angle: { min: 0, max: 360 },
    lifespan: { min: 700, max: 1100 },
    scale: { start: 0.6, end: 0 },
    alpha: { start: 1, end: 0 },
    quantity: 20,
    tint: [0x6fd0ff, 0x9adfff, 0xffffff],
    blendMode: "ADD",
    rotate: { min: -180, max: 180 },
  });

  const mist = scene.add.particles(x, y, "ice", {
    speed: { min: -60, max: 60 },
    lifespan: { min: 1000, max: 1500 },
    alpha: { start: 0.5, end: 0 },
    scale: { start: 0.8, end: 2.2 },
    quantity: 12,
    tint: [0x4477ff, 0x88ccff],
    blendMode: "SCREEN",
  });

  const shards = scene.add.particles(x, y, "ice", {
    speed: { min: -200, max: 200 },
    lifespan: { min: 500, max: 800 },
    scale: { start: 0.4, end: 0 },
    quantity: 25,
    tint: [0x99ddff, 0xffffff],
    blendMode: "ADD",
  });

  scene.time.delayedCall(900, () => snow.stop());
  scene.time.delayedCall(1200, () => mist.stop());
  scene.time.delayedCall(1000, () => shards.stop());

  scene.enemies.getChildren().forEach((enemy) => {
    if (!enemy.active) return;
    enemy.setTint?.(0x00bfff);
  });

  scene.time.delayedCall(duration, () => {
    scene.enemies.getChildren().forEach((enemy) => {
      if (!enemy.active) return;
      enemy.clearTint?.();
    });
  });
}

// --- LIGHTNING --- usar setStrokeStyle y depth para que SE VEAN los rayos
export function chainLightningEffect(scene, targets) {
  if (!targets || targets.length === 0) return;

  let prev = { x: scene.player.x, y: scene.player.y };

  targets.forEach((enemy, i) => {
    scene.time.delayedCall(i * 150, () => {
      if (!enemy.active) return;

      const bolt = scene.add.line(
        0, 0,
        prev.x, prev.y,
        enemy.x, enemy.y
      )
        .setOrigin(0, 0)
        .setStrokeStyle(6, 0x00ffff, 1)
        .setDepth(9999)
        .setBlendMode(Phaser.BlendModes.ADD);

      scene.tweens.add({
        targets: bolt,
        alpha: 0,
        duration: 250,
        ease: "Cubic.easeOut",
        onComplete: () => bolt.destroy()
      });

      const sparks = scene.add.particles(enemy.x, enemy.y, "spark", {
        speed: { min: -200, max: 200 },
        lifespan: { min: 250, max: 500 },
        scale: { start: 0.6, end: 0 },
        quantity: 25,
        tint: [0x00ffff, 0x88ffff, 0xffff00, 0xffffff],
        blendMode: "ADD"
      });
      scene.time.delayedCall(400, () => sparks.destroy());

      const burst = scene.add.particles(enemy.x, enemy.y, "spark", {
        speed: { min: -80, max: 80 },
        lifespan: { min: 100, max: 250 },
        scale: { start: 0.3, end: 0 },
        quantity: 12,
        tint: [0xffffff, 0x00ffff],
        blendMode: "ADD"
      });
      scene.time.delayedCall(200, () => burst.destroy());

      if (GameSettings.accessibility.flash) {
        scene.cameras.main.flash(200, 255, 100, 0);
      }
      if (GameSettings.accessibility.shake) {
        scene.cameras.main.shake(150, 0.01);
      }

      prev = { x: enemy.x, y: enemy.y };
    });
  });
}
