import { shakeLetter, floatingScore, explodeWord } from "./Effects";
import { activatePower } from "./PowerManager";
import { launchProjectiles } from "./ProjectileManager";
import { killEnemy, updateSpeedEnemy } from "./EnemyManager";
import { playFx } from "./AudioManager";


export function handleInput(event, scene) {
  if (!scene.isPlaying) return;

  if (scene.activeEnemy && !isValidForInput(scene.activeEnemy)) {
    clearActiveEnemy(scene);
  }

  const key = event.key.toLowerCase();

  // === BACKSPACE ===
  if (key === "backspace") {
    if (scene.powerBuffer?.length > 0) {
      scene.powerBuffer = scene.powerBuffer.slice(0, -1);
      renderPowerWord(scene);
      return;
    }
    if (scene.activeEnemy) {
      if (!isValidForInput(scene.activeEnemy)) {
        clearActiveEnemy(scene);
        return;
      }

      let typed = scene.activeEnemy.getData("typed") || "";
      typed = typed.slice(0, -1);
      scene.activeEnemy.setData("typed", typed);

      renderEnemyWord(
        scene.activeEnemy.getData("word") || "",
        typed,
        scene.activeEnemy.getData("wordLetters")
      );

      if (typed.length === 0) clearActiveEnemy(scene);
    }
    return;
  }

  // === INICIAR PODER ===
  if (key === "-") {
    scene.powerBuffer = "-";
    renderPowerWord(scene);
    return;
  }

  // === ESCRIBIENDO PODER ===
  if (scene.powerBuffer) {
    if (!/^[a-zñ]$/i.test(key)) return;
    scene.powerBuffer += key;
    renderPowerWord(scene);

    const clean = scene.powerBuffer.slice(1);
    const powerList = Object.keys(scene.hud.powers);

    // evita crash palabra de power erronea
    const matches = powerList.filter(
      (power) => typeof power === "string" && power.startsWith(clean)
    );
    if (matches.length === 0) {
      scene.powerBuffer = "";
      renderPowerWord(scene);
      return;
    }

    if (powerList.includes(clean)) {
      const hudPower = scene.hud.powers[clean];
      if (hudPower?.ready) {
        activatePower(scene, clean);
      } else {
        scene.powerBuffer = "";
        renderPowerWord(scene);
        return;
      }
      scene.powerBuffer = "";
      renderPowerWord(scene);
      return;
    }
    return;
  }

  // === ENEMIGOS ===
  if (!/^[a-zñ]$/i.test(key)) return;

  // --- si no hay enemigo activo, elegir uno ---
  if (!scene.activeEnemy) {
    const enemies = scene.enemies
      .getChildren()
      .filter((e) => e && e.getData && e.getData("pendingProjectiles") === 0)
      .filter((e) => isEnemyOnScreen(scene, e))
      .filter(isValidForInput);

    const candidates = enemies.filter((e) => {
      const word = e.getData("word");
      return typeof word === "string" && word.startsWith(key);
    });
    if (candidates.length === 0) return;

    const player = scene.player;
    scene.activeEnemy = candidates.reduce((prev, curr) => {
      const dPrev = Phaser.Math.Distance.Between(player.x, player.y, prev.x, prev.y);
      const dCurr = Phaser.Math.Distance.Between(player.x, player.y, curr.x, curr.y);
      return dCurr < dPrev ? curr : prev;
    });

    highlightEnemy(scene.activeEnemy, true);
  }

  // --- procesar input en el enemigo activo ---
  const enemy = scene.activeEnemy;
  if (!enemy?.active) return;

  const word = enemy.getData("word");
  if (typeof word !== "string") {
    clearActiveEnemy(scene);
    return;
  }

  let typed = enemy.getData("typed") || "";
  const letters = enemy.getData("wordLetters") || [];

  if (letters.length === 0) {
    clearActiveEnemy(scene);
    return;
  }

  const newTyped = typed + key;
  if (!word.startsWith(newTyped)) {
    if (letters[typed.length]) {
      shakeLetter(scene, letters[typed.length]);
      letters[typed.length].setStyle({ fill: "#f00" });
      enemy.setData("hadErrors", true);
    }
    return; // corregir con backspace
  }

  typed = newTyped;
  enemy.setData("typed", typed);
  renderEnemyWord(word, typed, letters);

  // --- palabra completada ---
  if (typed === word) {
    const hadErrors = enemy.getData("hadErrors") || false;

    if (hadErrors) {
      scene.stats.failedWords++;
      scene.updateMultiplier(false);
    } else {
      scene.stats.correctWords++;
      scene.updateMultiplier(true);
    }

    enemy.setData("hadErrors", false);

    const midLetter = letters[Math.floor(letters.length / 2)];

    // efecto de explosion
    enemy.setData("__wordExploding", true);
    explodeWord(scene, letters);

    enemy.setData("typed", "");
    enemy.setData("wordLetters", []);

    let points;
    if (!enemy.getData("__frozen")) {
      if (["giga_slime", "giga_orc", "giga_vampire"].includes(enemy.getData("subType"))) {
        points = word.length * 20;
      } else {
        points = word.length * 10;
      }
    } else {
      points = word.length;
    }

    points = points * scene.multiplier;

    if (midLetter) floatingScore(scene, midLetter.x, midLetter.y, points);

    const currentScore = scene.player.getData("score") || 0;
    scene.player.setData("score", currentScore + points);
    scene.hud.updateScore(currentScore + points, true);

    enemy.setData("__inputDead", true);
    clearActiveEnemy(scene);

    if (enemy.getData("__frozen")) {
      killEnemy(enemy, scene);
    } else {
      playFx(scene, "player_attack_fx");
      enemy.setData("__doomed", true);
      updateSpeedEnemy(scene, enemy, 10);
      scene.player.playAttackAndThen(enemy.x, () => {
        launchProjectiles(scene, enemy, word.length);
      });
    }
  }
}

function isValidForInput(enemy) {
  if (!enemy || !enemy.active || !enemy.getData) return false;
  if (enemy.getData("__inputDead") || enemy.getData("dying") || enemy.getData("attacking")) return false;
  if (enemy.getData("__frozen")) return false;
  const letters = enemy.getData("wordLetters");
  if (!letters || letters.length === 0) return false;
  const word = enemy.getData("word");
  if (typeof word !== "string" || word.length === 0) return false;
  return true;
}

// --- utils ---
function renderEnemyWord(word, typed, letters) {
  if (!letters || letters.length === 0) return;

  letters.forEach((letter, i) => {
    let color =
      i < typed.length
        ? typed[i] === word[i]
          ? "#0f0"
          : "#f00"
        : "#fff";
    letter.setStyle({ fill: color });
  });
}

function renderPowerWord(scene) {
  const buffer = scene.powerBuffer || "";
  const clean = buffer.startsWith("-") ? buffer.slice(1) : buffer;
  const powers = scene.hud.powers;

  const activePower = clean
    ? Object.keys(powers).find((power) => typeof power === "string" && power.startsWith(clean))
    : null;

  Object.keys(powers).forEach((name) => {
    const power = powers[name];
    const baseHex = power.color.rgba;
    const label = `-${name.toUpperCase()}`;

    // --- caso: esta en cooldown ---
    if (!power.ready) {
      destroyPowerOverlay(scene, power);
      if (power.text) {
        power.text.setText(label);
        power.text.setAlpha(1);
      }
      return;
    }

    // --- caso: listo pero no activo ---
    if (activePower !== name) {
      destroyPowerOverlay(scene, power);
      if (power.text) {
        power.text.setText(label);
        power.text.setColor(baseHex);
        power.text.setAlpha(1);
      }
      return;
    }

    // --- caso: activo (se esta escribiendo) ---
    ensurePowerOverlay(scene, power, label);
    if (power.text) power.text.setAlpha(0);

    const typedLen = Math.min(clean.length + 1, power.letters.length);
    power.letters.forEach((letter, i) => {
      if (i < typedLen) {
        letter.setColor("#00ff00");
      } else {
        letter.setColor(baseHex);
      }
    });
  });
}

function ensurePowerOverlay(scene, power, label) {
  if (power.overlay) return;

  const baseStyle = power.text.style;
  const style = {
    fontFamily: baseStyle.fontFamily,
    fontSize: baseStyle.fontSize,
    fontStyle: baseStyle.fontStyle,
    stroke: baseStyle.stroke,
    strokeThickness: baseStyle.strokeThickness,
  };

  const container = scene.add.container(power.text.x, power.text.y);
  container.setDepth(power.text.depth);

  const letters = [];
  let totalWidth = 0;

  const tmp = label.split("").map((char) =>
    scene.add.text(0, 0, char, style).setOrigin(0.5)
  );
  tmp.forEach((text) => (totalWidth += text.width));

  let x = -totalWidth / 2;
  tmp.forEach((text) => {
    text.x = x + text.width / 2;
    text.y = 0;
    container.add(text);
    letters.push(text);
    x += text.width;
  });

  power.overlay = container;
  power.letters = letters;
}

function destroyPowerOverlay(scene, power) {
  if (power.overlay) {
    power.overlay.destroy(true);
    power.overlay = null;
    power.letters = null;
  }
}

export function clearActiveEnemy(scene) {
  if (scene.activeEnemy) {
    const enemy = scene.activeEnemy;
    highlightEnemy(enemy, false);
    scene.activeEnemy = null;
  }
}

function highlightEnemy(enemy, active) {
  if (!enemy || !enemy.setStrokeStyle) return;
  if (active) {
    enemy.setStrokeStyle(3, 0xffff00);
  } else {
    enemy.setStrokeStyle();
  }
}

function isEnemyOnScreen(scene, enemy) {
  const padding = 20;
  return (
    enemy.x > -padding &&
    enemy.x < scene.width + padding &&
    enemy.y > -padding &&
    enemy.y < scene.height + padding
  );
}