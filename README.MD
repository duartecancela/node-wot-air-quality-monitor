# node-wot-air-quality-monitor

A Web of Things (WoT) project to monitor air quality and control actuators using a simulated ESP32. The system uses:

- **Node-WoT** to consume and interact with Things via Thing Descriptions (TD)
- **MQTT** for communication between simulated ESP32 and WoT Servient
- **Express.js** API to expose sensor data and control actuators via HTTP
- **Thing Description** includes sensors, thresholds, actuator commands and LED states
- **Actuators (Fan, Buzzer)** controlled via MQTT actions
- **Sensor data and thresholds** received via MQTT topics and stored in memory
- **LED states** reflect threshold evaluation (GREEN or RED) per parameter

## ✅ Current Features

- Full MQTT integration for:
  - Sensors: temperature, humidity, CO₂, noise
  - Thresholds: configurable max values for each parameter
  - Actuators: fan and buzzer (state + control)
  - LED states: per parameter (temperature, humidity, co2, noise)
- Thing Description (`thing-description.json`) modeled according to W3C WoT using `input` with JSON payloads
- Express API server (`server.js`) with WoT integration and in-memory history
- ESP32 Python simulator fully compatible with WoT `input` actions
- `tests_full.js` to validate all actions via Node-WoT programmatically

## 📁 Folder Structure

```
node-wot-air-quality-monitor/
├── backend/
│   ├── server.js                 # Express API with WoT integration
│   ├── tests_full.js             # Node-WoT actions test runner
│   └── package.json
├── frontend/                     # React frontend (to be developed)
│   ├── public/
│   ├── src/
│   └── package.json
├── things/
│   └── thing-description.json    # WoT Thing Description file
├── esp32_simulator.py            # Python-based MQTT simulator for ESP32
├── .gitignore
├── README.md
```

## 🔧 How to Run

1. Install backend dependencies:
   ```bash
   cd backend
   npm install express body-parser @node-wot/core @node-wot/binding-mqtt
   ```

2. Start your MQTT broker (e.g. Mosquitto):
   ```bash
   mosquitto
   ```

3. Run the ESP32 simulator:
   ```bash
   python esp32_simulator.py
   ```

4. Run the Express API server:
   ```bash
   node backend/server.js
   ```

5. (Optional) Run test script to trigger actions:
   ```bash
   node backend/tests_full.js
   ```

## 🔍 Test the Express API

### Read sensor data:
```bash
curl http://localhost:3000/temperature
curl http://localhost:3000/humidity
curl http://localhost:3000/co2
curl http://localhost:3000/noise
```

### Get actuator states:
```bash
curl http://localhost:3000/fan
curl http://localhost:3000/buzzer
```

### Get LED states and thresholds:
```bash
curl http://localhost:3000/ledStates
curl http://localhost:3000/thresholds
```

### Control actuators:
```bash
curl -X POST http://localhost:3000/fan -H "Content-Type: application/json" -d '{"state":"ON"}'
curl -X POST http://localhost:3000/buzzer -H "Content-Type: application/json" -d '{"state":"OFF"}'
```

### Update parameter thresholds:
```bash
curl -X POST http://localhost:3000/thresholds/temperature -H "Content-Type: application/json" -d '{"value":29.5}'
curl -X POST http://localhost:3000/thresholds/humidity -H "Content-Type: application/json" -d '{"value":55}'
curl -X POST http://localhost:3000/thresholds/co2 -H "Content-Type: application/json" -d '{"value":900}'
curl -X POST http://localhost:3000/thresholds/noise -H "Content-Type: application/json" -d '{"value":80}'
```

### Get full sensor history (in-memory):
```bash
curl http://localhost:3000/history
```

## 🗺️ Next Steps

- Add React frontend dashboard to view and control all data
- Add MongoDB to persist sensor history
- Add user authentication and security layer (optional)

## 📝 License

MIT

## API Backend

A API está localizada na pasta `backend/` e utiliza o Express.js. Os endpoints disponíveis atualmente são:

### Endpoints

- `GET /history`  
  Retorna uma lista de dados recebidos dos sensores.  
  **Exemplo de resposta:**
  ```json
  [
    {
      "timestamp": "2025-05-26T11:00:55.750Z",
      "temperature": 36.48,
      "humidity": 42.42,
      "co2": 727,
      "noise": 52
    }
  ]
  ```

- `POST /data`  
  Endpoint utilizado para receber os dados publicados pelo simulador (ou pelo ESP32 real no futuro).  
  Os dados devem estar no formato:
  ```json
  {
    "temperature": 36.5,
    "humidity": 42.4,
    "co2": 727,
    "noise": 52
  }
  ```

## Simulador

O ficheiro `backend/tests.js` simula um ESP32 que envia dados via HTTP POST para a API.  
Pode ser usado com:
```bash
node backend/tests.js
```

## Thing Description

A descrição WoT encontra-se no ficheiro `things/thing-description.json`, compatível com o Node-WoT.

## ESP32 Simulator

A simulator for the ESP32 is available in the `simulator/` folder. It simulates sensor data and communicates with the system via MQTT.

### Requirements
- Python 3 installed
- An MQTT broker running locally (e.g., Mosquitto)

### How to run (Windows)
Run the script:

```bash
simulator\run_simulator.bat
```

This script will:
- Create a virtual environment (`venv/`) if it does not already exist
- Install the required `paho-mqtt` library
- Launch the simulator (`esp32_sim.py`)

The simulator:
- Publishes random sensor values for temperature, humidity, CO₂, and noise
- Listens for actuator commands (fan and buzzer)
- Updates LED status based on threshold values
- Allows remote configuration of threshold values via MQTT topics

## 🗄️ MongoDB Integration

All valid sensor data received from the WoT-consumed Thing via MQTT is stored in a MongoDB collection called `readings`, located in the `air_data` database.

Only full sets of sensor values (temperature, humidity, CO₂, and noise) are stored to ensure data consistency and avoid duplicates.

For testing purposes, the database is automatically cleared each time the Express server is stopped (e.g., via CTRL+C). This ensures a clean state every time the server is restarted.

## 🖥️ Frontend (React + Vite + Tailwind CSS)

The frontend is located in the `frontend/` folder and was created using [Vite](https://vitejs.dev/) with React and Tailwind CSS.

### ✅ Features implemented so far:
- Displays live sensor values: temperature, humidity, CO₂, and noise
- Automatically updates sensor values every 5 seconds
- Styled with Tailwind CSS
- Modular components (`Header`, `Footer`, `SensorData`)
- Fully connected to the Express backend via `fetch`

### 📦 Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Run the frontend development server:
   ```bash
   npm run dev
   ```

4. Open the browser:
   ```
   http://localhost:5173
   ```

Make sure the backend is running on `http://localhost:3000` and CORS is enabled in the Express app.