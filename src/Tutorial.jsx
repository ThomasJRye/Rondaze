import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { startGame } from './game/game';
import './Tutorial.css';
import KeyboardKey from './KeyboardKey';

const Tutorial = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [game, setGame] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                progressTutorial();
            }
        };

        window.addEventListener('keypress', handleKeyPress);
        return () => {
            window.removeEventListener('keypress', handleKeyPress);
        };
    }, [currentStep]);

    const progressTutorial = () => {
        if (currentStep < tutorialSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            navigate('/');
        }
    };

    const tutorialSteps = [
        {
            level: 0,
            content: (
                <p>
                    Welcome to the tutorial! Let's learn how to play. Use <KeyboardKey keyName="LEFT" /> and <KeyboardKey keyName="RIGHT" /> to rotate your spacecraft.
                    Press <KeyboardKey keyName="ENTER" /> to continue.
                </p>
            )
        },
        {
            level: 1,
            content: (
                <p>
                    Great! Now use <KeyboardKey keyName="UP" /> to activate your thrusters and move forward.
                    Remember that momentum will keep you moving! Press <KeyboardKey keyName="ENTER" /> to continue.
                </p>
            )
        },
        {
            level: 2,
            content: (
                <p>
                    Time for weapons training! Press <KeyboardKey keyName="SPACE" /> to fire your weapon.
                    Try to hit the target! Press <KeyboardKey keyName="ENTER" /> to continue.
                </p>
            )
        },
        {
            level: 3,
            content: (
                <p>
                    Now let's try hitting multiple targets! Use <KeyboardKey keyName="SPACE" /> to destroy all asteroids.
                    Press <KeyboardKey keyName="ENTER" /> to continue.
                </p>
            )
        },
        {
            level: 4,
            content: (
                <p>
                    You're ready for the real challenge! Press <KeyboardKey keyName="ENTER" /> to return to the main menu and start your adventure!
                </p>
            )
        }
    ];

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
                    level: tutorialSteps[currentStep].level 
                }));
            }, { 
                isTutorial: true, 
                level: tutorialSteps[currentStep].level 
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
    }, [currentStep]);

    return (
        <div className="tutorial-container">
            <canvas id="tutorialCanvas"></canvas>
            <div className="tutorial-info">
                {tutorialSteps[currentStep].content}
                <div className="tutorial-buttons">
                    <button onClick={() => navigate('/')}>Exit Tutorial</button>
                </div>
            </div>
        </div>
    );
};

export default Tutorial; 