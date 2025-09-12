import Phaser from "phaser";
import { clearActiveEnemy, handleInput } from "../managers/InputManager";
import { animateScaleText } from "../managers/Effects";
import { spawnEnemy, updateEnemyWordPosition } from "../managers/EnemyManager";
import { createPlayer } from "../managers/PlayerManager";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;


    // === LEER AJUSTES DEL REGISTRO ===
    const showScore = this.registry.get("showScore") ?? true;
    const musicOn = this.registry.get("musicOn") ?? true;
    const musicVolume = this.registry.get("musicVolume") ?? 1;
    // const fxVolume = this.registry.get("fxVolume") ?? 1;

    this.isPlaying = false; // el juego inicia bloqueado

    // === grupos ===
    this.enemies = this.physics.add.group();
    this.projectiles = this.physics.add.group();

    // === MUSICA DE FONDO ===
    let bgMusic = this.sound.get("bgMusic");
    if (!bgMusic) {
      bgMusic = this.sound.add("bgMusic", {
        volume: musicVolume,
        loop: true,
      });
      if (musicOn) {
        this.sound.mute = false;
        bgMusic.play();
      } else {
        this.sound.mute = true;
      }
    } else {
      // Si ya existe, solo ajusta el volumen y mute
      bgMusic.setVolume(musicVolume);
      bgMusic.setMute(!musicOn);
    }
    this.bgMusic = bgMusic;

    // === UI ===
    // Puntuación
    this.textScore = this.add.text(this.width - 80, 10, "Score: 0", {
      font: "28px Arial Black",
      fill: "#0f0",
      stroke: "#000",
      strokeThickness: 4,
    })
      .setOrigin(1, 0)
      .setShadow(2, 2, "#000", 2, true, true);

    // Mostrar u ocultar puntuación según ajustes
    this.textScore.setVisible(showScore);

    this.textLives = this.add.text(10, 10 , "Lives: 3", {
      font: "28px Arial Black",
      fill: "rgba(255, 0, 212, 1)",
      stroke: "#000",
      strokeThickness: 4,
    });

    // input teclado
    this.keyListener = this.input.keyboard.on("keydown", (e) => handleInput(e, this));

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
    const countdownText = this.add.text(this.width / 2, this.height / 2, count, {
      font: "80px Arial Black",
      fill: "#ff0",
      stroke: "#000",
      strokeThickness: 6,
    }).setOrigin(0.5);

    this.countdownEvent = this.time.addEvent({
      delay: 1000,
      repeat: count,
      callback: () => {
        count--;
        if (count > 0) {
          countdownText.setText(count);
        } else {
          countdownText.setText("YA!");
          countdownText.destroy();
          
          this.startGame();
        }

        animateScaleText(this, countdownText);
      },
    });
  }

  startGame() {
    // arrancar juego
    this.isPlaying = true;

    // === player ===
    this.player = createPlayer(this, this.width / 2, this.height / 2);
    this.physics.add.collider(this.player, this.enemies, (player, enemy) => {
        this.handlePlayerHit(enemy);
    });

    // crear primer enemigo
    this.time.delayedCall(50, () => spawnEnemy(this));

    // spawneo continuo de enemigos
    this.enemySpawner = this.time.addEvent({
      delay: 3000,
      loop: true,
      callback: () => {
          if (this.isPlaying) {
              spawnEnemy(this);
          }
      },
    });
  }

  handlePlayerHit (enemy) {
    if (!enemy.active) return;

    const letters = enemy.getData("wordLetters");
    if (letters) letters.forEach((letter) => letter.destroy());
    enemy.destroy();

    if (this.activeEnemy === enemy) {
      clearActiveEnemy(this);
    }

    const lives = this.player.loseLife();
    this.textLives.setText("Lives: " + lives);
    animateScaleText(this, this.textLives);

    if (this.textScore.visible) {
      const score = this.player.getData("score") || 0;
      this.textScore.setText("Score: " + score);
    }

    if (lives <= 0) {
      this.gameOver();
    }
  }

  update() {
    if (!this.isPlaying) return;

    // Solo actualizar puntuacion si esta visible
    if (this.textScore.visible) {
      this.textScore.setText("Score: " + (this.player.getData("score") || 0));
    }

    // actualizar letras de cada enemigo activo en pantalla
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

    this.scene.start("GameOverScene", { score: this.player.getData("score") || 0 });
  }
}
