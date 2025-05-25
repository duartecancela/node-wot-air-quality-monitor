
# node-wot-air-quality-monitor

A Web of Things (WoT) project to monitor air quality and control actuators using a simulated ESP32. The system uses:

- **Node-WoT** to consume and interact with Things via Thing Descriptions (TD)
- **MQTT** for communication between simulated ESP32 and WoT Servient
- **Express.js** API to expose sensor data and control actuators via HTTP
- **Thing Description** includes multiple properties and actions
- **Actuators (Fan, Buzzer)** controlled via MQTT actions
- **Sensor data** received via MQTT topics and displayed in real-time

## ✅ Current Features

- Full MQTT integration for:
  - Sensors: temperature, humidity, CO₂, noise
  - Actuators: fan and buzzer (state + control)
- Thing Description (`thing-description.json`) modeled according to W3C WoT
- Node-WoT Servient (`server.js`) observes and logs all sensor data
- Support for `invokeAction()` to control actuators (via WoT + API)
- Functional ESP32 Python simulator provided
- REST API to query sensor data and control actuators
- Git repository properly initialized and ready for collaboration

## 📁 Folder Structure

```
node-wot-air-quality-monitor/
├── backend/               # Node.js with Node-WoT + Express
│   ├── server.js
│   ├── wot-servient.js (optional legacy)
│   └── package.json
├── frontend/              # React frontend (to be developed)
│   ├── public/
│   ├── src/
│   └── package.json
├── things/
│   └── thing-description.json
├── esp32_simulator.py     # MQTT simulator for ESP32
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

4. Run the Node-WoT API server:
   ```bash
   node backend/server.js
   ```

5. Test the API endpoints:

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

### Control actuators:

```bash
curl -X POST http://localhost:3000/fan -H "Content-Type: application/json" -d '{"state":"ON"}'
curl -X POST http://localhost:3000/buzzer -H "Content-Type: application/json" -d '{"state":"OFF"}'
```

## 🗺️ Next Steps

- Add React frontend dashboard to view and control data
- Add MongoDB to persist sensor history
- Add user authentication and security layer

## 📝 License

MIT
