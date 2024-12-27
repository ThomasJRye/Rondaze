import { GRAVITY_CONSTANT, DAMPING_FACTOR } from "./constants.js";

export function acceleration(radius, planet_mass) {
  const gravity = 35; // Gravitational constant
  if (radius < 0) {
    return -gravity * (planet_mass / (radius * radius));
  } else {
    return gravity * (planet_mass / (radius * radius));
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
    velocity_y: velocity_y + force_y,
  };
}
// Example of using damping factor elsewhere
export function applyDamping(angular_velocity) {
  return angular_velocity * DAMPING_FACTOR;
}

// Collision detection function
export function areCirclesColliding(circle1, circle2) {
  const dx = circle1.x - circle2.x;
  const dy = circle1.y - circle2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const sumOfRadii = circle1.radius + circle2.radius;

  return distance <= sumOfRadii;
}

// Checks if circles are within allowed distance
export function areCirclesClose(circle1, circle2, allowedDistance) {
  const dx = circle1.x - circle2.x;
  const dy = circle1.y - circle2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance <= allowedDistance;
}

function inAtmosphere(distance, planet) {
  return distance < planet.radius + planet.atmosphere;
}

export function atmosphericDrag(x, y, planet) {
  const dx = x - planet.x;
  const dy = y - planet.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (inAtmosphere(distance, planet)) {
    //calculate atmispheric density
    const atmosphereDensity =
      1 - (distance - planet.radius) / planet.atmosphere;

    const dragfactor = atmosphereDensity * 0.0002;

    return dragfactor;
  } else {
    return 0;
  }
}
