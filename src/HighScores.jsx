import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './HighScores.css';
import SaveHighScoreModal from './SaveHighScoreModal';
import { wait } from '@testing-library/user-event/dist/utils';

const HighScores = () => {
  const [refetch, setRefetch] = useState(false);
  const highScoresRef = useRef(JSON.parse(localStorage.getItem('highScores')) || []);
  useEffect(() => {
    wait(1000);
    highScoresRef.current = JSON.parse(localStorage.getItem('highScores')) || [];
  }, [refetch]);

  const location = useLocation();
  const score = location.state?.finalScore || 0;
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
      <SaveHighScoreModal score={score} refetch={() => setRefetch(!refetch)} />
      <h1>High Scores</h1>
      <ul>
        {highScoresRef.current.map((entry, index) => (
          <li key={index}>{entry.name}: {entry.score}</li>
        ))}
      </ul>
      <button onClick={handleRetry}>Retry</button>
      <button onClick={handleHome}>Home</button>
    </div>
  );
};

export default HighScores;