import Phaser from "phaser";
import { GameSettings } from "../managers/GameSettings";
import { createMenuBackground } from "../managers/BackgroundManager";
import { getLeaderboard } from "../managers/APIservices";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
    this.modal = null;
  }

  create() {
    const gSound = this.sound.get("game_song");
    if (gSound && gSound.isPlaying) gSound.stop();

    createMenuBackground(this);

    let music = this.sound.get("menu_song");
    if (!music) {
      music = this.sound.add("menu_song", {
        loop: true,
        volume: GameSettings.audio.global.volume * GameSettings.audio.music.volume,
      });
    }
    if (!music.isPlaying && GameSettings.audio.music.on && GameSettings.audio.global.on) {
      music.play();
    }
    music.setVolume(GameSettings.audio.global.volume * GameSettings.audio.music.volume);
    music.setMute(!(GameSettings.audio.music.on && GameSettings.audio.global.on));

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

    // === boton: tabla de scores ===
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

    // === boton: ajustes ===
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

    // === boton: salir ===
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
        if (scene.children) scene.children.removeAll(true); // destruye todos los objetos graficos
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

  async showModal() {
    if (this.modal) return;

    const { width, height } = this.sys.game.config;
    const centerX = width / 2;
    const centerY = height / 2;

    // === Fondo sombra ===
    const shadow = this.add.rectangle(centerX, centerY, width, height, 0x000000, 0.6)
      .setInteractive();

    const boxWidth = width * 0.45;
    const boxHeight = height * 0.75;
    const box = this.add.rectangle(centerX, centerY, boxWidth, boxHeight, 0x1a1a1a, 0.95)
      .setStrokeStyle(4, 0xffcc00, 0.8);

    // === Titulo ===
    const title = this.add.text(centerX, centerY - boxHeight / 2 + 40, "🏆 Leaderboard 🏆", {
      fontSize: "34px",
      fontStyle: "bold",
      color: "#ffcc00",
      stroke: "#000",
      strokeThickness: 6,
    }).setOrigin(0.5);

    // === Contenedor para la lista ===
    const content = this.add.container(centerX, centerY);

    const loadingText = this.add.text(0, 0, "Cargando...", {
      fontSize: "24px",
      color: "#ffffff",
    }).setOrigin(0.5);
    content.add(loadingText);

    // === Boton cerrar ===
    const closeBtn = this.add.text(centerX, centerY + boxHeight / 2 - 30, "Cerrar", {
      fontSize: "24px",
      color: "#ff4444",
      fontStyle: "bold",
      backgroundColor: "#222",
      padding: { x: 12, y: 6 }
    }).setOrigin(0.5).setInteractive();

    closeBtn.on("pointerdown", () => this.closeModal());
    closeBtn.on("pointerover", () => closeBtn.setStyle({ color: "#ffff00" }));
    closeBtn.on("pointerout", () => closeBtn.setStyle({ color: "#ff4444" }));

    // Agrupar modal
    this.modal = this.add.container(0, 0, [shadow, box, title, content, closeBtn]);

    // Animacion
    this.tweens.add({
      targets: this.modal,
      alpha: { from: 0, to: 1 },
      scale: { from: 0.85, to: 1 },
      duration: 400,
      ease: "Back.Out"
    });

    // === Cargar leaderboard ===
    try {
      const data = await getLeaderboard(100);
      const userId = Number(this.game.registry.get("userId"));

      loadingText.destroy();
      content.removeAll(true);

      const top10 = data.slice(0, 10);
      let userInTop = false;

      // Layout
      const startY = -boxHeight / 2 + 80;
      const rowSpacing = 40;

      // === Render top 10 ===
      top10.forEach((g, i) => {
        const username = g.user?.username || "Anon";
        const score = g.final_score;
        const id = Number(g.user?.id_user);

        let color = "#ffffff";
        let fontSize = "24px";
        let strokeThickness = 3;

        if (i === 0) { color = "#ffd700"; fontSize = "28px"; strokeThickness = 6; }
        else if (i === 1) { color = "#c0c0c0"; fontSize = "26px"; strokeThickness = 5; }
        else if (i === 2) { color = "#cd7f32"; fontSize = "25px"; strokeThickness = 4; }

        const yPos = startY + i * rowSpacing;

        const row = this.add.text(0, yPos, `${i + 1}. ${username}   ${score}`, {
          fontSize,
          color: (id === userId) ? "#00ffcc" : color,
          fontStyle: "bold",
          stroke: "#000",
          strokeThickness,
          backgroundColor: (id === userId) ? "#333366" : ""
        }).setOrigin(0.5, 0);

        if (id === userId) userInTop = true;
        content.add(row);

        if (i === 0) {
          this.tweens.add({
            targets: row,
            scale: { from: 1, to: 1.2 },
            yoyo: true,
            repeat: -1,
            duration: 1000,
            ease: "Sine.easeInOut",
          });
          this.tweens.add({
            targets: row,
            alpha: { from: 1, to: 0.7 },
            yoyo: true,
            repeat: -1,
            duration: 800,
          });
        }
      });

      // === Usuario fuera del top 10 ===
      if (!userInTop && userId && userId !== "pepe") {
        const index = data.findIndex(g => Number(g.user?.id_user) === userId);
        if (index !== -1) {
          const userRank = index + 1;
          const user = data[index].user?.username || "Tú";
          const score = data[index].final_score;

          const extraY = startY + top10.length * rowSpacing + 60;

          const extraRow = this.add.text(0, extraY, `${userRank}. ${user}   ${score}`, {
            fontSize: "22px",
            color: "#00ffcc",
            fontStyle: "bold",
            stroke: "#000",
            strokeThickness: 4,
            backgroundColor: "#333366"
          }).setOrigin(0.5, 0);

          content.add(extraRow);
        }
      }
    } catch (err) {
      loadingText.setText("Error al cargar leaderboard");
      console.error(err);
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.destroy();
      this.modal = null;
    }
  }
}
