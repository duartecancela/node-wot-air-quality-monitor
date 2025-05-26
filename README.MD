## API Backend

The API is located in the `backend/` folder and is built with Express.js. The currently available endpoints are:

### Endpoints

- `GET /history`  
  Returns a list of sensor data received.  
  **Example response:**
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
  Endpoint used to receive data sent by the simulator (or by a real ESP32 in the future).  
  Data must be in the following format:
  ```json
  {
    "temperature": 36.5,
    "humidity": 42.4,
    "co2": 727,
    "noise": 52
  }
  ```

## Simulator

The `backend/tests.js` file simulates an ESP32 sending HTTP POST data to the API.  
It can be run with:
```bash
node backend/tests.js
```

## Thing Description

The WoT description is located in the `things/thing-description.json` file and is compatible with Node-WoT.

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