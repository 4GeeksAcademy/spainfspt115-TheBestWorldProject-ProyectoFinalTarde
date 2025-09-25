import Phaser from "phaser";
import { getRandomWords } from "./APIservices";

let wordPool = {
  1: [],
  2: [],
  3: []
};

export async function loadWordsFromAPI() {
  try {
    const perDifficulty = 30;
    for (let diff = 1; diff <= 3; diff++) {
      const words = await getRandomWords(diff, perDifficulty);
      wordPool[diff] = words.map((w) => w.word);
    }
  } catch (err) {
    console.error("Error al cargar palabras:", err);
    wordPool = {
      1: ["casa", "perro", "gato"],
      2: ["ventana", "caminar", "montaña"],
      3: ["electricidad", "programacion", "vampirismo"]
    };
  }
}

export function clearWordPool() {
  wordPool = { 1: [], 2: [], 3: [] };
}

export function getRandomWord(scene) {
  if (!wordPool[1].length && !wordPool[2].length && !wordPool[3].length) {
    return "fallback";
  }

  // === ruleta de probabilidades segun dificultad ===
  const probs = scene.difficulty;
  const roll = Math.random();
  let acc = 0;
  let chosenDiff = 1;

  for (const diff of [1, 2, 3]) {
    acc += probs[`diff${diff}`];
    if (roll < acc) {
      chosenDiff = diff;
      break;
    }
  }

  return Phaser.Utils.Array.GetRandom(wordPool[chosenDiff]);
}
