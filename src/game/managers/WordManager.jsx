import Phaser from "phaser";

// --- crea una nueva palabra y sus letras en posiciones aleatorias ---
export function createWord(scene, words) {
  const { width } = scene.sys.game.config;
  const currentWord = Phaser.Utils.Array.GetRandom(words);
  const wordGroup = scene.add.group();

  const letterSpacing = 30;
  const wordWidth = currentWord.length * letterSpacing;
  const margin = 50;

  const startX = Phaser.Math.Between(
    margin,
    width - margin - wordWidth
  );

  for (let i = 0; i < currentWord.length; i++) {
    const letter = scene.add.text(startX + i * letterSpacing, 0, currentWord[i], {
      fontSize: "48px",
      fill: "#aaa",
    }).setOrigin(0.5);
    wordGroup.add(letter);
  }

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
export function moveWord(scene, speed = 0.5) {
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
