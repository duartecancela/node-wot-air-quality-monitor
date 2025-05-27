import React, { useEffect, useState } from 'react';

function ActuatorStates() {
  const [fanState, setFanState] = useState(null);
  const [buzzerState, setBuzzerState] = useState(null);

  const fetchStates = async () => {
    try {
      const [fanRes, buzzerRes] = await Promise.all([
        fetch('http://localhost:3000/fan').then(res => res.json()),
        fetch('http://localhost:3000/buzzer').then(res => res.json()),
      ]);
      setFanState(fanRes.value);
      setBuzzerState(buzzerRes.value);
    } catch (err) {
      console.error("Failed to fetch actuator states:", err);
    }
  };

  useEffect(() => {
    fetchStates();
    const interval = setInterval(fetchStates, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-semibold mb-4">Actuator States</h2>
      <ul className="space-y-2">
        <li>🌀 Fan: <span className={`font-bold ${fanState === 'ON' ? 'text-green-600' : 'text-red-600'}`}>{fanState}</span></li>
        <li>🔔 Buzzer: <span className={`font-bold ${buzzerState === 'ON' ? 'text-green-600' : 'text-red-600'}`}>{buzzerState}</span></li>
      </ul>
    </div>
  );
}

export default ActuatorStates;
