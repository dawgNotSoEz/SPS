# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import requests
import os
from dotenv import load_dotenv
import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB setup
try:
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    client = MongoClient(mongo_uri)
    db = client.satellite_tracker
    locations_collection = db.user_locations
    privacy_collection = db.privacy_shields
    print("Connected to MongoDB successfully")
except Exception as e:
    print(f"MongoDB connection error: {e}")

# NASA Open API key
NASA_API_KEY = os.getenv("NASA_API_KEY", "DEMO_KEY")

@app.route('/api/health', methods=['GET'])
def health_check():
    """Basic health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.datetime.now().isoformat()})

@app.route('/api/satellites', methods=['GET'])
def get_satellites():
    """Get satellites currently above a location"""
    try:
        # Get latitude and longitude from query parameters
        lat = request.args.get('lat', type=float)
        lng = request.args.get('lng', type=float)
        
        if not lat or not lng:
            return jsonify({"error": "Latitude and longitude are required"}), 400
            
        # Sample call to get ISS location (as a basic example)
        iss_response = requests.get('http://api.open-notify.org/iss-now.json')
        if iss_response.status_code == 200:
            iss_data = iss_response.json()
            
            # Store the user's location query in MongoDB
            locations_collection.insert_one({
                "user_id": request.args.get('user_id', 'anonymous'),
                "latitude": lat,
                "longitude": lng,
                "timestamp": datetime.datetime.now(),
                "query_type": "satellite_lookup"
            })
            
            # Return satellite data
            return jsonify({
                "satellites": [
                    {
                        "name": "ISS (International Space Station)",
                        "id": "25544",
                        "latitude": float(iss_data['iss_position']['latitude']),
                        "longitude": float(iss_data['iss_position']['longitude']),
                        "altitude": 408,  # Example altitude in km
                        "velocity": 27600,  # Example velocity in km/h
                        "visible": True,
                        "distance_from_query": "Calculation needed",  # Would calculate actual distance
                    }
                ],
                "timestamp": datetime.datetime.now().isoformat()
            })
        else:
            return jsonify({"error": "Failed to fetch satellite data"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/privacy-shield', methods=['POST'])
def activate_privacy_shield():
    """Activate privacy shield for a location"""
    try:
        data = request.get_json()
        
        # Validate request data
        if not data or 'latitude' not in data or 'longitude' not in data:
            return jsonify({"error": "Missing required fields"}), 400
            
        # Store privacy shield activation in MongoDB
        shield_id = privacy_collection.insert_one({
            "user_id": data.get('user_id', 'anonymous'),
            "latitude": data['latitude'],
            "longitude": data['longitude'],
            "radius": data.get('radius', 1.0),  # Default 1km radius
            "activated_at": datetime.datetime.now(),
            "status": "active",
            "shield_type": data.get('shield_type', 'basic')
        }).inserted_id
        
        return jsonify({
            "message": "Privacy shield activated",
            "shield_id": str(shield_id),
            "status": "active",
            "expires_at": (datetime.datetime.now() + datetime.timedelta(hours=1)).isoformat()
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/privacy-shield/<shield_id>', methods=['GET'])
def get_privacy_shield(shield_id):
    """Get privacy shield status"""
    try:
        shield = privacy_collection.find_one({"_id": shield_id})
        
        if not shield:
            return jsonify({"error": "Privacy shield not found"}), 404
            
        return jsonify({
            "shield_id": str(shield["_id"]),
            "status": shield["status"],
            "activated_at": shield["activated_at"].isoformat(),
            "coordinates": {
                "latitude": shield["latitude"],
                "longitude": shield["longitude"],
                "radius": shield["radius"]
            }
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/satellites/search', methods=['GET'])
def search_satellites():
    """Search for specific satellites by name or ID"""
    try:
        query = request.args.get('query', '')
        
        if not query:
            return jsonify({"error": "Search query is required"}), 400
            
        # In a real app, you would search a satellite database or API
        # For this example, we'll return mock data
        
        # Example of what real integration might look like:
        # response = requests.get(f"https://api.example.com/satellites?search={query}&apiKey={API_KEY}")
        
        return jsonify({
            "results": [
                {
                    "name": "International Space Station",
                    "id": "25544",
                    "type": "Human Spaceflight",
                    "launch_date": "1998-11-20"
                },
                {
                    "name": "Hubble Space Telescope",
                    "id": "20580",
                    "type": "Scientific",
                    "launch_date": "1990-04-24"
                }
            ],
            "count": 2
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)


