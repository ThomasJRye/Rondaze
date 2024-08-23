function Nuke(x, y, velocity_x, velocity_y, angle, angularVelocity) {
    this.x = x;
    this.y = y;
    this.velocity_x = velocity_x;
    this.velocity_y = velocity_y;
    this.angle = angle;
    this.angularVelocity = angularVelocity;
    this.radius = 10; // Radius of the nuke

    this.update = function() {
        // Update position based on velocity
        this.x += this.velocity_x;
        this.y += this.velocity_y;

        // Update angle based on angular velocity
        this.angle += this.angularVelocity;
    };

    this.draw = function(ctx) {
        // Draw the nuke on the canvas
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.restore();
    };

    this.isOutOfBounds = function(canvasWidth, canvasHeight) {
        return this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight;
    };
}