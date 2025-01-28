import React, { useState } from 'react';
import './SaveHighScoreModal.css';

const SaveHighScoreModal = ({ score, refetch }) => {
    const [name, setName] = useState('');
    const [showModal, setShowModal] = useState(true);

    const handleSave = () => {
        let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        
        console.log(highScores);
        // Ensure highScores is an array
        if (!Array.isArray(highScores)) {
            highScores = [];
        }

        highScores.push({ name, score });
        highScores = highScores.sort((a, b) => b.score - a.score).slice(0, 5);
        localStorage.setItem('highScores', JSON.stringify(highScores));
        refetch();
        setShowModal(false);
    };

    const close = () => {
        setShowModal(false);
    }

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
                        <button onClick={close}>Cancel</button>

                    </div>
                </div>
            )}
        </>
    );
}

export default SaveHighScoreModal;