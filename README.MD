
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
- Thing Description (`thing-description.json`) modeled according to W3C WoT
- Node-WoT Servient (`wot-servient.js`) for real-time observation and testing
- Express API server (`server_full.js`) exposing all data via REST
- Functional ESP32 Python simulator with adjustable thresholds and logic
- Endpoints for full WoT interaction (observe, invokeAction, get, post)

## 📁 Folder Structure

```
node-wot-air-quality-monitor/
├── backend/
│   ├── server_full.js             # Full Express API with WoT integration
│   ├── wot-servient.js            # Node-WoT test runner
│   └── package.json
├── frontend/                      # React frontend (to be developed)
│   ├── public/
│   ├── src/
│   └── package.json
├── things/
│   └── thing-description.json     # WoT Thing Description file
├── esp32_simulator.py             # Python-based MQTT simulator for ESP32
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

4. Run the Node-WoT test script (optional):
   ```bash
   node backend/wot-servient.js
   ```

5. Run the Express API server:
   ```bash
   node backend/server_full.js
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
curl -X POST http://localhost:3000/thresholds/co2 -H "Content-Type: application/json" -d '{"value":950}'
curl -X POST http://localhost:3000/thresholds/temperature -H "Content-Type: application/json" -d '{"value":29.5}'
```

## 🗺️ Next Steps

- Add React frontend dashboard to view and control all data
- Add MongoDB to persist sensor history
- Add user authentication and security layer (optional)

## 📝 License

MIT
