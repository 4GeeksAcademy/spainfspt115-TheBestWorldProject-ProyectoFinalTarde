import React, { useEffect } from "react";
import Phaser from "phaser";
import PreloadScene from "./scenes/PreloadScenes";
import MenuScene from "./scenes/MenuScene";
import GameScene from "./scenes/GameScene";
import GameOverScene from "./scenes/GameOverScene";

export default function Game() {
  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 600,
      height: 800,
      backgroundColor: "#222",
      parent: "game-container",
      scene: [PreloadScene, MenuScene, GameScene, GameOverScene],
      dom: { createContainer: true }
    });

    return () => game.destroy(true);
  }, []);

  return <div id="game-container" style={{ width: 600, height: 800, margin: "auto" }} />;
}