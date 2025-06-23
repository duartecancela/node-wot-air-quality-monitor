
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
    try:
        print("Connected to MQTT broker")
        for param in thresholds:
            topic = f"{threshold_topics_base}/{param}"
            client.subscribe(topic)
            print(f"Subscribed to topic: {topic}")
        for topic in actuator_topics.values():
            client.subscribe(topic)
            print(f"Subscribed to topic: {topic}")
    except Exception as e:
        print("[ERROR] Failed to process connection:", e)



def on_message(client, userdata, msg):
    try:
        command = json.loads(msg.payload.decode())

        # Atualiza thresholds
        if msg.topic.startswith(threshold_topics_base):
            try:
                param = msg.topic.split("/")[-1]
                value = float(command.get("value", 0))
                if param in thresholds:
                    thresholds[param] = value
                    print(f"[THRESHOLD UPDATED] {msg.topic} = {value}")
            except Exception as err:
                print("[ERROR] Threshold update failed:", err)

        # Comandos dos atuadores
        state = command.get("state", "").upper()

        if msg.topic == actuator_topics["fan"] and state in ["ON", "OFF"]:
            global fan_state
            fan_state = state
            client.manual_fan = True

        elif msg.topic == actuator_topics["buzzer"] and state in ["ON", "OFF"]:
            global buzzer_state
            buzzer_state = state
            client.manual_buzzer = True

    except Exception as e:
        print("Erro ao processar comando MQTT:", e)


client = mqtt.Client(client_id="esp32-simulator")
client.on_message = on_message
client.on_connect = on_connect


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


        # Automatic actuator control only if not manually overridden
        if not hasattr(client, 'manual_fan'):
            fan_state = "ON" if sensor_data["co2"] > thresholds["co2"] else "OFF"
        if not hasattr(client, 'manual_buzzer'):
            buzzer_state = "ON" if sensor_data["co2"] > thresholds["co2"] else "OFF"
    
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
