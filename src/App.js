import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home';
import Aircraft from './components/aircraft';
import Airport from './components/airport';
import City from './components/city';
import Passenger from './components/passengers';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aircraft" element={<Aircraft />} />
        <Route path="/airport" element={<Airport />} />
        <Route path="/city" element={<City />} />
        <Route path="/passenger" element={<Passenger />} />
      </Routes>
    </Router>
  );
}

export default App;