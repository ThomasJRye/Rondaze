export function drawPlanetFromSVG(ctx, planet) {    
    // Create a new Image object
    const img = new Image();
    
    // Set up the SVG data (this is a simplified version of the SVG)
    // In a real implementation, you'd likely load this from a file
    const svgData = `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="planetGradient" cx="50%" cy="50%" r="50%" fx="40%" fy="40%">
          <stop offset="0%" style="stop-color:${planet.coreColor || '#4287f5'};stop-opacity:1" />
          <stop offset="70%" style="stop-color:${planet.midColor || '#2d5eb3'};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${planet.edgeColor || '#1a365f'};stop-opacity:1" />
        </radialGradient>
        <radialGradient id="atmosphereGlow" cx="50%" cy="50%" r="55%">
          <stop offset="85%" style="stop-color:white;stop-opacity:0" />
          <stop offset="95%" style="stop-color:white;stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:white;stop-opacity:0" />
        </radialGradient>
        <radialGradient id="highlightGradient" cx="35%" cy="35%" r="60%">
          <stop offset="0%" style="stop-color:white;stop-opacity:0.3" />
          <stop offset="30%" style="stop-color:white;stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:white;stop-opacity:0" />
        </radialGradient>
        <radialGradient id="shadowGradient" cx="65%" cy="65%" r="60%">
          <stop offset="0%" style="stop-color:black;stop-opacity:0.3" />
          <stop offset="30%" style="stop-color:black;stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:black;stop-opacity:0" />
        </radialGradient>
        <clipPath id="planetClip">
          <circle cx="100" cy="100" r="80" />
        </clipPath>
      </defs>
      <circle cx="100" cy="100" r="88" fill="url(#atmosphereGlow)" />
      <circle cx="100" cy="100" r="80" fill="url(#planetGradient)" />
      <g clip-path="url(#planetClip)">
        <path d="M60,60 Q90,40 120,70 T160,90 Q170,120 140,130 T80,150 Q50,130 60,100 T60,60Z" 
              fill="${planet.landColor || '#3a7a45'}" fill-opacity="0.4" />
        <path d="M30,90 Q50,70 80,80 T120,60 Q140,80 120,100 T70,120 Q40,110 30,90Z" 
              fill="${planet.landColor || '#3a7a45'}" fill-opacity="0.3" />
        <path d="M110,140 Q140,130 160,150 Q170,180 140,170 Q120,160 110,140Z" 
              fill="${planet.landColor || '#3a7a45'}" fill-opacity="0.35" />
        <path d="M40,60 Q60,30 90,50 T130,40 Q150,60 130,80 T80,90 Q50,80 40,60Z" 
              fill="white" fill-opacity="0.2" />
        <path d="M100,110 Q130,90 160,100 T170,140 Q150,160 120,150 T100,110Z" 
              fill="white" fill-opacity="0.15" />
        <path d="M20,120 Q40,100 70,110 T90,140 Q70,160 40,150 T20,120Z" 
              fill="white" fill-opacity="0.1" />
      </g>
      <circle cx="100" cy="100" r="80" fill="url(#highlightGradient)" />
      <circle cx="100" cy="100" r="80" fill="url(#shadowGradient)" />
    </svg>
    `;
    
    // Convert SVG string to base64
    const svg64 = btoa(svgData);
    const b64Start = 'data:image/svg+xml;base64,';
    
    // Set the image source
    img.src = b64Start + svg64;
    
    // Draw the image once it's loaded
    img.onload = function() {
        // Calculate position and size to draw the planet at the specified coordinates
        const size = planet.radius * 2; // The planet radius in the game
        const x = planet.x - planet.radius;
        const y = planet.y - planet.radius;
        
        // Draw the planet at the specified size and position
        ctx.drawImage(img, x, y, size, size);
    };
}
