import Phaser from "phaser";
import { GameSettings, applyQualityPreset } from "../managers/GameSettings";

export default class SettingsScene extends Phaser.Scene {
    constructor() {
        super("SettingsScene");

        this.globalOn = true;
        this.musicOn = true;
        this.fxOn = true;
        this.ambientOn = true;

        this.globalVolume = 1;
        this.musicVolume = 1;
        this.fxVolume = 1;
        this.ambientVolume = 1;

        this.currentQuality = GameSettings.quality || "high";

        this.flashEnabled = true;
        this.shakeEnabled = true;

        this.fxDropdowns = {};
        this.dropdowns = {};
    }

    create() {
        const { width, height } = this.sys.game.config;
        const centerX = width / 2;

        this.globalOn = this.registry.get("globalOn") ?? true;
        this.globalVolume = this.registry.get("globalVolume") ?? 1;
        this.musicOn = this.registry.get("musicOn") ?? true;
        this.musicVolume = this.registry.get("musicVolume") ?? 1;
        this.fxOn = this.registry.get("fxOn") ?? true;
        this.fxVolume = this.registry.get("fxVolume") ?? 1;
        this.ambientOn = this.registry.get("ambientOn") ?? true;
        this.ambientVolume = this.registry.get("ambientVolume") ?? 1;

        this.flashEnabled = this.registry.get("flashEnabled") ?? true;
        this.shakeEnabled = this.registry.get("shakeEnabled") ?? true;

        this.add.text(centerX, height * 0.05, "Ajustes del juego", {
            fontSize: "42px",
            fill: "#11e0e7ff"
        }).setOrigin(0.5);

        //-----AJUSTES DE AUDIO-----
        const audioOptions = [
            { name: "Global", key: "global", y: 0.15, on: this.globalOn, volume: this.globalVolume },
            { name: "Música", key: "music", y: 0.20, on: this.musicOn, volume: this.musicVolume },
            { name: "FX", key: "fx", y: 0.25, on: this.fxOn, volume: this.fxVolume },
            { name: "Ambiente", key: "ambient", y: 0.30, on: this.ambientOn, volume: this.ambientVolume },
        ];

        audioOptions.forEach(opt => {
            this.add.text(centerX - 155, height * opt.y, opt.name, {
                fontSize: "26px",
                fill: "#fff"
            }).setOrigin(0.5);

            this.createMusicBar(centerX - 90, height * opt.y, GameSettings.audio[opt.key].volume, (value) => {
                GameSettings.audio[opt.key].volume = value;
                if (opt.key === "music" || opt.key === "global") {
                    const music = this.sound.get("bgMusic");
                    if (music) music.setVolume(GameSettings.audio.global.volume * GameSettings.audio.music.volume);
                }
            });

            const toggle = this.add.text(centerX + 190, height * opt.y, GameSettings.audio[opt.key].on ? "ON" : "OFF", {
                fontSize: "20px",
                fill: GameSettings.audio[opt.key].on ? "#0f0" : "#f00"
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            toggle.on("pointerdown", () => {
                GameSettings.audio[opt.key].on = !GameSettings.audio[opt.key].on;
                toggle.setText(GameSettings.audio[opt.key].on ? "ON" : "OFF")
                    .setStyle({ fill: GameSettings.audio[opt.key].on ? "#0f0" : "#f00" });

                if (opt.key === "global") {
                    this.sound.setMute(!GameSettings.audio.global.on);
                } else if (opt.key === "music") {
                    const music = this.sound.get("bgMusic");
                    if (music) {
                        if (GameSettings.audio.music.on) {
                            music.setVolume(GameSettings.audio.global.volume * GameSettings.audio.music.volume);
                        } else {
                            music.setVolume(0);
                        }
                    }
                }
            });
        });

        //-----AJUSTES DE CALIDAD Y ACCESIBILIDAD-----
        this.add.text(centerX, height * 0.40, "---Efectos FX---", {
            fontSize: "28px",
            fill: "#ffffffff"
        }).setOrigin(0.5);

        this.add.text(centerX - 60, height * 0.45, "Calidad:", {
            fontSize: "22px",
            fill: "#fff"
        }).setOrigin(0.5);

        // --- DROPDOWN DE CALIDAD ---
        const qualityDropdown = this.createDropdown(
            centerX + 100, height * 0.45,
            ["low", "medium", "high"],
            ["Bajo", "Medio", "Alto"],
            this.selectQuality.bind(this),
            'quality'
        );
        this.qualityButton = qualityDropdown.button;
        this.dropdowns.quality = qualityDropdown.optionsContainer;
        this.qualityButton.setText(this.getQualityDisplayName(this.currentQuality));

        //--- DROPDOWNS DE CALIDAD DE FX ---
        const fxKeys = ["fire", "ice", "lightning"];
        const fxLabels = ["Fuego", "Hielo", "Rayos"];
        // Modificado: Eliminado "off"
        const fxQualities = ["low", "medium", "high"];
        const fxQualityLabels = ["Bajo", "Medio", "Alto"];

        fxKeys.forEach((fx, i) => {
            const yPos = 0.50 + i * 0.05;
            this.add.text(centerX - 100, height * yPos, fxLabels[i], {
                fontSize: "20px",
                fill: "#fff"
            }).setOrigin(0.5);

            const fxDropdown = this.createDropdown(
                centerX + 100, height * yPos,
                fxQualities,
                fxQualityLabels,
                (quality) => this.selectFXOption(fx, quality),
                fx
            );
            this.dropdowns[fx] = fxDropdown.optionsContainer;
            this.fxDropdowns[fx] = fxDropdown.button;
        });

        this.updateQualityDisplay();
        this.updateFXToggles();

        //--- ACCESIBILIDAD ---
        this.add.text(centerX, height * 0.70, "---Accesibilidad---", {
            fontSize: "28px",
            fill: "#ffffffff"
        }).setOrigin(0.5);

        this.add.text(centerX - 120, height * 0.75, "Flash efectos:", {
            fontSize: "22px",
            fill: "#fff"
        }).setOrigin(0.5);

        this.flashToggle = this.add.text(centerX + 120, height * 0.75, this.flashEnabled ? "ON" : "OFF", {
            fontSize: "20px",
            fill: this.flashEnabled ? "#0f0" : "#f00"
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                this.flashEnabled = !this.flashEnabled;
                this.registry.set("flashEnabled", this.flashEnabled);
                this.flashToggle.setText(this.flashEnabled ? "ON" : "OFF")
                    .setStyle({ fill: this.flashEnabled ? "#0f0" : "#f00" });
            });

        this.add.text(centerX - 120, height * 0.80, "Shake efectos:", {
            fontSize: "22px",
            fill: "#fff"
        }).setOrigin(0.5);

        this.shakeToggle = this.add.text(centerX + 120, height * 0.80, this.shakeEnabled ? "ON" : "OFF", {
            fontSize: "20px",
            fill: this.shakeEnabled ? "#0f0" : "#f00"
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                this.shakeEnabled = !this.shakeEnabled;
                this.registry.set("shakeEnabled", this.shakeEnabled);
                this.shakeToggle.setText(this.shakeEnabled ? "ON" : "OFF")
                    .setStyle({ fill: this.shakeEnabled ? "#0f0" : "#f00" });
            });

        this.add.text(centerX, height * 0.90, "Volver al menú", {
            fontSize: "26px",
            fill: "#ffffffff"
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                this.scene.start("MenuScene");
            })
            .on("pointerover", function () { this.setStyle({ fill: "#ff0" }); })
            .on("pointerout", function () { this.setStyle({ fill: "#11e0e7ff" }); });
    }

    createDropdown(x, y, values, labels, callback, type) {
        const mainButton = this.add.text(x, y, "", {
            fontSize: "20px",
            fill: "#0f0",
            backgroundColor: "#333",
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on("pointerdown", () => this.toggleDropdown(type));

        const optionsContainer = this.add.container(x + 100, y);
        optionsContainer.setVisible(false);

        let currentX = 0;
        labels.forEach((label, i) => {
            const option = this.add.text(currentX, 0, label, {
                fontSize: "18px",
                fill: "#fff",
                backgroundColor: "#222",
                padding: { x: 10, y: 5 }
            }).setOrigin(0, 0.5)
                .setInteractive({ useHandCursor: true })
                .on("pointerdown", () => {
                    callback(values[i]);
                    optionsContainer.setVisible(false);
                });
            optionsContainer.add(option);
            currentX += option.width + 10;
        });

        return { button: mainButton, optionsContainer: optionsContainer };
    }

    createMusicBar(x, y, initialValue, callback) {
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

    toggleDropdown(type) {
        for (const key in this.dropdowns) {
            this.dropdowns[key].setVisible(false);
        }

        if (this.dropdowns[type]) {
            this.dropdowns[type].setVisible(true);
        }
    }

    selectQuality(quality) {
        this.currentQuality = quality;
        applyQualityPreset(this.currentQuality);
        
        const presetEffects = GameSettings.presets[quality].effects;
        Object.keys(presetEffects).forEach(fxKey => {
            GameSettings.effects[fxKey] = { ...presetEffects[fxKey] };
        });
        
        this.updateQualityDisplay();
        this.updateFXToggles();
    }

    selectFXOption(fxKey, quality) {
        Object.assign(GameSettings.effects[fxKey], GameSettings.presets[quality].effects[fxKey]);
        GameSettings.effects[fxKey].enabled = true;
        GameSettings.effects[fxKey].quality = quality;
    
        this.updateQualityDisplay();
        this.updateFXToggles();
    }

    updateQualityDisplay() {
        const isLow = this.compareSettings("low");
        const isMedium = this.compareSettings("medium");
        const isHigh = this.compareSettings("high");

        if (isLow) {
            this.currentQuality = "low";
        } else if (isMedium) {
            this.currentQuality = "medium";
        } else if (isHigh) {
            this.currentQuality = "high";
        } else {
            this.currentQuality = "custom";
        }
        
        this.qualityButton.setText(this.getQualityDisplayName(this.currentQuality));
        this.qualityButton.setStyle({ fill: this.currentQuality === "custom" ? "#ff0" : "#0f0" });
    }

    updateFXToggles() {
        const fxKeys = ["fire", "ice", "lightning"];
        fxKeys.forEach(fx => {
            const mainButton = this.fxDropdowns[fx];
            const currentFxQuality = GameSettings.effects[fx].quality || "high";
            mainButton.setText(this.getQualityDisplayName(currentFxQuality)).setStyle({ fill: "#0f0" });
        });
    }

    getQualityDisplayName(quality) {
        const displayNames = { low: "BAJO", medium: "MEDIO", high: "ALTO", custom: "PERSONALIZADO" };
        return displayNames[quality] || quality.toUpperCase();
    }

    compareSettings(presetKey) {
        const preset = GameSettings.presets[presetKey];
        if (!preset) return false;

        const fxKeys = ["fire", "ice", "lightning"];
        for (const fx of fxKeys) {
            const current = GameSettings.effects[fx];
            const presetFx = preset.effects[fx];

            if (current.quality !== presetFx.quality) {
                return false;
            }

            if (current.enabled !== presetFx.enabled) {
                return false;
            }
        }
        
        return true;
    }
}