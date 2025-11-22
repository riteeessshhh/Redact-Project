// client/src/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";

function prettyPayload(p) {
  if (!p) return "";
  if (typeof p === "string") return p;
  try {
    return JSON.stringify(p, null, 2);
  } catch {
    return String(p);
  }
}

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState("");

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/logs", { timeout: 5000 });
      setLogs(res.data || []);
      setError("");
    } catch (err) {
      setError("Unable to fetch logs");
    }
  };

  useEffect(() => {
    fetchLogs();
    const iv = setInterval(fetchLogs, 1000);
    return () => clearInterval(iv);
  }, []);

  const exportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = "attack_logs.json";
    a.click();
  };

  // front-end friendly mapping: pick fields safely
  const normalized = logs.map((l) => ({
    timestamp: l.time || l.timestamp || l.timeStamp || "",
    attackType: (l.detection && l.detection.type) || l.attackType || l.type || "unknown",
    payload: l.payload || l.data || l.input || "",
    hash: l.hash || l._hash || ""
  }));

  const rows = normalized.filter(r => filter === "ALL" || r.attackType?.toUpperCase() === filter);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Attack Dashboard</h1>

      <div className="flex gap-3 mb-4">
        <button onClick={() => setFilter("ALL")} className="px-3 py-1 bg-gray-200 rounded">All</button>
        <button onClick={() => setFilter("SQLI")} className="px-3 py-1 bg-red-100 rounded">SQLi</button>
        <button onClick={() => setFilter("XSS")} className="px-3 py-1 bg-yellow-100 rounded">XSS</button>
        <button onClick={() => setFilter("HoneypotBot")} className="px-3 py-1 bg-gray-100 rounded">Honeypot</button>
        <div className="ml-auto flex gap-2">
          <button onClick={fetchLogs} className="px-3 py-1 bg-blue-500 text-white rounded">Refresh</button>
          <button onClick={exportJson} className="px-3 py-1 bg-green-600 text-white rounded">Export JSON</button>
        </div>
      </div>

      {error && <div className="text-red-600 mb-3">{error}</div>}

      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Time</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Payload</th>
            <th className="p-2 border">Hash</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice().reverse().map((r, i) => (
            <tr key={i} className="border-t">
              <td className="p-2 align-top">{r.timestamp}</td>
              <td className="p-2 align-top">{r.attackType}</td>
              <td className="p-2 align-top break-words"><pre className="whitespace-pre-wrap">{prettyPayload(r.payload)}</pre></td>
              <td className="p-2 align-top text-xs break-all">{r.hash}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
