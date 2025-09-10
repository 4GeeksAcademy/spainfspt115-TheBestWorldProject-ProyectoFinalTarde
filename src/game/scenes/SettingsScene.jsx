import Phaser, { GameObjects } from "phaser";

export default class SettingsScene extends Phaser.Scene {
    constructor() {
        super("SettingsScene");
        this.musicOn = true;
    }

    create() {
        const initialVolume = this.sound.volume;

        this.add.text(400, 100, "Ajustes del juego", {
            fontSize: "42px",
            fill: "#11e0e7ff"
        }).setOrigin(0.5);

        this.add.text(250, 200, "Volumen", {
            fontSize: "26px",
            fill: "#ffffffff"
        }).setOrigin(0.5);

        this.add.text(400, 500, "Volver al menú", {
            fontSize: "26px",
            fill: "#ffffffff",
            hover: { fill: "rgba(255, 5, 5, 1)" }
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => this.scene.start("MenuScene"))
            .on("pointerover", function () {
                this.setStyle({ fill: "#ff0" });
            })
            .on("pointerout", function () {
                this.setStyle({ fill: "#11e0e7ff" });
            });

        // Parámetros de la barra
        this.barX = 320;
        this.barY = 200;
        this.barWidth = 350;
        this.barHeight = 10;

        // Fondo de la barra
        this.barBg = this.add.rectangle(
            this.barX,
            this.barY,
            this.barWidth,
            this.barHeight,
            0x555555
        ).setOrigin(0, 0.5);

        // Nivel de volumen
        this.barFill = this.add.rectangle(
            this.barX,
            this.barY,
            this.barWidth * initialVolume,
            this.barHeight,
            0x00ff00
        ).setOrigin(0, 0.5);

        // Handle draggable
        this.handle = this.add.circle(
            this.barX + this.barWidth * initialVolume,
            this.barY,
            15,
            0xffffff
        ).setInteractive({ draggable: true });

        // Eventos de drag
        this.input.setDraggable(this.handle);

        this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
            if (gameObject === this.handle) {
                if (dragX < this.barX) dragX = this.barX;
                if (dragX > this.barX + this.barWidth) dragX = this.barX + this.barWidth;

                gameObject.x = dragX;

                const volume = (dragX - this.barX) / this.barWidth;
                this.setVolume(volume);
            }
        });
    }

    setVolume(value) {
        this.sound.volume = value;
        this.barFill.width = this.barWidth * value;
    }

    setVisualIntensity(value) {
        this.visualIntensity = value;
        this.visualBarFill.width = this.barWidth * value;
        // Usa this.visualIntensity para modificar efectos visuales en otras escenas
    }

    setFxIntensity(value) {
        this.fxIntensity = value;
        this.fxBarFill.width = this.barWidth * value;
        // Usa this.fxIntensity para modificar la intensidad de tus efectos visuales en otras escenas
    }

}



