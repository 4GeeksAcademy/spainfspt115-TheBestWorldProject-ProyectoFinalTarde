import React, { useEffect } from "react";
import Phaser from "phaser";
import PreloadScene from "./scenes/PreloadScenes";
import MenuScene from "./scenes/MenuScene";
import GameScene from "./scenes/GameScene";
import GameOverScene from "./scenes/GameOverScene";
import SettingsScene from "./scenes/SettingsScene";
import useGlobalReducer from "../front/hooks/useGlobalReducer.jsx";

const defaultFont = '"Pixelify Sans", sans-serif';
const origTextFactory = Phaser.GameObjects.GameObjectFactory.prototype.text;

Phaser.GameObjects.GameObjectFactory.prototype.text = function(x, y, text, style = {}) {
  if (!style.fontFamily && !style.font) {
    style.fontFamily = defaultFont;
    style.fontSize = style.fontSize || "24px";
    style.color = style.color || "#ffffff";
  }
  return origTextFactory.call(this, x, y, text, style);
};

export const Game = () => {

  const { store } = useGlobalReducer();
  
  let userId = store?.user?.id_user;
  
  useEffect(() => {

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      backgroundColor: "#222",
      parent: "game-container",
      scene: [PreloadScene, MenuScene, SettingsScene, GameScene, GameOverScene],
      dom: { createContainer: true },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight,
      },
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },
      fps: {
        target: 60,
        forceSetTimeOut: true,
      },
      settings: {
        bgMusicVolume: 1,
        bgMusicLoop: true,
      }
    });

    if (userId != undefined && userId != null) {
      game.registry.set("userId", userId);
    } else {
      game.registry.set("userId", "pepe");
    }

    const resize = () => {
      game.scale.resize(window.innerWidth, window.innerHeight);
    
    }

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);  
      game.destroy(true);

    }

  }, []);

  return (
    <div
      className="container-fluid p-0 m-0 d-flex justify-content-center align-items-center overflow-hidden"
      style={{ height: "100vh", width: "100vw" }}
    >
      <div id="game-container" className="w-100 h-100" />
    </div>
  );
}