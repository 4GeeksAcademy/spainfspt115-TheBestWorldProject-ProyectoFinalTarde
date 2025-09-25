import Phaser from "phaser";
// import bitchesMusic from "../assets/Bitches.mp3";
// import bgImg from "../assets/bg.png";
// import startBtn from "../assets/StartBtn.png";
// import resetBtn from "../assets/ResetBtn.png";
import { loadWordsFromAPI } from "../managers/WordManager";
import { createLoadingBackground } from "../managers/BackgroundManager";

export default class LoadingScene extends Phaser.Scene {
    constructor() {
        super("LoadingScene");

        this.proTips = [
            "Usa los poderes estratégicamente.",
            "Recuerda: palabras más largas = más puntos.",
            "No te olvides de los enemigos congelados.",
            "Mira tu barra de vida constantemente.",
            "Activa los rayos para limpiar rápido la pantalla.",
            "El fuego puede eliminar a varios enemigos de golpe.",
            "El hielo te da tiempo extra: congela a todos los enemigos.",
            "Amigo ereh Hacker.",
            "Insanidad",
            "Aprobar este proyecto te dara puntos extra :D"
        ];
    }

    init(data) {
        this.nextScene = data?.nextScene || "MenuScene";
        this.nextData = data?.nextData || {};
        this.loadCallback = data?.loadCallback || null;
    }

    preload() {
        const { width, height } = this.sys.game.config;
        const centerX = width / 2;
        const centerY = height / 2;

        // === UI ===
        this.loadingText = this.add.text(centerX, centerY - 100, "Cargando...", {
            fontSize: "32px",
            fill: "#ffffff",
            fontStyle: "bold",
            stroke: "#000",
            strokeThickness: 4,
        }).setOrigin(0.5);

        this.percentText = this.add.text(centerX, centerY - 50, "0%", {
            fontSize: "28px",
            fill: "#00ff88",
            fontStyle: "bold",
        }).setOrigin(0.5);

        const barWidth = 400;
        const barHeight = 30;
        const barX = centerX - barWidth / 2;
        const barY = centerY;

        this.progressBox = this.add.rectangle(centerX, barY, barWidth, barHeight, 0x222222).setOrigin(0.5);
        this.progressBar = this.add.rectangle(barX, barY, 0, barHeight, 0x00ff00).setOrigin(0, 0.5);

        // Dummy sprite hasta que cargue el player
        this.playerSprite = this.add.rectangle(barX, centerY + 120, 40, 40, 0x00ff00);

        // === PRO TIP label fijo ===
        this.tipLabel = this.add.text(centerX + 100, centerY + 100, "Pro Tip:", {
            fontSize: "28px",
            fill: "#ffcc00",
            fontStyle: "bold",
            stroke: "#000",
            strokeThickness: 4,
        }).setOrigin(0, 0.5);

        // Efectos animados (parpadeo + pulso)
        this.tweens.add({
            targets: this.tipLabel,
            alpha: { from: 1, to: 0.6 },
            duration: 800,
            yoyo: true,
            repeat: -1
        });
        this.tweens.add({
            targets: this.tipLabel,
            scale: { from: 1, to: 1.1 },
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });

        // === PRO TIP dynamic text ===
        this.tipText = this.add.text(centerX + 100, centerY + 140, "", {
            fontSize: "20px",
            fill: "#ffff88",
            wordWrap: { width: 300 }
        }).setOrigin(0, 0.5).setAlpha(0);

        // Evento de progreso real
        this.load.on("progress", (value) => {
            this.updateProgress(value);
        });

        // === ASSETS ===
        // this.load.image("bg", bgImg);
        // this.load.audio("bgMusic", bitchesMusic);
        // this.load.image("buttonImg", startBtn);
        // this.load.image("resetBtn", resetBtn);

        this.load.image("fire", "https://res.cloudinary.com/dixwk4tan/image/upload/v1758754633/fire_lqd6sn.png");
        this.load.image("ice", "https://res.cloudinary.com/dixwk4tan/image/upload/v1758754672/ice_h8povb.png");
        this.load.image("spark", "https://res.cloudinary.com/dixwk4tan/image/upload/v1758754676/spark_ofwagp.png");

        // Background
        this.load.spritesheet("set1", "https://res.cloudinary.com/dixwk4tan/image/upload/v1758755341/Set_1_bvgi2y.png", {
            frameWidth: 16,
            frameHeight: 16,
        });

        this.load.spritesheet("vase", "https://res.cloudinary.com/dixwk4tan/image/upload/v1758755382/Vase_Shine_Anim_f9xrif.png", {
            frameWidth: 16,
            frameHeight: 16,
        });

        this.load.spritesheet("pillar", "https://res.cloudinary.com/dixwk4tan/image/upload/v1758755362/Structure_fvhelt.png", {
            frameWidth: 16,
            frameHeight: 16,
        });

        this.load.spritesheet("torch_yellow", "https://res.cloudinary.com/dixwk4tan/image/upload/v1758755372/Torch_Yellow_whzaa4.png", {
            frameWidth: 16,
            frameHeight: 16,
        });

        // Player
        this.load.spritesheet("player_idle", "https://res.cloudinary.com/dixwk4tan/image/upload/v1758756522/Idle_kns8yl.png", {
            frameWidth: 140,
            frameHeight: 140,
        });

        this.load.spritesheet("player_attack", "https://res.cloudinary.com/dixwk4tan/image/upload/v1758754801/Attack_yy3phn.png", {
            frameWidth: 140,
            frameHeight: 140,
        });

        this.load.spritesheet("player_hit", "https://res.cloudinary.com/dixwk4tan/image/upload/v1758754841/Get_hit_wdmdqd.png", {
            frameWidth: 140,
            frameHeight: 140,
        });

        this.load.spritesheet("player_death", "https://res.cloudinary.com/dixwk4tan/image/upload/v1758754853/Death_qtafvb.png", {
            frameWidth: 140,
            frameHeight: 140,
        });

        // Projectile
        this.load.spritesheet("projectile_move", "https://res.cloudinary.com/dixwk4tan/image/upload/v1758754919/Moving_qdqw5g.png", {
            frameWidth: 50,
            frameHeight: 50,
        });

        this.load.spritesheet("projectile_explode", "https://res.cloudinary.com/dixwk4tan/image/upload/v1758754904/Explode_cwednp.png", {
            frameWidth: 50,
            frameHeight: 50,
        });


        // Slime
        this.load.spritesheet("slime_run", "https://res.cloudinary.com/dixwk4tan/image/upload/v1758755203/Slime_Run_full_cgthkv.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("slime_attack", "https://res.cloudinary.com/dixwk4tan/image/upload/v1758755178/Slime_Attack_full_zpqa5y.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("slime_death", "https://res.cloudinary.com/dixwk4tan/image/upload/v1758755190/Slime_Death_full_iwgzec.png", {
            frameWidth: 64,
            frameHeight: 64,
        });

        // Orc
        this.load.spritesheet("orc_run", "https://res.cloudinary.com/dixwk4tan/image/upload/v1758755075/Orc_Run_full_moeppp.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("orc_attack", "https://res.cloudinary.com/dixwk4tan/image/upload/v1758755051/Orc_Attack_full_m9zkjj.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("orc_death", "https://res.cloudinary.com/dixwk4tan/image/upload/v1758755064/Orc_Death_full_a1hebn.png", {
            frameWidth: 64,
            frameHeight: 64,
        });

        // Vampire
        this.load.spritesheet("vampire_run", "https://res.cloudinary.com/dixwk4tan/image/upload/v1758755239/Vampires_Run_full_ey5l6l.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("vampire_attack", "https://res.cloudinary.com/dixwk4tan/image/upload/v1758755218/Vampires_Attack_full_smxdu9.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("vampire_death", "https://res.cloudinary.com/dixwk4tan/image/upload/v1758755229/Vampires_Death_full_u0ogoe.png", {
            frameWidth: 64,
            frameHeight: 64,
        });

        this.load.spritesheet("heart", "https://res.cloudinary.com/dixwk4tan/image/upload/v1758754653/Hearts_ahemkq.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.startTime = Date.now();

    }

    updateProgress(value) {
        const barWidth = 400;
        this.progressBar.width = barWidth * value;
        this.percentText.setText(`${Math.floor(value * 100)}%`);
    }

    async create() {
        createLoadingBackground(this);

        // sprite animado
        if (this.textures.exists("player_idle") && !this.anims.exists("player_idle")) {
            this.anims.create({
                key: "player_idle",
                frames: this.anims.generateFrameNumbers("player_idle"),
                frameRate: 10,
                repeat: -1,
            });
        }

        if (this.textures.exists("player_idle")) {
            const { x, y } = this.playerSprite;
            this.playerSprite.destroy();
            this.playerSprite = this.add.sprite(x, y, "player_idle").play("player_idle");
            this.playerSprite.setScale(1.2);
        }

        // === Rotador de Pro Tips (aleatorio + fade) ===
        let lastIndex = -1;
        const tipDuration = 3000; // tiempo minimo visible por tip

        const showTip = () => {
            let index;
            do {
                index = Phaser.Math.Between(0, this.proTips.length - 1);
            } while (index === lastIndex && this.proTips.length > 1);

            lastIndex = index;
            const msg = this.proTips[index];

            // fade out actual
            this.tweens.add({
                targets: this.tipText,
                alpha: 0,
                duration: 400,
                onComplete: () => {
                    this.tipText.setText(msg);
                    // fade in nuevo
                    this.tweens.add({
                        targets: this.tipText,
                        alpha: 1,
                        duration: 400,
                    });
                }
            });
        };

        showTip(); // primer tip
        this.tipTimer = this.time.addEvent({
            delay: tipDuration,
            loop: true,
            callback: showTip,
        });

        // === Simulacion barra ===
        if (this.progressBar.width === 0) {
            let progress = 0;
            this.simTimer = this.time.addEvent({
                delay: 100,
                loop: true,
                callback: () => {
                    progress = Math.min(progress + 0.01, 1);
                    this.updateProgress(progress);
                },
            });
        }

        // === Async loading ===
        await loadWordsFromAPI();
        if (this.loadCallback) await this.loadCallback();

        if (this.simTimer) this.simTimer.remove();
        this.updateProgress(1);

        // tiempo mínimo 4s
        const elapsed = Date.now() - this.startTime;
        const minDuration = 4000;
        const remaining = Math.max(0, minDuration - elapsed);

        this.time.delayedCall(remaining, () => {
            this.time.delayedCall(tipDuration, () => {
                this.tipTimer.remove();
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.cameras.main.once("camerafadeoutcomplete", () => {
                    this.scene.start(this.nextScene, this.nextData);
                });
            });
        });
    }
}