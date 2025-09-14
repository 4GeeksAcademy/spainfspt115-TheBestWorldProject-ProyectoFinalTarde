import { HEART_FRAMES } from "./AnimationManager";
import { animateScaleText } from "./Effects";

export function createHUD(scene, maxLives = 3) {
    const width = scene.sys.game.config.width;

    // === VIDAS (corazones) ===
    const hearts = [];
    const totalWidth = maxLives * 40 + 120;
    const startX = width / 2 - totalWidth / 2;

    for (let i = 0; i < maxLives; i++) {

        const x = startX + i * 50;
        // Empieza VACÍO para que el fill se vea bien
        const heart = scene.add
            .sprite(x, 40, "heart", HEART_FRAMES.EMPTY)
            .setScale(1.5)
            .setDepth(1000);

        hearts.push(heart);
    }

    // === SCORE ===
    const textScore = scene.add
        .text(startX + maxLives * 40 + 20, 30, "Score: 0", {
            font: "28px Arial Black",
            fill: "#0f0",
            stroke: "#000",
            strokeThickness: 4,
        })
        .setOrigin(0, 0);

    function updateScore(score, animate = true) {

        textScore.setText("Score: " + (score ?? 0));
        if (animate) {
            animateScaleText(scene, textScore);
        }
    }

    // Rellena (una vez al inicio). Deja el frame FULL al finalizar.
    function fillHearts(sceneRef) {

        return new Promise((resolve) => {
            if (hearts.length === 0) return resolve();

            let done = 0;

            for (let i = 0; i < hearts.length; i++)
            {
                const heart = hearts[i];

                sceneRef.time.delayedCall(i * 200, () => {
                    heart.stop(); // por si acaso
                    heart.setFrame(HEART_FRAMES.EMPTY);
                    heart.play("heart_fill");
                    heart.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                        heart.setFrame(HEART_FRAMES.FULL);
                        done++;
                        if (done === hearts.length) resolve();
                    });
                }); 
            }

            // hearts.forEach((heart, i) => {
            //     sceneRef.time.delayedCall(i * 200, () => {
            //         heart.stop(); // por si acaso
            //         heart.setFrame(HEART_FRAMES.EMPTY);
            //         heart.play("heart_fill");
            //         heart.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            //             heart.setFrame(HEART_FRAMES.FULL);
            //             done++;
            //             if (done === hearts.length) resolve();
            //         });
            //     });
            // });
        });
    }

    // Rompe un corazón con animación y lo deja en EMPTY
    function loseLife(livesLeft, onEmpty) {
        // livesLeft es el valor nuevo tras restar (0..maxLives)
        // el índice a animar es el corazón en esa posición
        if (hearts[livesLeft]) {
            const heart = hearts[livesLeft];
            heart.stop();
            heart.play("heart_break");
            heart.once(
                Phaser.Animations.Events.ANIMATION_COMPLETE,
                () => {
                    heart.setFrame(HEART_FRAMES.EMPTY);
                    if (livesLeft === 0 && typeof onEmpty === "function") {
                        onEmpty();
                    }
                });
            heart
        }
    }

    return { hearts, textScore, updateScore, fillHearts, loseLife };
}
