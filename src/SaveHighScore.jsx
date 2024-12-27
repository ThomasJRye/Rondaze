import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SaveHighScore.css';

const SaveHighScore = ({ score }) => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSave = () => {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScores.push({ name, score });
    localStorage.setItem('highScores', JSON.stringify(highScores));
    navigate('/high-scores');
  };

  return (
    <div className="save-high-score-container">
      <h1>Save High Score</h1>
      <p>Your Score: {score}</p>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default SaveHighScore;