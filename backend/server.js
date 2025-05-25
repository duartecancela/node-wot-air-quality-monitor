
const express = require("express");
const bodyParser = require("body-parser");
const { Servient } = require("@node-wot/core");
const MqttClientFactory = require("@node-wot/binding-mqtt").MqttClientFactory;
const fs = require("fs");

const app = express();
app.use(bodyParser.json());

let thing;
let lastReadings = {
    temperature: null,
    humidity: null,
    co2: null,
    noise: null,
    fan: null,
    buzzer: null
};

const servient = new Servient();
servient.addClientFactory(new MqttClientFactory());

servient.start().then(WoT => {
    const td = JSON.parse(fs.readFileSync("../things/thing-description.json", "utf8"));
    WoT.consume(td).then(t => {
        thing = t;
        console.log("Consumed Thing:", thing.title);

        // Robust data observation with null fallback
        const observeAndStore = (prop, field = "value") => {
            thing.observeProperty(prop, async (data) => {
                try {
                    const payload = await data.value();
                    const extracted = payload[field];
                    lastReadings[prop] = typeof extracted === "number" || typeof extracted === "string" ? extracted : null;
                    console.log(`[OBSERVED] ${prop}:`, lastReadings[prop]);
                } catch (err) {
                    console.error(`[ERROR] Failed to read ${prop}:`, err);
                    lastReadings[prop] = null;
                }
            });
        };

        observeAndStore("temperature");
        observeAndStore("humidity");
        observeAndStore("co2");
        observeAndStore("noise");
        observeAndStore("fan", "state");
        observeAndStore("buzzer", "state");
    });
});

// GET endpoint to retrieve last values
app.get("/:property", (req, res) => {
    const prop = req.params.property;
    if (lastReadings.hasOwnProperty(prop)) {
        res.json({ value: lastReadings[prop] });
    } else {
        res.status(404).json({ error: "Property not found" });
    }
});

// POST endpoint to control actuators
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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API server listening at http://localhost:${PORT}`);
});
