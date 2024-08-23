export function acceleration(radius, planet_mass) {
    const gravity = 50;
    if (radius < 0) {
        return -gravity*(planet_mass/(radius*radius))
    } else {

        return gravity*(planet_mass/(radius*radius))
    }

  }

export function applyGravity(planet, x, y, velocity_x, velocity_y, ) {

    let radius_x = Math.abs(x - planet.x);
    let radius_y = Math.abs(y - planet.y);
    
    let radius = Math.sqrt(radius_x*radius_x + radius_y*radius_y);
    
    let gravity = acceleration(radius, planet.mass);
    
    let angle = Math.atan2(radius_y, radius_x);

    let acceleration_x = gravity*Math.cos(angle);
    let acceleration_y = gravity*Math.sin(angle);

    if (x > planet.x) {
        acceleration_x = -acceleration_x;
    }
    if (y > planet.y) {
        acceleration_y = -acceleration_y;
    }
    
    velocity_x += acceleration_x;
    velocity_y += acceleration_y;

    // Return the updated velocities as an object
    return {
        velocity_x: velocity_x,
        velocity_y: velocity_y
    };
}