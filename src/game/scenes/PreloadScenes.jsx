import Phaser from "phaser";
import bgImg from "../assets/bg.png";
import bitchesMusic from "../assets/Bitches.mp3";
import startBtn from "../assets/StartBtn.png";
import resetBtn from "../assets/ResetBtn.png";
import { loadWordsFromAPI } from "../managers/WordManager";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.image("bg", bgImg);
    this.load.audio("bgMusic", bitchesMusic);
    this.load.image("buttonImg", startBtn);
    this.load.image("resetBtn", resetBtn);

    this.load.image("fire", "src/game/assets/sprites/fire.png");
    this.load.image("ice", "src/game/assets/sprites/ice.png");
    this.load.image("spark", "src/game/assets/sprites/spark.png");

    // Player
    this.load.spritesheet("player_idle", "src/game/assets/sprites/player/Idle.png", {
      frameWidth: 140,
      frameHeight: 140,
    });

    this.load.spritesheet("player_attack", "src/game/assets/sprites/player/Attack.png", {
      frameWidth: 140,
      frameHeight: 140,
    });

    this.load.spritesheet("player_hit", "src/game/assets/sprites/player/Get hit.png", {
      frameWidth: 140,
      frameHeight: 140,
    });

    this.load.spritesheet("player_death", "src/game/assets/sprites/player/Death.png", {
      frameWidth: 140,
      frameHeight: 140,
    });

    // Projectile
    this.load.spritesheet("projectile_move", "src/game/assets/sprites/player/projectile/Moving.png", {
      frameWidth: 50,
      frameHeight: 50,
    });

    this.load.spritesheet("projectile_explode", "src/game/assets/sprites/player/projectile/Explode.png", {
      frameWidth: 50,
      frameHeight: 50,
    });


    // Slime
    this.load.spritesheet("slime_run", "src/game/assets/sprites/enemies/enemy_slime/Run/Slime_Run_full.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("slime_attack", "src/game/assets/sprites/enemies/enemy_slime/Attack/Slime_Attack_full.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("slime_death", "src/game/assets/sprites/enemies/enemy_slime/Death/Slime_Death_full.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    // Orc
    this.load.spritesheet("orc_run", "src/game/assets/sprites/enemies/enemy_orc/Run/Orc_Run_full.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("orc_attack", "src/game/assets/sprites/enemies/enemy_orc/Attack/Orc_Attack_full.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("orc_death", "src/game/assets/sprites/enemies/enemy_orc/Death/Orc_Death_full.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    // Vampire
    this.load.spritesheet("vampire_run", "src/game/assets/sprites/enemies/enemy_vampire/Run/Vampires_Run_full.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("vampire_attack", "src/game/assets/sprites/enemies/enemy_vampire/Attack/Vampires_Attack_full.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("vampire_death", "src/game/assets/sprites/enemies/enemy_vampire/Death/Vampires_Death_full.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

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
