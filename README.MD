# node-wot-air-quality-monitor

This is the base structure of a Web of Things (WoT) project to monitor air quality using a simulated ESP32 device. The system uses:

- **Node-WoT** to consume and interact with IoT Things via Thing Descriptions (TD)
- **Express** (to be added) as backend API framework
- **React** (frontend folder scaffolded)
- **MQTT** as the communication protocol between devices
- **No security** is applied for now, as this is an early development stage

## ✅ Current Features

- Project initialized with separate `backend/` and `frontend/` folders
- Base folder structure created
- Thing Description (`thing-description.json`) written to describe a temperature sensor
- Node-WoT servient (`wot-servient.js`) implemented to consume the Thing and observe temperature values via MQTT
- `.gitignore` updated to ignore common Node.js and React build artifacts

## 📁 Folder Structure

```
node-wot-air-quality-monitor/
├── backend/               # Node.js with Node-WoT
│   ├── server.js
│   ├── wot-servient.js
│   └── package.json
├── frontend/              # React frontend (empty for now)
│   ├── public/
│   ├── src/
│   └── package.json
├── things/
│   └── thing-description.json
├── .gitignore
├── README.md
```

## 🔧 How to Run

1. Install dependencies:
   ```bash
   cd backend
   npm install @node-wot/core @node-wot/binding-mqtt
   ```

2. Start a local MQTT broker (e.g. Mosquitto on `localhost:1883`).

3. Run the Node-WoT servient:
   ```bash
   node wot-servient.js
   ```

4. Use an ESP32 simulator to publish temperature to:
   ```
   topic: sensor/temperature
   ```

## 🗺️ Next Steps

- Add support for humidity readings
- Expose data via HTTP using Express
- Store sensor data (optionally with MongoDB later)
- Build and integrate React frontend

## 📝 License

MIT
