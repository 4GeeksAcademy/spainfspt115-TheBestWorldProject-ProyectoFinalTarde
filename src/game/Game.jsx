import React, { useEffect } from "react";
import Phaser from "phaser";
import PreloadScene from "./scenes/PreloadScenes";
import MenuScene from "./scenes/MenuScene";
import GameScene from "./scenes/GameScene";

export default function Game() {
  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      backgroundColor: "#222",
      parent: "game-container",
      scene: [PreloadScene, MenuScene, GameScene],
      dom: { createContainer: true }
    });

    return () => game.destroy(true);
  }, []);

  return <div id="game-container" style={{ width: 800, height: 600, margin: "auto" }} />;
}
