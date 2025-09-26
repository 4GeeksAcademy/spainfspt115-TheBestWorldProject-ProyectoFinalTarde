import Phaser from "phaser";
import { clearActiveEnemy, handleInput } from "../managers/InputManager";
import { animateScaleText } from "../managers/Effects";
import { spawnEnemy, updateEnemyWordPosition, enemyAttack } from "../managers/EnemyManager";
import { createPlayer } from "../managers/PlayerManager";
import { createHUD } from "../managers/HUDmanager";
import { createAnimations } from "../managers/AnimationManager";
import { clearWordPool, loadWordsFromAPI } from "../managers/WordManager";
import { saveGame } from "../managers/APIservices";
import { createBackground } from "../managers/BackgroundManager";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  async create() {

    // Game Stats
    this.stats = {
      startTime: Date.now(),
      correctWords: 0,
      failedWords: 0,
    };

    this.comboCount = 0;
    this.multiplier = 1;

    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;

    // === CARGA DE PALABRAS ===
    await loadWordsFromAPI();

    // === AJUSTES REGISTRO ===
    const showScore = this.registry.get("showScore") ?? true;
    // const musicOn = this.registry.get("musicOn") ?? true;
    // const musicVolume = this.registry.get("musicVolume") ?? 1;

    this.isPlaying = false;

    this.actualLives = 0;

    // === grupos ===
    this.enemies = this.physics.add.group();
    this.projectiles = this.physics.add.group();

    // === MUSICA ===
    // let bgMusic = this.sound.get("bgMusic");
    // if (!bgMusic) {
    //   bgMusic = this.sound.add("bgMusic", {
    //     volume: musicVolume,
    //     loop: true,
    //   });
    //   this.sound.mute = !musicOn;
    //   if (musicOn) bgMusic.play();
    // } else {
    //   bgMusic.setVolume(musicVolume);
    //   bgMusic.setMute(!musicOn);
    // }
    // this.bgMusic = bgMusic;

    // === ANIMACIONES ===
    createAnimations(this);

    // === HUD ===
    this.hud = createHUD(this, 3);
    this.hud.textScore.setVisible(showScore);

    // === INPUT ===
    this.input.keyboard.addCapture(['BACKSPACE', '-']);

    this.keyListener = this.input.keyboard.on("keydown", (e) => {
      if(this.actualLives > 0) {
        handleInput(e, this);
      }
    });

    createBackground(this, {
      mixPatterns: true,
      withBorders: true,
      vaseMin: 2,
      vaseMax: 10,
      pillarMin: 2,
      pillarMax: 8,
      torchMin: 2,
      torchMax: 12,
    });

    // contador inicial
    this.startCountdown();

    // limpieza al cerrar la escena
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      // if (this.bgMusic) {
      //   this.bgMusic.stop();
      //   this.bgMusic.destroy();
      //   this.bgMusic = null;
      // }
      if (this.keyListener) {
        this.input.keyboard.removeListener("keydown", this.keyListener);
        this.keyListener = null;
      }
    });
  }

  startCountdown() {
    let count = 3;
    const countdownText = this.add
      .text(this.width / 2, this.height / 2, count, {
        font: "80px",
        fill: "#ff0",
        stroke: "#000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.countdownEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        count--;
        if (count > 0) {
          countdownText.setText(count);
        } else {
          countdownText.setText("YA!");
          this.time.delayedCall(800, () => {
            countdownText.destroy();
            this.startGame();
          });
          this.countdownEvent.remove();
        }
        animateScaleText(this, countdownText);
      },
    });
  }

  async startGame() {
    this.isPlaying = true;

    this.difficulty = {
      diff1: 0.7,
      diff2: 0.25,
      diff3: 0.05,
    };

    this.time.addEvent({
      delay: 15000,
      loop: true,
      callback: () => {
        this.difficulty.diff1 = Math.max(0.3, this.difficulty.diff1 - 0.05);
        this.difficulty.diff2 = Math.min(0.5, this.difficulty.diff2 + 0.03);
        this.difficulty.diff3 = Math.min(0.3, this.difficulty.diff3 + 0.02);

        if (this.enemySpawner?.delay > 1500) {
          this.enemySpawner.delay -= 100;
        }
      }
    });

    // === player ===
    this.player = createPlayer(this, this.width / 2, this.height / 2);
    this.physics.add.collider(this.player, this.enemies, (_, enemy) => {
      this.handlePlayerHit(enemy);
    });

    // vidas
    await this.hud.fillHearts(this);

    // primer enemigo
    this.time.delayedCall(50, () => spawnEnemy(this));

    // spawneo continuo
    this.enemySpawner = this.time.addEvent({
      delay: 3000,
      loop: true,
      callback: () => {
        if (this.isPlaying) spawnEnemy(this);
      },
    });
  }

  handlePlayerHit(enemy) {
    if (!enemy || !enemy.active) return;
    if (enemy.getData("attacking") || enemy.getData("dying")) return;

    if (this.activeEnemy === enemy) {
      clearActiveEnemy(this);
    }

    // animacion de ataque -> al completar resta vida y destruye
    enemyAttack(enemy, this);
  }

  update() {
    if (!this.isPlaying) return;

    this.actualLives = this.player.getData("lives");

    this.hud.updateScore(this.player.getData("score"), false);

    this.enemies.getChildren().forEach((enemy) => {
      if (enemy && enemy.active && enemy.getData) {
        updateEnemyWordPosition(enemy);
      }
    });
  }

  async gameOver() {
    
    const user = this.registry.get("userId");
    
    if (user != "pepe") {
      const endTime = Date.now();
      const elapsedMinutes = (endTime - this.stats.startTime) / 60000;

      const correct = this.stats.correctWords;
      const failed = this.stats.failedWords;
      const total = correct + failed;

      const averagePrecision = total > 0 ? ((correct / total) * 100).toFixed(2) : 0.00;
      const wpm = elapsedMinutes > 0 ? (total / elapsedMinutes).toFixed(2) : 0;

      const payload = {
        id_user: this.registry.get("userId"),
        final_score: this.player.getData("score") || 0,
        played_at: new Date().toISOString(),
        correct_words: correct,
        failed_words: failed,
        average_precision: averagePrecision,
        wpm_average: wpm,
        difficulty: 1
      };

      console.log(payload);
      
      await saveGame(payload).catch(err => console.error("Error al guardar datos de la partida", err));
    }

    if (!this.isPlaying) return;
    this.isPlaying = false;

    // if (this.bgMusic) {
    //   this.bgMusic.stop();
    //   this.bgMusic.destroy();
    //   this.bgMusic = null;
    // }

    if (this.keyListener) {
      this.input.keyboard.removeListener("keydown", this.keyListener);
      this.keyListener = null;
    }

    if (this.enemySpawner) {
      this.enemySpawner.remove(false);
      this.enemySpawner = null;
    }

    this.activeEnemy = null;
    this.enemies.clear(true, true);
    this.projectiles.clear(true, true);

    clearWordPool();

    this.scene.start("GameOverScene", {
      score: this.player.getData("score") || 0,
    });
  }
}
