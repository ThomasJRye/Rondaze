export const TUTORIAL_LEVELS = {
    1: {
        // Just the player and planet - for learning movement
        planet: {
            radius: 25,
            mass: 15,
            atmosphere: 100,
            color: "lightblue",
            atmosphereColor: "rgba(135, 206, 235, {opacity})"
        },
        asteroids: {
            spawnInterval: 999999, // Effectively never spawn
            minRadius: 0,
            maxRadius: 0,
            spawnRate: 0,
            initialVelocity: {
                x: 0,
                y: 0
            }
        },
        spacecraft: {
            xOffset: 100,
            yOffset: 200,
            initialVelocity: {
                x: 0.2,
                y: 0
            }
        }
    },
    2: {
        // Add a single slow asteroid for targeting practice
        planet: {
            radius: 25,
            mass: 15,
            atmosphere: 100,
            color: "lightblue",
            atmosphereColor: "rgba(135, 206, 235, {opacity})"
        },
        asteroids: {
            spawnInterval: 15000, // One slow asteroid every 15 seconds
            minRadius: 10,
            maxRadius: 10,
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
                x: 0.2,
                y: 0
            }
        }
    },
    3: {
        // Multiple slower asteroids for practice
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
            maxRadius: 12,
            spawnRate: 2,
            initialVelocity: {
                x: 0.003,
                y: 0.0015
            }
        },
        spacecraft: {
            xOffset: 100,
            yOffset: 200,
            initialVelocity: {
                x: 0.2,
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
            minRadius: 2,
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
    2: {
        planet: {
            radius: 35,
            mass: 25,
            atmosphere: 120,
            color: "red",
            atmosphereColor: "rgba(255, 150, 150, {opacity})"
        },
        asteroids: {
            spawnInterval: 8000,
            minRadius: 3,
            maxRadius: 20,
            spawnRate: 2,
            initialVelocity: {
                x: 0.007,
                y: 0.004
            }
        },
        spacecraft: {
            xOffset: 150,
            yOffset: 250,
            initialVelocity: {
                x: 0.6,
                y: 0
            }
        }
    },
    3: {
        planet: {
            radius: 30,
            mass: 20,
            atmosphere: 80,
            color: "purple",
            atmosphereColor: "rgba(180, 150, 255, {opacity})"
        },
        asteroids: {
            spawnInterval: 6000,
            minRadius: 4,
            maxRadius: 25,
            spawnRate: 3,
            initialVelocity: {
                x: 0.009,
                y: 0.005
            }
        },
        spacecraft: {
            xOffset: 120,
            yOffset: 220,
            initialVelocity: {
                x: 0.7,
                y: 0
            }
        }
    }
}; 