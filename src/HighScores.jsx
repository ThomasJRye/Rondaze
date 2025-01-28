import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './HighScores.css';
import SaveHighScoreModal from './SaveHighScoreModal';


const HighScores = () => {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

  const location = useLocation();
  const score = location.state?.score || 0;

  const navigate = useNavigate();

  const handleRetry = () => {
    navigate('/game');
  };

  const handleHome = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="container">
      <SaveHighScoreModal score={score}/>
      <h1>High Scores</h1>
      <ul>
        {Object.entries(highScores).map(([name, score], index) => (
          <li key={index}>{name}: {score}</li>
        ))}
      </ul>
      <button onClick={handleRetry}>Retry</button>
      <button onClick={handleHome}>Home</button>
    </div>
  );
};

export default HighScores;