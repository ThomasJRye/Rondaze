import React, { useState } from 'react';
import './SaveHighScoreModal.css';

const API_URL = 'http://localhost:3002/api/highscores';

const SaveHighScoreModal = ({ score, refetch }) => {
    const [name, setName] = useState('');
    const [showModal, setShowModal] = useState(true);
    const [error, setError] = useState('');

    const handleSave = async () => {
        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ playerName: name, score }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save score');
            }

            refetch();
            setShowModal(false);
        } catch (error) {
            console.error('Error saving score:', error);
            setError(error.message || 'Failed to save score. Please try again.');
        }
    };

    const close = async () => {
        // Save the score before closing if name is entered
        if (name.trim()) {
            await handleSave();
        }
        setShowModal(false);
    };

    return (
        <>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h1>Game Over</h1>
                        <h2>Your Score: {score}</h2>
                        {error && <p className="error">{error}</p>}
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <button onClick={handleSave}>Save</button>
                        <button onClick={close}>Cancel</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default SaveHighScoreModal;