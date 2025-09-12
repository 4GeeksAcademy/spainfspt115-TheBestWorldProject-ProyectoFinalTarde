import { Scene } from "phaser";
import { shakeLetter, animateScore, floatingScore } from "./Effects";
import { launchProjectiles } from "./ProjectileManager";
import { updateSpeedEnemy } from "./EnemyManager";

export function handleInput(event, scene) {
    if (!scene.isPlaying) return;

    const key = event.key;

    // --- backspace ---
    if (key === "Backspace") {
        if (scene.activeEnemy) {
            let typed = scene.activeEnemy.getData("typed") || "";
            typed = typed.slice(0, -1);
            scene.activeEnemy.setData("typed", typed);
            renderEnemyWord(scene.activeEnemy.getData("word"), typed, scene.activeEnemy.getData("wordLetters"));

            // si ya no queda nada escrito, liberar enemigo activo
            if (typed.length === 0) {
                clearActiveEnemy(scene);
            }
        }
        return;
    }

    // aceptar solo letras
    if (!/^[a-zñ]$/i.test(key)) return;

    // si no hay enemigo activo, elegir uno cuyo word comience con esa letra
    if (!scene.activeEnemy) {
        const enemies = scene.enemies.getChildren()
        .filter( enemy => enemy.active && enemy.getData("pendingProjectiles") === 0 )
        .filter( enemy => isEnemyOnScreen(scene, enemy));

        const candidates = enemies.filter(enemy => enemy.getData("word").startsWith(key.toLowerCase()));
        if (candidates.length === 0) return;

        const player = scene.player;
        const closest = candidates.reduce((prev, curr) => {
            const distPrev = Phaser.Math.Distance.Between(player.x, player.y, prev.x, prev.y);
            const distCurr = Phaser.Math.Distance.Between(player.x, player.y, curr.x, curr.y);
            return distCurr < distPrev ? curr : prev;
        });

        scene.activeEnemy = closest;
        highlightEnemy(scene.activeEnemy, true);
    }

    const enemy = scene.activeEnemy;
    const word = enemy.getData("word");
    let typed = enemy.getData("typed") || "";
    const letters = enemy.getData("wordLetters") || [];

    const newTyped = typed + key.toLowerCase();

    // letra incorrecta
    if (!word.startsWith(newTyped)) {
        if (letters[typed.length]) {
            shakeLetter(scene, letters[typed.length]);
            letters[typed.length].setStyle({ fill: "#f00" });
        } 
        return;
    }

    // letra correcta
    typed = newTyped;
    enemy.setData("typed", typed);
    renderEnemyWord(word, typed, letters);

    // palabra completa
    if (typed === word) {
        letters.forEach(letter => letter.destroy());
        enemy.setData("typed", "");
        enemy.setData("wordLetters", []);

        const midLetter = letters[Math.floor(letters.length / 2)];
        if (midLetter) floatingScore(scene, midLetter.x, midLetter.y, 10);

        let points = word.length * 10;
        let currentScore = scene.player.getData("score") || 0;
        scene.player.setData("score", currentScore + points);

        // ---PROCESOS DESPUES DEL COMPLETAR PALABRA ---
        animateScore(scene); // animacion del score
        updateSpeedEnemy(scene, enemy, 40); // reducir la velocidad al completar palabra
        launchProjectiles(scene, enemy, word.length); // lanzar proyectiles
        clearActiveEnemy(scene); // liberar enemigo despues de completarlo
    }
}

// --- limpiar enemigo activo
export function clearActiveEnemy (scene) {
    if (scene.activeEnemy) {
        highlightEnemy(scene.activeEnemy, false);
        scene.activeEnemy = null;
    }
}

// --- resaltar enemigo activo
function highlightEnemy (enemy, active)
{
    if (!enemy) return;
    
    if (active) {
        enemy.setStrokeStyle(3, 0xffff00);
    } else {
        enemy.setStrokeStyle();
    }
}

// --- renderizado de letras de las palabras en el enemigo
function renderEnemyWord (word, typed, letters) {
    if (!letters || letters.length === 0) return;

    for (let i = 0; i < word.length; i++)
    {
        let color = "#fff";
        if (i < typed.length) {
            color = typed[i] === word[i] ? "#0f0" : "#f00";
        }

        if (letters[i]) letters[i].setStyle({ fill: color });
    }
}

function isEnemyOnScreen (scene, enemy) {
    const padding = 20;

    return (
        enemy.x > -padding &&
        enemy.x < scene.width + padding &&
        enemy.y > -padding &&
        enemy.y < scene.height + padding
    );
}