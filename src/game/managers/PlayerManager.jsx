export function createPlayer (scene, x, y) {
    // placeholder de jugador con circulo cambiar por sprite
    // scene.add.sprite(..........)
    const player = scene.add.circle(x, y, 25, 0x00ff00);
    
    scene.physics.add.existing(player);
    player.body.setImmovable(true);

    player.setData("lives", 3);
    player.setData("score", 0);

    player.loseLife = function () {
        let lives = this.getData("lives");
        lives--;
        this.setData("lives", lives);
        return lives;
    };

    player.addScore = function (points) {
        let score = this.getData("score");
        score += points;
        this.setData("score", score);
        return score;
    };

    return player;

}