import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    const startButton = this.add.image(400, 300, "buttonImg").setInteractive();

    startButton.on("pointerdown", () => {
      this.scene.start("GameScene");
    });
  }
}
