
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

// Initialize WoT Servient and consume Thing
const servient = new Servient();
servient.addClientFactory(new MqttClientFactory());

servient.start().then(WoT => {
    const td = JSON.parse(fs.readFileSync("../things/thing-description.json", "utf8"));
    WoT.consume(td).then(t => {
        thing = t;
        console.log("Consumed Thing:", thing.title);

        // Observers for each property
        ["temperature", "humidity", "co2", "noise", "fan", "buzzer"].forEach(prop => {
            thing.observeProperty(prop, async (data) => {
                const payload = await data.value();
                lastReadings[prop] = payload.value || payload.state || payload;
                console.log(`[OBSERVED] ${prop}:`, lastReadings[prop]);
            });
        });
    });
});

// GET endpoints to retrieve last values
app.get("/:property", (req, res) => {
    const prop = req.params.property;
    if (lastReadings.hasOwnProperty(prop)) {
        res.json({ value: lastReadings[prop] });
    } else {
        res.status(404).json({ error: "Property not found" });
    }
});

// POST endpoint to control fan or buzzer
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

// Start HTTP server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API server listening at http://localhost:${PORT}`);
});
