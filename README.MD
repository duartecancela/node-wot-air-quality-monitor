# node-wot-air-quality-monitor

A Web of Things (WoT) project to monitor air quality and control actuators using a simulated ESP32. The system uses:

- **Node-WoT** to consume and interact with Things via Thing Descriptions (TD)
- **MQTT** for communication between simulated ESP32 and WoT Servient
- **Express.js** API to expose sensor data and control actuators via HTTP
- **Thing Description** includes sensors, thresholds, actuator commands and LED states
- **Actuators (Fan, Buzzer)** controlled via MQTT actions
- **Sensor data and thresholds** received via MQTT topics and stored in MongoDB
- **LED states** reflect threshold evaluation (GREEN or RED) per parameter
- **React + Tailwind frontend** to view and control system

## ✅ Features

- Sensors: temperature, humidity, CO₂, noise
- Actuators: fan and buzzer (GET/POST)
- Thresholds: max values for each parameter (GET/POST)
- LED state visualisation
- MongoDB integration (persist full sensor sets)
- API Express server (REST interface)
- React frontend using Vite + Tailwind CSS
- ESP32 simulator (Python + MQTT)

## 📁 Folder Structure

```
node-wot-air-quality-monitor/
├── backend/                   # Express + WoT Servient
│   ├── server.js
│   ├── tests_full.js
│   └── package.json
├── frontend/                  # React frontend (Vite + Tailwind)
│   ├── src/
│   └── package.json
├── things/
│   └── thing-description.json
├── simulator/
│   ├── esp32_sim.py
│   └── run_simulator.bat
├── .gitignore
├── README.md
```

## 🔧 How to Run

### Backend
```bash
cd backend
npm install
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### MQTT Broker (if needed)
```bash
mosquitto
```

### ESP32 Simulator
```bash
cd simulator
run_simulator.bat
```

## 🔍 API Endpoints

### Sensor values
```
GET /temperature
GET /humidity
GET /co2
GET /noise
```

### Actuator states
```
GET /fan
GET /buzzer
```

### Control actuators
```
POST /fan       { "state": "ON" }
POST /buzzer    { "state": "OFF" }
```

### Thresholds
```
GET /thresholds
POST /thresholds/:parameter
```

### LED states
```
GET /ledStates
```

### Sensor history
```
GET /history
```

## 🖥️ Frontend (React + Vite + Tailwind CSS)

### ✅ Implemented features:
- Live sensor values (auto-refresh)
- LED state indicators (per parameter)
- Threshold max values display
- Threshold edit inputs
- Actuator states display (fan/buzzer)
- Actuator ON/OFF control buttons
- Tailwind-based responsive layout
- Modular components:
  - `SensorData.jsx`
  - `LedStates.jsx`
  - `Thresholds.jsx`
  - `ThresholdEditor.jsx`
  - `ActuatorStates.jsx`
  - `ActuatorControl.jsx`
  - `Header.jsx`, `Footer.jsx`

### 📦 Setup

```bash
cd frontend
npm install
npm run dev
```

Open: [http://localhost:5173](http://localhost:5173)

### 📊 LED State Display

- Uses `/ledStates`
- One circle per parameter: GREEN or RED
- Updated every 5 seconds

### 🎚️ Threshold Max Values

- Uses `/thresholds`
- Displays current limit for each sensor
- Updated every 5 seconds

### ✏️ Threshold Editor

- Sends new limits via `POST /thresholds/:parameter`
- Inputs per sensor, updated manually

### 🔘 Actuator States

- Uses `/fan` and `/buzzer`
- Displays ON/OFF for each actuator
- Updated every 5 seconds

### 🎛️ Actuator Control (ON/OFF)

- Uses `POST /fan` and `POST /buzzer`
- Two buttons per actuator: ON and OFF
- Sends `{"state": "ON"}` or `{"state": "OFF"}`
- Updates visual state in real-time
- Modular component: `ActuatorControl.jsx`

### 📄 History Page (`/history`)

- Uses `GET /history`
- Displays a full table of sensor values stored in MongoDB
- Columns: timestamp, temperature, humidity, CO₂, noise
- Uses its own route with React Router (`/history`)
- Navigation handled via `Header.jsx` using `react-router-dom`

### 🗃️ MongoDB CRUD (Sensor History)

* Full history of sensor records stored in MongoDB is displayed in the `/history` page
* Available actions per record:

  * ✏️ **Edit**: update temperature, humidity, CO₂ or noise values
  * 🗑️ **Delete**: remove the record from the database
* Each row shows the MongoDB `_id` and a human-readable `timestamp` (read-only)
* Data is sorted by most recent first (based on `timestamp`)
* Visual feedback is shown after successful edits and deletions using temporary success messages
* All operations use RESTful endpoints:

  * `PUT /history/:id`
  * `DELETE /history/:id`

