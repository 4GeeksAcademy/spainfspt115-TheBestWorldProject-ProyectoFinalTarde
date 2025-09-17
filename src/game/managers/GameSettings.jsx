

export const GameSettings = {
    // animations:{},
    audio: {
        global: { volume: 1 },
        music: { volume: 1, on: true },
        fx: { volume: 1, on: true },
        ambient: { volume: 1, on: true },
    },
    quality: "high",
    globalFlash: true,
    globalShake: true,
    presets: {
        low: {
            effects: {
                fire: {
                    flash: { enabled: false },
                    shake: { enabled: false },
                    particles: { quantity: 10 },
                },
                ice: {
                    flash: { enabled: false },
                    shake: { enabled: false },
                    particles: { quantity: 10 },
                },
                lightning: {
                    flash: { enabled: false},
                    shake: { enabled: false},
                    sparks: { quantity: 5},
                    burst: { quantity: 3},
                    strokeWidth: 3,
                },
            },
            animations: {
                enmies: {
                    frameRate: 8,
                    scale: 1.2,
                },
                player: {
                    frameRate: 8,
                    scale: 1.2,
                },
            },
        },
        medium: {
            effects: {
                fire: {
                    flash: { enabled: true },
                    shake: { enabled: false },
                    particles: { quantity: 20 },
                },
                ice: {
                    flash: { enabled: true },
                    shake: { enabled: false },
                    particles: { quantity: 15 },
                },
                lightning: {
                    flash: { enabled: true},
                    shake: { enabled: false},
                    sparks: { quantity: 15},
                    burst: { quantity: 8},
                    strokeWidth: 5,
                },
            },
            animations: {
                enmies: {
                    frameRate: 12,
                    scale: 1.3,
                },
                player: {
                    frameRate: 12,
                    scale: 1.3,
                },
            },
        },
        hight: {
            effects: {
                fire: {
                    flash: { enabled: true },
                    shake: { enabled: true },
                    particles: { quantity: 40 },
                },
                ice: {
                    flash: { enabled: true },
                    shake: { enabled: true },
                    particles: { quantity: 25 },
                },
                lightning: {
                    flash: { enabled: true},
                    shake: { enabled: true},
                    sparks: { quantity: 25},
                    burst: { quantity: 12},
                    strokeWidth: 6,
                },
            },
            animations: {
                enmies: {
                    frameRate: 15,
                    scale: 1.5,
                },
                player: {
                    frameRate: 15,
                    scale: 1.5,
                },
            },
        },
    },
};

export function applyQualityPreset(presetType) {
    if (!presetType && !GameSettings.presets[presetType]) return;

    GameSettings.quality = presetType;

    const preset = GameSettings.presets[presetType];

    Object.assign(GameSettings.effects.fire, preset.effects.fire);
    Object.assign(GameSettings.effects.ice, preset.effects.ice);
    Object.assign(GameSettings.effects.lightning, preset.effects.lightning);
    Object.assign(GameSettings.animations.enmies, preset.animations.enmies);
    Object.assign(GameSettings.animations.player, preset.animations.player);
}