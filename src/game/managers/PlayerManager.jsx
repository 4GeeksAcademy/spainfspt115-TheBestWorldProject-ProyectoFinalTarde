export function createPlayer (scene, x, y) {
    // const player = scene.add.circle(x, y, 25, 0x00ff00);

    const player = scene.add.sprite(x, y, "player_idle", 0);
    player.setDepth(10);
    player.setScale(1.5);

    scene.physics.add.existing(player);
    player.setOrigin(0.5, 0.5);
    player.body.setSize(40, 60);
    player.body.setOffset(55, 40);
    player.body.setImmovable(true);

    player.setData("lives", 3);
    player.setData("score", 0);
    player.setData("facing", "right") //"right" -> default --- cambiar a "left"

    player.faceTowards = function(positionX) {
        const direction = positionX >= this.x ? "right" : "left";
        this.setFlipX(direction === "left");
        this.setData("facing", direction);
        return direction;
    };

    player.faceLeft = function () {
        this.setFlipX(true);
        this.setData("facing", "left");
    };

    player.faceRight = function () {
        this.setFlipX(false);
        this.setData("facing", "right");
    };

    player.playIdle = function () {
        if (!this.anims || this.anims.currentAnim?.key === "player_idle") return;
        this.play("player_idle", true);
    };

    player.playAttackAndThen = function (targetX, onComplete) {
        this.faceTowards(targetX);
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.playIdle();
            if (onComplete) onComplete();
        });
        this.play("player_attack", true);
    };

    player.playHitAndThen = function (sourceX, onComplete) {
        if (typeof sourceX === "number") this.faceTowards(sourceX);
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            if (onComplete) onComplete();
            this.playIdle();
        });
        this.play("player_hit", true);
    };

    player.playDeath = function (onComplete) {
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            if (onComplete) onComplete();
        });
        this.play("player_death", true);
    };

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

    player.play("player_idle");

    return player;

}