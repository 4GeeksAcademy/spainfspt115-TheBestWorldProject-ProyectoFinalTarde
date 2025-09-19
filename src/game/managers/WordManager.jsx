import Phaser from "phaser";

let wordPool = [];

export async function loadWordsFromAPI (apiURL = "") {
  // funcion para cargar las palabras de la api
  
  wordPool = [
      "resident",
      "fortnite",
      "bycarloss",
      "onichan",
      "itadori",
      "gojo",
      "repo",
      "programar",
      "fokin",
      "hola",
    ];
}

export function getRandomWord () {
  if (wordPool.length === 0) {
    return "ejemplo";
  }

  return Phaser.Utils.Array.GetRandom(wordPool);
}