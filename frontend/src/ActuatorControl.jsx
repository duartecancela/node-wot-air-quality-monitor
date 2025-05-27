import React, { useEffect, useState } from 'react';

function ActuatorControl() {
  const [states, setStates] = useState({ fan: null, buzzer: null });

  const fetchStates = async () => {
    try {
      const [fanRes, buzzerRes] = await Promise.all([
        fetch('http://localhost:3000/fan').then(res => res.json()),
        fetch('http://localhost:3000/buzzer').then(res => res.json())
      ]);
      setStates({ fan: fanRes.value, buzzer: buzzerRes.value });
    } catch (err) {
      console.error("Failed to fetch actuator states:", err);
    }
  };

  const sendCommand = async (actuator, state) => {
    try {
      await fetch(`http://localhost:3000/${actuator}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state })
      });
      setStates(prev => ({ ...prev, [actuator]: state }));
    } catch (err) {
      console.error(`Failed to set ${actuator} to ${state}`, err);
    }
  };

  useEffect(() => {
    fetchStates();
    const interval = setInterval(fetchStates, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-semibold mb-4">Control Actuators</h2>
      <div className="flex flex-col items-center gap-4">
        {["fan", "buzzer"].map((actuator) => (
          <div key={actuator} className="flex items-center gap-4">
            <span className="capitalize font-medium w-20 text-right">{actuator}:</span>
            <span
              className={`font-bold ${
                states[actuator] === "ON" ? "text-green-600" : "text-red-600"
              }`}
            >
              {states[actuator]}
            </span>
            <button
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              onClick={() => sendCommand(actuator, "ON")}
            >
              ON
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              onClick={() => sendCommand(actuator, "OFF")}
            >
              OFF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActuatorControl;
