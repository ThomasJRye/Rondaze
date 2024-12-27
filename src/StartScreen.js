// src/StartScreen.js
import React from 'react';
import './StartScreen.css';
import { useNavigate } from 'react-router-dom';

const StartScreen = ({ onStart }) => {
    const navigate = useNavigate();

    const handleStartGame = () => {
        navigate('/game'); // Redirect to the GamePage
      };

  return (
    <div className="start-screen">
        <div>
            <h1 className="start-title">Welcome to Rondaze!</h1>
            <button className="start-button" onClick={handleStartGame}>
                Start Game
            </button>
        </div>
    </div>
  );
};

export default StartScreen;