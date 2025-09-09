import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    const { width, height } = this.sys.game.config;
    const centerX = width / 2;
    const centerY = height / 2;

    this.add.text(centerX, centerY - height * 0.2, "GAME OVER", {
        fontSize: "48px",
        fill: "#ff0000",
    }).setOrigin(0.5);

    this.add.text(centerX, centerY - height * 0.1, `Puntaje: ${this.finalScore}`, {
        fontSize: "32px",
        fill: "#fff",
    }).setOrigin(0.5);

    // boton reiniciar
    const restartBtn = this.add.text(centerX, centerY, "Reintentar", {
        fontSize: "28px",
        fill: "#0f0",
    }).setOrigin(0.5).setInteractive();

    restartBtn.on("pointerdown", () => {
        this.scene.start("GameScene");
    });

    // btono volver al menu
    const menuBtn = this.add.text(centerX, centerY + height * 0.1, "Volver al menú", {
      fontSize: "24px",
      fill: "#ff0",
    }).setOrigin(0.5).setInteractive();

    menuBtn.on("pointerdown", () => {
        this.scene.start("MenuScene");
    });
  }
}
