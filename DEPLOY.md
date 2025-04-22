# Satellite Surveillance & Privacy Shield - Project Setup Guide

This document provides instructions for setting up and running both the backend and frontend components of the Satellite Surveillance & Privacy Shield application.

## Project Structure

```
satellite-surveillance-shield/
├── backend/                # Flask backend
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Environment variables (create this)
├── frontend/               # React frontend
│   ├── public/             # Static files
│   ├── src/                # React components
│   │   ├── components/     # UI components
│   │   └── styles/         # CSS files
│   ├── package.json        # Node.js dependencies
│   └── .env                # Environment variables (create this)
└── README.md               # Project documentation
```

## Backend Setup (Flask)

### Prerequisites
- Python 3.8 or higher
- MongoDB (local installation or cloud instance)

### Installation Steps

1. Create a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory with the following variables:
   ```
   FLASK_APP=app.py
   FLASK_ENV=development
   MONGO_URI=mongodb://localhost:27017/
   NASA_API_KEY=your_nasa_api_key  # Optional, can use DEMO_KEY for testing
   ```

5. Run the Flask application:
   ```bash
   flask run
   ```
   
   The backend server should now be running at `http://localhost:5000`

### API Endpoints

- `GET /api/health` - Check if the API is working
- `GET /api/satellites?lat={latitude}&lng={longitude}` - Get satellites above a location
- `POST /api/privacy-shield` - Activate privacy shield for a location
- `GET /api/privacy-shield/{shield_id}` - Get privacy shield status
- `GET /api/satellites/search?query={query}` - Search for satellites by name/ID

## Frontend Setup (React)

### Prerequisites
- Node.js 14.x or higher
- npm 6.x or higher

### Installation Steps

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```
   
   The frontend application should now be running at `http://localhost:3000`

## Additional Dependencies to Install

### Backend (Python)
```
Flask==2.0.1
Flask-Cors==3.0.10
pymongo==4.1.1
requests==2.26.0
python-dotenv==0.19.1
```

### Frontend (React)
```
react-router-dom@6.4.2
axios@0.27.2
react-leaflet@4.1.0
leaflet@1.9.2
```

## MongoDB Setup

1. If using a local MongoDB installation:
   - Make sure MongoDB is installed and running on your system
   - The default connection string is `mongodb://localhost:27017/`

2. If using MongoDB Atlas (cloud):
   - Create a MongoDB Atlas account
   - Set up a cluster and get your connection string
   - Replace the `MONGO_URI` in your `.env` file with your Atlas connection string

## API Key Setup

For production use, you may need to obtain API keys for satellite data:

1. NASA API:
   - Visit https://api.nasa.gov/ and register for an API key
   - Add the key to your backend `.env` file as `NASA_API_KEY`

2. Other potential satellite APIs:
   - N2YO API: https://www.n2yo.com/api/
   - Space-Track: https://www.space-track.org/

## Next Steps for Development

Once you have the basic application running, consider these next steps:

1. **Implement user authentication**:
   - Add user registration and login
   - Connect user accounts to their privacy shield settings

2. **Enhance satellite data**:
   - Connect to real satellite APIs
   - Implement more accurate tracking algorithms

3. **Expand privacy shield features**:
   - Research and implement more privacy protection methods
   - Add scheduling for privacy shield activation

4. **Improve visualization**:
   - Add 3D visualization of satellite orbits
   - Implement heatmaps for satellite coverage areas

5. **Mobile optimization**:
   - Ensure responsive design works on all devices
   - Consider developing mobile apps

## Troubleshooting

### Common Backend Issues

- **MongoDB Connection Error**: Ensure MongoDB is running and your connection string is correct
- **Missing Dependencies**: Run `pip install -r requirements.txt` to ensure all dependencies are installed
- **Port Already in Use**: Change the port in `app.run()` if port 5000 is already in use

### Common Frontend Issues

- **API Connection Errors**: Ensure the backend server is running and CORS is properly configured
- **Missing Dependencies**: Run `npm install` to ensure all dependencies are installed
- **Build Errors**: Check console for specific error messages during npm start

## Resources and Documentation

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [NASA Open APIs](https://api.nasa.gov/)