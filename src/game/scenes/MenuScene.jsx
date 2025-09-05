import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
    this.modal = null;
  }

  create() {
    // === BOTÓN: INICIAR PARTIDA ===
    const startButton = this.add.text(400, 200, "Iniciar Partida", {
      fontSize: "32px",
      fill: "#fff"
    }).setOrigin(0.5).setInteractive();

    startButton.on("pointerdown", () => {
      this.scene.start("GameScene");
    });

    // === BOTÓN: TABLA DE SCORES ===
    const scoreButton = this.add.text(400, 260, "Tabla de Scores", {
      fontSize: "32px",
      fill: "#fff"
    }).setOrigin(0.5).setInteractive();

    scoreButton.on("pointerdown", () => {
      this.showModal();
    });

    // === BOTÓN: AJUSTES ===
    const settingsButton = this.add.text(400, 320, "Ajustes", {
      fontSize: "32px",
      fill: "#fff"
    }).setOrigin(0.5).setInteractive();

    settingsButton.on("pointerdown", () => {
      this.scene.start("SettingsScene");
    });

    // === BOTÓN: SALIR (cerrar motor) ===
    const exitButton = this.add.text(400, 380, "Salir", {
      fontSize: "32px",
      fill: "#fff"
    }).setOrigin(0.5)
      .setInteractive();

    exitButton.on("pointerdown", () => {
      this.game.destroy(true);
    });

    // === EFECTO HOVER ===
    [startButton, scoreButton, settingsButton, exitButton].forEach(button => {
      button.on("pointerover", () => {
        button.setStyle({ fill: "#ff0" });
      });
      button.on("pointerout", () => {
        button.setStyle({ fill: "#fff" });
      });
    });
  }

  showModal() {
    if (this.modal) return;

    // Fondo semitransparente
    const bg = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5);

    // Caja del modal
    const box = this.add.rectangle(400, 300, 650, 450, 0xffffff);

    // Texto del modal
    const title = this.add.text(400, 220, "Tabla de Scores", {
      fontSize: "28px",
      color: "#000"
    }).setOrigin(0.5);

    const content = this.add.text(400, 300, "1. K0ST4N - 180\n2. Artureyy - 120\n3. JavierMV - 100\n4. BYCARLOSS - 90\n5. TrivM - 80", {
      fontSize: "21px",
      color: "#000"
    }).setOrigin(0.5);

    // Botón cerrar
    const closeBtn = this.add.text(400, 420, "Cerrar", {
      fontSize: "20px",
      color: "#f00"
    }).setOrigin(0.5).setInteractive();

    closeBtn.on("pointerdown", () => {
      this.closeModal();
    });

    // Agrupar en un container
    this.modal = this.add.container(0, 0, [bg, box, title, content, closeBtn]);
  }

  closeModal() {
    if (this.modal) {
      this.modal.destroy();
      this.modal = null;
    }
  }
}
