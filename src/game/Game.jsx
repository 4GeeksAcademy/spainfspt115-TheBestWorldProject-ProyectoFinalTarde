import Phaser from "phaser";
import React, { useEffect } from "react";
import bgImg from "../front/assets/bg.png";
import bgMusic from "../front/assets/bg.mp3";
import startBtn from "../front/assets/StartBtn.png"; //ejemplo

export default function Game() {
    useEffect(() => {
        const game = new Phaser.Game({
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            backgroundColor: "#222",
            parent: "game-container",
            scene: GameScene,
            dom: { createContainer: true }
        });
        return () => game.destroy(true);
    }, []);

    return <div id="game-container" style={{ width: 800, height: 600, margin: "auto" }} />;
}
//fokin prueba
class GameScene extends Phaser.Scene {
    constructor() {
        super("scene-game");
        this.words = ["phaser", "react", "game", "javascript", "coding", "final", "vaca"];
    }

    preload() {
        this.load.image("bg", bgImg);
        this.load.audio("bgMusic", bgMusic);
        this.load.image("buttonImg", startBtn);
    }
    
    create() {
        // Botón de inicio
        this.startButton = this.add.image(400, 300, "buttonImg")
            .setInteractive();

        this.startButton.on("pointerdown", () => {
            console.log("Juego iniciado!");
            this.startButton.destroy();
            this.startGame();
        });
    }

    startGame() {
        this.score = 0;
        this.isPlaying = true;

        this.bgMusic = this.sound.add("bgMusic");
        this.bgMusic.play();

        this.add.image(0, 0, "bg").setOrigin(0, 0);

        this.textScore = this.add.text(this.sys.game.config.width - 120, 10, "Score:0", {
            font: "25px Arial",
            fill: "#000000",
        });

        this.textTime = this.add.text(10, 10, "Remaining Time:00", {
            font: "25px Arial",
            fill: "#ffffffff",
        });

        this.timedEvent = this.time.delayedCall(10000, this.gameOver, [], this);

        // Input del jugador
        const inputEl = document.createElement("input");
        Object.assign(inputEl.style, {
            padding: "8px 12px",
            fontSize: "18px",
            width: "360px",
            borderRadius: "6px",
            border: "2px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.05)",
            color: "#fff",
            outline: "none"
        });
        this.domInput = this.add.dom(400, 520, inputEl).setOrigin(0.5);

        inputEl.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && inputEl.value.trim() !== "") {
                this.checkWord(inputEl.value.trim());
                inputEl.value = "";
            }
        });

        this.newWord();
        inputEl.focus();
    }

    update() {
        if (this.timedEvent) {
            this.remainingTime = this.timedEvent.getRemainingSeconds();
            this.textTime.setText(`Remaining Time: ${Math.round(this.remainingTime)}`);
        }
    }

    newWord() {
        this.currentWord = Phaser.Utils.Array.GetRandom(this.words);
        if (this.wordText) this.wordText.destroy();
        this.wordText = this.add.text(400, 300, this.currentWord, { fontSize: "48px", fill: "#aaa" }).setOrigin(0.5);
    }

    checkWord(word) {
        if (!this.isPlaying) return;

        if (word.toLowerCase() === this.currentWord) {
            this.score += 10;
            this.textScore.setText("Score: " + this.score);
            this.wordText.setStyle({ fill: "#0f0" });
            this.time.delayedCall(200, () => this.newWord());
        } else {
            this.wordText.setTint(0xff0000);
            this.time.delayedCall(300, () => this.wordText.clearTint());
        }
    }

    gameOver() {
        this.isPlaying = false;
        this.add.text(this.sys.game.config.width / 2 - 100, this.sys.game.config.height / 2, "Game Over", {
            font: "40px Arial",
            fill: "#ff0000",
        });

        this.add.text(
            this.sys.game.config.width / 2 - 100,
            this.sys.game.config.height / 2 + 50,
            `Score: ${this.score}`,
            { font: "30px Arial", fill: "#000" }
        );
    }
}