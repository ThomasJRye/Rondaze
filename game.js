// Initialize canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set up the planet
const planet = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 30,
  mass: 10,
};

// Set up the spacecraft
const spacecraft = {
    x: planet.x + 100, // Start at periapsis
    y: planet.y + 100, // Start at periapsis
    radius: 20, // Increase the radius to 20 pixels
    velocity_x: 1,
    velocity_y: 0,
    angle: 0,
  };

// Add keyboard controls
document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "ArrowLeft":
      spacecraft.angle -= 0.1;
      break;
    case "ArrowRight":
      spacecraft.angle += 0.1;
      break;
    case "ArrowUp":
        spacecraft.velocity_x += Math.sin(spacecraft.angle)*0.1;
        spacecraft.velocity_y -= Math.cos(spacecraft.angle)*0.1;
      break;
    case "ArrowDown":
      spacecraft.speed -= 0.1;
      break;
  }
});

// Draw the planet and spacecraft
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw the planet
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
  
    // // Draw the spacecraft, it should be a black tall triange
    // ctx.beginPath();
    // ctx.
    // ctx.arc(spacecraft.x, spacecraft.y, spacecraft.radius, 0, Math.PI * 2);
    // ctx.fillStyle = "black"; // Set fillStyle to black
    // ctx.fill();

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
    ctx.fillStyle = "black"; // Set fillStyle to black
    // Set fillStyle to black 
    ctx.fill(); // Fill the triangle 
    ctx.restore(); // Restore the previous state of the canvas
  }
  

// Update the spacecraft's position and momentum
function update() {
    spacecraft.x += spacecraft.velocity_x;
    spacecraft.y += spacecraft.velocity_y;
    
    let radius_x = Math.abs(spacecraft.x - planet.x);
    let radius_y = Math.abs(spacecraft.y - planet.y);
    
    let radius = Math.sqrt(radius_x*radius_x + radius_y*radius_y);
    
    let gravity = acceleration(radius, planet.mass);
    
    let angle = Math.atan2(radius_y, radius_x);
    let acceleration_x = gravity*Math.cos(angle);
    let acceleration_y = gravity*Math.sin(angle);

    if (spacecraft.x > planet.x) {
        acceleration_x = -acceleration_x;
    }
    if (spacecraft.y > planet.y) {
        acceleration_y = -acceleration_y;
    }
    
    spacecraft.velocity_x += acceleration_x;
    spacecraft.velocity_y += acceleration_y;
    
    // console.log("x: " + spacecraft.velocity_x)
    // console.log("y: " + spacecraft.velocity_y)


  }
  
function acceleration(radius, planet_mass) {
    const gravity = 10;
    if (radius < 0) {
        // console.log("negative")
        return -gravity*(planet_mass/(radius*radius))
    } else {
        // console.log("positive")
        // console.log(radius)
        // console.log(gravity*(planet_mass/(radius*radius)))
        return gravity*(planet_mass/(radius*radius))
    }

  }


// Game loop
function loop() {
    console.log(Math.cos(spacecraft.angle))
    console.log(Math.sin(spacecraft.angle))
  draw();
  update();
  requestAnimationFrame(loop);
}

// Start the game loop
loop();
