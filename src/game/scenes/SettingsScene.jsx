import Phaser from "phaser";

export default class SettingsScene extends Phaser.Scene {
    constructor() {
        super("SettingsScene");
        
        this.musicOn = true;
        this.musicVolume = 1;
        this.fxVolume = 1;
    }

    create() {
        // Recuperar preferencias del registro (si existen)
        this.musicOn = this.registry.get("musicOn") ?? true;
        this.musicVolume = this.registry.get("musicVolume") ?? 1;
        this.fxVolume = this.registry.get("fxVolume") ?? 1;
        this.showScore = this.registry.get("showScore") ?? true;
        
        // Título
        this.add.text(300, 100, "Ajustes del juego", {
            fontSize: "42px",
            fill: "#11e0e7ff",
        }).setOrigin(0.5);
        
        // ======== VOLVER A LA PARTIDA ========
        this.add.text(300, 180, "Reanudar", {
            fontSize: "26px",
            fill: "#ffffffff",
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                this.scene.stop("SettingsScene");
                this.scene.resume("GameScene");
            })
            .on("pointerover", function () {
                this.setStyle({ fill: "rgba(255, 157, 0, 1)" });
            })
            .on("pointerout", function () {
                this.setStyle({ fill: "#ffffff" });
            });

        // ======== VOLUMEN MÚSICA ========
        this.add.text(150, 280, "Música", {
            fontSize: "26px",
            fill: "#ffffff",
        }).setOrigin(0.5);

        this.createVolumeBar(230, 280, this.musicVolume, (value) => {
            this.musicVolume = value;
            this.registry.set("musicVolume", value);
            this.sound.volume = value; // ajusta volumen global
        });

        // Botón ON/OFF Música
        this.musicButton = this.add.text(230, 240, this.musicOn ? "Música: ON" : "Música: OFF", {
            fontSize: "20px",
            fill: this.musicOn ? "#0f0" : "#f00",
        })
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                this.musicOn = !this.musicOn;
                this.registry.set("musicOn", this.musicOn);
                this.toggleMusic(this.musicOn);
            });
        // Opciones de efectos visuales
        this.add.text(300, 360, "---Efectos visuales---", {
            fontSize: "28px",
            fill: "#11e0e7ff",
        }).setOrigin(0.5);

        // ======== TOGGLE MOSTRAR PUNTUACIÓN ========
        this.scoreToggle = this.add.text(230, 400, this.showScore ? "Puntuación: ON" : "Puntuación: OFF", {
            fontSize: "20px",
            fill: this.showScore ? "#0f0" : "#f00",
        })
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                this.showScore = !this.showScore;
                this.registry.set("showScore", this.showScore);
                this.scoreToggle.setText(this.showScore ? "Puntuación: ON" : "Puntuación: OFF");
                this.scoreToggle.setStyle({ fill: this.showScore ? "#0f0" : "#f00" });
            });


        // ======== VOLVER AL MENÚ ========
        this.add.text(300, 700, "Volver al menú", {
            fontSize: "26px",
            fill: "#ffffffff",
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => this.scene.start("MenuScene"))
            .on("pointerover", function () {
                this.setStyle({ fill: "#ff0" });
            })
            .on("pointerout", function () {
                this.setStyle({ fill: "#11e0e7ff" });
            });
    }

    // 🔹 Crea barra genérica con callback
    createVolumeBar(x, y, initialValue, callback) {
        const barWidth = 250;
        const barHeight = 5;

        const barBg = this.add.rectangle(
            x,
            y,
            barWidth,
            barHeight,
            0x555555
        ).setOrigin(0, 0.5);

        const barFill = this.add.rectangle(
            x,
            y,
            barWidth * initialValue,
            barHeight,
            0x00ff00
        ).setOrigin(0, 0.5);

        const handle = this.add.circle(
            x + barWidth * initialValue,
            y,
            8,
            0xffffff
        ).setInteractive({ draggable: true });

        this.input.setDraggable(handle);

        this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
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

    // 🔹 Activar/desactivar música
    toggleMusic(on) {
        if (on) {
            this.musicButton.setText("Música: ON").setStyle({ fill: "#0f0" });
            this.sound.mute = false;
        } else {
            this.musicButton.setText("Música: OFF").setStyle({ fill: "#f00" });
            this.sound.mute = true;
        }
    }
}
