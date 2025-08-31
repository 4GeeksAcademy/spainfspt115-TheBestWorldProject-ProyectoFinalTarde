import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.words = ["resident", "fortnite", "bycarloss", "onichan", "itadori", "gojo", "repo", "programar", "fokin", "hola"];
  }

  create() {
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
      fill: "#ffffff",
    });

    this.timedEvent = this.time.delayedCall(10000, this.gameOver, [], this);

    // input del jugador
    const inputEl = document.createElement("input");
    Object.assign(inputEl.style, {
      padding: "8px 12px",
      fontSize: "18px",
      width: "360px",
      borderRadius: "6px",
      border: "2px solid rgba(255,255,255,0.15)",
      background: "rgba(255,255,255,0.05)",
      color: "#fff",
      outline: "none",
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

    this.add.text(400, 250, "Game Over", { font: "40px Arial", fill: "#ff0000" }).setOrigin(0.5);
    this.add.text(400, 300, `Score: ${this.score}`, { font: "30px Arial", fill: "#000" }).setOrigin(0.5);

    this.add.image(400, 400, "resetBtn")
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("MenuScene");
      });
  }
}
