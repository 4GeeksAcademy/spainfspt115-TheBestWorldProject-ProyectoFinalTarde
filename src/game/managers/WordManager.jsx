import Phaser from "phaser";
import { spawnWordEffect } from "./Effects";

// --- crea una nueva palabra y sus letras en posiciones aleatorias ---
export function createWord(scene, words) {
  const { width, height } = scene.sys.game.config;
  const currentWord = Phaser.Utils.Array.GetRandom(words);
  const wordGroup = scene.add.group();

  const letterSpacing = 30;
  const wordWidth = currentWord.length * letterSpacing;
  const margin = 20;

  const startX = Phaser.Math.Between(
    margin,
    width - margin - wordWidth
  );

  // --- rango vertical: debajo de UI hasta mitad pantalla ---
  const topMargin = 30;
  const bottomLimit = height * 0.25;
  const startY = Phaser.Math.Between(topMargin, bottomLimit);

  const letters = [];

  for (let i = 0; i < currentWord.length; i++) {
    const letter = scene.add.text(startX + i * letterSpacing, startY, currentWord[i], {
      fontSize: "48px",
      fill: "#aaa",
    }).setOrigin(0.5);

    wordGroup.add(letter);
    letters.push(letter);
  }

  // animación de aparición
  spawnWordEffect(scene, letters);

  // guardar info en la escena
  scene.currentWord = currentWord;
  scene.wordGroup = wordGroup;
  scene.typed = "";
  scene.locked = false;
  scene.errorIndex = -1;

  return wordGroup;
}

// --- renderiza la palabra ---
export function renderWord(scene, wordGroup, currentWord, typed) {
  if (!wordGroup || !currentWord) return;
  const letters = wordGroup.getChildren();
  for (let i = 0; i < currentWord.length; i++) {
    let color = "#aaa";
    if (i < typed.length) {
      color = typed[i] === currentWord[i] ? "#0f0" : "#f00";
    }
    letters[i].setStyle({ fill: color });
  }
}

// --- mueve la palabra hacia abajo ---
export function moveWord(scene, speed = 1.75) {
  if (!scene.wordGroup) return;
  const { height } = scene.sys.game.config;

  const letters = scene.wordGroup.getChildren();
  let allOut = true;

  letters.forEach(letter => {
    letter.y += speed;
    if (letter.y <= height + 50) {
      allOut = false;
    }
  });

  if (allOut) {
    scene.wordGroup.clear(true, true);
    createWord(scene, scene.words);
  }
}
