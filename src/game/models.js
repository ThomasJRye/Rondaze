import { applyGravity } from './physics.js';
import { ASTEROIDS, NUKES, DAMPING_FACTOR } from './constants.js';

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
    this.mass = radius * radius * (ASTEROIDS ? ASTEROIDS.MASS : 1);
    this.planet = planet;
    this.angle = 0;
    this.angularVelocity = (Math.random() - 0.5) * 0.1; // Random angular velocity
    const DAMPING_FACTOR = 0.995;
    
    // Generate shape irregularities and craters for asteroid
    this.points = [];
    this.craters = [];
    
    // Generate irregular shape points around the radius
    const numPoints = Math.floor(Math.random() * 5) + 8; // 8-12 points
    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const jitter = 0.7 + (Math.random() * 0.6); // 0.7 to 1.3 variation
        const pointRadius = this.radius * jitter;
        this.points.push({
            x: Math.cos(angle) * pointRadius,
            y: Math.sin(angle) * pointRadius
        });
    }
    
    // Generate 2-4 craters
    const numCraters = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < numCraters; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * (this.radius * 0.6);
        const craterRadius = Math.random() * (this.radius * 0.3) + (this.radius * 0.1);
        this.craters.push({
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            radius: craterRadius
        });
    }

    this.update = function() {
        this.x += this.velocity_x;
        this.y += this.velocity_y;

        // Apply gravity if the required function exists
        if (typeof applyGravity === 'function') {
            let newVelocities = applyGravity(planet, this.x, this.y, this.velocity_x, this.velocity_y);
            this.velocity_x = newVelocities.velocity_x;
            this.velocity_y = newVelocities.velocity_y;
        }

        this.angle += this.angularVelocity;
        this.angularVelocity *= DAMPING_FACTOR;
    };

    this.draw = function(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Draw irregular asteroid shape
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.closePath();
        
        // Brown-gray color for asteroid
        const r = 100 + Math.floor(Math.random() * 20); // Less random variation per frame
        const g = 90 + Math.floor(Math.random() * 10);
        const b = 70 + Math.floor(Math.random() * 10);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fill();
        
        // Draw craters as darker circles
        for (let i = 0; i < this.craters.length; i++) {
            const crater = this.craters[i];
            ctx.beginPath();
            ctx.arc(crater.x, crater.y, crater.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(40, 40, 40, 0.6)';
            ctx.fill();
        }
        
        // Add subtle texture/highlights
        ctx.beginPath();
        ctx.arc(this.radius * 0.2, -this.radius * 0.3, this.radius * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fill();
        
        ctx.restore();
    };

    this.isOutOfBounds = function(canvasWidth, canvasHeight) {
        return this.x < -this.radius || this.x > canvasWidth + this.radius || 
               this.y < -this.radius || this.y > canvasHeight + this.radius;
    };
}