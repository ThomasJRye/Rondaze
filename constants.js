// constants.js

export const PLANET = {
    RADIUS: 25,
    MASS: 15,
    ATMOSPHERE: 75,
};

export const SPACECRAFT = {
    INITIAL_X_OFFSET: 100,
    INITIAL_Y_OFFSET: 100,
    RADIUS: 10,
    INITIAL_VELOCITY_X: 1,
    INITIAL_VELOCITY_Y: 0,
    INITIAL_ANGLE: 0,
    INITIAL_ANGULAR_VELOCITY: 0,
};

export const NUKES = {
    VELOCITY_MULTIPLIER: 1.5,
};

export const ASTEROIDS = {
    BASE_X: 1100,
    BASE_Y: 1100,
    VELOCITY_X: 0.0085,
    VELOCITY_Y: -0.0025,
    MIN_RADIUS: 2,
    MAX_RADIUS: 15,
    GRAVITATIONAL_CONSTANT: 0.1,
};

export const ATMOSPHERE_LAYERS = 10;
export const ATMOSPHERE_OPACITY = 0.4;

// constants.js

export const GRAVITY_CONSTANT = 9.81;  // Example constant for gravity
export const DAMPING_FACTOR = 0.99;    // Damping factor for reducing angular velocity

// Nuke-specific constants
export const NUKE_RADIUS = 10;
export const NUKE_FUSE = 10;
export const NUKE_COLOR = "#4B5320";
export const BOOM_COLOR = "#FF0000";

// Asteroid-specific constants
export const ASTEROID_BASE_MASS = Math.PI;  // Base mass factor
export const ASTEROID_COLOR = "#333333";