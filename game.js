import { acceleration, applyGravity } from "./physics.js";
import { PLANET, SPACECRAFT, NUKES, ASTEROIDS, ATMOSPHERE_LAYERS, ATMOSPHERE_OPACITY } from './constants.js';

import { Nuke, Asteroid } from "./models.js"
// Initialize canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

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
  angularVelocity: SPACECRAFT.INITIAL_ANGULAR_VELOCITY,
};


let nukes = [];

function fireNuke(spacecraft) {
  console.log("asteroids")
  const nuke = new Nuke(spacecraft.x, spacecraft.y, (Math.sin(spacecraft.angle) * 1.5) + spacecraft.velocity_x, (-Math.cos(spacecraft.angle) * 1.5) + spacecraft.velocity_y, spacecraft.angle, 0, planet);
  nukes.push(nuke);

}


let asteroids = [];


let arrowUpPressed = false;
let spacebarPressed = false;
// Add keyboard controls
document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "ArrowLeft":
      spacecraft.angularVelocity -= 0.005; // Change angular velocity instead of angle
      break;
    case "ArrowRight":
      spacecraft.angularVelocity += 0.005; // Change angular velocity instead of angle
      break;
    case "ArrowUp":
      console.log("arrow up")
      arrowUpPressed = true;
      spacecraft.velocity_x += Math.sin(spacecraft.angle)*0.1;
      spacecraft.velocity_y -= Math.cos(spacecraft.angle)*0.1;
      break;
    case "ArrowDown":
      spacecraft.speed -= 0.1;
      break;
    case "Space":
      fireNuke(spacecraft);
      break;
  }
});

document.addEventListener("keyup", (event) => {
    switch (event.code) {
      case "ArrowUp":
        arrowUpPressed = false;
        break;
    }
  });

// Draw the planet and spacecraft
function draw() {

  // Generate a meteor shower
  if (Math.random() <= 0.005) {
    

    // const asteroid =  new Asteroid(900, 900, 0.85, -0.25, planet, 10);
    const asteroid = new Asteroid(
      1100 * (0.6 * Math.random() + 0.4), 
      1100 * (0.6 * Math.random() + 0.4), 
      0.0085,
      -0.0025,
      planet,
      (Math.random() * 15) + 2
    );
    
    asteroids.push(asteroid);

  }

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    
  
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
    }

    // draw asteroids
    for (let i = 0; i < asteroids.length; i++) {
      asteroids[i].draw(ctx);

    }
    
  }
  

// Collision detection function
function areCirclesColliding(circle1, circle2) {
    const dx = circle1.x - circle2.x;
    const dy = circle1.y - circle2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const sumOfRadii = circle1.radius + circle2.radius;

    return distance <= sumOfRadii;
}

// Spacecraft outside bounds detection function
function isSpacecraftOutsideBounds(spacecraft) {
    return spacecraft.x < 0 || spacecraft.x > canvas.width || spacecraft.y < 0 || spacecraft.y > canvas.height;
}

function inAtmosphere(distance, planet) {


  return distance < planet.radius + planet.atmosphere;
}

function atmosphericDrag(x,y, planet) {

  const dx = x - planet.x;
  const dy = y - planet.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (inAtmosphere(distance, planet)) {
    console.log("in atmosphere")
    //calculate atmispheric density
    const atmosphereDensity = 1 - (distance - planet.radius) / planet.atmosphere;

    const dragfactor = atmosphereDensity * 0.0002;

    return dragfactor;
    
  } else {
    return 0;
  }
}



// Update the spacecraft's position and momentum
function update() {
  spacecraft.x += spacecraft.velocity_x;
  spacecraft.y += spacecraft.velocity_y;  
  spacecraft.angle += spacecraft.angularVelocity;

  // Damping
  spacecraft.angularVelocity *= 0.995;

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
  }

  // Update nukes
  for (let i = 0; i < nukes.length; i++) {
      let nuke = nukes[i];
      nuke.update();

      if (areCirclesColliding(planet, nuke)) {
          nukes.splice(i, 1);
          i--;
          continue;
      }

      for (let j = 0; j < asteroids.length; j++) {
          let asteroid = asteroids[j];

          if (areCirclesColliding(nuke, asteroid)) {
              nukes.splice(i, 1);
              asteroids.splice(j, 1);
              i--;
              break;
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

          // Avoid division by zero or too strong force if asteroids are too close
          if (distance < asteroid1.radius + asteroid2.radius) {
              distance = asteroid1.radius + asteroid2.radius;
          }

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
      }
  }
}
  

// Game loop
function loop() {

  draw();
  update();
  requestAnimationFrame(loop);
}

// Start the game loop
loop();
