
// Import required WoT libraries
const { Servient } = require("@node-wot/core");
const MqttClientFactory = require("@node-wot/binding-mqtt").MqttClientFactory;
const fs = require("fs");

// Create Servient and add MQTT binding
const servient = new Servient();
servient.addClientFactory(new MqttClientFactory());

// Read Thing Description from file
const td = JSON.parse(fs.readFileSync("../things/thing-description.json", "utf8"));

// Start servient and consume the Thing
servient.start().then((WoT) => {
    WoT.consume(td).then((thing) => {
        console.log(`Consumed Thing: ${thing.title}`);

        // Observe each sensor property
        ["temperature", "humidity", "co2", "noise"].forEach((prop) => {
            thing.observeProperty(prop, async (data) => {
                try {
                    const payload = await data.value();
                    const value = typeof payload.value === "number" ? payload.value : null;
                    console.log(`${prop[0].toUpperCase() + prop.slice(1)}:`, value);
                } catch (err) {
                    console.error(`Failed to read ${prop}:`, err);
                }
            });
        });

        // Observe fan and buzzer states
        ["fan", "buzzer"].forEach((prop) => {
            thing.observeProperty(prop, async (data) => {
                try {
                    const payload = await data.value();
                    const state = typeof payload.state === "string" ? payload.state : null;
                    console.log(`${prop[0].toUpperCase() + prop.slice(1)} state:`, state);
                } catch (err) {
                    console.error(`Failed to read ${prop} state:`, err);
                }
            });
        });

        // Observe LED states
        thing.observeProperty("ledStates", async (data) => {
            try {
                const states = await data.value();
                console.log("LED States:", states);
            } catch (err) {
                console.error("Failed to read LED states:", err);
            }
        });

        // Observe current thresholds
        thing.observeProperty("thresholds", async (data) => {
            try {
                const values = await data.value();
                console.log("Thresholds:", values);
            } catch (err) {
                console.error("Failed to read thresholds:", err);
            }
        });

        // Set thresholds for each parameter (example values)
        thing.invokeAction("setTemperatureLimit", {}, { uriVariables: { value: 29.5 } })
            .then(() => console.log("Set temperature threshold"))
            .catch((err) => console.error("Error setting temperature threshold:", err));

        thing.invokeAction("setHumidityLimit", {}, { uriVariables: { value: 55 } })
            .then(() => console.log("Set humidity threshold"))
            .catch((err) => console.error("Error setting humidity threshold:", err));

        thing.invokeAction("setCo2Limit", {}, { uriVariables: { value: 850 } })
            .then(() => console.log("Set CO2 threshold"))
            .catch((err) => console.error("Error setting CO2 threshold:", err));

        thing.invokeAction("setNoiseLimit", {}, { uriVariables: { value: 75 } })
            .then(() => console.log("Set noise threshold"))
            .catch((err) => console.error("Error setting noise threshold:", err));
    });
});
