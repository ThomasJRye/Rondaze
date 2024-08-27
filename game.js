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
    radius: 20, // Increase the radius to 20 pixels
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
    // 3% chance of executing this block
    const asteroid =  new Asteroid(canvas.width*0.75, canvas.width, 0.4, -0.25, planet, 10);
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

function inAtmosphere(x, y, planet) {
    const dx = x - planet.x;
    const dy = y - planet.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < planet.radius + planet.atmosphere;
}

// Update the spacecraft's position and momentum
function update() {
    spacecraft.x += spacecraft.velocity_x;
    spacecraft.y += spacecraft.velocity_y;  
    // Update the spacecraft's angle based on its angular velocity
    spacecraft.angle += spacecraft.angularVelocity;

    // Damping
    spacecraft.angularVelocity *= 0.99;

    let newVelocities = applyGravity(planet, spacecraft.x, spacecraft.y, spacecraft.velocity_x, spacecraft.velocity_y);
    spacecraft.velocity_x = newVelocities.velocity_x;
    spacecraft.velocity_y = newVelocities.velocity_y;
    
    if (areCirclesColliding(planet, spacecraft) || isSpacecraftOutsideBounds(spacecraft)) {

        // Reset the spacecraft position or take other desired action
        spacecraft.x = planet.x;
        spacecraft.y = planet.y + 200;

        // Reset the spacecraft velocity
        spacecraft.velocity_x = 1.3;
        spacecraft.velocity_y = 0;
    }

    for (let i = 0; i < nukes.length; i++) {

      nukes[i].update();

      if (areCirclesColliding(planet, nukes[i])) {
        nukes.splice(i, 1); // Remove the nuke upon collision
        i--; // Adjust the index after removal
      }
    }

    for (let i = 0; i < asteroids.length; i++) {

      asteroids[i].update();

      if (areCirclesColliding(planet, asteroids[i])) {
        asteroids.splice(i, 1); // Remove the nuke upon collision
        i--; // Adjust the index after removal
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
