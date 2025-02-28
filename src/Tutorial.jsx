import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { startGame } from './game/game.js';
import './Tutorial.css';

const Tutorial = () => {
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);

    const tutorialSteps = [
        {
            title: "Welcome to the Tutorial!",
            content: "Let's learn how to play Rondaze. Press Next to continue."
        },
        {
            title: "Basic Controls",
            content: "Use the LEFT and RIGHT arrow keys to rotate your spacecraft around the planet."
        },
        {
            title: "Weapons",
            content: "Press SPACEBAR to launch nukes at incoming asteroids."
        },
        {
            title: "Objective",
            content: "Protect the planet by destroying asteroids before they hit the atmosphere."
        },
        {
            title: "Ready to Play",
            content: "You're now ready to defend the planet! Click 'Start Game' to begin."
        }
    ];

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Pass a dummy navigation function and enable tutorial mode
            const dummyNavigate = () => {};
            startGame(canvas, ctx, dummyNavigate, true);

            const handleResize = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            };

            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);

    const handleNext = () => {
        if (currentStep < tutorialSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleStartGame = () => {
        navigate('/game');
    };

    return (
        <div className="tutorial-container">
            <canvas ref={canvasRef} className="game-canvas"></canvas>
            <div className="tutorial-overlay">
                <div className="tutorial-content">
                    <h2>{tutorialSteps[currentStep].title}</h2>
                    <p>{tutorialSteps[currentStep].content}</p>
                    <div className="tutorial-buttons">
                        {currentStep > 0 && (
                            <button onClick={handlePrevious}>Previous</button>
                        )}
                        {currentStep < tutorialSteps.length - 1 ? (
                            <button onClick={handleNext}>Next</button>
                        ) : (
                            <button onClick={handleStartGame}>Start Game</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tutorial; 