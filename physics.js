export function acceleration(radius, planet_mass) {
    const gravity = 50;
    if (radius < 0) {
        return -gravity*(planet_mass/(radius*radius))
    } else {

        return gravity*(planet_mass/(radius*radius))
    }

  }

function applyGravity(planet, object) {

}