
# node-wot-air-quality-monitor

A Web of Things (WoT) project to monitor air quality and control actuators using a simulated ESP32. The system uses:

- **Node-WoT** to consume and interact with Things via Thing Descriptions (TD)
- **MQTT** for communication between simulated ESP32 and WoT Servient
- **Thing Description** includes multiple properties and actions
- **Actuators (Fan, Buzzer)** controlled via MQTT actions
- **Sensor data** received via MQTT topics and displayed in real-time
- **No security** applied yet – development phase

## ✅ Current Features

- Full MQTT integration for:
  - Sensors: temperature, humidity, CO₂, noise
  - Actuators: fan and buzzer (state + control)
- Thing Description (`thing-description.json`) modeled according to W3C WoT
- Node-WoT Servient (`wot-servient.js`) receives and logs all sensor data
- Support for `invokeAction()` to control actuators
- Functional ESP32 Python simulator provided
- Git repository properly initialized and ready for collaboration

## 📁 Folder Structure

```
node-wot-air-quality-monitor/
├── backend/               # Node.js with Node-WoT
│   ├── server.js
│   ├── wot-servient.js
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
   npm install @node-wot/core @node-wot/binding-mqtt
   ```

2. Start your MQTT broker (e.g. Mosquitto):
   ```bash
   mosquitto
   ```

3. Run the ESP32 simulator:
   ```bash
   python esp32_simulator.py
   ```

4. Run the Node-WoT Servient:
   ```bash
   node backend/wot-servient.js
   ```

5. Optional – Send manual commands via MQTT:
   ```bash
   mosquitto_pub -t actuator/fan -m '{"state": "ON"}'
   mosquitto_pub -t actuator/buzzer -m '{"state": "OFF"}'
   ```

## 🗺️ Next Steps

- Expose latest values via HTTP using Express API
- Add React frontend dashboard to control and view data
- Add MongoDB integration to persist history
- Add security layer for remote access

## 📝 License

MIT
