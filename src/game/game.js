import { applyGravity, atmosphericDrag, areCirclesClose, areCirclesColliding } from "./physics.js";
import {  SPACECRAFT, ATMOSPHERE_LAYERS, ATMOSPHERE_OPACITY } from './constants.js';
import { Nuke, Asteroid } from "./models.js";
import { LEVELS, TUTORIAL_LEVELS } from "./levels.js";

// Color palette that mirrors colorPalette.css for canvas use
const COLORS = {
  oxfordBlue: '#0e172c',
  vermilion: '#ef3e36',
  orangeWeb: '#ffae03',
  battleshipGray: '#848c8e',
  whiteSmoke: '#f1f2ee',
  continentGreenLight: 'rgb(80, 118, 17)',
  continentGreenDark: 'rgb(23, 91, 18)'
};

// Initialize canvas
var score = 0;

export function getScore() {
  return score;
}

export function startGame(canvas, ctx, navigate, options = {}) {
  const { isTutorial = false, level = 1 } = options;
  const levelConfig = isTutorial ? TUTORIAL_LEVELS[level] : LEVELS[level];
  score = 0;

  let gameOver = false;
  let paused = false;
  let nukes = [];
  let asteroids = [];
  let arrowUpPressed = false;
  let lastMeteorShowerTime = 0;
  let asteroidCounter = 0;
  let animationFrameId = null;
  
  // Event listener references for cleanup
  const keydownListener = handleKeyDown;
  const keyupListener = handleKeyUp;

  // In tutorial mode, provide a custom navigate function that doesn't actually navigate away
  const safeNavigate = isTutorial ? 
    () => {
      // Do nothing in tutorial mode - don't navigate away
      resetGame();
    } : navigate;

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

  function resetGame() {
    // In tutorial mode, reset everything and continue
    gameOver = false;
    resetSpacecraft();
    nukes = [];
    asteroids = [];
    score = 0;
    lastMeteorShowerTime = 0;
    asteroidCounter = 0;
  }

  function resetSpacecraft() {
    spacecraft.x = planet.x + levelConfig.spacecraft.xOffset;
    spacecraft.y = planet.y + levelConfig.spacecraft.yOffset;
    spacecraft.velocity_x = levelConfig.spacecraft.initialVelocity.x;
    spacecraft.velocity_y = levelConfig.spacecraft.initialVelocity.y;
    spacecraft.angle = SPACECRAFT.INITIAL_ANGLE;
    spacecraft.angular_velocity = SPACECRAFT.INITIAL_ANGULAR_VELOCITY;
  }

  function fireNuke(spacecraft) {
    // Increase velocity by 75% (x1.75)
    const velocityMultiplier = 1.75;
    const nuke = new Nuke(
        spacecraft.x, 
        spacecraft.y, 
        (Math.sin(spacecraft.angle) * 1.5 * velocityMultiplier) + spacecraft.velocity_x, 
        (-Math.cos(spacecraft.angle) * 1.5 * velocityMultiplier) + spacecraft.velocity_y, 
        spacecraft.angle, 
        0, 
        planet
    );
    nukes.push(nuke);
  }

  function handleKeyDown(event) {
    // Prevent Enter key from being processed in tutorial mode
    if (isTutorial && (event.code === "Enter" || event.key === "Enter")) {
      // Ignore Enter key in tutorial mode
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    
    switch (event.code) {
      case "ArrowLeft":
        spacecraft.angular_velocity -= 0.01;
        break;
      case "ArrowRight":
        spacecraft.angular_velocity += 0.01;
        break;
      case "ArrowUp":
        arrowUpPressed = true;
        break;
      case "ArrowDown":
        spacecraft.speed -= 0.1;
        break;
      case "Space":
        // In tutorial, prevent spacebar from triggering other events
        if (isTutorial) {
          event.stopPropagation();
        }
        fireNuke(spacecraft);
        break;
      case "KeyP":
      case "p":
        paused = !paused;
        break;
      default:
        break;
    }
  }

  function handleKeyUp(event) {
    if (event.code === "ArrowUp") {
      arrowUpPressed = false;
    }
  }

  // Add keyboard controls
  document.addEventListener("keydown", keydownListener);
  document.addEventListener("keyup", keyupListener);

  function cleanup() {
    // Remove event listeners
    document.removeEventListener("keydown", keydownListener);
    document.removeEventListener("keyup", keyupListener);
    // Cancel animation frame
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    // Clear arrays
    nukes = [];
    asteroids = [];
  }

  function generateAsteroid() {
    if (isTutorial) return;

    const currentTime = Date.now();
    if (currentTime - lastMeteorShowerTime > (levelConfig.asteroids.spawnInterval * (0.95**asteroidCounter))) {
      
      lastMeteorShowerTime = currentTime;

        var xpos = window.innerWidth;
        var ypos = window.innerHeight;
        var velocity_x = Math.random() * levelConfig.asteroids.initialVelocity.x;
        var velocity_y = Math.random() * levelConfig.asteroids.initialVelocity.y;
        
        if (Math.random() < 0.5) {
          xpos = xpos * Math.random();
        } else {
          ypos = ypos * Math.random();
        }

        const radius = (Math.random() * (levelConfig.asteroids.maxRadius - levelConfig.asteroids.minRadius)) + levelConfig.asteroids.minRadius;
        const asteroid = new Asteroid(xpos, ypos, velocity_x, velocity_y, planet, radius);
        asteroids.push(asteroid);
        asteroidCounter += 1;
    }
  }

  // Draw the planet and spacecraft
  function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "50px Arial";
    ctx.fillStyle = COLORS.whiteSmoke;
    ctx.fillText(Math.round(score / 100), 10, 80);

    // Draw atmosphere
    for (let i = 0; i < ATMOSPHERE_LAYERS; i++) {
      let radius = planet.radius + planet.atmosphere * (i / ATMOSPHERE_LAYERS);
      let opacity_for_layer = ATMOSPHERE_OPACITY * (1 - i / ATMOSPHERE_LAYERS);
      let atmosphereColor = planet.atmosphereColor.replace("{opacity}", opacity_for_layer);

      ctx.beginPath();
      ctx.arc(planet.x, planet.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = atmosphereColor;
      ctx.fill();
    }

    // Draw the planet
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
    ctx.fillStyle = planet.color

    ctx.fill();

    // Draw first continent (upper right)
    ctx.beginPath();
    ctx.moveTo(planet.x + planet.radius * 0.5, planet.y - planet.radius * 0.3);
    ctx.lineTo(planet.x + planet.radius * 0.8, planet.y - planet.radius * 0.1);
    ctx.lineTo(planet.x + planet.radius * 0.9, planet.y + planet.radius * 0.3);
    ctx.lineTo(planet.x + planet.radius * 0.7, planet.y + planet.radius * 0.5);
    ctx.lineTo(planet.x + planet.radius * 0.3, planet.y + planet.radius * 0.4);
    ctx.lineTo(planet.x + planet.radius * 0.1, planet.y - planet.radius * 0.9);
    ctx.lineTo(planet.x + planet.radius * 0.2, planet.y - planet.radius * 0.6);
    ctx.closePath();
    ctx.fillStyle = COLORS.continentGreenLight;
    ctx.fill();

    // Draw second continent (lower left)
    ctx.beginPath();
    ctx.moveTo(planet.x - planet.radius * 0.6, planet.y + planet.radius * 0.1);
    ctx.lineTo(planet.x - planet.radius * 0.9, planet.y + planet.radius * 0.2);
    ctx.lineTo(planet.x - planet.radius * 0.8, planet.y + planet.radius * 0.7);
    ctx.lineTo(planet.x - planet.radius * 0.3, planet.y + planet.radius * 0.8);
    ctx.lineTo(planet.x - planet.radius * 0.1, planet.y + planet.radius * 0.6);
    ctx.lineTo(planet.x - planet.radius * 0.3, planet.y + planet.radius * 0.5);
    
    ctx.lineTo(planet.x - planet.radius * 0.5, planet.y + planet.radius * 0.1);
    ctx.closePath();
    ctx.fillStyle = COLORS.continentGreenDark;
    ctx.fill();
    
    if (arrowUpPressed) {
      ctx.save();
      ctx.translate(spacecraft.x, spacecraft.y);
      ctx.rotate(spacecraft.angle);
      
      // Left engine flame
      ctx.beginPath();
      ctx.moveTo(-spacecraft.radius * 0.3, spacecraft.radius + 8);
      ctx.lineTo(-spacecraft.radius * 0.15, spacecraft.radius + 25);
      ctx.lineTo(-spacecraft.radius * 0.05, spacecraft.radius + 8);
      ctx.closePath();
      ctx.fillStyle = COLORS.orangeWeb;
      ctx.fill();
      
      // Right engine flame
      ctx.beginPath();
      ctx.moveTo(spacecraft.radius * 0.3, spacecraft.radius + 8);
      ctx.lineTo(spacecraft.radius * 0.15, spacecraft.radius + 25);
      ctx.lineTo(spacecraft.radius * 0.05, spacecraft.radius + 8);
      ctx.closePath();
      ctx.fillStyle = COLORS.orangeWeb;
      ctx.fill();
      
      ctx.restore();
    }

    // Draw spacecraft
    ctx.save();
    ctx.translate(spacecraft.x, spacecraft.y);
    ctx.rotate(spacecraft.angle);
    
    // Draw main spacecraft body
    ctx.beginPath();
    ctx.moveTo(0, -spacecraft.radius * 1.2);
    ctx.lineTo(-spacecraft.radius * 0.8, spacecraft.radius * 0.5);
    ctx.lineTo(-spacecraft.radius * 0.3, spacecraft.radius + 8);
    ctx.lineTo(spacecraft.radius * 0.3, spacecraft.radius + 8);
    ctx.lineTo(spacecraft.radius * 0.8, spacecraft.radius * 0.5);
    ctx.closePath();
    ctx.fillStyle = COLORS.vermilion;
    ctx.fill();
    
    // Draw cockpit/nose cone
    ctx.beginPath();
    ctx.moveTo(0, -spacecraft.radius * 1.2);
    ctx.lineTo(-spacecraft.radius * 0.4, -spacecraft.radius * 0.2);
    ctx.lineTo(spacecraft.radius * 0.4, -spacecraft.radius * 0.2);
    ctx.closePath();
    ctx.fillStyle = COLORS.whiteSmoke;
    ctx.fill();
    
    // Draw wing details
    ctx.beginPath();
    ctx.moveTo(-spacecraft.radius * 0.8, spacecraft.radius * 0.5);
    ctx.lineTo(-spacecraft.radius * 1.1, spacecraft.radius * 0.8);
    ctx.lineTo(-spacecraft.radius * 0.6, spacecraft.radius * 0.9);
    ctx.closePath();
    ctx.fillStyle = COLORS.battleshipGray;
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(spacecraft.radius * 0.8, spacecraft.radius * 0.5);
    ctx.lineTo(spacecraft.radius * 1.1, spacecraft.radius * 0.8);
    ctx.lineTo(spacecraft.radius * 0.6, spacecraft.radius * 0.9);
    ctx.closePath();
    ctx.fillStyle = COLORS.battleshipGray;
    ctx.fill();
    
    // Draw engine exhaust ports
    ctx.beginPath();
    ctx.arc(-spacecraft.radius * 0.2, spacecraft.radius + 6, 2, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.oxfordBlue;
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(spacecraft.radius * 0.2, spacecraft.radius + 6, 2, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.oxfordBlue;
    ctx.fill();
    
    ctx.restore();

    // Draw nukes
    for (let i = 0; i < nukes.length; i++) {
      nukes[i].draw(ctx);
      if (nukes[i].activated) {
        nukes[i].drawBoom(ctx);
      }
    }

    // Draw asteroids
    for (let i = 0; i < asteroids.length; i++) {
      asteroids[i].draw(ctx);
    }
  }

  // Spacecraft outside bounds detection function
  function isSpacecraftOutsideBounds(spacecraft) {
    return spacecraft.x < 0 || spacecraft.x > canvas.width || spacecraft.y < 0 || spacecraft.y > canvas.height;
  }

  // Update the spacecraft's position and momentum
  function update() {
    score += 1;
    if (arrowUpPressed) {
      spacecraft.velocity_x += Math.sin(spacecraft.angle) * 0.003;
      spacecraft.velocity_y -= Math.cos(spacecraft.angle) * 0.003;
    }

    spacecraft.x += spacecraft.velocity_x;
    spacecraft.y += spacecraft.velocity_y;
    spacecraft.angle += spacecraft.angular_velocity;

    // Damping
    spacecraft.angular_velocity *= 0.995;

    // Apply gravity to spacecraft
    let newVelocities = applyGravity(planet, spacecraft.x, spacecraft.y, spacecraft.velocity_x, spacecraft.velocity_y);
    spacecraft.velocity_x = newVelocities.velocity_x;
    spacecraft.velocity_y = newVelocities.velocity_y;

    // Apply atmospheric drag to spacecraft
    const drag_x = atmosphericDrag(spacecraft.x, spacecraft.y, planet);
    const drag_y = atmosphericDrag(spacecraft.x, spacecraft.y, planet);

    spacecraft.velocity_x *= 1 - (drag_x * Math.abs(spacecraft.velocity_x));
    spacecraft.velocity_y *= 1 - (drag_y * Math.abs(spacecraft.velocity_y));

    // Check for spacecraft collision with planet
    if (areCirclesColliding(planet, spacecraft) || isSpacecraftOutsideBounds(spacecraft)) {
      spacecraft.x = planet.x;
      spacecraft.y = planet.y + 200;
      spacecraft.velocity_x = 1.3;
      spacecraft.velocity_y = 0;
      if (!isTutorial) {
        gameOver = true;
      } else {
        // In tutorial mode, just reset the spacecraft
        resetSpacecraft();
      }
    }

    // Update nukes
    for (let i = 0; i < nukes.length; i++) {
      nukes[i].update();

      if (nukes[i].fuse <= 0) {
        nukes[i].activated = true;
      }

      if (areCirclesColliding(planet, nukes[i])) {
        nukes.splice(i, 1);
        i--;
        continue;
      }

      for (let j = 0; j < asteroids.length; j++) {
        let asteroid = asteroids[j];

        if (areCirclesClose(nukes[i], asteroid, 30)) {
          // Create an explosion
          nukes[i].activated = true;
          score += asteroid.radius * 10;
          i--;
          break;
        }
      }

      // If the nuke is activated, remove asteroids within the blast radius
      if (nukes[i] === undefined || nukes[i].activated === undefined) {
        continue;
      }
      if (nukes[i].activated) {
        for (let j = 0; j < asteroids.length; j++) {
          let asteroid = asteroids[j];

          if (areCirclesClose(nukes[i], asteroid, nukes[i].boom_radius)) {
            asteroids.splice(j, 1);
            j--;
          }
        }
        if (nukes[i].boom_radius <= 0) {
          nukes.splice(i, 1);
          i--;
        } else {
          nukes[i].boom_radius--;
        }
      }
    }

    // Apply gravitational attraction between asteroids
    for (let i = 0; i < asteroids.length; i++) {
      let asteroid1 = asteroids[i];

      for (let j = i + 1; j < asteroids.length; j++) {
        let asteroid2 = asteroids[j];

        let dx = asteroid2.x - asteroid1.x;
        let dy = asteroid2.y - asteroid1.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Gravitational force magnitude
        const gravitationalConstant = 0.1; // Adjust this constant as needed
        const force = (gravitationalConstant * asteroid1.mass * asteroid2.mass) / (distance * distance);

        // Directional force components
        const force_x = (force * dx) / distance;
        const force_y = (force * dy) / distance;

        // Update velocities due to gravitational attraction
        asteroid1.velocity_x += force_x / asteroid1.mass;
        asteroid1.velocity_y += force_y / asteroid1.mass;

        asteroid2.velocity_x -= force_x / asteroid2.mass;
        asteroid2.velocity_y -= force_y / asteroid2.mass;

        // Combine if collision
        if (distance < asteroid1.radius + asteroid2.radius) {
          // Calculate new velocities
          let new_velocity_x = (asteroid1.velocity_x * asteroid1.mass + asteroid2.velocity_x * asteroid2.mass) / (asteroid1.mass + asteroid2.mass);
          let new_velocity_y = (asteroid1.velocity_y * asteroid1.mass + asteroid2.velocity_y * asteroid2.mass) / (asteroid1.mass + asteroid2.mass);

          asteroid1.x = (asteroid1.x * asteroid1.mass + asteroid2.x * asteroid2.mass) / (asteroid1.mass + asteroid2.mass);
          asteroid1.y = (asteroid1.y * asteroid1.mass + asteroid2.y * asteroid2.mass) / (asteroid1.mass + asteroid2.mass);
          asteroid1.velocity_x = new_velocity_x;
          asteroid1.velocity_y = new_velocity_y;

          asteroid1.mass += asteroid2.mass;
          asteroids.splice(j, 1);
        }
      }

      asteroid1.update();

      // Apply gravity from planet
      let asteroidVelocities = applyGravity(planet, asteroid1.x, asteroid1.y, asteroid1.velocity_x, asteroid1.velocity_y);
      asteroid1.velocity_x = asteroidVelocities.velocity_x;
      asteroid1.velocity_y = asteroidVelocities.velocity_y;

      // Apply drag to asteroid
      const asteroid_drag_x = atmosphericDrag(asteroid1.x, asteroid1.y, planet);
      const asteroid_drag_y = atmosphericDrag(asteroid1.x, asteroid1.y, planet);

      asteroid1.velocity_x *= 1 - (asteroid_drag_x * Math.abs(asteroid1.velocity_x));
      asteroid1.velocity_y *= 1 - (asteroid_drag_y * Math.abs(asteroid1.velocity_y));

      // Check for asteroid collision with planet
      if (areCirclesColliding(planet, asteroid1)) {
        asteroids.splice(i, 1);
        i--;
        if (!isTutorial) {
          gameOver = true;
        }
      }
    }
  }

  // Game loop
  function loop() {
    if (!gameOver) {
      if (!paused) {
        generateAsteroid();
        update();
      }
      draw();
      
      // Draw pause indicator
      if (paused) {
        ctx.font = "40px Arial";
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.textAlign = "center";
        ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
        ctx.fillText("Press P to resume", canvas.width / 2, canvas.height / 2 + 50);
        ctx.textAlign = "left"; // Reset text alignment
      }
      
      animationFrameId = requestAnimationFrame(loop);
    } else {
      if (isTutorial) {
        resetGame();
        loop(); // Restart the game loop
      } else {
        // In normal game mode, navigate to game over
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