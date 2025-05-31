import { COLORS, ATMOSPHERE_LAYERS, ATMOSPHERE_OPACITY } from './constants.js';

export function drawPlanet(ctx, planet) {
  // Draw atmosphere
  for (let i = 0; i < ATMOSPHERE_LAYERS; i++) {
    let radius = planet.radius + planet.atmosphere * (i / ATMOSPHERE_LAYERS);
    let opacity_for_layer = ATMOSPHERE_OPACITY * (1 - i / ATMOSPHERE_LAYERS);
    let atmosphereColor = planet.atmosphereColor.replace("{opacity}", opacity_for_layer);

    ctx.beginPath();
    ctx.arc(
      /* centerX */ planet.x, 
      /* centerY */ planet.y, 
      /* radius */ radius, 
      /* startAngle */ 0, 
      /* endAngle */ Math.PI * 2
    );
    ctx.fillStyle = atmosphereColor;
    ctx.fill();
  }

  // Draw the planet
  ctx.beginPath();
  ctx.arc(
    /* centerX */ planet.x, 
    /* centerY */ planet.y, 
    /* radius */ planet.radius, 
    /* startAngle */ 0, 
    /* endAngle */ Math.PI * 2
  );
  ctx.fillStyle = planet.color;
  ctx.fill();

  // Draw first continent (upper right)
  ctx.beginPath();
  ctx.moveTo(planet.x + planet.radius * 0.5, planet.y - planet.radius * 0.3);
  ctx.lineTo(planet.x + planet.radius * 0.8, planet.y - planet.radius * 0.1);
  ctx.lineTo(planet.x + planet.radius * 0.9, planet.y + planet.radius * 0.3);
  ctx.lineTo(planet.x + planet.radius * 0.7, planet.y + planet.radius * 0.5);
  ctx.lineTo(planet.x + planet.radius * 0.3, planet.y + planet.radius * 0.4);
  ctx.lineTo(planet.x + planet.radius * 0.1, planet.y - planet.radius * 0.9);
  ctx.lineTo(planet.x + planet.radius * 0.2, planet.y - planet.radius * 0.6);
  ctx.closePath();
  ctx.fillStyle = COLORS.continentGreenLight;
  ctx.fill();

  // Draw second continent (lower left)
  ctx.beginPath();
  ctx.moveTo(planet.x - planet.radius * 0.6, planet.y + planet.radius * 0.1);
  ctx.lineTo(planet.x - planet.radius * 0.9, planet.y + planet.radius * 0.2);
  ctx.lineTo(planet.x - planet.radius * 0.8, planet.y + planet.radius * 0.7);
  ctx.lineTo(planet.x - planet.radius * 0.3, planet.y + planet.radius * 0.8);
  ctx.lineTo(planet.x - planet.radius * 0.1, planet.y + planet.radius * 0.6);
  ctx.lineTo(planet.x - planet.radius * 0.3, planet.y + planet.radius * 0.5);
  ctx.lineTo(planet.x - planet.radius * 0.5, planet.y + planet.radius * 0.1);
  ctx.closePath();
  ctx.fillStyle = COLORS.continentGreenDark;
  ctx.fill();
}

export function drawSpacecraft(ctx, spacecraft, arrowUpPressed) {
  ctx.save();
  ctx.translate(/* x */ spacecraft.x, /* y */ spacecraft.y);
  ctx.rotate(/* angle */ spacecraft.angle);
  
  if (arrowUpPressed) {
    // Left engine flame
    ctx.beginPath();
    ctx.moveTo(-spacecraft.radius * 0.3, spacecraft.radius + 8);
    ctx.lineTo(-spacecraft.radius * 0.15, spacecraft.radius + 25);
    ctx.lineTo(-spacecraft.radius * 0.05, spacecraft.radius + 8);
    ctx.closePath();
    ctx.fillStyle = COLORS.orangeWeb;
    ctx.fill();
    
    // Right engine flame
    ctx.beginPath();
    ctx.moveTo(spacecraft.radius * 0.3, spacecraft.radius + 8);
    ctx.lineTo(spacecraft.radius * 0.15, spacecraft.radius + 25);
    ctx.lineTo(spacecraft.radius * 0.05, spacecraft.radius + 8);
    ctx.closePath();
    ctx.fillStyle = COLORS.orangeWeb;
    ctx.fill();
  }
  
  // Draw main spacecraft body
  ctx.beginPath();
  ctx.moveTo(0, -spacecraft.radius * 1.2);
  ctx.lineTo(-spacecraft.radius * 0.8, spacecraft.radius * 0.5);
  ctx.lineTo(-spacecraft.radius * 0.3, spacecraft.radius + 8);
  ctx.lineTo(spacecraft.radius * 0.3, spacecraft.radius + 8);
  ctx.lineTo(spacecraft.radius * 0.8, spacecraft.radius * 0.5);
  ctx.closePath();
  ctx.fillStyle = COLORS.vermilion;
  ctx.fill();
  
  // Draw cockpit/nose cone
  ctx.beginPath();
  ctx.moveTo(0, -spacecraft.radius * 1.2);
  ctx.lineTo(-spacecraft.radius * 0.4, -spacecraft.radius * 0.2);
  ctx.lineTo(spacecraft.radius * 0.4, -spacecraft.radius * 0.2);
  ctx.closePath();
  ctx.fillStyle = COLORS.whiteSmoke;
  ctx.fill();
  
  // Draw wing details
  ctx.beginPath();
  ctx.moveTo(-spacecraft.radius * 0.8, spacecraft.radius * 0.5);
  ctx.lineTo(-spacecraft.radius * 1.1, spacecraft.radius * 0.8);
  ctx.lineTo(-spacecraft.radius * 0.6, spacecraft.radius * 0.9);
  ctx.closePath();
  ctx.fillStyle = COLORS.battleshipGray;
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(spacecraft.radius * 0.8, spacecraft.radius * 0.5);
  ctx.lineTo(spacecraft.radius * 1.1, spacecraft.radius * 0.8);
  ctx.lineTo(spacecraft.radius * 0.6, spacecraft.radius * 0.9);
  ctx.closePath();
  ctx.fillStyle = COLORS.battleshipGray;
  ctx.fill();
  
  // Draw engine exhaust ports
  ctx.beginPath();
  ctx.arc(
    /* centerX */ -spacecraft.radius * 0.2, 
    /* centerY */ spacecraft.radius + 6, 
    /* radius */ 2, 
    /* startAngle */ 0, 
    /* endAngle */ Math.PI * 2
  );
  ctx.fillStyle = COLORS.oxfordBlue;
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(
    /* centerX */ spacecraft.radius * 0.2, 
    /* centerY */ spacecraft.radius + 6, 
    /* radius */ 2, 
    /* startAngle */ 0, 
    /* endAngle */ Math.PI * 2
  );
  ctx.fillStyle = COLORS.oxfordBlue;
  ctx.fill();
  
  ctx.restore();
}

export function drawScore(ctx, score) {
  ctx.font = "50px Arial";
  ctx.fillStyle = COLORS.whiteSmoke;
  ctx.fillText(
    /* text */ Math.round(score / 100), 
    /* x */ 10, 
    /* y */ 80
  );
}

export function drawPauseScreen(ctx, canvas) {
  ctx.font = "40px Arial";
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.textAlign = "center";
  ctx.fillText(
    /* text */ "PAUSED", 
    /* x */ canvas.width / 2, 
    /* y */ canvas.height / 2
  );
  ctx.fillText(
    /* text */ "Press P to resume", 
    /* x */ canvas.width / 2, 
    /* y */ canvas.height / 2 + 50
  );
  ctx.textAlign = "left"; // Reset text alignment
} 