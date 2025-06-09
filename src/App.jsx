import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartScreen from "./StartScreen";
import GameLoader from "./GameLoader";
import HighScores from "./HighScores";
import Tutorial from "./Tutorial";
import './App.css';
import './game/colorPalette.css';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<StartScreen />} />
      <Route path="/game" element={<GameLoader />} /> 
      <Route path="/tutorial" element={<Tutorial />} />
      <Route path="/game-over" element={<HighScores />} />
      <Route path="/high-scores" element={<h1>You Win!</h1>} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;