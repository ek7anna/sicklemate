import React, { useState } from "react";
import axios from "axios";
import "./HomePage.css";

function HomePage() {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState([]);
  const [placeInfo, setPlaceInfo] = useState(null);

  // Your Flask backend IP
  const BASE_URL = "http://172.31.98.76:5000";

  const handleCheckHealth = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/submit-data`, {
        fatigue_level: 5,
        hydration_ml: 1000,
        steps_count: 1500,
        temperature: 32,
      });
      setAdvice(response.data.advice);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert("Failed to fetch health advice");
    }
  };

  const handleAnalyzePlace = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/analyze-location`, {
        place: location,
      });
      setPlaceInfo(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert("Failed to fetch risk info");
    }
  };

  return (
    <div className="homepage">
      <h1 className="title">Welcome to <span>SickleMate 🩸</span></h1>

      <div className="card-grid">
        <div className="card" onClick={handleCheckHealth}>
          ✅ <h3>Check Real-Time Health</h3>
          <p>Get instant advice based on your health data.</p>
        </div>

        <div className="card">
          🌍 <h3>Analyze a Place</h3>
          <input
            type="text"
            placeholder="Enter location (e.g., Gujarat)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button onClick={handleAnalyzePlace}>Analyze</button>

          {placeInfo && (
            <div className="result">
              <h4>Result:</h4>
              <p><strong>Location:</strong> {placeInfo.location}</p>
              <p><strong>Temperature:</strong> {placeInfo.temperature}°C</p>
              <p><strong>Altitude:</strong> {placeInfo.altitude} m</p>
              <p><strong>Risk:</strong> {placeInfo.risk_level}</p>
              <ul>
                {placeInfo.advice.map((a, index) => (
                  <li key={index}>{a}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="card disabled">
          💬 <h3>Community Forum</h3>
          <p>Coming Soon!</p>
        </div>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {advice.length > 0 && (
        <div className="modal">
          <div className="modal-content">
            <h3>Your Health Advice</h3>
            <ul>
              {advice.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <button onClick={() => setAdvice([])}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
