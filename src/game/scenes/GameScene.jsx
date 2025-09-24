import Phaser from "phaser";
import { clearActiveEnemy, handleInput } from "../managers/InputManager";
import { animateScaleText } from "../managers/Effects";
import { spawnEnemy, updateEnemyWordPosition, enemyAttack } from "../managers/EnemyManager";
import { createPlayer } from "../managers/PlayerManager";
import { createHUD } from "../managers/HUDmanager";
import { createAnimations } from "../managers/AnimationManager";
import { clearWordPool, loadWordsFromAPI } from "../managers/WordManager";

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

    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;

    // === CARGA DE PALABRAS ===
    await loadWordsFromAPI();

    // === AJUSTES REGISTRO ===
    const showScore = this.registry.get("showScore") ?? true;
    const musicOn = this.registry.get("musicOn") ?? true;
    const musicVolume = this.registry.get("musicVolume") ?? 1;

    this.isPlaying = false;

    this.actualLives = 0;

    // === grupos ===
    this.enemies = this.physics.add.group();
    this.projectiles = this.physics.add.group();

    // === MUSICA ===
    let bgMusic = this.sound.get("bgMusic");
    if (!bgMusic) {
      bgMusic = this.sound.add("bgMusic", {
        volume: musicVolume,
        loop: true,
      });
      this.sound.mute = !musicOn;
      if (musicOn) bgMusic.play();
    } else {
      bgMusic.setVolume(musicVolume);
      bgMusic.setMute(!musicOn);
    }
    this.bgMusic = bgMusic;

    // === ANIMACIONES ===
    createAnimations(this);

    // === HUD ===
    this.hud = createHUD(this, 3);
    this.hud.textScore.setVisible(showScore);

    // === INPUT ===
    this.keyListener = this.input.keyboard.on("keydown", (e) => {
      if(this.actualLives > 0) {
        handleInput(e, this);
      }
    });

    // contador inicial
    this.startCountdown();

    // limpieza al cerrar la escena
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.bgMusic) {
        this.bgMusic.stop();
        this.bgMusic.destroy();
        this.bgMusic = null;
      }
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
      updateEnemyWordPosition(enemy);
    });
  }

  gameOver() {
    
    const user = this.registry.get("userId");
    
    if (user != "pepe") {
      const endTime = Date.now();
      const elapsedMinutes = (endTime - this.stats.startTime) / 60000;

      const correct = this.stats.correctWords;
      const failed = this.stats.failedWords;
      const total = correct + failed;

      const averagePrecision = total > 0 ? (correct / total) * 100 : 0;
      const wpm = elapsedMinutes > 0 ? total / elapsedMinutes : 0;

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
      

      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/game`, {
        method: "POST",
        headers: {"content-Type": "application/json"},
        body: JSON.stringify(payload),
      }).catch(err => console.error("Error saving game: ", err));
    }

    if (!this.isPlaying) return;
    this.isPlaying = false;

    if (this.bgMusic) {
      this.bgMusic.stop();
      this.bgMusic.destroy();
      this.bgMusic = null;
    }

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
