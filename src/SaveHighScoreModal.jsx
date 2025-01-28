import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SaveHighScoreModal.css';

const SaveHighScoreModal = () => {
    const [name, setName] = useState('');
    const location = useLocation();
    const score = location.state?.finalScore || 0;

    const [showModal, setShowModal] = useState(true);
    const handleSave = () => {
        // Save the high score

        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        highScores.push({ name, score });
        
        setShowModal(false);

    };

    return (
        <>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h1>Game Over</h1>
                        <h2>Your Score: {score}</h2>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <button onClick={handleSave}>Save</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default SaveHighScoreModal;