import { shakeLetter, floatingScore } from "./Effects";
import { activatePower } from "./PowerManager";
import { launchProjectiles } from "./ProjectileManager";
import { killEnemy, updateSpeedEnemy } from "./EnemyManager";

export function handleInput(event, scene) {
  if (!scene.isPlaying) return;

  if (scene.activeEnemy && !scene.activeEnemy.active) {
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

      if (!scene.activeEnemy.active || !scene.activeEnemy.getData("wordLetters")) {
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
    const matches = powerList.filter((power) => typeof power === "string" && power.startsWith(clean));
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

  if (!scene.activeEnemy) {
    const enemies = scene.enemies
      .getChildren()
      .filter((e) => e.active && e.getData("pendingProjectiles") === 0)
      .filter((e) => isEnemyOnScreen(scene, e));

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

  const enemy = scene.activeEnemy;
  if (!enemy?.active) return;

  const word = enemy.getData("word");
  if (typeof word !== "string") return;

  let typed = enemy.getData("typed") || "";
  const letters = enemy.getData("wordLetters") || [];

  const newTyped = typed + key;
  if (!word.startsWith(newTyped)) {
    if (letters[typed.length]) {
      shakeLetter(scene, letters[typed.length]);
      letters[typed.length].setStyle({ fill: "#f00" });
    }
    return;
  }

  typed = newTyped;
  enemy.setData("typed", typed);
  renderEnemyWord(word, typed, letters);

  if (typed === word) {
    const midLetter = letters[Math.floor(letters.length / 2)];
    letters.forEach((letter) => letter.destroy());
    enemy.setData("typed", "");
    enemy.setData("wordLetters", []);

    let points;    

    if(!enemy.getData("__frozen"))
    {
      points = word.length * 10;
    } else {
      points = word.length;
    }
    if (midLetter) floatingScore(scene, midLetter.x, midLetter.y, points);

    const currentScore = scene.player.getData("score") || 0;
    scene.player.setData("score", currentScore + points);
    scene.hud.updateScore(currentScore + points, true);

    if(enemy.getData("__frozen"))
    {
      killEnemy(enemy, scene);
    } else {
      enemy.setData("__doomed", true);

      updateSpeedEnemy(scene, enemy, 0);

      scene.player.playAttackAndThen(enemy.x, () => {
        launchProjectiles(scene, enemy, word.length);
      });
    }

    clearActiveEnemy(scene);
  }
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

    // --- caso: está en cooldown ---
    if (!power.ready) {
      // si tiene overlay de escritura, limpiarlo
      destroyPowerOverlay(scene, power);
      if (power.text) {
        power.text.setText(label);
        power.text.setAlpha(1);
        // 👇 NO tocamos el color porque HUDmanager lo va actualizando con el cooldown
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

    // --- caso: activo (se está escribiendo) ---
    ensurePowerOverlay(scene, power, label);
    if (power.text) power.text.setAlpha(0);

    const typedLen = Math.min(clean.length + 1, power.letters.length);
    power.letters.forEach((letter, i) => {
      if (i < typedLen) {
        letter.setColor("#00ff00"); // verde al escribir
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
    if (!scene.activeEnemy.active) {
      scene.activeEnemy = null;
      return;
    }
    highlightEnemy(scene.activeEnemy, false);
    scene.activeEnemy = null;
  }
}

function highlightEnemy(enemy, active) {
  if (active && enemy.setStrokeStyle) enemy.setStrokeStyle(3, 0xffff00);
  else if (enemy.setStrokeStyle) enemy.setStrokeStyle();
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
