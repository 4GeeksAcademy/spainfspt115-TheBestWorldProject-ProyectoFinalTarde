import Phaser from "phaser";

// --- temblor de letra para indicar error ---
export function shakeLetter(scene, letter) {
  if (!letter) return;

  // matar tween anterior sobre ese objeto para evitar solapamientos
  scene.tweens.killTweensOf(letter);

  // tweenear la propiedad 'shakeOffset' del objeto letter
  scene.tweens.add({
    targets: letter,
    shakeOffset: 8,    // desplazamiento horizontal
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

// --- animación de aparición de palabra ---
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
  wordGroup.getChildren().forEach(letter => {
    const angle = Phaser.Math.Between(0, 360);
    const distance = Phaser.Math.Between(50, 150);
    const dx = distance * Math.cos(angle * (Math.PI / 180));
    const dy = distance * Math.sin(angle * (Math.PI / 180));

    scene.tweens.add({
      targets: letter,
      x: letter.x + dx,
      y: letter.y + dy,
      alpha: 0,
      scale: 0,
      angle: Phaser.Math.Between(-180, 180),
      duration: 500,
      ease: "Power1",
      onComplete: () => letter.destroy(),
    });
  });
}

// --- efecto para el score al sumar puntos ---
export function animateScore(scene) {
  if (!scene.textScore) return;

  scene.tweens.add({
    targets: scene.textScore,
    scale: 1.3,
    duration: 150,
    yoyo: true,
    ease: "Back.easeOut",
  });

  scene.tweens.add({
    targets: scene.textScore,
    alpha: 0.5,
    duration: 100,
    yoyo: true,
    repeat: 1,
  });
}

// --- texto flotante de "+puntos" ---
export function floatingScore(scene, x, y, points = 10) {
  const floatText = scene.add.text(x, y, `+${points}`, {
    fontSize: "28px",
    fill: "#0f0",
    fontStyle: "bold",
    stroke: "#000",
    strokeThickness: 4,
  }).setOrigin(0.5);

  scene.tweens.add({
    targets: floatText,
    y: y - 50,
    alpha: 0,
    duration: 800,
    ease: "Cubic.easeOut",
    onComplete: () => floatText.destroy(),
  });
}

// --- animacion de escalado de texto ---
export function animateScaleText(scene, target) {
  scene.tweens.add({
    targets: target,
    scale: { from: 1.5, to: 1 },
    alpha: { from: 0, to: 1 },
    duration: 400,
    ease: "Back.Out",
  });
}