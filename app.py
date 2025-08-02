from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime
import json
import os
import requests

app = Flask(__name__)
CORS(app)

# Constants
OPENWEATHER_API_KEY = "YOUR_API_KEY"  # Replace with your OpenWeatherMap key
DATA_FILE_PATH = "user_data.json"

# Helper functions
def load_health_log():
    if os.path.exists(DATA_FILE_PATH):
        with open(DATA_FILE_PATH, "r") as f:
            return json.load(f)
    return {"entries": []}

def save_to_health_log(entry):
    data = load_health_log()
    data["entries"].append(entry)
    with open(DATA_FILE_PATH, "w") as f:
        json.dump(data, f, indent=4)

def generate_advice(data):
    fatigue = data["fatigue_level"]
    hydration = data["hydration_ml"]
    temperature = data["temperature"]
    steps = data["steps_count"]

    advice = []

    if fatigue >= 7:
        advice.append("High fatigue detected. Take rest immediately.")
    elif fatigue >= 4:
        advice.append("Moderate fatigue detected. Take breaks and stay hydrated.")
    else:
        advice.append("Fatigue levels are normal.")

    if hydration < 1200:
        advice.append("Increase your water intake.")
    else:
        advice.append("Hydration is adequate.")

    if steps > 5000:
        advice.append("Great job staying active today!")
    elif steps < 1000:
        advice.append("Try to move around more to improve circulation.")
    else:
        advice.append("Nice! Maintain this activity level.")

    if temperature > 35:
        advice.append("High temperature detected. Stay cool and hydrated.")
    elif temperature > 30:
        advice.append("Moderate heat. Avoid strenuous activity.")
    else:
        advice.append("Temperature is within safe range.")

    return advice

# Routes
@app.route('/')
def index():
    return '✅ Sicklemate backend is running. Try: /submit-data, /get-history, /analyze-location'

@app.route('/submit-data', methods=['POST'])
def submit_data():
    try:
        data = request.get_json()
        data["timestamp"] = datetime.datetime.now().isoformat()
        advice = generate_advice(data)
        save_to_health_log(data)

        return jsonify({
            "status": "success",
            "received": data,
            "advice": advice
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/get-history', methods=['GET'])
def get_history():
    try:
        data = load_health_log()
        return jsonify(data)
    except Exception as e:
        return jsonify({"status": "fail", "message": str(e)}), 500

@app.route('/analyze-location', methods=['POST'])
def analyze_location():
    try:
        data = request.get_json()
        location = data.get("location")  # ✅ changed from "place" to "location"

        # Geocoding
        geo_url = f"http://api.openweathermap.org/geo/1.0/direct?q={location}&limit=1&appid={OPENWEATHER_API_KEY}"
        geo_response = requests.get(geo_url).json()

        if not geo_response:
            return jsonify({"status": "error", "message": "Location not found"}), 400

        lat = geo_response[0]["lat"]
        lon = geo_response[0]["lon"]

        # Weather
        weather_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
        weather_data = requests.get(weather_url).json()
        temperature = weather_data["main"]["temp"]

        # Altitude
        elevation_url = f"https://api.open-elevation.com/api/v1/lookup?locations={lat},{lon}"
        elevation_data = requests.get(elevation_url).json()
        altitude = elevation_data["results"][0]["elevation"]

        # Risk analysis
        advice = []
        risk_level = "Low"

        if temperature > 35:
            advice.append("High temperatures detected. Avoid travel during the hottest hours.")
            risk_level = "High"
        elif temperature > 30:
            advice.append("Moderate heat. Carry water and rest as needed.")
            risk_level = "Moderate"
        else:
            advice.append("Temperature is safe.")

        if altitude > 1500:
            advice.append("High altitude detected. May cause fatigue or breathing issues.")
            risk_level = "High"
        elif altitude > 800:
            advice.append("Moderate altitude. People with health conditions should take precautions.")
            if risk_level != "High":
                risk_level = "Moderate"
        else:
            advice.append("Altitude is safe.")

        result = {
            "location": location,
            "latitude": lat,
            "longitude": lon,
            "temperature": temperature,
            "altitude": altitude,
            "risk_level": risk_level,
            "advice": advice,
            "status": "success"
        }

        return jsonify(result)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
