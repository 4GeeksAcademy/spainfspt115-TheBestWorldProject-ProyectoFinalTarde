import { GameSettings } from "./GameSettings";

export function playFx(scene, key, config = {}) {
  if (!GameSettings.audio.global.on || !GameSettings.audio.fx.on) return;

  const base = config.volume ?? 1;
  const volume = base * GameSettings.audio.global.volume * GameSettings.audio.fx.volume;

  scene.sound.play(key, { ...config, volume });
}