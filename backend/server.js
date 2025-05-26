
const express = require("express");
const bodyParser = require("body-parser");
const { Servient } = require("@node-wot/core");
const MqttClientFactory = require("@node-wot/binding-mqtt").MqttClientFactory;
const fs = require("fs");

const app = express();
app.use(bodyParser.json());

let thing;
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

const servient = new Servient();
servient.addClientFactory(new MqttClientFactory());

servient.start().then(WoT => {
    const td = JSON.parse(fs.readFileSync("../things/thing-description.json", "utf8"));
    WoT.consume(td).then(t => {
        thing = t;
        console.log("Consumed Thing:", thing.title);

        ["temperature", "humidity", "co2", "noise"].forEach(prop => {
            thing.observeProperty(prop, async (data) => {
                try {
                    const payload = await data.value();
                    lastReadings[prop] = typeof payload.value === "number" ? payload.value : null;
                    console.log(`[OBSERVED] ${prop}:`, lastReadings[prop]);
                } catch (err) {
                    console.error(`[ERROR] Failed to read ${prop}:`, err);
                }
            });
        });

        ["fan", "buzzer"].forEach(prop => {
            thing.observeProperty(prop, async (data) => {
                try {
                    const payload = await data.value();
                    lastReadings[prop] = typeof payload.state === "string" ? payload.state : null;
                    console.log(`[OBSERVED] ${prop} state:`, lastReadings[prop]);
                } catch (err) {
                    console.error(`[ERROR] Failed to read ${prop}:`, err);
                }
            });
        });

        thing.observeProperty("ledStates", async (data) => {
            try {
                const states = await data.value();
                lastReadings.ledStates = states;
                console.log("[OBSERVED] ledStates:", states);
            } catch (err) {
                console.error("[ERROR] Failed to read ledStates:", err);
            }
        });

        thing.observeProperty("thresholds", async (data) => {
            try {
                const values = await data.value();
                lastReadings.thresholds = values;
                console.log("[OBSERVED] thresholds:", values);
            } catch (err) {
                console.error("[ERROR] Failed to read thresholds:", err);
            }
        });
    });
});

app.get("/:property", (req, res) => {
    const prop = req.params.property;
    if (lastReadings.hasOwnProperty(prop)) {
        res.json({ value: lastReadings[prop] });
    } else {
        res.status(404).json({ error: "Property not found" });
    }
});

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

    thing.invokeAction(actionMap[param], {}, { uriVariables: { value } })
        .then(() => {
            console.log(`[ACTION] Updated ${param} threshold to ${value}`);
            res.json({ status: "OK", parameter: param, value });
        })
        .catch(err => {
            console.error("Threshold update failed:", err);
            res.status(500).json({ error: "Threshold update failed" });
        });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API server listening at http://localhost:${PORT}`);
});
