import Phaser from "phaser";

let wordPool = [];

const API_BASE_URL = "https://probable-sniffle-975jjx97p7v7cr7-3001.app.github.dev/api"

export async function loadWordsFromAPI() {
  try {
    const pool = [];

    const perDifficulty = 20;

    for (let diff = 1; diff <= 3; diff++) {
      const response = await fetch(`${API_BASE_URL}/words/random/${diff}?amount=${perDifficulty}`);
      if (!response.ok) {
        console.error(`Error cargando palabras dificultad ${diff}`);
        continue;
      }

      const words = await response.json();
      words.forEach((w) => pool.push(w.word));
    }

    wordPool = pool;
    console.log("WordPool cargado:", wordPool.length, "palabras");

  } catch (err) {
    console.error("Error al cargar palabras del backend:", err);

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