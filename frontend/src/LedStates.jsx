import React, { useEffect, useState } from 'react';

function LedStates() {
  const [leds, setLeds] = useState({});

  const fetchLedStates = async () => {
    try {
      const res = await fetch('http://localhost:3000/ledStates');
      const data = await res.json();
      console.log("LED API response:", data);
      setLeds(data.value);
    } catch (err) {
      console.error("Failed to fetch LED states:", err);
    }
  };

  useEffect(() => {
    fetchLedStates();
    const interval = setInterval(fetchLedStates, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-semibold mb-4">LED Status</h2>
      {Object.keys(leds).length === 0 ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="flex flex-col items-center gap-3">
          {Object.entries(leds).map(([param, status]) => (
            <div key={param} className="flex items-center gap-3 border border-blue-400 p-2 rounded">

              <span className="capitalize font-medium">{param}:</span>
              <div
                className={`w-4 h-4 rounded-full ${
                  status === 'GREEN' ? 'bg-green-500' : 'bg-red-500'
                }`}
                title={status}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LedStates;
