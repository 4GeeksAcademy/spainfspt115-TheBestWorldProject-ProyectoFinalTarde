const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

// === WORDS ===
export async function getRandomWords(difficulty, amount = 10) {
  const res = await fetch(`${API_BASE_URL}/words/random/${difficulty}?amount=${amount}`);
  if (!res.ok) throw new Error("Error al obtener palabras");
  return res.json();
}

// === GAMES ===
export async function saveGame(payload) {
  const res = await fetch(`${API_BASE_URL}/game`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al guardar partida");
  return res.json();
}

// === LEADERBOARD ===
export async function getLeaderboard(limit = 10) {
  const res = await fetch(`${API_BASE_URL}/leaderboard?limit=${limit}`);
  if (!res.ok) throw new Error("Error al obtener leaderboard");
  return res.json();
}

// === USERS ===
export async function getUser(id) {
  const res = await fetch(`${API_BASE_URL}/user/${id}`);
  if (!res.ok) throw new Error("Error al obtener usuario");
  return res.json();
}
