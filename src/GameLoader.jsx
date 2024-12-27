import React, { useEffect, useRef, useState } from 'react';
import { startGame } from './game/game.js';
import './GameLoader.css';

const GameLoader = () => {
    const canvasRef = useRef(null);
    const [showInfo, setShowInfo] = useState(true);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                setShowInfo(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (!showInfo) {
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

            const handleGameOver = () => {
            };

            window.addEventListener("resize", handleResize);
            window.addEventListener("gameOver", handleGameOver);

            return () => {
                window.removeEventListener("resize", handleResize);
                window.removeEventListener("gameOver", handleGameOver);
            };
        }
    }, [showInfo]);

    const handleStartGame = () => {
        setShowInfo(false);
    };

    return (
        <div>
            {showInfo ? (
                <div className="info-screen">
                    <h1>Game Instructions</h1>
                    <p>Use the arrow keys for steering.</p>
                    <p>Press the spacebar to launch nukes.</p>
                    <p>Stop asteroids from hitting the planet.</p>
                    <button onClick={handleStartGame}>Start Game</button>
                </div>
            ) : (
                <canvas ref={canvasRef} id="canvas"></canvas>
            )}
        </div>
    );
};

export default GameLoader;