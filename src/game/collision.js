import { areCirclesColliding } from './physics.js';

export function isSpacecraftOutsideBounds(spacecraft, canvas) {
  return spacecraft.x < 0 || spacecraft.x > canvas.width || spacecraft.y < 0 || spacecraft.y > canvas.height;
}

export function handleCollisions(spacecraft, planet, asteroids, isTutorial, canvas) {
  let gameOver = false;

  // Check for spacecraft collision with planet
  if (areCirclesColliding(planet, spacecraft) || isSpacecraftOutsideBounds(spacecraft, canvas)) {
    spacecraft.x = planet.x;
    spacecraft.y = planet.y + 200;
    spacecraft.velocity_x = 1.3;
    spacecraft.velocity_y = 0;
    if (!isTutorial) {
      gameOver = true;
    }
  }

  // Check for asteroid collisions with planet
  for (let i = 0; i < asteroids.length; i++) {
    if (areCirclesColliding(planet, asteroids[i])) {
      asteroids.splice(i, 1);
      i--;
      if (!isTutorial) {
        gameOver = true;
      }
    }
  }

  return gameOver;
} 