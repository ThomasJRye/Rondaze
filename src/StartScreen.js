// src/StartScreen.js
import React, { useEffect } from 'react';
import './StartScreen.css';
import { useNavigate } from 'react-router-dom';

const StartScreen = ({ onStart }) => {
    const navigate = useNavigate();

    const handleStartGame = () => {
        navigate('/game'); // Redirect to the GamePage
    };

    const handleTutorial = () => {
        navigate('/tutorial');
    };

    const handleHighScores = () => {
        navigate('/game-over');
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                handleStartGame();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        
        // Cleanup event listener when component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className="start-screen">
            <div className="start-content">
                <h1 className="start-title">Welcome to Rondaze!</h1>
                <div className="button-container">
                    <button className="tutorial-button" onClick={handleTutorial}>
                        Tutorial
                    </button>
                    <button className="start-button" onClick={handleStartGame}>
                        Start Game
                    </button>
                    <button className="highscores-button" onClick={handleHighScores}>
                        High Scores
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StartScreen;