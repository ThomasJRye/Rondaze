import { applyGravity, atmosphericDrag, areCirclesClose, areCirclesColliding } from "./physics.js";
import { PLANET, SPACECRAFT, NUKES, ATMOSPHERE_LAYERS, ATMOSPHERE_OPACITY } from './constants.js';

import { Nuke, Asteroid } from "./models.js"
// Initialize canvas

export function startGame(canvas, ctx) {

  const planet = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: PLANET.RADIUS,
    mass: PLANET.MASS,
    atmosphere: PLANET.ATMOSPHERE,
  };

  // Set up the spacecraft
  const spacecraft = {
    x: planet.x + SPACECRAFT.INITIAL_X_OFFSET,
    y: planet.y + SPACECRAFT.INITIAL_Y_OFFSET,
    radius: SPACECRAFT.RADIUS,
    velocity_x: SPACECRAFT.INITIAL_VELOCITY_X,
    velocity_y: SPACECRAFT.INITIAL_VELOCITY_Y,
    angle: SPACECRAFT.INITIAL_ANGLE,
    angular_velocity: SPACECRAFT.INITIAL_ANGULAR_VELOCITY,
  };

  let score = 0;
  let gameOver = false;
  let nukes = [];

  function fireNuke(spacecraft) {
    const nuke = new Nuke(spacecraft.x, spacecraft.y, (Math.sin(spacecraft.angle) * 1.5) + spacecraft.velocity_x, (-Math.cos(spacecraft.angle) * 1.5) + spacecraft.velocity_y, spacecraft.angle, 0, planet);
    console.log(nuke)
    nukes.push(nuke);

  }


  let asteroids = [];


  let arrowUpPressed = false;

  // Add keyboard controls
  document.addEventListener("keydown", (event) => {
    switch (event.code) {
      case "ArrowLeft":
        spacecraft.angular_velocity -= 0.01; // Change angular velocity instead of angle
        break;
      case "ArrowRight":
        spacecraft.angular_velocity += 0.01; // Change angular velocity instead of angle
        break;
      case "ArrowUp":
        console.log("arrow up")
        arrowUpPressed = true;
        break;
      case "ArrowDown":
        spacecraft.speed -= 0.1;
        break;
      case "Space":
        fireNuke(spacecraft);
        break;
      default:
        break;
    }
  });

  document.addEventListener("keyup", (event) => {
      switch (event.code) {
        case "ArrowUp":
          arrowUpPressed = false;
          break;
        default:
          break;
      }
    });

  // Draw the planet and spacecraft
  function draw() {


    // Generate a meteor shower
    if (Math.random() <= 0.005) {
      let xSign = 1;
      let ySign = 1;
      let vxSign = 1;
      let vySign = 1;
      if (Math.random() <= 0.5) {
        xSign = -1;
      }
      if (Math.random() <= 0.5) {
        ySign = -1;
      }
      if (Math.random() <= 0.5) {
        vxSign = -1;
      }
      if (Math.random() <= 0.5) {
        vySign = -1;
      }


      // const asteroid =  new Asteroid(900, 900, 0.85, -0.25, planet, 10);
      const asteroid = new Asteroid(
        
        xSign * (window.innerWidth + (5 * Math.random() + 0.4)), 
        ySign * (window.innerHeight + (5 * Math.random() + 0.4)), 
        vxSign * Math.random() * 0.005,
        vySign * Math.random() * 0.0025,
        planet,
        (Math.random() * 15) + 2
      );
      
      asteroids.push(asteroid);

    }

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    
      ctx.font = "50px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(Math.round(score / 100),10,80);
    
      for (let i = 0; i < ATMOSPHERE_LAYERS; i++) {
        let radius = planet.radius + planet.atmosphere * (i / ATMOSPHERE_LAYERS); // Gradually increase the radius
        let opacity_for_layer = ATMOSPHERE_OPACITY * (1 - i / ATMOSPHERE_LAYERS); // Gradually decrease the opacity

        ctx.beginPath();
        ctx.arc(planet.x, planet.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(135, 206, 235, ${opacity_for_layer})`; // Use the calculated opacity
        ctx.fill();
      }
      
      // Draw the planet
      ctx.beginPath();
      ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
      ctx.fillStyle = "blue";
      ctx.fill();

      if (arrowUpPressed) {
          ctx.save(); 
          ctx.translate(spacecraft.x, spacecraft.y);
          ctx.rotate(spacecraft.angle);
          ctx.beginPath();
          ctx.moveTo(-spacecraft.radius, spacecraft.radius + 10);
          ctx.lineTo(0, spacecraft.radius + 30);
          ctx.lineTo(spacecraft.radius, spacecraft.radius + 10);
          ctx.closePath();
          ctx.fillStyle = "orange";
          ctx.fill();
          ctx.restore();
        }

      // draw spacecraft
      ctx.save(); // Save the current state of the canvas 
      ctx.translate(spacecraft.x, spacecraft.y); 
      // Move the origin to the center of the spacecraft 
      ctx.rotate(spacecraft.angle); 
      // Rotate the canvas by the angle 
      ctx.beginPath(); 
      ctx.moveTo(0, -spacecraft.radius); 
      // Move to the top vertex (relative to the origin) 
      ctx.lineTo(-spacecraft.radius, spacecraft.radius+10); 
      // Draw a line to the bottom left vertex 
      ctx.lineTo(spacecraft.radius, spacecraft.radius+10); 
      // Draw a line to the bottom right vertex 
      ctx.closePath(); 
      // Close the path 
      ctx.fillStyle = "maroon"; // Set fillStyle to maroon
      // Set fillStyle to black 
      ctx.fill(); // Fill the triangle 
      ctx.restore(); // Restore the previous state of the canvas

      // draw nukes
      for ( let i = 0; i < nukes.length; i++) {
        nukes[i].draw(ctx);
        
        if (nukes[i].activated) {
          nukes[i].drawBoom(ctx);
        }
      
      }

      // draw asteroids
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
    console.log("x: ", spacecraft.velocity_x, " y: ", spacecraft.velocity_y)
    if (arrowUpPressed) {
      
      spacecraft.velocity_x += Math.sin(spacecraft.angle)*0.003;
      spacecraft.velocity_y -= Math.cos(spacecraft.angle)*0.003;
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

        gameOver = true;
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

        // if the nuke is activated, remove asteroids within the blast radius
        if (nukes[i] == undefined || nukes[i].activated == undefined) {
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

              asteroid1.mass += asteroid2.mass
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
            gameOver = true;
        }
    }
  }
    

  // Game loop
  function loop() {

    if (!gameOver) {
      draw();
      update();
      requestAnimationFrame(loop);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "80px Arial";
      ctx.fillStyle = "red";
      ctx.fillText("Game Over", canvas.width / 2 - 200, canvas.height / 2);
      ctx.font = "50px Arial";
      ctx.fillText("Score: " + Math.round(score / 100), canvas.width / 2 - 100, canvas.height / 2 + 60);
    }


  }

  // Start the game loop
  loop();
}