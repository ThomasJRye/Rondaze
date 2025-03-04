import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { startGame } from './game/game.js';
import './Tutorial.css';

const Tutorial = () => {
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [tutorialLevel, setTutorialLevel] = useState(1);

    const tutorialSteps = [
        {
            title: "Welcome to the Tutorial!",
            content: "Let's learn how to play Rondaze. First, let's practice moving your spacecraft. Use the LEFT and RIGHT arrow keys to rotate.",
            level: 1
        },
        {
            title: "Basic Movement",
            content: "Great! Now try using the UP arrow to thrust forward. The planet's gravity will affect your movement.",
            level: 1
        },
        {
            title: "Weapons Training",
            content: "Time to practice shooting! A slow asteroid will appear. Press SPACEBAR to launch nukes at it.",
            level: 2
        },
        {
            title: "Multiple Targets",
            content: "Now let's try handling multiple asteroids. Remember to time your shots carefully!",
            level: 3
        },
        {
            title: "Ready to Play",
            content: "You've completed the tutorial! Click 'Start Game' to begin Level 1 of the real game.",
            level: 3
        }
    ];

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Pass tutorial mode option with current tutorial level
            const dummyNavigate = () => {};
            startGame(canvas, ctx, dummyNavigate, { 
                isTutorial: true, 
                level: tutorialLevel 
            });

            const handleResize = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            };

            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    }, [tutorialLevel]);

    const handleNext = () => {
        if (currentStep < tutorialSteps.length - 1) {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            // Update tutorial level if the next step has a different level
            if (tutorialSteps[nextStep].level !== tutorialLevel) {
                setTutorialLevel(tutorialSteps[nextStep].level);
            }
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            const prevStep = currentStep - 1;
            setCurrentStep(prevStep);
            // Update tutorial level if the previous step has a different level
            if (tutorialSteps[prevStep].level !== tutorialLevel) {
                setTutorialLevel(tutorialSteps[prevStep].level);
            }
        }
    };

    const handleStartGame = () => {
        navigate('/game', { state: { level: 1 } });
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