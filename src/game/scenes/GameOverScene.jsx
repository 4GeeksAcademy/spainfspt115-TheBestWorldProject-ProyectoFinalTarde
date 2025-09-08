import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {

    this.add.text(400, 200, "GAME OVER", {
        fontSize: "48px",
        fill: "#ff0000",
    }).setOrigin(0.5);

    this.add.text(400, 280, `Puntaje: ${this.finalScore}`, {
        fontSize: "32px",
        fill: "#fff",
    }).setOrigin(0.5);

    // Botón reiniciar
    const restartBtn = this.add.text(400, 360, "Reintentar", {
        fontSize: "28px",
        fill: "#0f0",
    }).setOrigin(0.5).setInteractive();

    restartBtn.on("pointerdown", () => {
        this.scene.start("GameScene");
    });

    // Botón volver al menú
    const menuBtn = this.add.text(400, 420, "Volver al menú", {
      fontSize: "24px",
      fill: "#ff0",
    }).setOrigin(0.5).setInteractive();

    menuBtn.on("pointerdown", () => {
        this.scene.start("MenuScene");
    });
  }
}
