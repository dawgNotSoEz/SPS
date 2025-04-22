
// src/components/PrivacyShield.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/PrivacyShield.css';

// API endpoint
const API_URL = 'http://localhost:5000/api';

function PrivacyShield() {
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const [radius, setRadius] = useState(1.0);
  const [shieldType, setShieldType] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeShield, setActiveShield] = useState(null);

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location: ", error);
          setError("Unable to get your location. Please enable location services.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  // Activate privacy shield
  const activateShield = async (e) => {
    e.preventDefault();
    
    if (!location.latitude || !location.longitude) {
      setError("Please provide a valid location.");
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const response = await axios.post(`${API_URL}/privacy-shield`, {
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude),
        radius: parseFloat(radius),
        shield_type: shieldType
      });
      
      setActiveShield(response.data);
      setSuccess("Privacy shield activated successfully!");
      setLoading(false);
    } catch (err) {
      console.error("Error activating privacy shield: ", err);
      setError("Failed to activate privacy shield. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="privacy-shield-container">
      <div className="shield-info">
        <h2>Privacy Shield Protection</h2>
        <p>
          Activate a privacy shield to protect your location from satellite surveillance.
          Our technology helps mask your location and activities from overhead observation.
        </p>
        
        <div className="shield-types">
          <h3>Available Protection Types:</h3>
          <div className="shield-type-cards">
            <div 
              className={`shield-type-card ${shieldType === 'basic' ? 'selected' : ''}`}
              onClick={() => setShieldType('basic')}
            >
              <h4>Basic Protection</h4>
              <p>Signal jamming for common commercial satellite frequencies.</p>
              <p>Coverage: 1km radius</p>
              <p>Duration: 1 hour</p>
            </div>
            
            <div 
              className={`shield-type-card ${shieldType === 'advanced' ? 'selected' : ''}`}
              onClick={() => setShieldType('advanced')}
            >
              <h4>Advanced Protection</h4>
              <p>Enhanced jamming with thermal signature masking.</p>
              <p>Coverage: 2km radius</p>
              <p>Duration: 2 hours</p>
            </div>
            
            <div 
              className={`shield-type-card ${shieldType === 'premium' ? 'selected' : ''}`}
              onClick={() => setShieldType('premium')}
            >
              <h4>Premium Protection</h4>
              <p>Full-spectrum signal jamming with visual and thermal masking.</p>
              <p>Coverage: 5km radius</p>
              <p>Duration: 4 hours</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="shield-activation">
        <h3>Activate Privacy Shield</h3>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={activateShield} className="shield-form">
          <div className="form-group">
            <label htmlFor="latitude">Latitude:</label>
            <input
              type="text"
              id="latitude"
              value={location.latitude}
              onChange={(e) => setLocation({...location, latitude: e.target.value})}
              placeholder="e.g. 40.7128"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="longitude">Longitude:</label>
            <input
              type="text"
              id="longitude"
              value={location.longitude}
              onChange={(e) => setLocation({...location, longitude: e.target.value})}
              placeholder="e.g. -74.0060"
              required
            />
          </div>
          
          <button type="button" onClick={getUserLocation} className="location-btn">
            Use Current Location
          </button>
          
          <div className="form-group">
            <label htmlFor="radius">Protection Radius (km):</label>
            <input
              type="range"
              id="radius"
              min="0.5"
              max="5"
              step="0.5"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
            />
            <span>{radius} km</span>
          </div>
          
          <button type="submit" className="activate-btn" disabled={loading}>
            {loading ? 'Activating...' : 'Activate Privacy Shield'}
          </button>
        </form>
        
        {activeShield && (
          <div className="active-shield-info">
            <h3>Active Privacy Shield</h3>
            <p><strong>Status:</strong> {activeShield.status}</p>
            <p><strong>Shield ID:</strong> {activeShield.shield_id}</p>
            <p><strong>Expires at:</strong> {new Date(activeShield.expires_at).toLocaleString()}</p>
          </div>
        )}
      </div>
      
      <div className="privacy-disclaimer">
        <h3>Important Information</h3>
        <p>
          This privacy shield technology is for research and educational purposes only.
          Interfering with satellite communications may be illegal in some jurisdictions.
          Please ensure you comply with all local laws and regulations.
        </p>
      </div>
    </div>
  );
}

export default PrivacyShield;