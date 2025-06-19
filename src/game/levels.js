export const TUTORIAL_LEVELS = {
    0: {
        // Initial level - just the player and planet
        planet: {
            radius: 25,
            mass: 15,
            atmosphere: 100,
            color: "lightblue",
            atmosphereColor: "rgba(135, 206, 235, {opacity})"
        },
        asteroids: {
            spawnInterval: 999999,
            minRadius: 0,
            maxRadius: 0,
            spawnRate: 0,
            initialVelocity: {
                x: Math.random(),
                y: Math.random()
            }
        },
        spacecraft: {
            xOffset: 100,
            yOffset: 200,
            initialVelocity: {
                x: 0.5,
                y: 0
            }
        }
    },
    1: {
        // Level with very slow asteroids for practice
        planet: {
            radius: 25,
            mass: 15,
            atmosphere: 100,
            color: "lightblue",
            atmosphereColor: "rgba(135, 206, 235, {opacity})"
        },
        asteroids: {
            spawnInterval: 15000,
            minRadius: 8,
            maxRadius: 15,
            spawnRate: 1,
            initialVelocity: {
                x: 0.002,
                y: 0.001
            }
        },
        spacecraft: {
            xOffset: 100,
            yOffset: 200,
            initialVelocity: {
                x: 0.5,
                y: 0
            }
        }
    },
    2: {
        // Level with medium speed asteroids
        planet: {
            radius: 25,
            mass: 15,
            atmosphere: 100,
            color: "lightblue",
            atmosphereColor: "rgba(135, 206, 235, {opacity})"
        },
        asteroids: {
            spawnInterval: 12000,
            minRadius: 8,
            maxRadius: 16,
            spawnRate: 1,
            initialVelocity: {
                x: 0.003,
                y: 0.0015
            }
        },
        spacecraft: {
            xOffset: 100,
            yOffset: 200,
            initialVelocity: {
                x: 0.5,
                y: 0
            }
        }
    },
    3: {
        // Level with regular speed asteroids for practice
        planet: {
            radius: 25,
            mass: 15,
            atmosphere: 100,
            color: "lightblue",
            atmosphereColor: "rgba(135, 206, 235, {opacity})"
        },
        asteroids: {
            spawnInterval: 8000,
            minRadius: 8,
            maxRadius: 17,
            spawnRate: 1,
            initialVelocity: {
                x: 0.004,
                y: 0.002
            }
        },
        spacecraft: {
            xOffset: 100,
            yOffset: 200,
            initialVelocity: {
                x: 0.5,
                y: 0
            }
        }
    }
};

export const LEVELS = {
    1: {
        planet: {
            radius: 25,
            mass: 15,
            atmosphere: 100,
            color: "blue",
            atmosphereColor: "rgba(135, 206, 235, {opacity})"
        },
        asteroids: {
            spawnInterval: 10000,
            minRadius: 8,
            maxRadius: 17,
            spawnRate: 1,
            initialVelocity: {
                x: 0.005,
                y: 0.0025
            }
        },
        spacecraft: {
            xOffset: 100,
            yOffset: 200,
            initialVelocity: {
                x: 0.5,
                y: 0
            }
        }
    },
}; 