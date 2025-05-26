
const { Servient } = require("@node-wot/core");
const MqttClientFactory = require("@node-wot/binding-mqtt").MqttClientFactory;
const fs = require("fs");

const servient = new Servient();
servient.addClientFactory(new MqttClientFactory());

const td = JSON.parse(fs.readFileSync("../things/thing-description.json", "utf8"));

servient.start().then(WoT => {
  WoT.consume(td).then(thing => {
    console.log("✅ Consumed Thing:", thing.title);

    // Temperatura
    thing.invokeAction("setTemperatureLimit", { value: 29.5 })
      .then(() => console.log("✔️ Temperature threshold set to 29.5"))
      .catch(err => console.error("❌ Temperature error:", err));

    // Humidade
    thing.invokeAction("setHumidityLimit", { value: 55 })
      .then(() => console.log("✔️ Humidity threshold set to 55"))
      .catch(err => console.error("❌ Humidity error:", err));

    // CO₂
    thing.invokeAction("setCo2Limit", { value: 900 })
      .then(() => console.log("✔️ CO₂ threshold set to 900"))
      .catch(err => console.error("❌ CO₂ error:", err));

    // Ruído
    thing.invokeAction("setNoiseLimit", { value: 80 })
      .then(() => console.log("✔️ Noise threshold set to 80"))
      .catch(err => console.error("❌ Noise error:", err));
  });
});

