// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const { Servient } = require("@node-wot/core");
const MqttClientFactory = require("@node-wot/binding-mqtt").MqttClientFactory;
const fs = require("fs");
const { MongoClient } = require("mongodb"); // MongoDB module
const cors = require('cors') 

// Initialize Express app
const app = express();

app.use(cors()); 

app.use(bodyParser.json());

// Placeholder for the WoT Thing
let thing;

// Store latest sensor and actuator readings
const lastReadings = {
    temperature: null,
    humidity: null,
    co2: null,
    noise: null,
    fan: null,
    buzzer: null,
    ledStates: null,
    thresholds: null
};

// Array to store sensor history (also saved to MongoDB)
const sensorHistory = [];

// MongoDB connection setup
const mongoUrl = "mongodb://127.0.0.1:27017";
const dbName = "air_data";
let mongoClient, mongoCollection;

// Connect to MongoDB and store reference to the collection
MongoClient.connect(mongoUrl)
    .then(client => {
        mongoClient = client;
        const db = client.db(dbName);
        mongoCollection = db.collection("readings");
        console.log("Connected to MongoDB");
    })
    .catch(err => console.error("MongoDB connection error:", err));

// Setup WoT Servient with MQTT
const mqttFactory = new MqttClientFactory();
const servient = new Servient();
servient.addClientFactory(mqttFactory);

servient.addCredentials({
  "urn:dev:ops:air-quality-monitor": {
    username: "esp32user",
    password: "password"
  }
});


servient.start().then(WoT => {
    const td = JSON.parse(fs.readFileSync("../things/thing-description.json", "utf8"));
    WoT.consume(td).then(t => {
        thing = t;
        console.log("Consumed Thing:", thing.title);

        // Use buffer to group sensor values before saving
        const pendingValues = {
            temperature: null,
            humidity: null,
            co2: null,
            noise: null
        };

        // Observe each sensor property
        ["temperature", "humidity", "co2", "noise"].forEach(prop => {
            thing.observeProperty(prop, async (data) => {
                try {
                    const payload = await data.value();
                    lastReadings[prop] = typeof payload.value === "number" ? payload.value : null;
                    pendingValues[prop] = lastReadings[prop];

                    // Check if we have a complete data set
                    if (
                        pendingValues.temperature !== null &&
                        pendingValues.humidity !== null &&
                        pendingValues.co2 !== null &&
                        pendingValues.noise !== null
                    ) {
                        const snapshot = {
                            timestamp: new Date().toISOString(),
                            temperature: pendingValues.temperature,
                            humidity: pendingValues.humidity,
                            co2: pendingValues.co2,
                            noise: pendingValues.noise
                        };

                        sensorHistory.push(snapshot);
                        if (mongoCollection) {
                            mongoCollection.insertOne(snapshot).catch(err =>
                                console.error("[MongoDB] Failed to insert snapshot:", err)
                            );
                        }

                        // Reset buffer
                        pendingValues.temperature = null;
                        pendingValues.humidity = null;
                        pendingValues.co2 = null;
                        pendingValues.noise = null;
                    }
                } catch (err) {
                    console.error(`[ERROR] Failed to read ${prop}:`, err);
                }
            });
        });

        // Observe actuator properties
        ["fan", "buzzer"].forEach(prop => {
            thing.observeProperty(prop, async (data) => {
                try {
                    const payload = await data.value();
                    lastReadings[prop] = typeof payload.state === "string" ? payload.state : null;
                } catch (err) {
                    console.error(`[ERROR] Failed to read ${prop}:`, err);
                }
            });
        });

        // Observe LEDs and thresholds
        thing.observeProperty("ledStates", async (data) => {
            try {
                lastReadings.ledStates = await data.value();
            } catch (err) {
                console.error("[ERROR] Failed to read ledStates:", err);
            }
        });

        thing.observeProperty("thresholds", async (data) => {
            try {
                lastReadings.thresholds = await data.value();
            } catch (err) {
                console.error("[ERROR] Failed to read thresholds:", err);
            }
        });
    });
});

// Return all readings stored in MongoDB, ordered by most recent
app.get("/history", async (req, res) => {
    try {
        const data = await mongoCollection.find().sort({ timestamp: -1 }).toArray();
        res.json(data);
    } catch (err) {
        console.error("Failed to fetch history from MongoDB:", err);
        res.status(500).json({ error: "Failed to fetch history" });
    }
});


// Return the latest reading of a given property
app.get("/:property", (req, res) => {
    const prop = req.params.property;
    if (lastReadings.hasOwnProperty(prop)) {
        res.json({ value: lastReadings[prop] });
    } else {
        res.status(404).json({ error: "Property not found" });
    }
});

// Set the state of actuators (fan or buzzer)
app.post("/:actuator", (req, res) => {
    const actuator = req.params.actuator;
    const { state } = req.body;

    if (!["fan", "buzzer"].includes(actuator)) {
        return res.status(400).json({ error: "Invalid actuator" });
    }

    if (!["ON", "OFF"].includes(state)) {
        return res.status(400).json({ error: "State must be 'ON' or 'OFF'" });
    }

    const actionName = actuator === "fan" ? "setFanState" : "setBuzzerState";

    thing.invokeAction(actionName, { state })
        .then(() => {
            console.log(`[ACTION] ${actuator} -> ${state}`);
            res.json({ status: "OK", actuator, state });
        })
        .catch(err => {
            console.error("Action failed:", err);
            res.status(500).json({ error: "Action failed" });
        });
});

// Update threshold values for sensor parameters
app.post("/thresholds/:param", (req, res) => {
    const param = req.params.param;
    const { value } = req.body;

    const actionMap = {
        temperature: "setTemperatureLimit",
        humidity: "setHumidityLimit",
        co2: "setCo2Limit",
        noise: "setNoiseLimit"
    };

    if (!actionMap.hasOwnProperty(param)) {
        return res.status(400).json({ error: "Invalid parameter" });
    }

    if (typeof value !== "number") {
        return res.status(400).json({ error: "Value must be a number" });
    }

    thing.invokeAction(actionMap[param], { value })
        .then(() => {
            console.log(`[ACTION] Updated ${param} threshold to ${value}`);
            res.json({ status: "OK", parameter: param, value });
        })
        .catch(err => {
            console.error("Threshold update failed:", err);
            res.status(500).json({ error: "Threshold update failed" });
        });
});


// CRUD operations for MongoDB sensor history
const { ObjectId } = require("mongodb");

// Get one reading by ID
app.get("/history/:id", async (req, res) => {
    try {
        const doc = await mongoCollection.findOne({ _id: new ObjectId(req.params.id) });
        if (!doc) return res.status(404).json({ error: "Reading not found" });
        res.json(doc);
    } catch (err) {
        res.status(400).json({ error: "Invalid ID format" });
    }
});

// Update one reading
app.put("/history/:id", async (req, res) => {
    const { temperature, humidity, co2, noise } = req.body;
    try {
        const result = await mongoCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { temperature, humidity, co2, noise } }
        );
        if (result.matchedCount === 0)
            return res.status(404).json({ error: "Reading not found" });
        res.json({ status: "Updated", id: req.params.id });
    } catch (err) {
        res.status(400).json({ error: "Invalid ID or update" });
    }
});

// Delete one reading
app.delete("/history/:id", async (req, res) => {
    try {
        const result = await mongoCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0)
            return res.status(404).json({ error: "Reading not found" });
        res.json({ status: "Deleted", id: req.params.id });
    } catch (err) {
        res.status(400).json({ error: "Invalid ID" });
    }
});

// Delete all readings (use with caution!)
app.delete("/history", async (req, res) => {
    try {
        const result = await mongoCollection.deleteMany({});
        res.json({ status: "All readings deleted", count: result.deletedCount });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete all" });
    }
});


// Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API server listening at http://localhost:${PORT}`);
});

// Graceful shutdown: clear database on server exit (for testing)
// function cleanupAndExit() {
//     if (mongoCollection) {
//         mongoCollection.deleteMany({})
//             .then(() => {
//                 console.log("✅ Cleared MongoDB collection before exit");
//                 process.exit(0);
//             })
//             .catch(err => {
//                 console.error("❌ Failed to clear collection on exit:", err);
//                 process.exit(1);
//             });
//     } else {
//         process.exit(0);
//     }
// }

// Catch CTRL+C or termination signals
// process.on("SIGINT", cleanupAndExit);
// process.on("SIGTERM", cleanupAndExit);