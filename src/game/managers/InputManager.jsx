import { renderWord, createWord } from "./WordManager";
import { shakeLetter, explodeWord, animateScore, floatingScore } from "./Effects";

export function handleInput(event, scene) {
    if (!scene.isPlaying) return;

    const key = event.key;

    // --- backspace: borrar letra ---
    if (key === "Backspace") {
        if (scene.typed.length > 0) {
            scene.typed = scene.typed.slice(0, -1);
            if (scene.locked && scene.typed.length <= scene.errorIndex) {
                scene.locked = false;
                scene.errorIndex = -1;
            }
            renderWord(scene, scene.wordGroup, scene.currentWord, scene.typed);
        }
        return;
    }

    // ignorar si ya completamos la palabra o estamos bloqueados
    if (scene.typed.length >= scene.currentWord.length || scene.locked) return;

    // aceptar solo letras
    if (!/^[a-zñ]$/i.test(key)) return;

    const nextChar = key.toLowerCase();
    const newTyped = scene.typed + nextChar;

    // letra incorrecta
    if (!scene.currentWord.startsWith(newTyped)) {
        scene.locked = true;
        scene.errorIndex = newTyped.length - 1;
        scene.typed = newTyped;
        renderWord(scene, scene.wordGroup, scene.currentWord, scene.typed);
        shakeLetter(scene, scene.wordGroup.getChildren()[scene.errorIndex]);
        return;
    }

    // letra correcta
    scene.typed = newTyped;
    renderWord(scene, scene.wordGroup, scene.currentWord, scene.typed);

    // palabra completa = animacion explosion palabra + animacion de puntuacion ---
    // ------------------ + animacion de score
    if (scene.typed === scene.currentWord) {
        scene.score += 10;
        animateScore(scene);

        const letters = scene.wordGroup.getChildren();
        if (letters.length > 0) {
            // posicion de los puntos
            const midLetter = letters[Math.floor(letters.length / 2)];
            floatingScore(scene, midLetter.x, midLetter.y, 10);
        }

        explodeWord(scene, scene.wordGroup);

        scene.time.delayedCall(500, () => {
            createWord(scene, scene.words);
        });
    }
}
