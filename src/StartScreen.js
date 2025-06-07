// src/StartScreen.js
import React, { useEffect, useRef } from 'react';
import './StartScreen.css';
import { useNavigate } from 'react-router-dom';

const StartScreen = ({ onStart }) => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);

    const handleStartGame = () => {
        navigate('/game'); // Redirect to the GamePage
    };

    const handleTutorial = () => {
        navigate('/tutorial');
    };

    const handleHighScores = () => {
        navigate('/game-over');
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                handleStartGame();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        
        // Cleanup event listener when component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to window size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Create stars
        const stars = Array(200).fill().map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speed: Math.random() * 0.5
        }));

        function animate() {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw and update stars
            stars.forEach(star => {
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();

                // Move star
                star.y += star.speed;
                
                // Reset star position if it goes off screen
                if (star.y > canvas.height) {
                    star.y = 0;
                    star.x = Math.random() * canvas.width;
                }
            });

            requestAnimationFrame(animate);
        }

        animate();

        // Handle window resize
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="start-screen">
            <canvas ref={canvasRef} style={{position: 'absolute', top: 0, left: 0, zIndex: 0}} />
            <div className="start-content" style={{zIndex: 10000}}>
                <h1 className="start-title">Welcome to Rondaze!</h1>
                <div className="button-container">
                    <button className="tutorial-button" onClick={handleTutorial}>
                        Tutorial
                    </button>
                    <button className="start-button" onClick={handleStartGame}>
                        Start Game
                    </button>
                    <button className="highscores-button" onClick={handleHighScores}>
                        High Scores
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StartScreen;