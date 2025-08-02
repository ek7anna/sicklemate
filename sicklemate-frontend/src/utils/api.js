import axios from "axios";

// ✅ Flask backend base URL
const BASE_URL = "http://172.31.98.76:5000"; // Replace with your system's IP if it changes

// ✅ OpenWeatherMap API key
const WEATHER_API_KEY = "55875dc3876f08c5d63cd5532bc36e2a";

// ----------------------------
// 🔹 Backend API Functions
// ----------------------------
export async function submitHealthData(data) {
  const response = await axios.post(`${BASE_URL}/submit-data`, data);
  return response.data; // e.g., { advice: [...] }
}

export async function analyzeLocation(location) {
  const response = await axios.post(`${BASE_URL}/analyze-location`, { location });
  return response.data; // e.g., { risk_level: "Moderate", advice: [...] }
}

export async function getHistory() {
  const response = await axios.get(`${BASE_URL}/get-history`);
  return response.data; // e.g., { entries: [...] }
}

// ----------------------------
// 🔹 External APIs
// ----------------------------
export async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
  const response = await axios.get(url);
  return {
    temp: response.data.main.temp,
    humidity: response.data.main.humidity,
    lat: response.data.coord.lat,
    lon: response.data.coord.lon,
    description: response.data.weather[0].description,
  };
}

export async function fetchAltitude(lat, lon) {
  const url = `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`;
  const response = await axios.get(url);
  return response.data.results[0].elevation;
}
