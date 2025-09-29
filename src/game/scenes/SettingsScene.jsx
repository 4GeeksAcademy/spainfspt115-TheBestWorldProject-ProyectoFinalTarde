import Phaser from "phaser";
import { GameSettings } from "../managers/GameSettings";
import { createSettingsBackground } from "../managers/BackgroundManager";

export default class SettingsScene extends Phaser.Scene {
  constructor() {
    super("SettingsScene");
  }

  create() {
    createSettingsBackground(this);

    const { width, height } = this.sys.game.config;
    const centerX = width / 2;

    this.add.text(centerX, height * 0.05, "Ajustes del juego", {
      fontSize: "42px",
      fill: "#11e0e7ff"
    }).setOrigin(0.5);

    // --- Audio ---
    const audioOptions = [
      { name: "Global", key: "global", y: 0.20 },
      { name: "Música", key: "music", y: 0.28 },
      { name: "FX", key: "fx", y: 0.36 },
    ];

    audioOptions.forEach(opt => {
      this.add.text(centerX - 155, height * opt.y, opt.name, {
        fontSize: "26px",
        fill: "#fff"
      }).setOrigin(0.5);

      this.createVolumeBar(centerX - 90, height * opt.y,
        GameSettings.audio[opt.key].volume,
        (value) => {
          GameSettings.audio[opt.key].volume = value;
          this.updateAllVolumes();
        });

      const toggle = this.add.text(centerX + 190, height * opt.y,
        GameSettings.audio[opt.key].on ? "ON" : "OFF", {
          fontSize: "20px",
          fill: GameSettings.audio[opt.key].on ? "#0f0" : "#f00"
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      toggle.on("pointerdown", () => {
        GameSettings.audio[opt.key].on = !GameSettings.audio[opt.key].on;
        toggle.setText(GameSettings.audio[opt.key].on ? "ON" : "OFF")
          .setStyle({ fill: GameSettings.audio[opt.key].on ? "#0f0" : "#f00" });
        this.updateAllVolumes();
      });
    });

    // --- Accesibilidad ---
    this.add.text(centerX, height * 0.50, "---Accesibilidad---", {
      fontSize: "28px",
      fill: "#ffffffff"
    }).setOrigin(0.5);

    // Flash
    this.add.text(centerX - 120, height * 0.58, "Flash efectos:", {
      fontSize: "22px",
      fill: "#fff"
    }).setOrigin(0.5);

    const flashToggle = this.add.text(centerX + 120, height * 0.58,
      GameSettings.accessibility.flash ? "ON" : "OFF", {
        fontSize: "20px",
        fill: GameSettings.accessibility.flash ? "#0f0" : "#f00"
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    flashToggle.on("pointerdown", () => {
      GameSettings.accessibility.flash = !GameSettings.accessibility.flash;
      flashToggle.setText(GameSettings.accessibility.flash ? "ON" : "OFF")
        .setStyle({ fill: GameSettings.accessibility.flash ? "#0f0" : "#f00" });
    });

    // Shake
    this.add.text(centerX - 120, height * 0.66, "Shake efectos:", {
      fontSize: "22px",
      fill: "#fff"
    }).setOrigin(0.5);

    const shakeToggle = this.add.text(centerX + 120, height * 0.66,
      GameSettings.accessibility.shake ? "ON" : "OFF", {
        fontSize: "20px",
        fill: GameSettings.accessibility.shake ? "#0f0" : "#f00"
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    shakeToggle.on("pointerdown", () => {
      GameSettings.accessibility.shake = !GameSettings.accessibility.shake;
      shakeToggle.setText(GameSettings.accessibility.shake ? "ON" : "OFF")
        .setStyle({ fill: GameSettings.accessibility.shake ? "#0f0" : "#f00" });
    });

    // Boton volver
    this.add.text(centerX, height * 0.85, "Volver al menú", {
      fontSize: "26px",
      fill: "#ffffffff"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("MenuScene"))
      .on("pointerover", function () { this.setStyle({ fill: "#ff0" }); })
      .on("pointerout", function () { this.setStyle({ fill: "#11e0e7ff" }); });
  }

  createVolumeBar(x, y, initialValue, callback) {
    const barWidth = 250;
    const barHeight = 5;

    const barBg = this.add.rectangle(x, y, barWidth, barHeight, 0x555555).setOrigin(0, 0.5);
    const barFill = this.add.rectangle(x, y, barWidth * initialValue, barHeight, 0x00ff00).setOrigin(0, 0.5);
    const handle = this.add.circle(x + barWidth * initialValue, y, 8, 0xffffff).setInteractive({ draggable: true });

    this.input.setDraggable(handle);
    this.input.on("drag", (pointer, gameObject, dragX) => {
      if (gameObject === handle) {
        if (dragX < x) dragX = x;
        if (dragX > x + barWidth) dragX = x + barWidth;
        gameObject.x = dragX;
        const value = (dragX - x) / barWidth;
        barFill.width = barWidth * value;
        callback(value);
      }
    });
  }

  updateAllVolumes() {
    const globalOn = GameSettings.audio.global.on;
    const globalVol = GameSettings.audio.global.volume;

    const musicOn = GameSettings.audio.music.on;
    const musicVol = GameSettings.audio.music.volume;

    const fxOn = GameSettings.audio.fx.on;
    const fxVol = GameSettings.audio.fx.volume;

    // === MUSICA ===
    ["menu_song", "game_song"].forEach(key => {
      const s = this.sound.get(key);
      if (s) {
        s.setVolume(globalVol * musicVol);
        s.setMute(!(globalOn && musicOn));
      }
    });

    // === FX ===
    this.sound.sounds.forEach(s => {
      if (!["menu_song", "game_song"].includes(s.key)) {
        s.setVolume(globalVol * fxVol);
        s.setMute(!(globalOn && fxOn));
      }
    });

    // Global mute maestro
    this.sound.setMute(!globalOn);
  }
}
