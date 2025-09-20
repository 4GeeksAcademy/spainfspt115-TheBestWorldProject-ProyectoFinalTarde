export const GameSettings = {
    audio: {
        global: { volume: 1, on: true },
        music: { volume: 1, on: true },
        fx: { volume: 1, on: true },
        ambient: { volume: 1, on: true }
    },
    quality: "high",
    globalFlash: true,
    globalShake: true,
    // defaults needed para applyQualityPreset (evitan errores al hacer Object.assign)
    effects: {
        fire: { flash: { enabled: false }, shake: { enabled: false }, particles: { quantity: 0 }, enabled: true, quality: "high" },
        ice: { flash: { enabled: false }, shake: { enabled: false }, particles: { quantity: 0 }, enabled: true, quality: "high" },
        lightning: { flash: { enabled: false }, shake: { enabled: false }, sparks: { quantity: 0 }, burst: { quantity: 0 }, strokeWidth: 0, enabled: true, quality: "high" }
    },
    animations: {
        enmies: { frameRate: 8, scale: 1.2 },
        player: { frameRate: 8, scale: 1.2 }
    },
    presets: {
        low: {
            effects: {
                fire: { flash: { enabled: false }, shake: { enabled: false }, particles: { quantity: 10 }, enabled: true, quality: "low" },
                ice: { flash: { enabled: false }, shake: { enabled: false }, particles: { quantity: 10 }, enabled: true, quality: "low" },
                lightning: { flash: { enabled: false }, shake: { enabled: false }, sparks: { quantity: 5 }, burst: { quantity: 3 }, strokeWidth: 3, enabled: true, quality: "low" }
            },
            animations: { enmies: { frameRate: 8, scale: 1.2 }, player: { frameRate: 8, scale: 1.2 } }
        },
        medium: {
            effects: {
                fire: { flash: { enabled: true }, shake: { enabled: false }, particles: { quantity: 20 }, enabled: true, quality: "medium" },
                ice: { flash: { enabled: true }, shake: { enabled: false }, particles: { quantity: 15 }, enabled: true, quality: "medium" },
                lightning: { flash: { enabled: true }, shake: { enabled: false }, sparks: { quantity: 15 }, burst: { quantity: 8 }, strokeWidth: 5, enabled: true, quality: "medium" }
            },
            animations: { enmies: { frameRate: 12, scale: 1.3 }, player: { frameRate: 12, scale: 1.3 } }
        },
        high: {
            effects: {
                fire: { flash: { enabled: true }, shake: { enabled: true }, particles: { quantity: 40 }, enabled: true, quality: "high" },
                ice: { flash: { enabled: true }, shake: { enabled: true }, particles: { quantity: 25 }, enabled: true, quality: "high" },
                lightning: { flash: { enabled: true }, shake: { enabled: true }, sparks: { quantity: 25 }, burst: { quantity: 12 }, strokeWidth: 6, enabled: true, quality: "high" }
            },
            animations: { enmies: { frameRate: 15, scale: 1.5 }, player: { frameRate: 15, scale: 1.5 } }
        }
    }
};

export function applyQualityPreset(presetType) {
    // Guard seguro
    if (!presetType || !GameSettings.presets[presetType]) {
        console.error(`Preset de calidad "${presetType}" no encontrado.`);
        return;
    }

    GameSettings.quality = presetType;
    const preset = GameSettings.presets[presetType];

    // Aplica la configuración de efectos
    Object.keys(preset.effects).forEach(effectKey => {
        // Usa Object.assign de forma recursiva para copiar las propiedades anidadas
        Object.assign(GameSettings.effects[effectKey], preset.effects[effectKey]);
    });

    // Aplica la configuración de animaciones
    Object.keys(preset.animations).forEach(animKey => {
        Object.assign(GameSettings.animations[animKey], preset.animations[animKey]);
    });
}