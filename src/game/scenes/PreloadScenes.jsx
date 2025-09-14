import Phaser from "phaser";
import bgImg from "../assets/bg.png";
import bitchesMusic from "../assets/Bitches.mp3";
import startBtn from "../assets/StartBtn.png";
import resetBtn from "../assets/ResetBtn.png";
import { loadWordsFromAPI } from "../managers/WordManager";
import { createAnimations } from "../managers/AnimationManager";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.image("bg", bgImg);
    this.load.audio("bgMusic", bitchesMusic);
    this.load.image("buttonImg", startBtn);
    this.load.image("resetBtn", resetBtn);

    this.load.spritesheet("heart", "src/game/assets/sprites/Hearts.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  async create() {
    await loadWordsFromAPI();
    
    this.scene.start("MenuScene");
  }
}
