import { acceleration } from "./physics.js";

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
  
      // Apply gravity
      let radius_x = Math.abs(this.x - planet.x);
      let radius_y = Math.abs(this.y - planet.y);
      
      let radius = Math.sqrt(radius_x*radius_x + radius_y*radius_y);
      
      let gravity = acceleration(radius, planet.mass);
      
      let angle = Math.atan2(radius_y, radius_x);
      
      let acceleration_x = gravity*Math.cos(angle);
      let acceleration_y = gravity*Math.sin(angle);
  
      // Update the spacecraft's angle based on its angular velocity
      this.angle += this.angularVelocity;
  
      // Optional: apply a damping factor to gradually reduce the angular velocity
      this.angularVelocity *= 0.99;
  
      if (this.x > this.planet.x) {
          acceleration_x = -acceleration_x;
      }
      if (this.y > this.planet.y) {
          acceleration_y = -acceleration_y;
      }
      
      this.velocity_x += acceleration_x;
      this.velocity_y += acceleration_y;

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