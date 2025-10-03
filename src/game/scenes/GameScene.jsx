import Phaser from "phaser";
import { clearActiveEnemy, handleInput } from "../managers/InputManager";
import { animateScaleText } from "../managers/Effects";
import { spawnEnemy, updateEnemyWordPosition, enemyAttack } from "../managers/EnemyManager";
import { createPlayer } from "../managers/PlayerManager";
import { createHUD } from "../managers/HUDmanager";
import { createAnimations } from "../managers/AnimationManager";
import { clearWordPool, loadWordsFromAPI, getWordPool } from "../managers/WordManager";
import { saveGame } from "../managers/APIservices";
import { createBackground } from "../managers/BackgroundManager";
import { GameSettings } from "../managers/GameSettings";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this._gameOverStarted = false;
  }

  async create() {
    //MUSIC MANAGER
    const menuMusic = this.sound.get("menu_song");
    if (menuMusic && menuMusic.isPlaying) {
      menuMusic.stop();
    }

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

    // === AJUSTES REGISTRO ===
    const showScore = this.registry.get("showScore") ?? true;

    this.isPlaying = false;

    this.actualLives = 0;

    // === grupos ===
    this.enemies = this.physics.add.group();
    this.projectiles = this.physics.add.group();

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

    const pool = getWordPool?.() || {};
    const needsWords = !(pool[1]?.length || pool[2]?.length || pool[3]?.length);
    if (needsWords) {
      await loadWordsFromAPI();
    }

    // contador inicial
    this.startCountdown();

    // limpieza al cerrar la escena
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {

      if (this.keyListener) {
        this.input.keyboard.removeListener("keydown", this.keyListener);
        this.keyListener = null;
      }
    });
  }

  startCountdown() {

    this.sound.play("start_fx", {
      volume: GameSettings.audio.global.volume * GameSettings.audio.fx.volume,
    }); 

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

  updateMultiplier(success) {
    if (success) {
      this.comboCount++;
      if (this.comboCount >= 40) this.multiplier = 10;
      else if (this.comboCount >= 20) this.multiplier = 5;
      else if (this.comboCount >= 10) this.multiplier = 3;
      else if (this.comboCount >= 5) this.multiplier = 2;
      else this.multiplier = 1;
    } else {
      this.comboCount = 0;
      this.multiplier = 1;
    }
    this.hud.updateMultiplier(this.multiplier);
  }

  async startGame() {
    this._gameOverStarted = false;
    this.isPlaying = true;

    // --- detener musica de menu ---
    const menuMusic = this.sound.get("menu_song");
    if (menuMusic && menuMusic.isPlaying) {
      menuMusic.stop();
    }

    // --- lanzar musica de juego ---
    let gameMusic = this.sound.get("game_song");
    if (!gameMusic) {
      gameMusic = this.sound.add("game_song", {
        loop: true,
        volume: GameSettings.audio.global.volume * GameSettings.audio.music.volume,
      });
    }

    if (!gameMusic.isPlaying && GameSettings.audio.music.on && GameSettings.audio.global.on) {
      gameMusic.play();
    }

    gameMusic.setVolume(GameSettings.audio.global.volume * GameSettings.audio.music.volume);
    gameMusic.setMute(!(GameSettings.audio.music.on && GameSettings.audio.global.on));

    this.difficulty = {
      diff1: 0.7,
      diff2: 0.25,
      diff3: 0.05,
      gigaChance: 0.002
    };

    this.time.addEvent({
      delay: 15000,
      callback: this.updateDifficulty,
      callbackScope: this,
      loop: true
    });

    // === player ===
    this.player = createPlayer(this, this.width * 0.5, this.height * 0.25 );
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

  updateDifficulty() {
    let { diff1, diff2, diff3, gigaChance } = this.difficulty;

    diff1 = Math.max(0.2, diff1 - 0.02);
    diff2 = Math.min(0.5, diff2 + 0.01);
    diff3 = Math.min(0.3, diff3 + 0.01);
    gigaChance = Math.min(0.15, gigaChance + 0.005);

    this.difficulty = { diff1, diff2, diff3, gigaChance };

    // console.log("Nueva dificultad:", this.difficulty);
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
    if (this._gameOverStarted) return;
    this._gameOverStarted = true;
    this.isPlaying = false;

    this.input.keyboard?.removeAllListeners?.();
    this.tweens.killAll();
    this.time.removeAllEvents();

    if (this.enemySpawner) {
      this.enemySpawner.remove?.(false);
      this.enemySpawner.paused = true;
    }
    this.enemies?.getChildren?.().forEach(enemy => {
      if (!enemy) return;
      if (enemy.body) {
        enemy.body.enable = false;
        enemy.body.setVelocity(0, 0);
      }
      enemy.anims?.stop();
    });

    this.sound.stopByKey?.("game_song");
    this.sound.stopAll();

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

    this.activeEnemy = null;
    this.enemies?.clear?.(true, true);
    this.projectiles?.clear?.(true, true);

    clearWordPool();

    this.scene.start("GameOverScene", {
      score: this.player.getData("score") || 0,
    });
  }
}
