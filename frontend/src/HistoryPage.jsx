import React, { useEffect, useState } from 'react';

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const totalPages = Math.ceil(history.length / pageSize);
  const paginatedData = history.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );



  const fetchHistory = async () => {
    try {
      const res = await fetch('http://localhost:3000/history');
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/history/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessMsg("Reading deleted successfully!");
        setTimeout(() => setSuccessMsg(''), 3000);
        fetchHistory();
      } else {
        const error = await res.json();
        alert(`Failed to delete: ${error.error}`);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Unexpected error while deleting.");
    }
  };

  const handleDeleteAll = async () => {
    const confirmDelete = confirm("Are you sure you want to delete ALL history records?");
    if (!confirmDelete) return;

    try {
      const res = await fetch("http://localhost:3000/history", { method: "DELETE" });
      if (res.ok) {
        setSuccessMsg("All records deleted successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
        fetchHistory();
      } else {
        alert("Failed to delete all records.");
      }
    } catch (err) {
      console.error("Delete all failed:", err);
      alert("Unexpected error while deleting all records.");
    }
  };


  const startEdit = (entry, index) => {
    setEditIndex(index);
    setEditData({
      temperature: entry.temperature,
      humidity: entry.humidity,
      co2: entry.co2,
      noise: entry.noise
    });
  };

  const handleChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value === '' ? '' : parseFloat(value)
    }));
  };

  const saveEdit = async (id) => {
    const invalid = Object.values(editData).some(value => value === '' || isNaN(value));
    if (invalid) {
      alert("Please fill all fields with valid numbers.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/history/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Failed to save changes: ${error.error}`);
      } else {
        setSuccessMsg("Reading updated successfully!");
        setTimeout(() => setSuccessMsg(''), 3000);
        setEditIndex(null);
        fetchHistory();
      }
    } catch (err) {
      console.error("Failed to update:", err);
      alert("Unexpected error while saving changes.");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-semibold mb-6">Sensor History</h2>
      {successMsg && (
        <div className="mb-4 text-green-700 bg-green-100 border border-green-300 rounded px-4 py-2 max-w-md mx-auto">
          {successMsg}
        </div>
      )}

      {history.length === 0 ? (
        <p className="text-gray-500">No data available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 mx-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">ID</th>
                <th className="border px-3 py-2">Timestamp</th>
                <th className="border px-3 py-2">Temp</th>
                <th className="border px-3 py-2">Hum</th>
                <th className="border px-3 py-2">CO₂</th>
                <th className="border px-3 py-2">Noise</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((entry, index) => (
                <tr key={entry._id}>
                  <td className="border px-3 py-2 text-gray-500 text-xs">{entry._id}</td>
                  <td className="border px-3 py-2">{new Date(entry.timestamp).toLocaleString()}</td>
                  {editIndex === index ? (
                    <>
                      {["temperature", "humidity", "co2", "noise"].map((field) => (
                        <td key={field} className="border px-3 py-1">
                          <input
                            type="number"
                            value={editData[field]}
                            onChange={e => handleChange(field, e.target.value)}
                            className="w-20 text-center border rounded px-1"
                          />
                        </td>
                      ))}
                      <td className="border px-3 py-1">
                        <button onClick={() => saveEdit(entry._id)} className="text-green-600 hover:underline mr-2">Save</button>
                        <button onClick={() => setEditIndex(null)} className="text-gray-500 hover:underline">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border px-3 py-2">{entry.temperature}</td>
                      <td className="border px-3 py-2">{entry.humidity}</td>
                      <td className="border px-3 py-2">{entry.co2}</td>
                      <td className="border px-3 py-2">{entry.noise}</td>
                      <td className="border px-3 py-2 space-x-2">
                        <button onClick={() => startEdit(entry, index)} className="text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(entry._id)} className="text-red-600 hover:underline">Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
            <div className="mt-4 flex justify-center gap-4 text-sm">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border bg-gray-100 disabled:opacity-50"
              >
                ◀ Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border bg-gray-100 disabled:opacity-50"
              >
                Next ▶
              </button>
            </div>

          </table>
          <div className="mt-6">
            <button
              onClick={handleDeleteAll}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete All History
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

export default HistoryPage;