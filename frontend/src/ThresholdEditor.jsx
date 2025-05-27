import React, { useEffect, useState } from 'react';

function ThresholdEditor() {
  const [thresholds, setThresholds] = useState({});
  const [form, setForm] = useState({});

  useEffect(() => {
    fetchThresholds();
  }, []);

  const fetchThresholds = async () => {
    try {
      const res = await fetch('http://localhost:3000/thresholds');
      const data = await res.json();
      setThresholds(data.value); // <- pode ser só data se não tiver .value
      setForm(data.value);
    } catch (err) {
      console.error("Failed to fetch thresholds:", err);
    }
  };

  const handleChange = (param, value) => {
    setForm(prev => ({
      ...prev,
      [param]: value
    }));
  };

  const handleSubmit = async (param) => {
    try {
      await fetch(`http://localhost:3000/thresholds/${param}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: parseFloat(form[param]) })
      });
      console.log(`Updated ${param} to ${form[param]}`);
    } catch (err) {
      console.error(`Failed to update ${param}:`, err);
    }
  };

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-semibold mb-4">Edit Thresholds</h2>
      <div className="flex flex-col items-center gap-4">
        {Object.entries(form).map(([param, value]) => (
          <div key={param} className="flex items-center gap-3">
            <label className="capitalize w-24 text-right">{param}:</label>
            <input
              type="number"
              value={value}
              onChange={e => handleChange(param, e.target.value)}
              className="border px-2 py-1 rounded w-24 text-center"
            />
            <button
              onClick={() => handleSubmit(param)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ThresholdEditor;
