import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { startGame } from './game/game';
import './Tutorial.css';
import KeyboardKey from './KeyboardKey';

const Tutorial = () => {
    const [game, setGame] = useState(null);
    const navigate = useNavigate();

    const finishTutorial = useCallback(() => {
        navigate('/');
    }, [navigate]);

    // Single tutorial level with all instructions
    const tutorialContent = (
        <div>
            <h2>Game Controls</h2>
            <p>
                <KeyboardKey keyName="LEFT" /> and <KeyboardKey keyName="RIGHT" /> to rotate your spacecraft
            </p>
            <p>
                <KeyboardKey keyName="UP" /> to activate thrusters and move forward
            </p>
            <p>
                <KeyboardKey keyName="SPACE" /> to fire your weapon
            </p>
            <p>
                Try to destroy asteroids and protect the planet!
            </p>
        </div>
    );

    useEffect(() => {
        const canvas = document.getElementById('tutorialCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const gameInstance = startGame(canvas, ctx, () => {
                const canvas = document.getElementById('tutorialCanvas');
                const ctx = canvas.getContext('2d');
                setGame(startGame(canvas, ctx, () => {}, { 
                    isTutorial: true, 
                    level: 3 // Use level 3 which has asteroids to practice with
                }));
            }, { 
                isTutorial: true, 
                level: 3
            });

            setGame(gameInstance);

            const handleResize = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            };
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                if (gameInstance && gameInstance.cleanup) {
                    gameInstance.cleanup();
                }
            };
        }
    }, []);

    return (
        <div className="tutorial-container">
            <canvas id="tutorialCanvas"></canvas>
            <div className="tutorial-info">
                {tutorialContent}
                <div className="tutorial-buttons">
                    <button onClick={finishTutorial}>
                        Return to Menu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Tutorial; 