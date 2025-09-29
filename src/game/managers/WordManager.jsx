import Phaser from "phaser";
import { getRandomWords, getGigaWords } from "./APIservices";

let wordPool = {
  1: [],
  2: [],
  3: [],
  giga_slime: [],
  giga_orc: [],
  giga_vampire: []
};

export async function loadWordsFromAPI() {
  try {
    const perDifficulty = 90;
    for (let diff = 1; diff <= 3; diff++) {
      const words = await getRandomWords(diff, perDifficulty);
      wordPool[diff] = words.map((w) => w.word);
    }

    // --- palabras para GIGAS desde backend ---
    const gigas = await getGigaWords();
    wordPool.giga_slime = (gigas.giga_slime || []).map(w => w.word);
    wordPool.giga_orc = (gigas.giga_orc || []).map(w => w.word);
    wordPool.giga_vampire = (gigas.giga_vampire || []).map(w => w.word);

    // fallback si no hay nada en DB
    if (wordPool.giga_slime.length === 0) wordPool.giga_slime = ["hipermegacosa"];
    if (wordPool.giga_orc.length === 0) wordPool.giga_orc = ["supergiganteorc"];
    if (wordPool.giga_vampire.length === 0) wordPool.giga_vampire = ["ultravampirismo"];

  } catch (err) {
    console.error("Error al cargar palabras:", err);
    wordPool = {
      1: ["casa", "perro", "gato"],
      2: ["ventana", "caminar", "montaña"],
      3: ["electricidad", "programacion", "vampirismo"],
      giga_slime: ["hipermegacosa"],
      giga_orc: ["supergiganteorc"],
      giga_vampire: ["ultravampirismo"]
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

  // --- chance de giga ---
  if (Math.random() < (probs.gigaChance ?? 0)) {
    if (chosenDiff === 1 && wordPool.giga_slime.length > 0) {
      return Phaser.Utils.Array.GetRandom(wordPool.giga_slime);
    }
    if (chosenDiff === 2 && wordPool.giga_orc.length > 0) {
      return Phaser.Utils.Array.GetRandom(wordPool.giga_orc);
    }
    if (chosenDiff === 3 && wordPool.giga_vampire.length > 0) {
      return Phaser.Utils.Array.GetRandom(wordPool.giga_vampire);
    }
  }

  return Phaser.Utils.Array.GetRandom(wordPool[chosenDiff]);
}

export function getWordPool() {
  return wordPool;
}