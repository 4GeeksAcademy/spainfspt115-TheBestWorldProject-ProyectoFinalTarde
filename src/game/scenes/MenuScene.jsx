import Phaser from "phaser";
import { GameSettings } from "../managers/GameSettings";
import { createMenuBackground } from "../managers/BackgroundManager";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
    this.modal = null;
  }

  create() {
    createMenuBackground(this);

    // === Iniciar música global si no está ya activa ===
    // let music = this.sound.get("bgMusic");

    // if (!music) {
    //   // si no existe, la creamos con el volumen actual de GameSettings
    //   music = this.sound.add("bgMusic", {
    //     loop: true,
    //     volume:
    //       GameSettings.audio.global.volume * GameSettings.audio.music.volume,
    //   });
    //   music.play();
    // } else {
    //   // si ya existía, aseguramos el volumen correcto
    //   music.setVolume(
    //     GameSettings.audio.global.volume * GameSettings.audio.music.volume
    //   );
    // }

    const { width, height } = this.sys.game.config;
    const centerX = width / 2;

    // --- titulo ---
    const title = this.add.text(centerX, height * 0.15, "- M E C A M A G I C -", {
      fontSize: "40px",
      color: "#fff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    // === boton: iniciar partida ===
    const startButton = this.add.text(centerX, height * 0.35, "Iniciar Partida", {
      fontSize: "32px",
      fill: "#fff"
    }).setOrigin(0.5).setInteractive();

    startButton.on("pointerdown", () => {
      this.scene.start("LoadingScene", {
        nextScene: "GameScene",
      });
    });

    // === botón: tabla de scores ===
    const scoreButton = this.add
      .text(centerX, height * 0.43, "Tabla de Scores", {
        fontSize: "32px",
        fill: "#fff",
      })
      .setOrigin(0.5)
      .setInteractive();

    scoreButton.on("pointerdown", () => {
      this.showModal();
    });

    // === botón: ajustes ===
    const settingsButton = this.add
      .text(centerX, height * 0.51, "Ajustes", {
        fontSize: "32px",
        fill: "#fff",
      })
      .setOrigin(0.5)
      .setInteractive();

    settingsButton.on("pointerdown", () => {
      this.scene.start("SettingsScene");
    });

    // === botón: salir ===
    const exitButton = this.add
      .text(centerX, height * 0.59, "Salir", {
        fontSize: "32px",
        fill: "#fff",
      })
      .setOrigin(0.5)
      .setInteractive();

    exitButton.on("pointerdown", () => {
      const goProfile = this.game.registry.get("exitToProfile");

      // Limpieza de escenas activas
      this.scene.manager.getScenes(true).forEach(scene => {
        scene.time?.removeAllEvents();
        scene.tweens?.killAll();
        scene.sound?.stopAll();
        scene.input?.removeAllListeners();
        if (scene.children) scene.children.removeAll(true); // destruye todos los objetos gráficos
        if (scene.physics?.world) scene.physics.world.shutdown();
      });

      // Destruir animaciones globales
      this.anims.destroy();

      // Finalmente destruir el juego completo
      this.game.destroy(true);

      // Redirigir al perfil (React Router)
      if (typeof goProfile === "function") goProfile();
    });

    // === EFECTO HOVER para botones ===
    [startButton, scoreButton, settingsButton, exitButton].forEach((button) => {
      button.on("pointerover", () => button.setStyle({ fill: "#ff0" }));
      button.on("pointerout", () => button.setStyle({ fill: "#fff" }));
    });
  }

  showModal() {
    if (this.modal) return;

    const { width, height } = this.sys.game.config;
    const centerX = width / 2;
    const centerY = height / 2;

    // sombra
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.3);
    shadow.fillRoundedRect(
      centerX - width * 0.4 + 5,
      centerY - height * 0.3 + 5,
      width * 0.8,
      height * 0.6,
      20
    );

    // caja blanca + bordes redondeados
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRoundedRect(
      centerX - width * 0.4,
      centerY - height * 0.3,
      width * 0.8,
      height * 0.6,
      20
    );

    // texto del modal
    const title = this.add
      .text(centerX, centerY - height * 0.22, "Tabla de Scores", {
        fontSize: "28px",
        color: "#000",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const content = this.add
      .text(
        centerX,
        centerY,
        "1. K0ST4N - 180\n2. Artureyy - 120\n3. JavierMV - 100\n4. BYCARLOSS - 90\n5. TrivM - 80",
        {
          fontSize: "21px",
          color: "#000",
          align: "center",
        }
      )
      .setOrigin(0.5);

    // botón cerrar
    const closeBtn = this.add
      .text(centerX, centerY + height * 0.22, "Cerrar", {
        fontSize: "22px",
        color: "#f00",
      })
      .setOrigin(0.5)
      .setInteractive();

    closeBtn.on("pointerdown", () => this.closeModal());
    closeBtn.on("pointerover", () => closeBtn.setStyle({ color: "#ff0" }));
    closeBtn.on("pointerout", () => closeBtn.setStyle({ color: "#f00" }));

    // Agrupar en un container
    this.modal = this.add.container(0, 0, [
      shadow,
      graphics,
      title,
      content,
      closeBtn,
    ]);
  }

  closeModal() {
    if (this.modal) {
      this.modal.destroy();
      this.modal = null;
    }
  }
}
