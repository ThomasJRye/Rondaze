import { NUKES, ASTEROIDS, DAMPING_FACTOR } from './constants.js';
import { applyGravity } from './physics.js';

export function Nuke(x, y, velocity_x, velocity_y, angle, angularVelocity, planet) {
    this.x = x;
    this.y = y;
    this.velocity_x = velocity_x;
    this.velocity_y = velocity_y;
    this.angle = angle;
    this.angular_velocity = angularVelocity;
    this.radius = NUKES.RADIUS;
    this.fuse = NUKES.FUSE;
    this.planet = planet;
    this.boom_radius = NUKES.BOOM_RADIUS;
    this.activated = false;

  
    this.update = function() {
        this.x += this.velocity_x;
        this.y += this.velocity_y;
    
        let newVelocities = applyGravity(planet, this.x, this.y, this.velocity_x, this.velocity_y);
        this.velocity_x = newVelocities.velocity_x;
        this.velocity_y = newVelocities.velocity_y;

        this.angle += this.angularVelocity;
        this.angularVelocity *= DAMPING_FACTOR;
        this.fuse -= 1;
    };

    this.draw = function(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = NUKES.COLOR;
        ctx.fill();
        ctx.restore();
    };

    this.drawBoom = function(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.arc(0, 0, this.boom_radius, 0, Math.PI * 2);
        ctx.fillStyle = NUKES.BOOM_COLOR;
        ctx.fill();
        ctx.restore();
    }

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
    this.mass = radius * radius * ASTEROIDS.MASS;
    this.planet = planet;

    this.update = function() {
        this.x += this.velocity_x;
        this.y += this.velocity_y;
    };

    this.draw = function(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = ASTEROIDS.COLOR;
        ctx.fill();
        ctx.restore();
    };

    this.isOutOfBounds = function(canvasWidth, canvasHeight) {
        return this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight;
    };
}