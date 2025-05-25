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

        // Subscribe to temperature updates
        thing.observeProperty("temperature", async (data) => {
            try {
                const payload = await data.value();
                console.log("Temperature:", payload.value); // Extracts value from JSON
            } catch (err) {
                console.error("Failed to read temperature:", err);
            }
        });

        // Subscribe to humidity updates
        thing.observeProperty("humidity", async (data) => {
            try {
                const payload = await data.value();
                console.log("Humidity:", payload.value);
            } catch (err) {
                console.error("Failed to read humidity:", err);
            }
        });

        // Subscribe to CO₂ updates
        thing.observeProperty("co2", async (data) => {
            try {
                const payload = await data.value();
                console.log("CO₂:", payload.value);
            } catch (err) {
                console.error("Failed to read CO₂:", err);
            }
        });

        // Subscribe to noise updates
        thing.observeProperty("noise", async (data) => {
            try {
                const payload = await data.value();
                console.log("Noise:", payload.value);
            } catch (err) {
                console.error("Failed to read noise:", err);
            }
        });

        // Subscribe to fan state
        thing.observeProperty("fan", async (data) => {
            try {
                const payload = await data.value();
                console.log("Fan state:", payload.state);
            } catch (err) {
                console.error("Failed to read fan state:", err);
            }
        });

        // Subscribe to buzzer state
        thing.observeProperty("buzzer", async (data) => {
            try {
                const payload = await data.value();
                console.log("Buzzer state:", payload.state);
            } catch (err) {
                console.error("Failed to read buzzer state:", err);
            }
        });

        // Turn fan ON
        thing.invokeAction("setFanState", { state: "ON" })
            .then(() => console.log("Fan ON command sent"))
            .catch((err) => console.error("Error sending fan command:", err));

        // Turn buzzer OFF
        thing.invokeAction("setBuzzerState", { state: "OFF" })
            .then(() => console.log("Buzzer OFF command sent"))
            .catch((err) => console.error("Error sending buzzer command:", err));


    });
});
