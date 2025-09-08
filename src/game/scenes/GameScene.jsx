import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.words = ["resident", "fortnite", "bycarloss", "onichan", "itadori", "gojo", "repo", "programar", "fokin", "hola"];
  }

  create() {
    this.score = 0;
    this.isPlaying = true;
    this.locked = false;

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

    this.timedEvent = this.time.delayedCall(10000, this.gameOver, [], this);

    // input del jugador
    const inputPlayer = document.createElement("input");
    Object.assign(inputPlayer.style, {
      padding: "8px 12px",
      fontSize: "18px",
      width: "360px",
      borderRadius: "6px",
      border: "2px solid rgba(255,255,255,0.15)",
      background: "rgba(255,255,255,0.05)",
      color: "#fff",
      outline: "none",
    });

    this.domInput = this.add.dom(400, 520, inputPlayer).setOrigin(0.5);

    inputPlayer.addEventListener("input", () => {
      let typed = inputPlayer.value.trim().toLowerCase();

      // si esta bloqueado, solo dejar borrar
      if (this.locked && typed.length >= this.errorIndex + 1) {
        inputPlayer.value = typed.slice(0, this.errorIndex + 1); 
        return;
      }

      this.renderWord(inputPlayer.value);

      // si hay error bloquear
      if (!this.currentWord.startsWith(typed)) {
        this.locked = true;
        this.errorIndex = typed.length - 1; // posición donde ocurre el error
      } else {
        this.locked = false; // desbloquear al corregir
      }

      // si la palabra esta completa y correcta
      if (typed === this.currentWord) {
        this.score += 10;
        
        inputPlayer.value = "";
        this.newWord();
      }
    });

    this.newWord();
    inputPlayer.focus();
  }

  update() {
    if (this.timedEvent) {
      this.remainingTime = this.timedEvent.getRemainingSeconds();
      this.textTime.setText(`Remaining Time: ${Math.round(this.remainingTime)}`);
      this.textScore.setText("Score: " + this.score);
    }
  }

  newWord() {
    this.currentWord = Phaser.Utils.Array.GetRandom(this.words);

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
      let color = "#aaa"; // gris por defecto

      if (i < typed.length) {
        color = typed[i] === this.currentWord[i] ? "#0f0" : "#f00"; // verde o rojo
      }

      letters[i].setStyle({ fill: color });
    }
  }

  gameOver() {
    this.isPlaying = false;
    this.bgMusic.stop();
    this.scene.start("GameOverScene", { score: this.score });
  }
}
