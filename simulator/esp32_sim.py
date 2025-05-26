
import time
import random
import json
import paho.mqtt.client as mqtt

mqtt_server = 'localhost'
mqtt_port = 1883

mqtt_topics = {
    "temperature": "sensors/temperature",
    "humidity": "sensors/humidity",
    "co2": "sensors/co2",
    "noise": "sensors/noise"
}

actuator_topics = {
    "fan": "actuator/fan",
    "buzzer": "actuator/buzzer"
}

status_topics = {
    "fan": "status/fan",
    "buzzer": "status/buzzer",
    "thresholds": "status/thresholds"
}

threshold_topics_base = "config/threshold"

thresholds = {
    "temperature": 30.0,
    "humidity": 60.0,
    "co2": 800,
    "noise": 70
}

fan_state = "OFF"
buzzer_state = "OFF"

led_states = {
    "temperature": "GREEN",
    "humidity": "GREEN",
    "co2": "GREEN",
    "noise": "GREEN"
}

def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT broker")
    for param in thresholds:
        topic = f"{threshold_topics_base}/{param}"
        client.subscribe(topic)
        print(f"Subscribed to topic: {topic}")
    for topic in actuator_topics.values():
        client.subscribe(topic)
        print(f"Subscribed to topic: {topic}")

def on_message(client, userdata, msg):
    global fan_state, buzzer_state, thresholds
    print(f"[MQTT RECEIVED] {msg.topic} -> {msg.payload.decode()}")

    try:
        data = json.loads(msg.payload.decode())
        if msg.topic in actuator_topics.values():
            state = data.get("state", "").upper()
            if msg.topic == actuator_topics["fan"] and state in ["ON", "OFF"]:
                fan_state = state
                print(f"[ACTUATOR] Fan: {fan_state}")
                client.publish(status_topics["fan"], json.dumps({"state": fan_state}))
            elif msg.topic == actuator_topics["buzzer"] and state in ["ON", "OFF"]:
                buzzer_state = state
                print(f"[ACTUATOR] Buzzer: {buzzer_state}")
                client.publish(status_topics["buzzer"], json.dumps({"state": buzzer_state}))
        elif msg.topic.startswith("config/threshold/"):
            param_name = msg.topic.split("/")[-1]
            if param_name in thresholds and "value" in data:
                thresholds[param_name] = float(data["value"])
                print(f"[CONFIG] Set {param_name} threshold to {data['value']}")
    except Exception as e:
        print("[ERROR] Failed to process message:", e)

client = mqtt.Client(client_id="esp32-simulator", protocol=mqtt.MQTTv311)
client.on_connect = on_connect
client.on_message = on_message

client.connect(mqtt_server, mqtt_port, 60)
client.loop_start()

try:
    while True:
        sensor_data = {
            "temperature": round(random.uniform(20.0, 40.0), 2),
            "humidity": round(random.uniform(30.0, 80.0), 2),
            "co2": random.randint(300, 1500),
            "noise": random.randint(20, 100)
        }

        for key, value in sensor_data.items():
            led_states[key] = "RED" if value > thresholds[key] else "GREEN"

        for key, topic in mqtt_topics.items():
            payload = json.dumps({"value": sensor_data[key]})
            client.publish(topic, payload)
            print(f"[MQTT PUBLISHED] {topic} -> {payload}")

        client.publish("status/leds", json.dumps(led_states))
        print(f"[LED STATES] {led_states}")

        client.publish(status_topics["thresholds"], json.dumps(thresholds))
        print(f"[THRESHOLDS] {thresholds}")

        client.publish(status_topics["fan"], json.dumps({"state": fan_state}))
        client.publish(status_topics["buzzer"], json.dumps({"state": buzzer_state}))

        print(f"[STATES] Fan: {fan_state} | Buzzer: {buzzer_state}")
        print("----------------------------------------------------------")
        time.sleep(5)

except KeyboardInterrupt:
    print("Shutting down simulator...")
    client.loop_stop()
    client.disconnect()
