// src/StartScreen.js
import React from 'react';
import './StartScreen.css';
import { Columns } from 'react-bulma-components';

const StartScreen = ({ onStart }) => {
  return (
    <div className="start-screen">
        <Columns>
            <h1 className="start-title">Welcome to Rondaze!</h1>
            <button className="start-button" onClick={onStart}>
                Start Game
            </button>
        </Columns>
    </div>
  );
};

export default StartScreen;