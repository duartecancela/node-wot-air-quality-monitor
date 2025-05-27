import React, { useEffect, useState } from 'react';

function SensorData() {
  const [data, setData] = useState({
    temperature: null,
    humidity: null,
    co2: null,
    noise: null
  });

  const fetchData = async () => {
    try {
      const [t, h, c, n] = await Promise.all([
        fetch('http://localhost:3000/temperature').then(res => res.json()),
        fetch('http://localhost:3000/humidity').then(res => res.json()),
        fetch('http://localhost:3000/co2').then(res => res.json()),
        fetch('http://localhost:3000/noise').then(res => res.json()),
      ]);

      setData({
        temperature: t.value,
        humidity: h.value,
        co2: c.value,
        noise: n.value
      });
    } catch (err) {
      console.error("Failed to fetch sensor data:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // atualizar a cada 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-semibold mb-4">Sensor Data</h2>
      <ul className="space-y-2">
        <li>🌡️ Temperature: {data.temperature} °C</li>
        <li>💧 Humidity: {data.humidity} %</li>
        <li>🫁 CO₂: {data.co2} ppm</li>
        <li>🔊 Noise: {data.noise} dB</li>
      </ul>
    </div>
  );
}

export default SensorData;
