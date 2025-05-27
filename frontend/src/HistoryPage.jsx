import React, { useEffect, useState } from 'react';

function HistoryPage() {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('http://localhost:3000/history');
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-semibold mb-6">Sensor History</h2>
      {history.length === 0 ? (
        <p className="text-gray-500">No data available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 mx-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Timestamp</th>
                <th className="border px-4 py-2">Temperature (°C)</th>
                <th className="border px-4 py-2">Humidity (%)</th>
                <th className="border px-4 py-2">CO₂ (ppm)</th>
                <th className="border px-4 py-2">Noise (dB)</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{new Date(entry.timestamp).toLocaleString()}</td>
                  <td className="border px-4 py-2">{entry.temperature}</td>
                  <td className="border px-4 py-2">{entry.humidity}</td>
                  <td className="border px-4 py-2">{entry.co2}</td>
                  <td className="border px-4 py-2">{entry.noise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
