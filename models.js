import { acceleration, applyGravity } from "./physics.js";

export function Nuke(x, y, velocity_x, velocity_y, angle, angularVelocity, planet) {
    this.x = x;
    this.y = y;
    this.velocity_x = velocity_x;
    this.velocity_y = velocity_y;
    this.angle = angle;
    this.angularVelocity = angularVelocity;
    this.radius = 10;
    this.planet = planet;
  
    this.update = function() {
        // Update position based on velocity
        this.x += this.velocity_x;
        this.y += this.velocity_y;
    
        let newVelocities = applyGravity(planet, this.x, this.y, this.velocity_x, this.velocity_y);
        this.velocity_x = newVelocities.velocity_x;
        this.velocity_y = newVelocities.velocity_y;

        // Update the spacecraft's angle based on its angular velocity
        this.angle += this.angularVelocity;
    
        // Optional: apply a damping factor to gradually reduce the angular velocity
        this.angularVelocity *= 0.99;
    };

    this.draw = function(ctx) {
        // Draw the nuke on the canvas
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        
        ctx.fillStyle = "#4B5320";
        ctx.fill();
        ctx.restore();
    };
  
    this.isOutOfBounds = function(canvasWidth, canvasHeight) {
        return this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight;
    };
  
  }

export function Asteroid(x, y, velocity_x, velocity_y, planet, radius) {
    this.x = x;
    this.y = y;
    this.velocity_x = velocity_x;
    this.velocity_y = velocity_y;
    this.radius = radius;
    this.planet = planet;
  
    this.update = function() {
        // Update position based on velocity
        this.x += this.velocity_x;
        this.y += this.velocity_y;
    
        let newVelocities = applyGravity(planet, this.x, this.y, this.velocity_x, this.velocity_y);
        this.velocity_x = newVelocities.velocity_x;
        this.velocity_y = newVelocities.velocity_y;


    };

    this.draw = function(ctx) {

        // Draw the nuke on the canvas
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        
        ctx.fillStyle = "#333333";
        ctx.fill();
        ctx.restore();
    };
  
    this.isOutOfBounds = function(canvasWidth, canvasHeight) {
        return this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight;
    };
  
  }