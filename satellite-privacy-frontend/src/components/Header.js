
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <h1>🛰️ SatelliteTracker</h1>
        </Link>
      </div>
      <nav className="nav">
        <ul>
          <li><Link to="/">Map</Link></li>
          <li><Link to="/privacy-shield">Privacy Shield</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;