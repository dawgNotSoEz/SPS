from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Replace this URL with the satellite tracking API of your choice
SATELLITE_API_URL = 'https://api.le-systeme-solaire.net/rest/bodies/'

# Get satellite flyovers based on location (example API)
@app.route('/get-satellite-info', methods=['GET'])
def get_satellite_info():
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    if not lat or not lon:
        return jsonify({"error": "Latitude and Longitude required"}), 400

    # Call the satellite API (you'll use real API calls here)
    response = requests.get(f"{SATELLITE_API_URL}?lat={lat}&lon={lon}")

    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch satellite data"}), 500

    # Parse satellite data and return to the frontend
    data = response.json()
    return jsonify(data), 200

if __name__ == '__main__':
    app.run(debug=True)
