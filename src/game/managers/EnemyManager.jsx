import { getRandomWord } from "./WordManager";

const letterSpacing = 24;

export function spawnEnemy(scene, speed = 80) {
    const { width, height } = scene.sys.game.config;
    
    // spawn aleatorio:
    // RIGHTSIDE = 0
    // BOTTOMSIDE = 1
    // LEFTSIDE = 2
    const side = Phaser.Math.Between(0, 2);
    const hudHeight = 80;

    let x, y;
    if (side === 0) { y = Phaser.Math.Between(0, height); x = width + 50; }
    if (side === 1) { x = Phaser.Math.Between(0, width); y = height + 50; }
    if (side === 2) { y = Phaser.Math.Between(0, width); x = -50; }

    // PLACEHOLDER de enemigo, cambiar por sprite
    // scene.add.sprite(.......)
    const enemy = scene.add.circle(x, y, 20, 0xff0000);
    scene.physics.add.existing(enemy);
    scene.enemies.add(enemy);

    // generar y asignar palabra aleatoria debajo del enemigo
    const word = getRandomWord();
    enemy.setData("word", word);
    enemy.setData("typed", "");
    enemy.setData("pendingProjectiles", 0);
    enemy.setData("wordLetters", []);

    let startX = enemy.x - (word.length * letterSpacing) / 2;
    const lettersArray = [];

    for (let i = 0; i < word.length; i++)
    {
        const posX = startX + i * letterSpacing;
        const posY = enemy.y + 40

        const letter = scene.add.text(posX, posY, word[i], {
            fontSize: "28px",
            fill: "#fff",
        }).setOrigin(0.5);

        letter.baseOffsetX = posX - enemy.x;
        letter.baseOffsetY = posY - enemy.y;
        letter.shakeOffset = 0;
        lettersArray.push(letter);
    }

    enemy.setData("wordLetters", lettersArray);
    scene.physics.moveToObject(enemy, scene.player, speed);

    return enemy;
}

export function updateEnemyWordPosition (enemy) {
    const letters = enemy.getData("wordLetters");
    if (!letters || letters.length === 0) return;

    const word = enemy.getData("word");

    letters.forEach((letter, i) => {
        const baseX = enemy.x + (letter.baseOffsetX ?? (i * letterSpacing - (word.length * letterSpacing) / 2));
        const baseY = enemy.y + (letter.baseOffsetY ?? 40);
        letter.x = baseX + (letter.shakeOffset || 0);
        letter.y = baseY;
    });

}

export function updateSpeedEnemy (scene, enemy, speed = 80) {
    scene.physics.moveToObject(enemy, scene.player, speed);
}