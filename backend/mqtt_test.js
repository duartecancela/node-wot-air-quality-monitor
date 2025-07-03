const mqtt = require("mqtt");

const options = {
  username: "esp32user",
  password: "password"
};

const client = mqtt.connect("mqtt://localhost:1883", options);

client.on("connect", () => {
  console.log("✅ Ligado com sucesso ao broker MQTT com autenticação");
  client.subscribe("sensors/temperature", (err) => {
    if (!err) {
      console.log("🟢 Subscrito a sensors/temperature");
    }
  });
});

client.on("error", (err) => {
  console.error("❌ Erro MQTT:", err.message);
});
