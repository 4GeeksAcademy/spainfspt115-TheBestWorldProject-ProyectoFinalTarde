// --- temblor de letra para indicar error ---
export function shakeLetter(scene, letter) {
    if (!letter) return;
    scene.tweens.add({
        targets: letter,
        x: letter.x + 4,
        yoyo: true,
        repeat: 2,
        duration: 50,
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
  scene.tweens.add({
    targets: scene.textScore,
    scale: 1.3,
    duration: 150,
    yoyo: true,
    ease: "Back.easeOut"
  });

  scene.tweens.add({
    targets: scene.textScore,
    alpha: 0.5,
    duration: 100,
    yoyo: true,
    repeat: 1
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
    onComplete: () => floatText.destroy()
  });
}