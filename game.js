import { acceleration, applyGravity } from "./physics.js";
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


// Set up the planet
const planet = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 50,
  mass: 10,
  atmosphere: 75
};

// Set up the spacecraft
const spacecraft = {
    x: planet.x + 100, 
    y: planet.y + 100, 
    radius: 10, 
    velocity_x: 1,
    velocity_y: 0,
    angle: 0,
    angularVelocity: 0, // Add angular velocity property

  };


let nukes = [];

function fireNuke(spacecraft) {
  console.log("asteroids")
  const nuke = new Nuke(spacecraft.x, spacecraft.y, (Math.sin(spacecraft.angle) * 0.9) + spacecraft.velocity_x, (-Math.cos(spacecraft.angle) * 0.9) + spacecraft.velocity_y, spacecraft.angle, 0, planet);
  nukes.push(nuke);
  console.log(nuke)
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
      1500 * (0.6 * Math.random() + 0.4), 
      1500 * (0.6 * Math.random() + 0.4), 
      0.85,
      -0.25,
      planet,
      10
    );
    
    asteroids.push(asteroid);

  }

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    
  
    const atmosphereLayers = 10;  // Number of layers to create the gradient effect
    for (let i = 0; i < atmosphereLayers; i++) {
      let radius = planet.radius + planet.atmosphere * (i / atmosphereLayers); // Gradually increase the radius
      let opacity = 0.4 * (1 - i / atmosphereLayers); // Gradually decrease the opacity

      ctx.beginPath();
      ctx.arc(planet.x, planet.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(135, 206, 235, ${opacity})`; // Use the calculated opacity
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

    console.log(asteroids)
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
  console.log('distance', distance)
  console.log('planet', planet)

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
    // Update the spacecraft's angle based on its angular velocity
    spacecraft.angle += spacecraft.angularVelocity;

    // Damping
    spacecraft.angularVelocity *= 0.995;

    let newVelocities = applyGravity(planet, spacecraft.x, spacecraft.y, spacecraft.velocity_x, spacecraft.velocity_y);
    spacecraft.velocity_x = newVelocities.velocity_x;
    spacecraft.velocity_y = newVelocities.velocity_y;
    

    const drag_x = atmosphericDrag(spacecraft.x, spacecraft.x, planet);
    const drag_y = atmosphericDrag(spacecraft.x, spacecraft.y, planet);

    console.log("drag", drag_x);

    spacecraft.velocity_x *= 1 - (drag_x * spacecraft.velocity_x**2);
    spacecraft.velocity_y *= 1 - (drag_y * spacecraft.velocity_y**2);

    if (areCirclesColliding(planet, spacecraft) || isSpacecraftOutsideBounds(spacecraft)) {

        // Reset the spacecraft position or take other desired action
        spacecraft.x = planet.x;
        spacecraft.y = planet.y + 200;

        // Reset the spacecraft velocity
        spacecraft.velocity_x = 1.3;
        spacecraft.velocity_y = 0;
    }

    // Update nukes
    for (let i = 0; i < nukes.length; i++) {
      let nuke = nukes[i];
      nuke.update();

      // Check for collision with planet
      if (areCirclesColliding(planet, nuke)) {
        nukes.splice(i, 1);
        i--;
        continue; // Skip further checks if the nuke collided with the planet
      }

      // Check for collision with asteroids
      for (let j = 0; j < asteroids.length; j++) {
        let asteroid = asteroids[j];
        
        if (areCirclesColliding(nuke, asteroid)) {
          // Remove both the nuke and the asteroid, simulating an explosion
          nukes.splice(i, 1);
          asteroids.splice(j, 1);
          
          i--; // Adjust the index after removal of the nuke
          break; // Stop checking other asteroids for this nuke, as it has exploded
        }
      }
    }


    // Update asteroids
    for (let i = 0; i < asteroids.length; i++) {
      let asteroid = asteroids[i];

      asteroid.update();

      // Apply gravity to asteroids
      let asteroidVelocities = applyGravity(planet, asteroid.x, asteroid.y, asteroid.velocity_x, asteroid.velocity_y);
      asteroid.velocity_x = asteroidVelocities.velocity_x;
      asteroid.velocity_y = asteroidVelocities.velocity_y;

      // Apply drag to asteroids
      const asteroid_drag_x = atmosphericDrag(asteroid.x, asteroid.y, planet);
      const asteroid_drag_y = atmosphericDrag(asteroid.x, asteroid.y, planet);

      asteroid.velocity_x *= 1 - (asteroid_drag_x * Math.abs(asteroid.velocity_x));
      asteroid.velocity_y *= 1 - (asteroid_drag_y * Math.abs(asteroid.velocity_y));

      // Check for asteroid collision with planet
      if (areCirclesColliding(planet, asteroid)) {
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
