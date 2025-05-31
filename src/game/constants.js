// Color palette that mirrors colorPalette.css for canvas use
export const COLORS = {
  oxfordBlue: '#0e172c',
  vermilion: '#ef3e36',
  orangeWeb: '#ffae03',
  battleshipGray: '#848c8e',
  whiteSmoke: '#f1f2ee',
  continentGreenLight: 'rgb(80, 118, 17)',
  continentGreenDark: 'rgb(23, 91, 18)'
};

// Planet-specific constants
export const PLANET = {
    RADIUS: 25,
    MASS: 15,
    ATMOSPHERE: 100,
};

// Spacecraft-specific constants
export const SPACECRAFT = {
    INITIAL_X_OFFSET: 100,
    INITIAL_Y_OFFSET: 200,
    RADIUS: 10,
    INITIAL_VELOCITY_X: 0.5,
    INITIAL_VELOCITY_Y: 0,
    INITIAL_ANGLE: 0,
    INITIAL_ANGULAR_VELOCITY: 0,
};

// Nuke-specific constants
export const NUKES = {
    VELOCITY_MULTIPLIER: 1.5,
    RADIUS: 5,
    FUSE: 400, // Fuse length in frames
    COLOR: COLORS.battleshipGray,
    BOOM_RADIUS: 56,
    BOOM_COLOR: COLORS.orangeWeb,
};

// Asteroid-specific constants
export const ASTEROIDS = {
    MASS: 1,
    VELOCITY_MULTIPLIER: 2,
    COLOR: "var(--battleship-gray)",
};


// Environmental constants
export const ATMOSPHERE_LAYERS = 50;
export const ATMOSPHERE_OPACITY = 0.06;
export const GRAVITY_CONSTANT = 9.81;  // Gravity constant
export const DAMPING_FACTOR = 0.99;    // Damping factor for reducing angular velocity

export const BOOM_RADIUS = 56; // Boom radius
export const NUKE_FUSE = 400; // Fuse length in frames
