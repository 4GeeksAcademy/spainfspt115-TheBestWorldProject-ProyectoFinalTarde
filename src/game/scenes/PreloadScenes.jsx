import Phaser from "phaser";
import bgImg from "../assets/bg.png";
import bitchesMusic from "../assets/Bitches.mp3";
import startBtn from "../assets/StartBtn.png";
import resetBtn from "../assets/ResetBtn.png";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.image("bg", bgImg);
    this.load.audio("bgMusic", bitchesMusic);
    this.load.image("buttonImg", startBtn);
    this.load.image("resetBtn", resetBtn);
  }

  create() {
    this.scene.start("MenuScene");
  }
}
