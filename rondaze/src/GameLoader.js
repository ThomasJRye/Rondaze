import { startGame } from './game/game.js';
import React, { useEffect, useRef } from "react";

const GameLoader = () => {
    const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Resize the canvas to fill the screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    startGame(canvas, ctx);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} id="canvas"></canvas>
    </div>
  );
}

export default GameLoader;