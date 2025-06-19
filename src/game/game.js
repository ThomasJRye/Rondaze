import { SPACECRAFT } from './constants.js';
import { LEVELS, TUTORIAL_LEVELS } from "./levels.js";
import { createInputHandlers } from './input.js';
import { createGameObjects } from './gameObjects.js';
import { handleCollisions } from './collision.js';
import { drawPlanet, drawSpacecraft, drawScore, drawPauseScreen } from './drawing.js';

let score = 0;

export function getScore() {
  return score;
}

export function startGame(canvas, ctx, navigate, options = {}) {
  const { isTutorial = false, level = 1 } = options;
  const levelConfig = isTutorial ? TUTORIAL_LEVELS[level] : LEVELS[level];
  score = 0;

  let gameOver = false;
  let paused = false;
  let animationFrameId = null;

  // Create background stars
  const stars = Array(150).fill().map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.3 + 0.1
  }));

  const planet = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: levelConfig.planet.radius,
    mass: levelConfig.planet.mass,
    atmosphere: levelConfig.planet.atmosphere,
    color: levelConfig.planet.color,
    atmosphereColor: levelConfig.planet.atmosphereColor
  };

  // Set up the spacecraft
  const spacecraft = {
    x: planet.x + levelConfig.spacecraft.xOffset,
    y: planet.y + levelConfig.spacecraft.yOffset,
    radius: SPACECRAFT.RADIUS,
    velocity_x: levelConfig.spacecraft.initialVelocity.x,
    velocity_y: levelConfig.spacecraft.initialVelocity.y,
    angle: SPACECRAFT.INITIAL_ANGLE,
    angular_velocity: SPACECRAFT.INITIAL_ANGULAR_VELOCITY,
  };

  const gameObjects = createGameObjects(planet, levelConfig);
  const inputHandlers = createInputHandlers(spacecraft, isTutorial);

  // In tutorial mode, provide a custom navigate function that doesn't actually navigate away
  const safeNavigate = isTutorial ? 
    () => {
      // Do nothing in tutorial mode - don't navigate away
      resetGame();
    } : navigate;

  function resetGame() {
    gameOver = false;
    resetSpacecraft();
    gameObjects.nukes = [];
    gameObjects.asteroids = [];
    score = 0;
  }

  function resetSpacecraft() {
    spacecraft.x = planet.x + levelConfig.spacecraft.xOffset;
    spacecraft.y = planet.y + levelConfig.spacecraft.yOffset;
    spacecraft.velocity_x = levelConfig.spacecraft.initialVelocity.x;
    spacecraft.velocity_y = levelConfig.spacecraft.initialVelocity.y;
    spacecraft.angle = SPACECRAFT.INITIAL_ANGLE;
    spacecraft.angular_velocity = SPACECRAFT.INITIAL_ANGULAR_VELOCITY;
  }

  // Add keyboard controls
  document.addEventListener("keydown", (event) => {
    const result = inputHandlers.handleKeyDown(event);
    if (result === true) {
      gameObjects.fireNuke(spacecraft);
    } else if (result === "togglePause") {
      paused = !paused;
    }
  });
  document.addEventListener("keyup", inputHandlers.handleKeyUp);

  function cleanup() {
    document.removeEventListener("keydown", inputHandlers.handleKeyDown);
    document.removeEventListener("keyup", inputHandlers.handleKeyUp);
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  }

  function drawStars() {
    ctx.save();
    stars.forEach(star => {
      ctx.globalAlpha = star.opacity;
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background stars first
    drawStars();

    drawScore(ctx, score);
    drawPlanet(ctx, planet);
    drawSpacecraft(ctx, spacecraft, inputHandlers.isArrowUpPressed());

    // Draw nukes
    for (let i = 0; i < gameObjects.nukes.length; i++) {
      gameObjects.nukes[i].draw(ctx);
      if (gameObjects.nukes[i].activated) {
        gameObjects.nukes[i].drawBoom(ctx);
      }
    }

    // Draw asteroids
    for (let i = 0; i < gameObjects.asteroids.length; i++) {
      gameObjects.asteroids[i].draw(ctx);
    }

    if (paused) {
      drawPauseScreen(ctx, canvas);
    }
  }

  function update() {
    score += 1;
    gameObjects.generateAsteroid(isTutorial);
    gameObjects.updateObjects(spacecraft, isTutorial, score, inputHandlers.isArrowUpPressed());
    gameOver = handleCollisions(spacecraft, planet, gameObjects.asteroids, isTutorial, canvas);
  }

  function loop() {
    if (!gameOver) {
      if (!paused) {
        update();
      }
      draw();
      animationFrameId = requestAnimationFrame(loop);
    } else {
      if (isTutorial) {
        resetGame();
        loop();
      } else {
        cleanup();
        const finalScore = Math.round(score / 100);
        safeNavigate('/game-over', { state: { finalScore, level } });
      }
    }
  }

  // Start the game loop
  loop();

  // Return cleanup function and game control methods
  return {
    cleanup,
    resetSpacecraft,
    isGameOver: () => gameOver
  };
}