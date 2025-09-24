import Phaser from "phaser";
import { getRandomWords } from "./APIservices";

let wordPool = [];

export async function loadWordsFromAPI() {
  try {
    const pool = [];
    const perDifficulty = 20;

    for (let diff = 1; diff <= 3; diff++) {
      const words = await getRandomWords(diff, perDifficulty);
      words.forEach((w) => pool.push(w.word));
    }

    wordPool = pool;
  } catch (err) {
    console.error("Error al cargar palabras:", err);
    wordPool = ["fallback", "ejemplo", "palabra"];
  }
}

export function clearWordPool() {
  wordPool = [];
}

export function getRandomWord () {
  if (wordPool.length === 0) {
    return "ejemplo";
  }

  return Phaser.Utils.Array.GetRandom(wordPool);
}