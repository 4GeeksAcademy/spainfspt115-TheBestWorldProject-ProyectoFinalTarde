import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.words = ["resident", "fortnite", "bycarloss", "onichan", "itadori", "gojo", "repo", "programar", "fokin", "hola"];
  }

  create() {
    this.score = 0;
    this.isPlaying = true;
    this.locked = false;       // bloqueado tras error
    this.errorIndex = -1;      // índice del primer error
    this.typed = "";           // lo que va escribiendo el jugador

    this.bgMusic = this.sound.add("bgMusic");
    this.bgMusic.play();

    this.add.image(0, 0, "bg").setOrigin(0, 0);

    this.textScore = this.add.text(this.sys.game.config.width - 120, 10, "Score:0", {
      font: "25px Arial",
      fill: "#000000",
    });

    this.textTime = this.add.text(10, 10, "Remaining Time:00", {
      font: "25px Arial",
      fill: "#ffffff",
    });

    // ⏱ pon tu duración real (estaba a 2000ms de pruebas)
    this.timedEvent = this.time.delayedCall(10000, this.gameOver, [], this);

    // Palabra inicial
    this.newWord();

    // === INPUT TECLADO (sin DOM) ===
    this.onKeyDown = (event) => {
      if (!this.isPlaying) return;

      const key = event.key;

      // ENTER: validar (por si quieres exigir Enter para confirmar)
      if (key === "Enter") {
        if (this.typed === this.currentWord) {
          this.score += 10;
          this.newWord();
        } else {
          // Feedback de fallo al confirmar
          this.flashError();
        }
        return;
      }

      // BACKSPACE: permite corregir siempre
      if (key === "Backspace") {
        if (this.typed.length > 0) {
          this.typed = this.typed.slice(0, -1);

          // si hemos borrado hasta antes del error -> desbloquear
          if (this.locked && this.typed.length <= this.errorIndex) {
            this.locked = false;
            this.errorIndex = -1;
          }

          this.renderWord(this.typed);
        }
        return;
      }

      // Ignorar si ya está completa (no permitir más chars)
      if (this.typed.length >= this.currentWord.length) {
        return;
      }

      // Si está bloqueado por error, no dejar meter más (solo Backspace)
      if (this.locked) return;

      // Acepta letras (incluye ñ). Puedes ampliar con tildes si lo necesitas.
      if (!/^[a-zñ]$/i.test(key)) return;

      const nextChar = key.toLowerCase();
      const newTyped = this.typed + nextChar;

      // ¿rompe el prefijo correcto?
      if (!this.currentWord.startsWith(newTyped)) {
        this.locked = true;
        this.errorIndex = newTyped.length - 1; // índice donde falló
        this.typed = newTyped;                 // mostramos la letra que escribió
        this.renderWord(this.typed);
        this.shakeLetter(this.errorIndex);
        return;
      }

      // Prefijo correcto
      this.typed = newTyped;
      this.renderWord(this.typed);

      // Autocompletar: si ya igualó la palabra, puntúa y nueva palabra
      if (this.typed === this.currentWord) {
        this.score += 10;
        this.newWord();
      }
    };

    // Registra el listener
    this.input.keyboard.on("keydown", this.onKeyDown);

    // Limpieza al apagar la escena
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
      if (this.onKeyDown) {
        this.input.keyboard.off("keydown", this.onKeyDown);
        this.onKeyDown = null;
      }
      if (this.wordGroup) {
        this.wordGroup.clear(true, true);
        this.wordGroup = null;
      }
    });
  }

  update() {
    if (this.timedEvent) {
      const remaining = this.timedEvent.getRemainingSeconds();
      this.textTime.setText(`Remaining Time: ${Math.round(remaining)}`);
    }
    this.textScore.setText("Score: " + this.score);
  }

  newWord() {
    this.currentWord = Phaser.Utils.Array.GetRandom(this.words);
    this.typed = "";
    this.locked = false;
    this.errorIndex = -1;

    if (this.wordGroup) {
      this.wordGroup.clear(true, true);
    }
    this.wordGroup = this.add.group();

    const startX = 400 - (this.currentWord.length * 15);
    for (let i = 0; i < this.currentWord.length; i++) {
      const letter = this.add.text(startX + i * 30, 300, this.currentWord[i], {
        fontSize: "48px",
        fill: "#aaa",
      }).setOrigin(0.5);
      this.wordGroup.add(letter);
    }
  }

  renderWord(typed) {
    const letters = this.wordGroup.getChildren();
    for (let i = 0; i < this.currentWord.length; i++) {
      let color = "#aaa"; // por defecto
      if (i < typed.length) {
        color = typed[i] === this.currentWord[i] ? "#0f0" : "#f00"; // verde / rojo
      }
      letters[i].setStyle({ fill: color });
    }
  }

  shakeLetter(index) {
    const letter = this.wordGroup.getChildren()[index];
    if (!letter) return;
    this.tweens.add({
      targets: letter,
      x: letter.x + 4,
      yoyo: true,
      repeat: 2,
      duration: 50,
    });
  }

  flashError() {
    // Tremor feedback en la letra erronea
    const letters = this.wordGroup.getChildren();
    this.tweens.add({
      targets: letters,
      alpha: 0.6,
      yoyo: true,
      repeat: 1,
      duration: 80,
    });
  }

  gameOver() {
    if (!this.isPlaying) return; // Evita doble llamada
    this.isPlaying = false;

    // Detener música
    if (this.bgMusic) {
      this.bgMusic.stop();
      this.bgMusic.destroy();
      this.bgMusic = null;
    }

    // Quitar listener de teclado
    if (this.onKeyDown) {
      this.input.keyboard.off("keydown", this.onKeyDown);
      this.onKeyDown = null;
    }

    // Cancelar el timer
    if (this.timedEvent) {
      this.timedEvent.remove(false);
      this.timedEvent = null;
    }

    // Limpiar palabra
    if (this.wordGroup) {
      this.wordGroup.clear(true, true);
      this.wordGroup = null;
    }

    // Cambiar de escena
    this.scene.start("GameOverScene", { score: this.score });
  }
}
