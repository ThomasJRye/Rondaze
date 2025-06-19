import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './HighScores.css';
import SaveHighScoreModal from './SaveHighScoreModal';

const API_URL = 'http://localhost:3002/api/highscores';

// Create a dark theme for the DataGrid
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const columns = [
  { 
    field: 'rank', 
    headerName: 'Rank', 
    width: 90,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'username',
    headerName: 'Player',
    width: 150,
    flex: 1,
    align: 'left',
    headerAlign: 'left'
  },
  {
    field: 'score',
    headerName: 'Score',
    width: 110,
    type: 'number',
    flex: 1,
    align: 'right',
    headerAlign: 'right'
  }
];

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
        // Sort data by score in descending order and add rank
        const sortedData = [...data].sort((a, b) => b.score - a.score);
        const scoresWithRankAndIds = sortedData.map((score, index) => ({
          ...score,
          id: score.id || index + 1,
          rank: index + 1
        }));
        setHighScores(scoresWithRankAndIds);
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
      <div style={{ height: 400, width: '100%', backgroundColor: 'var(--oxford-blue)' }}>
        <ThemeProvider theme={darkTheme}>
          <DataGrid
            rows={highScores}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
            initialState={{
              sorting: {
                sortModel: [{ field: 'score', sort: 'desc' }],
              },
            }}
            sx={{
              border: 1,
              borderColor: 'var(--battleship-gray)',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'var(--oxford-blue)',
                borderBottom: '2px solid var(--battleship-gray)',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid var(--battleship-gray)',
              },
              '& .MuiDataGrid-footerContainer': {
                backgroundColor: 'var(--oxford-blue)',
                borderTop: '2px solid var(--battleship-gray)',
              },
            }}
          />
        </ThemeProvider>
      </div>
      <div className="button-container">
        <button onClick={handleRetry}>Retry</button>
        <button onClick={handleHome}>Home</button>
      </div>
    </div>
  );
};

export default HighScores;