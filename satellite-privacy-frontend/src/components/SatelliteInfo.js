// src/components/SatelliteInfo.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/SatelliteInfo.css';

// API endpoint
const API_URL = 'http://localhost:5000/api';

function SatelliteInfo() {
  const { id } = useParams();
  const [satellite, setSatellite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSatelliteInfo = async () => {
      try {
        // This would be replaced with actual API call in production
        // const response = await axios.get(`${API_URL}/satellites/${id}`);
        
        // Mock data for demonstration
        const mockSatellite = {
          id: id,
          name: id === '25544' ? 'International Space Station' : `Satellite ${id}`,
          type: 'Human Spaceflight',
          launch_date: '1998-11-20',
          operator: 'Multinational',
          altitude: 408,
          velocity: 27600,
          period: 92.68,
          inclination: 51.64,
          current_position: {
            latitude: 37.785834,
            longitude: -122.406417
          },
          visible_passes: [
            { date: '2025-04-23', time: '20:15:00', duration: '4 minutes', max_elevation: '45°' },
            { date: '2025-04-24', time: '19:30:00', duration: '5 minutes', max_elevation: '60°' }
          ],
          description: 'The International Space Station is a modular space station in low Earth orbit. It is a multinational collaborative project involving five participating space agencies: NASA, Roscosmos, JAXA, ESA, and CSA.'
        };
        
        setSatellite(mockSatellite);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching satellite info: ", err);
        setError("Failed to load satellite information. Please try again later.");
        setLoading(false);
      }
    };

    fetchSatelliteInfo();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading satellite information...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!satellite) {
    return <div className="not-found">Satellite not found</div>;
  }

  return (
    <div className="satellite-info-container">
      <div className="satellite-header">
        <h2>{satellite.name}</h2>
        <p className="satellite-type">{satellite.type}</p>
      </div>
      
      <div className="satellite-details">
        <div className="satellite-metadata">
          <h3>Satellite Details</h3>
          <div className="detail-item">
            <span className="detail-label">ID:</span>
            <span className="detail-value">{satellite.id}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Launch Date:</span>
            <span className="detail-value">{satellite.launch_date}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Operator:</span>
            <span className="detail-value">{satellite.operator}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Altitude:</span>
            <span className="detail-value">{satellite.altitude} km</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Velocity:</span>
            <span className="detail-value">{satellite.velocity} km/h</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Orbital Period:</span>
            <span className="detail-value">{satellite.period} minutes</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Inclination:</span>
            <span className="detail-value">{satellite.inclination}°</span>
          </div>
        </div>
        
        <div className="satellite-current-location">
          <h3>Current Location</h3>
          <p>Latitude: {satellite.current_position.latitude}</p>
          <p>Longitude: {satellite.current_position.longitude}</p>
          <div className="location-map">
            {/* Map placeholder - would be replaced with actual map component */}
            <div className="map-placeholder">
              Map display would go here
            </div>
          </div>
        </div>
      </div>
      
      <div className="satellite-description">
        <h3>About {satellite.name}</h3>
        <p>{satellite.description}</p>
      </div>
      
      <div className="satellite-visibility">
        <h3>Upcoming Visible Passes</h3>
        <div className="passes-list">
          {satellite.visible_passes.map((pass, index) => (
            <div key={index} className="pass-item">
              <div className="pass-date">{pass.date}</div>
              <div className="pass-info">
                <p><strong>Time:</strong> {pass.time}</p>
                <p><strong>Duration:</strong> {pass.duration}</p>
                <p><strong>Max Elevation:</strong> {pass.max_elevation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SatelliteInfo;