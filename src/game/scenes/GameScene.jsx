import Phaser from "phaser";
import { clearActiveEnemy, handleInput } from "../managers/InputManager";
import { animateScaleText } from "../managers/Effects";
import { spawnEnemy, updateEnemyWordPosition, enemyAttack } from "../managers/EnemyManager";
import { createPlayer } from "../managers/PlayerManager";
import { createHUD } from "../managers/HUDmanager";
import { createAnimations } from "../managers/AnimationManager";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;

    // === AJUSTES REGISTRO ===
    const showScore = this.registry.get("showScore") ?? true;
    const musicOn = this.registry.get("musicOn") ?? true;
    const musicVolume = this.registry.get("musicVolume") ?? 1;

    this.isPlaying = false;

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
    this.keyListener = this.input.keyboard.on("keydown", (e) =>
      handleInput(e, this)
    );

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

    this.hud.updateScore(this.player.getData("score"), false);

    this.enemies.getChildren().forEach((enemy) => {
      updateEnemyWordPosition(enemy);
    });
  }

  gameOver() {
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

    this.scene.start("GameOverScene", {
      score: this.player.getData("score") || 0,
    });
  }
}
