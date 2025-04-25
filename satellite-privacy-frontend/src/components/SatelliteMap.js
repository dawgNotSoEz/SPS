
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import '../styles/SatelliteMap.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// API endpoint
const API_URL = 'http://localhost:5000/api';

function SetViewOnClick({ coords }) {
  const map = useMap();
  map.setView(coords, map.getZoom());
  return null;
}

function SatelliteMap() {
  const [userLocation, setUserLocation] = useState(null);
  const [satellites, setSatellites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef(null);

  // Get user's location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location: ", error);
          setError("Unable to get your location. Please enable location services.");
          // Default to a location if user's location is not available
          setUserLocation({ lat: 40.7128, lng: -74.0060 }); // New York City
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setUserLocation({ lat: 40.7128, lng: -74.0060 }); // New York City
    }
  }, []);

  // Function to fetch satellites based on location
  const fetchSatellites = async (lat, lng) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/satellites?lat=${lat}&lng=${lng}`);
      setSatellites(response.data.satellites);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching satellite data: ", err);
      setError("Failed to fetch satellite data. Please try again later.");
      setLoading(false);
    }
  };

  // Search for satellites
  const searchSatellites = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/satellites/search?query=${searchQuery}`);
      // Do something with search results
      console.log(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error searching satellites: ", err);
      setError("Failed to search satellites. Please try again later.");
      setLoading(false);
    }
  };

  // Load satellites when user location is available
  useEffect(() => {
    if (userLocation) {
      fetchSatellites(userLocation.lat, userLocation.lng);
    }
  }, [userLocation]);

  // Handle manual location input
  const handleLocationSubmit = (e) => {
    e.preventDefault();
    const lat = parseFloat(e.target.latitude.value);
    const lng = parseFloat(e.target.longitude.value);
    
    if (isNaN(lat) || isNaN(lng)) {
      setError("Please enter valid latitude and longitude values.");
      return;
    }
    
    setUserLocation({ lat, lng });
  };

  if (!userLocation) {
    return <div className="loading">Loading map...</div>;
  }

  return (
    <div className="satellite-map-container">
      <div className="map-controls">
        <form onSubmit={handleLocationSubmit} className="location-form">
          <h3>Enter Location</h3>
          <div className="form-group">
            <label htmlFor="latitude">Latitude:</label>
            <input
              type="text"
              id="latitude"
              name="latitude"
              placeholder="e.g. 40.7128"
              defaultValue={userLocation.lat}
            />
          </div>
          <div className="form-group">
            <label htmlFor="longitude">Longitude:</label>
            <input
              type="text"
              id="longitude"
              name="longitude"
              placeholder="e.g. -74.0060"
              defaultValue={userLocation.lng}
            />
          </div>
          <button type="submit">Update Location</button>
        </form>

        <form onSubmit={searchSatellites} className="search-form">
          <h3>Search Satellites</h3>
          <div className="form-group">
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </div>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="map-wrapper">
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={5}
          style={{ height: "500px", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User location marker */}
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>
              Your Location<br />
              Lat: {userLocation.lat.toFixed(4)}<br />
              Lng: {userLocation.lng.toFixed(4)}
            </Popup>
          </Marker>

          {/* Satellite markers */}
          {satellites.map(satellite => (
            <Marker
              key={satellite.id}
              position={[satellite.latitude, satellite.longitude]}
              icon={L.divIcon({
                className: 'satellite-icon',
                html: '🛰️',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              })}
            >
              <Popup>
                <div className="satellite-popup">
                  <h3>{satellite.name}</h3>
                  <p>ID: {satellite.id}</p>
                  <p>Altitude: {satellite.altitude} km</p>
                  <p>Velocity: {satellite.velocity} km/h</p>
                  <p>Visible: {satellite.visible ? 'Yes' : 'No'}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          <SetViewOnClick coords={[userLocation.lat, userLocation.lng]} />
        </MapContainer>
      </div>

      <div className="satellites-list">
        <h3>Satellites Overhead ({satellites.length})</h3>
        {loading ? (
          <p>Loading satellites...</p>
        ) : (
          <div className="satellite-cards">
            {satellites.map(satellite => (
              <div key={satellite.id} className="satellite-card">
                <h4>{satellite.name}</h4>
                <p><strong>ID:</strong> {satellite.id}</p>
                <p><strong>Altitude:</strong> {satellite.altitude} km</p>
                <p><strong>Coordinates:</strong> {satellite.latitude.toFixed(4)}, {satellite.longitude.toFixed(4)}</p>
              </div>
            ))}
            {satellites.length === 0 && <p>No satellites found overhead at this time.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default SatelliteMap;