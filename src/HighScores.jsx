import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './HighScores.css';
import SaveHighScoreModal from './SaveHighScoreModal';

const API_URL = 'http://localhost:3002/api/highscores';

const HighScores = () => {
  const [highScores, setHighScores] = useState([]);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const fetchHighScores = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch high scores');
        }
        const data = await response.json();
        setHighScores(data);
      } catch (error) {
        console.error('Error fetching high scores:', error);
      }
    };

    fetchHighScores();
  }, [refetch]);

  const location = useLocation();
  const score = location.state?.finalScore || 0;
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate('/game');
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <SaveHighScoreModal score={score} refetch={() => setRefetch(!refetch)} />
      <h1>High Scores</h1>
      <ul>
        {highScores.map((entry, index) => (
          <li key={index}>{entry.username}: {entry.score}</li>
        ))}
      </ul>
      <button onClick={handleRetry}>Retry</button>
      <button onClick={handleHome}>Home</button>
    </div>
  );
};

export default HighScores;