import { GRAVITY_CONSTANT, DAMPING_FACTOR } from './constants.js';


export function acceleration(radius, planet_mass) {
    const gravity = 35; // Gravitational constant
    if (radius < 0) {
        return -gravity*(planet_mass/(radius*radius))
    } else {

        return gravity*(planet_mass/(radius*radius))
    }

  }

export function applyGravity(planet, x, y, velocity_x, velocity_y) {
    const dx = planet.x - x;
    const dy = planet.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Calculate gravitational force
    const force = (GRAVITY_CONSTANT * planet.mass) / (distance * distance);
    const force_x = (force * dx) / distance;
    const force_y = (force * dy) / distance;

    return {
        velocity_x: velocity_x + force_x,
        velocity_y: velocity_y + force_y
    };
}
// Example of using damping factor elsewhere
export function applyDamping(angularVelocity) {
    return angularVelocity * DAMPING_FACTOR;
}