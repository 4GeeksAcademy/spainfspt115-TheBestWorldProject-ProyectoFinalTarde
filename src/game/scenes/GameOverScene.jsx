import Phaser from "phaser";
import { createGameOverBackground } from "../managers/BackgroundManager";
import { GameSettings } from "../managers/GameSettings";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    createGameOverBackground(this);

    // parar musicas de fondo
    this.sound.stopAll();

    // reproducir efecto de game over solo una vez
    this.sound.play("game_over_fx", {
      volume: GameSettings.audio.global.volume * GameSettings.audio.fx.volume,
    });

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
    const restartButton = this.add.text(centerX, centerY + height * 0.1, "Reintentar", {
        fontSize: "28px",
        fill: "#fff",
    }).setOrigin(0.5).setInteractive();

    restartButton.on("pointerdown", () => {
      this.scene.start("LoadingScene", {
        nextScene: "GameScene",
      });
    });

    // boton volver al menu
    const menuButton = this.add.text(centerX, centerY + height * 0.2, "Volver al menú", {
      fontSize: "24px",
      fill: "#fff",
    }).setOrigin(0.5).setInteractive();

    menuButton.on("pointerdown", () => {
        this.scene.start("MenuScene");
    });

    // === EFECTO HOVER para botones ===
    [menuButton, restartButton].forEach(button => {
      button.on("pointerover", () => button.setStyle({ fill: "#ff0" }));
      button.on("pointerout", () => button.setStyle({ fill: "#fff" }));
    });
  }
}
