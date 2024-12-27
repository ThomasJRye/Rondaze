import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HighScores.css';

const HighScores = () => {
  const [highScores, setHighScores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch high scores from local storage or an API
    const scores = JSON.parse(localStorage.getItem('highScores')) || [];
    setHighScores(scores);
  }, []);

  const handleRetry = () => {
    navigate('/game');
  };

  const handleHome = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="container">
      <h1>High Scores</h1>
      <ul>
        {highScores.map((score, index) => (
          <li key={index}>{score}</li>
        ))}
      </ul>
      <button onClick={handleRetry}>Retry</button>
      <button onClick={handleHome}>Home</button>
    </div>
  );
};

export default HighScores;