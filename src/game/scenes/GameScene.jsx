import Phaser from "phaser";
import { createWord, moveWord } from "../managers/WordManager";
import { handleInput } from "../managers/InputManager";
import { animateScaleText } from "../managers/Effects";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.words = ["resident", "fortnite", "bycarloss", "onichan", "itadori", "gojo", "repo", "programar", "fokin", "hola"];
    }

    create() {
        const { width, height } = this.sys.game.config;

        this.score = 0;
        this.isPlaying = false; // el juego inicia bloqueado
        this.locked = false;
        this.errorIndex = -1;
        this.typed = "";

        // musica
        this.bgMusic = this.sound.add("bgMusic");
        this.bgMusic.play();

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

        // input teclado
        this.input.keyboard.on("keydown", (event) => handleInput(event, this));

        // contador inicial
        this.startCountdown();

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

    startCountdown() {
        const { width, height } = this.sys.game.config;

        let count = 3;
        const countdownText = this.add.text(width / 2, height / 2, count, {
            font: "80px Arial Black",
            fill: "#ff0",
            stroke: "#000",
            strokeThickness: 6,
        }).setOrigin(0.5);

        this.time.addEvent({
            delay: 1000,
            repeat: 3,
            callback: () => {
                count--;
                if (count > 0) {
                    countdownText.setText(count);
                } else if (count === 0) {
                    countdownText.setText("YA!");
                } else {
                    countdownText.destroy();

                    // arrancar juego
                    this.isPlaying = true;

                    // timer de juego
                    this.timedEvent = this.time.delayedCall(20000, this.gameOver, [], this);

                    // crear primera palabra
                    createWord(this, this.words);
                }

                animateScaleText(this, countdownText);
            }
        });
    }

    update() {
        if (!this.isPlaying) return;

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
