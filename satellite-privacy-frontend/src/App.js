import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import SatelliteMap from './components/SatelliteMap';
import PrivacyShield from './components/PrivacyShield';
import SatelliteInfo from './components/SatelliteInfo';
import UserDashboard from './components/UserDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<SatelliteMap />} />
            <Route path="/privacy-shield" element={<PrivacyShield />} />
            <Route path="/satellite/:id" element={<SatelliteInfo />} />
            <Route path="/dashboard" element={<UserDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
