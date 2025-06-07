import { applyGravity, atmosphericDrag, areCirclesClose, areCirclesColliding } from "./physics.js";
import { Nuke, Asteroid } from "./models.js";

export function createGameObjects(planet, levelConfig) {
  let nukes = [];
  let asteroids = [];
  let asteroidCounter = 0;
  let lastMeteorShowerTime = 0;

  function generateAsteroid(isTutorial) {
    if (isTutorial) return;

    const currentTime = Date.now();
    if (currentTime - lastMeteorShowerTime > (levelConfig.asteroids.spawnInterval * (0.95**asteroidCounter))) {
      lastMeteorShowerTime = currentTime;

      // Determine number of asteroids to spawn (2, 3, or 3)
      const clusterRoll = Math.random();
      const numAsteroids = clusterRoll < 1/9 ? 3: clusterRoll < 1/3 ? 2 : 1;

      // Base position for the first asteroid
      var xpos = window.innerWidth;
      var ypos = window.innerHeight;
      
      if (Math.random() < 0.5) {
        xpos = xpos * Math.random();
      } else {
        ypos = ypos * Math.random();
      }

      // Spawn the cluster of asteroids
      for (let i = 0; i < numAsteroids; i++) {
        // Add slight offset for additional asteroids in the cluster
        const offsetX = i > 0 ? (Math.random() - 0.5) * 300 : 0;
        const offsetY = i > 0 ? (Math.random() - 0.5) * 300 : 0;

        const velocity_x = Math.random() * levelConfig.asteroids.initialVelocity.x;
        const velocity_y = Math.random() * levelConfig.asteroids.initialVelocity.y;
        const radius = (Math.random() * (levelConfig.asteroids.maxRadius - levelConfig.asteroids.minRadius)) + levelConfig.asteroids.minRadius;
        
        const asteroid = new Asteroid(
          xpos + offsetX, 
          ypos + offsetY, 
          velocity_x, 
          velocity_y, 
          planet, 
          radius
        );
        asteroids.push(asteroid);
      }
      
      asteroidCounter += numAsteroids;
    }
  }

  function fireNuke(spacecraft) {
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

  function updateObjects(spacecraft, isTutorial, score, arrowUpPressed) {
    // Update spacecraft
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
          nukes[i].activated = true;
          score += asteroid.radius * 10;
          i--;
          break;
        }
      }

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

    // Update asteroids
    for (let i = 0; i < asteroids.length; i++) {
      let asteroid1 = asteroids[i];

      for (let j = i + 1; j < asteroids.length; j++) {
        let asteroid2 = asteroids[j];

        let dx = asteroid2.x - asteroid1.x;
        let dy = asteroid2.y - asteroid1.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Gravitational force magnitude
        const gravitationalConstant = 0.1;
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
          // Calculate new velocities based on mass-weighted average
          let new_velocity_x = (asteroid1.velocity_x * asteroid1.mass + asteroid2.velocity_x * asteroid2.mass) / (asteroid1.mass + asteroid2.mass);
          let new_velocity_y = (asteroid1.velocity_y * asteroid1.mass + asteroid2.velocity_y * asteroid2.mass) / (asteroid1.mass + asteroid2.mass);

          // Calculate new position based on mass-weighted average
          asteroid1.x = (asteroid1.x * asteroid1.mass + asteroid2.x * asteroid2.mass) / (asteroid1.mass + asteroid2.mass);
          asteroid1.y = (asteroid1.y * asteroid1.mass + asteroid2.y * asteroid2.mass) / (asteroid1.mass + asteroid2.mass);
          asteroid1.velocity_x = new_velocity_x;
          asteroid1.velocity_y = new_velocity_y;

          // Combine masses and calculate new radius using square root of sum of squares
          asteroid1.mass += asteroid2.mass;
          asteroid1.radius = Math.sqrt(asteroid1.radius * asteroid1.radius + asteroid2.radius * asteroid2.radius);
          
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
    }
  }

  return {
    nukes,
    asteroids,
    generateAsteroid,
    fireNuke,
    updateObjects
  };
} 