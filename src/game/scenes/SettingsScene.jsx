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
            //---Barra de volumen---
            this.createMusicBar(centerX - 90, height * opt.y, GameSettings.audio[opt.key].volume, (value) => {
                GameSettings.audio[opt.key].volume = value;
                console.log(`Volumen de ${opt.key}: ${value.toFixed(2)}`);
                
                if (opt.key === "music" || opt.key === "global") {
                    const music = this.sound.get("bgMusic");
                    if (music) music.setVolume(GameSettings.audio.global.volume * GameSettings.audio.music.volume);
                }
            });
            //--- AJUSTES AUDIO ON/OFF ---
            const toggle = this.add.text(centerX + 190, height * opt.y, GameSettings.audio[opt.key].on ? "ON" : "OFF", {
                fontSize: "20px",
                fill: GameSettings.audio[opt.key].on ? "#0f0" : "#f00"
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            toggle.on("pointerdown", () => {
                GameSettings.audio[opt.key].on = !GameSettings.audio[opt.key].on;
                
                console.log(`Botón ${opt.key} presionado. Nuevo estado: ${GameSettings.audio[opt.key].on}`);
                
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
        
        // --- BOTÓN PRINCIPAL DEL DROPDOWN DE CALIDAD ---
        this.qualityButton = this.add.text(centerX + 100, height * 0.45, "", {
            fontSize: "20px",
            fill: "#0f0",
            backgroundColor: "#333",
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on("pointerdown", () => this.toggleDropdown('quality'));

        // --- OPCIONES DEL DROPDOWN (AHORA HACIA LA DERECHA) ---
        this.qualityDropdown = this.add.container(centerX + 160, height * 0.45);
        this.qualityDropdown.setVisible(false);
        const qualities = ["low", "medium", "high"];
        const qualityLabels = ["Bajo", "Medio", "Alto"];

        qualities.forEach((quality, i) => {
            const option = this.add.text(i * 70, 0, qualityLabels[i], {
                fontSize: "18px",
                fill: "#fff",
                backgroundColor: "#222",
                padding: { x: 10, y: 5 }
            }).setOrigin(0.5)
              .setInteractive({ useHandCursor: true });

            option.on("pointerdown", () => this.selectQuality(quality));
            this.qualityDropdown.add(option);
        });
        
        //--- OPCIONES DE CALIDAD DE FX ---
        const fxKeys = ["fire", "ice", "lightning"];
        const fxLabels = ["Fuego", "Hielo", "Rayos"];
        fxKeys.forEach((fx, i) => {
            const yPos = 0.50 + i * 0.05;
            this.add.text(centerX - 100, height * yPos, fxLabels[i], {
                fontSize: "20px",
                fill: "#fff"
            }).setOrigin(0.5);

            // --- CADA FX TIENE AHORA SU PROPIO DROPDOWN ---
            const fxDropdown = this.add.container(centerX + 100, height * yPos);
            this.fxDropdowns[fx] = fxDropdown;

            // Botón principal del dropdown de FX
            const mainButton = this.add.text(0, 0, "", {
                fontSize: "20px",
                fill: "#0f0",
                backgroundColor: "#333",
                padding: { x: 10, y: 5 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true })
              .on("pointerdown", () => this.toggleDropdown(fx));

            // Opciones del dropdown de FX (AHORA HACIA LA DERECHA)
            const optionsContainer = this.add.container(70, 0);
            optionsContainer.setVisible(false);
            
            const fxQualities = ["low", "medium", "high", "off"];
            const fxQualityLabels = ["Bajo", "Medio", "Alto", "Inactivo"];

            // Añadir fondo dinámico para el dropdown
            const bgWidth = fxQualities.length * 70;
            const optionsBg = this.add.rectangle(bgWidth / 2 - 35, 0, bgWidth, 40, 0x111111, 0.9).setOrigin(0.5);
            optionsContainer.add(optionsBg);

            fxQualities.forEach((quality, j) => {
                const option = this.add.text(j * 70 - (bgWidth / 2 - 35), 0, fxQualityLabels[j], {
                    fontSize: "18px",
                    fill: "#fff",
                    backgroundColor: "#222",
                    padding: { x: 10, y: 5 }
                }).setOrigin(0.5).setInteractive({ useHandCursor: true })
                  .on("pointerdown", () => this.selectFXOption(fx, quality));
                optionsContainer.add(option);
            });

            fxDropdown.add([mainButton, optionsContainer]);
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
        //--- ACCESIBILIDAD: FLASH Y SHAKE ON/OFF---
        this.flashToggle = this.add.text(centerX + 120, height * 0.75, this.flashEnabled ? "ON" : "OFF", {
            fontSize: "20px",
            fill: this.flashEnabled ? "#0f0" : "#f00"
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                console.log(`Botón de Flash presionado. Nuevo estado: ${!this.flashEnabled}`);

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
                console.log(`Botón de Shake presionado. Nuevo estado: ${!this.shakeEnabled}`);
                
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
                console.log("Volviendo al menú.");
                this.scene.start("MenuScene");
            })
            .on("pointerover", function () { this.setStyle({ fill: "#ff0" }); })
            .on("pointerout", function () { this.setStyle({ fill: "#11e0e7ff" }); });
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

    // ===== GESTIÓN DE MENÚS DESPLEGABLES =====
    toggleDropdown(type) {
        this.qualityDropdown.setVisible(false);
        for (const key in this.fxDropdowns) {
            this.fxDropdowns[key].getAt(1).setVisible(false);
        }

        if (type === 'quality') {
            this.qualityDropdown.setVisible(!this.qualityDropdown.visible);
            console.log(`Menú de Calidad: ${this.qualityDropdown.visible ? "Visible" : "Oculto"}`);
        } else {
            const optionsContainer = this.fxDropdowns[type].getAt(1);
            optionsContainer.setVisible(!optionsContainer.visible);
            console.log(`Menú de ${type}: ${optionsContainer.visible ? "Visible" : "Oculto"}`);
        }
    }

    selectQuality(quality) {
        this.currentQuality = quality;
        applyQualityPreset(this.currentQuality);
        this.updateQualityDisplay();
        this.updateFXToggles();
        this.toggleDropdown('quality'); 
        console.log(`Calidad seleccionada: ${quality}`);
    }

    selectFXOption(fxKey, quality) {
        if (quality === "off") {
            GameSettings.effects[fxKey].enabled = false;
        } else {
            // Usa Object.assign para copiar las propiedades del preset al efecto
            Object.assign(GameSettings.effects[fxKey], GameSettings.presets[quality].effects[fxKey]);
            GameSettings.effects[fxKey].enabled = true;
            GameSettings.effects[fxKey].quality = quality; // Guarda la calidad seleccionada
        }

        this.currentQuality = "custom";
        this.updateQualityDisplay();
        this.updateFXToggles();
        this.toggleDropdown(fxKey);
        console.log(`Opción ${fxKey} seleccionada: ${quality}`);
    }

    updateQualityDisplay() {
        if (this.currentQuality === "custom") {
            this.qualityButton.setText("PERSONALIZADO")
                .setStyle({ fill: "#ff0" });
        } else {
            const displayNames = { low: "BAJO", medium: "MEDIO", high: "ALTO" };
            this.qualityButton.setText(displayNames[this.currentQuality])
                .setStyle({ fill: "#0f0" });
        }
    }

    updateFXToggles() {
        const fxKeys = ["fire", "ice", "lightning"];
        const displayNames = { low: "BAJO", medium: "MEDIO", high: "ALTO" };
        
        fxKeys.forEach(fx => {
            const mainButton = this.fxDropdowns[fx].getAt(0);
            
            if (GameSettings.effects[fx].enabled === false) {
                mainButton.setText("INACTIVO")
                    .setStyle({ fill: "#f00" });
            } else {
                const currentFxQuality = GameSettings.effects[fx].quality || "high";
                mainButton.setText(displayNames[currentFxQuality])
                    .setStyle({ fill: "#0f0" });
            }
        });
    }
}