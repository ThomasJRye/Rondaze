import React, { useEffect, useRef } from "react";
import { Columns } from 'react-bulma-components';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartScreen from "./StartScreen";
import GameLoader from "./GameLoader";
import './App.css';

function App() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<StartScreen />}>
        <Route path="game" element={<GameLoader />} />
      </Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;