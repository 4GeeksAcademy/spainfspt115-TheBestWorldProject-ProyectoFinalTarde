import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    //Boton de inicio de partida
    const startButton = this.add.image(400, 300, "buttonImg").setInteractive();

    startButton.on("pointerdown", () => {
      this.scene.start("GameScene");
    });

    //Boton para mostrar tabla score

    //Boton para ir a la scene ajustes

    //Boton salir
  }
}
