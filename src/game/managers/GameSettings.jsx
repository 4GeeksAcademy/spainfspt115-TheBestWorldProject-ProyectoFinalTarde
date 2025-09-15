

export const GameSettings = {
    // animations:{},
    audio: {
        global: {volume: 1},
        music: {volume: 1, on: true},
        fx: {volume: 1 ,on: true},
        ambient: {volume: 1 ,on: true},
    },
    effcts:{
        shakeLetter: {
            offset: 8,
            duration: 80,
            repeat: 2,
        },
        flashError: {
            alpha: 0.6,
            repeat: 1,
            duration: 80,
        },
        floatingScore: {
            color: "#00ff88",
            fontSize: 36,
            duration: 1600,
        },
        fire: {
            particles: {
                quantity: 40,
            }
        },
        ice: {
            particles: {
                quantity: 25,
            }
        },
        lightning: {
            strokeWidth: 6,
            sparks: {
                quantity: 25,
            },
            burst: {
                quantity: 12,
            }
        },
        globalFlash: true,
        globalShake: true,
    },
};
