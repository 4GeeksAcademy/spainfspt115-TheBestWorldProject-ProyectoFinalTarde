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

let wordCycle = {
  1: [],
  2: [],
  3: [],
  giga_slime: [],
  giga_orc: [],
  giga_vampire: []
};

function pullFromCycle(key) {
  if (wordCycle[key].length > 0) {
    return wordCycle[key].shift();
  }
  if (wordPool[key]?.length > 0) {
    wordCycle[key] = Phaser.Utils.Array.Shuffle([...wordPool[key]]);
    return wordCycle[key].shift();
  }
  console.warn(`[WordManager] Pool vacío para ${key}`);
  return "fallback";
}

export async function loadWordsFromAPI() {
  try {
    const perDifficulty = 90;
    for (let diff = 1; diff <= 3; diff++) {
      const words = await getRandomWords(diff, perDifficulty);
      wordPool[diff] = words.map((w) => w.word);
    }

    const gigas = await getGigaWords();
    wordPool.giga_slime = (gigas.giga_slime || []).map(w => w.word);
    wordPool.giga_orc = (gigas.giga_orc || []).map(w => w.word);
    wordPool.giga_vampire = (gigas.giga_vampire || []).map(w => w.word);

    if (wordPool.giga_slime.length === 0) wordPool.giga_slime = ["hipermegacosa"];
    if (wordPool.giga_orc.length === 0) wordPool.giga_orc = ["supergiganteorc"];
    if (wordPool.giga_vampire.length === 0) wordPool.giga_vampire = ["ultravampirismo"];

    wordCycle[1] = Phaser.Utils.Array.Shuffle([...wordPool[1]]);
    wordCycle[2] = Phaser.Utils.Array.Shuffle([...wordPool[2]]);
    wordCycle[3] = Phaser.Utils.Array.Shuffle([...wordPool[3]]);
    wordCycle.giga_slime = Phaser.Utils.Array.Shuffle([...wordPool.giga_slime]);
    wordCycle.giga_orc = Phaser.Utils.Array.Shuffle([...wordPool.giga_orc]);
    wordCycle.giga_vampire = Phaser.Utils.Array.Shuffle([...wordPool.giga_vampire]);

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

    wordCycle[1] = [...wordPool[1]];
    wordCycle[2] = [...wordPool[2]];
    wordCycle[3] = [...wordPool[3]];
    wordCycle.giga_slime = [...wordPool.giga_slime];
    wordCycle.giga_orc = [...wordPool.giga_orc];
    wordCycle.giga_vampire = [...wordPool.giga_vampire];
  }
}

export function clearWordPool() {
  wordPool = { 1: [], 2: [], 3: [] };
  wordCycle[1] = [];
  wordCycle[2] = [];
  wordCycle[3] = [];
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
      return pullFromCycle("giga_slime");
    }
    if (chosenDiff === 2 && wordPool.giga_orc.length > 0) {
      return pullFromCycle("giga_orc");
    }
    if (chosenDiff === 3 && wordPool.giga_vampire.length > 0) {
      return pullFromCycle("giga_vampire");
    }
  }

  return pullFromCycle(chosenDiff);
}

export function getWordPool() {
  return wordPool;
}