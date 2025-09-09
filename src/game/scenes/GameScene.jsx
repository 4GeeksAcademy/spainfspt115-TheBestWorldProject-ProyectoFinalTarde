import Phaser from "phaser";
import { createWord, moveWord } from "../managers/WordManager";
import { handleInput } from "../managers/InputManager";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.words = ["resident", "fortnite", "bycarloss", "onichan", "itadori", "gojo", "repo", "programar", "fokin", "hola"];
    }

    create() {
        const { width, height } = this.sys.game.config;

        this.score = 0;
        this.isPlaying = true;
        this.locked = false;
        this.errorIndex = -1;
        this.typed = "";

        // musica
        this.bgMusic = this.sound.add("bgMusic");
        this.bgMusic.play();

        // Fondo "--- DESABILITADO DEMOMENTO ---"
        // this.add.image(0, 0, "bg").setOrigin(0, 0);

        // UI
        this.textScore = this.add.text(width - 80, 10, "Score: 0", {
            font: "28px Arial Black",
            fill: "#0f0",
            stroke: "#000",
            strokeThickness: 4,
        })
        .setOrigin(1, 0)
        .setShadow(2, 2, "#000", 2, true, true);

        this.textTime = this.add.text(10, 10, "Remaining Time:00", {
            font: "25px Arial",
            fill: "#fff",
        });

        // timer de juego
        this.timedEvent = this.time.delayedCall(10000, this.gameOver, [], this);

        // crear primera palabra
        createWord(this, this.words);

        // input teclado
        this.input.keyboard.on("keydown", (event) => handleInput(event, this));

        // limpieza al cerrar la escena
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            if (this.bgMusic) {
                this.bgMusic.stop();
                this.bgMusic.destroy();
                this.bgMusic = null;
            }
            if (this.timedEvent) {
                this.timedEvent.remove(false);
                this.timedEvent = null;
            }
            if (this.wordGroup) {
                this.wordGroup.clear(true, true);
                this.wordGroup = null;
            }
        });
    }

    update() {
        // actualizacion de eventos
        
        if (this.timedEvent) {
            const remaining = this.timedEvent.getRemainingSeconds();
            this.textTime.setText(`Remaining Time: ${Math.round(remaining)}`);
        }
        this.textScore.setText("Score: " + this.score);

        moveWord(this);
    }

    gameOver() {
        if (!this.isPlaying) return;
        this.isPlaying = false;

        if (this.bgMusic) {
            this.bgMusic.stop();
            this.bgMusic.destroy();
            this.bgMusic = null;
        }

        if (this.timedEvent) {
            this.timedEvent.remove(false);
            this.timedEvent = null;
        }

        if (this.wordGroup) {
            this.wordGroup.clear(true, true);
            this.wordGroup = null;
        }

        this.scene.start("GameOverScene", { score: this.score });
    }
}
