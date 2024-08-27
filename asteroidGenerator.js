import { Asteroid } from "./models.js"

export function generateMeteorShower(numAsteroids, planet) {
    let asteroids = [];
    for (let i = 0; i < numAsteroids; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let velocity_x = Math.random() * 2 - 1;
        let velocity_y = Math.random() * 2 - 1;
        let angle = Math.random() * Math.PI * 2;
        let angularVelocity = Math.random() * 0.1 - 0.05;
        let radius = Math.random() * 10 + 10;
        asteroids.push(new Asteroid(x, y, velocity_x, velocity_y, angle, angularVelocity, planet, radius));
    }
    return asteroids;
}

