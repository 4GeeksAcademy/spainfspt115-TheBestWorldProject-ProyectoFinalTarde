
import Phaser, { Physics, RIGHT, Scene } from "phaser";
import React from "react";
import { useEffect } from "react";
import bgImg from "../front/assets/bg.png";
import bgMusic from "../front/assets/bg.mp3";


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




class GameScene extends Phaser.Scene {
    constructor() {
        super("scene-game");
        this.points = 0;
        this.textScore;
        this.textTime;
        this.timeEvent;
        this.remainingTime;
        this.successMusic;
        this.bgMusic;
    }

    preload() {
        this.load.image("bg", bgImg);
        this.load.audio("bgMusic", bgMusic);
    }

    create() {
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
        this.timedEvent = this.time.delayedCall(60000, this.gameOver, [], this);
    }

    update() {
        this.remainingTime = this.timedEvent.getRemainingSeconds();
        this.textTime.setText(
            `Remaining Time: ${Math.round(this.remainingTime).toString()}`
        );
    }

    gameOver() {
        this.physics.pause();
        this.add.text(this.sys.game.config.width / 2 - 100, this.sys.game.config.height / 2, "Game Over", {
            font: "40px Arial",
            fill: "#ff0000",
        });

        this.add.text(
            this.sys.game.config.width / 2 - 100,
            this.sys.game.config.height / 2 + 50,
            `Score: ${this.points}`,
            {
                font: "30px Arial",
                fill: "#000",
            }
        );
    }



}


