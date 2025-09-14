export function createAnimations(scene) {
  // animacion de destruccion del corazon
  scene.anims.create({
    key: "heart_break",
    frames: scene.anims.generateFrameNumbers("heart", { start: 85, end: 97 }),
    frameRate: 15,
    repeat: 0,
    showOnStart: true,
    hideOnComplete: false,
  });

  // animacion rellenado, tiene un reverse porque en el spritesheet la animacion es de vaciado
  const fill = scene.anims
    .generateFrameNumbers("heart", { start: 102, end: 112 })
    .reverse();

  scene.anims.create({
    key: "heart_fill",
    frames: fill,
    frameRate: 15,
    repeat: 0,
    showOnStart: true,
    hideOnComplete: false,
  });
}

export const HEART_FRAMES = {
  FULL: 102,
  EMPTY: 112,
};
