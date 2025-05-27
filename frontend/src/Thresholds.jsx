import React, { useEffect, useState } from 'react';

function Thresholds() {
  const [thresholds, setThresholds] = useState({});

  const fetchThresholds = async () => {
    try {
      const res = await fetch('http://localhost:3000/thresholds');
      const data = await res.json();
      setThresholds(data.value);
    } catch (err) {
      console.error("Failed to fetch thresholds:", err);
    }
  };

  useEffect(() => {
    fetchThresholds();
    const interval = setInterval(fetchThresholds, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-semibold mb-4">Maximum Thresholds</h2>
      {Object.keys(thresholds).length === 0 ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <ul className="space-y-2">
          <li>🌡️ Temperature Max: {thresholds.temperature} °C</li>
          <li>💧 Humidity Max: {thresholds.humidity} %</li>
          <li>🫁 CO₂ Max: {thresholds.co2} ppm</li>
          <li>🔊 Noise Max: {thresholds.noise} dB</li>
        </ul>
      )}
    </div>
  );
}

export default Thresholds;
