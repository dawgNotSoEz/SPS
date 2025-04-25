
import React, { useState, useEffect } from 'react';
import '../styles/UserDashboard.css';

function UserDashboard() {
  const [activeShields, setActiveShields] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  

  useEffect(() => {
    setTimeout(() => {
      setActiveShields([
        {
          id: 'shield-123',
          location: { latitude: 40.7128, longitude: -74.0060 },
          radius: 2.5,
          type: 'advanced',
          activated_at: '2025-04-22T10:30:00Z',
          expires_at: '2025-04-22T12:30:00Z',
          status: 'active'
        }
      ]);
      
      setRecentSearches([
        {
          id: 'search-456',
          location: { latitude: 40.7128, longitude: -74.0060 },
          timestamp: '2025-04-22T09:15:00Z',
          satellites_found: 3
        },
        {
          id: 'search-789',
          location: { latitude: 34.0522, longitude: -118.2437 },
          timestamp: '2025-04-21T14:20:00Z',
          satellites_found: 5
        }
      ]);
      
      setIsLoggedIn(true);
    }, 1000);
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <h2>Login Required</h2>
        <p>Please log in to view your dashboard</p>
        <button className="login-button">Login</button>
        <p>Don't have an account? <a href="/signup">Sign up</a></p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2>User Dashboard</h2>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Active Privacy Shields</h3>
          {activeShields.length > 0 ? (
            <div className="shields-list">
              {activeShields.map(shield => (
                <div key={shield.id} className="shield-item">
                  <div className="shield-header">
                    <span className={`shield-status ${shield.status}`}>{shield.status}</span>
                    <span className="shield-type">{shield.type}</span>
                  </div>
                  <div className="shield-details">
                    <p><strong>Location:</strong> {shield.location.latitude.toFixed(4)}, {shield.location.longitude.toFixed(4)}</p>
                    <p><strong>Radius:</strong> {shield.radius} km</p>
                    <p><strong>Activated:</strong> {new Date(shield.activated_at).toLocaleString()}</p>
                    <p><strong>Expires:</strong> {new Date(shield.expires_at).toLocaleString()}</p>
                  </div>
                  <div className="shield-actions">
                    <button className="extend-button">Extend</button>
                    <button className="deactivate-button">Deactivate</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No active privacy shields</p>
          )}
        </div>
        
        <div className="dashboard-card">
          <h3>Recent Location Searches</h3>
          {recentSearches.length > 0 ? (
            <div className="searches-list">
              {recentSearches.map(search => (
                <div key={search.id} className="search-item">
                  <p><strong>Location:</strong> {search.location.latitude.toFixed(4)}, {search.location.longitude.toFixed(4)}</p>
                  <p><strong>Time:</strong> {new Date(search.timestamp).toLocaleString()}</p>
                  <p><strong>Satellites found:</strong> {search.satellites_found}</p>
                  <button className="search-again-button">Search Again</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No recent searches</p>
          )}
        </div>
        
        <div className="dashboard-card">
          <h3>Privacy Statistics</h3>
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-value">5</div>
              <div className="stat-label">Shields Activated</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">12</div>
              <div className="stat-label">Satellites Tracked</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">85%</div>
              <div className="stat-label">Privacy Score</div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <h3>Account Settings</h3>
          <div className="settings-list">
            <div className="settings-item">
              <span>Email Notifications</span>
              <label className="switch">
                <input type="checkbox" checked={true} onChange={() => {}} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="settings-item">
              <span>Location History</span>
              <label className="switch">
                <input type="checkbox" checked={false} onChange={() => {}} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="settings-item">
              <span>Auto-activate Shield</span>
              <label className="switch">
                <input type="checkbox" checked={false} onChange={() => {}} />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <button className="settings-button">Manage Account</button>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;