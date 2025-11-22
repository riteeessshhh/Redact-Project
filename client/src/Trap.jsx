// client/src/Trap.jsx
import { useState } from "react";
import axios from "axios";
import FakeAdmin from "./FakeAdmin";

export default function Trap() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hpField, setHpField] = useState(""); // honeypot
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFakeAdmin, setShowFakeAdmin] = useState(false);

  const send = async (payloadOverride = null) => {
    setLoading(true);
    setResult("");

    try {
      const body = payloadOverride ?? {
        username,
        password,
        hp_field: hpField,
      };

      const res = await axios.post("http://localhost:5000/trap", body);

      // 👉 If attacker → show fake admin screen
      if (res.data.fakeAdmin) {
        setShowFakeAdmin(true);
        return;
      }

      // Normal harmless user → show backend message
      setResult(JSON.stringify(res.data, null, 2));
    } catch (err) {
      setResult("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // 👉 If attacker detected → directly show fake Admin panel
  if (showFakeAdmin) {
    return <FakeAdmin />;
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Fake Login (Trap Page)</h1>

      <input
        type="text"
        placeholder="Username"
        className="border p-2 w-full mb-3"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="text"
        placeholder="Password / Payload"
        className="border p-2 w-full mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Honeypot hidden field */}
      <input
        type="text"
        value={hpField}
        onChange={(e) => setHpField(e.target.value)}
        style={{ display: "none" }}
        autoComplete="off"
      />

      <div className="flex gap-2 mb-3 flex-wrap">
        <button
          onClick={() => send()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Sending..." : "Submit"}
        </button>

        {/* SQL Injection Demo */}
        <button
          onClick={() => {
            const payload = "admin' OR 1=1 --";
            setPassword(payload);
            send({ username: "admin", password: payload, hp_field: "" });
          }}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Send SQLi
        </button>

        {/* XSS Demo */}
        <button
          onClick={() => {
            const payload = "<script>alert('xss')</script>";
            setPassword(payload);
            send({ username: "attacker", password: payload, hp_field: "" });
          }}
          className="bg-yellow-500 text-black px-3 py-1 rounded"
        >
          Send XSS
        </button>

        {/* Honeypot Bot Trigger */}
        <button
          onClick={() => {
            const botVal = "bot-filled";
            setHpField(botVal);
            send({ username: "bot", password: "123", hp_field: botVal });
          }}
          className="bg-gray-700 text-white px-3 py-1 rounded"
        >
          Trigger Honeypot
        </button>
      </div>

      <pre className="mt-4 bg-gray-100 p-4 max-h-64 overflow-auto">
        {result}
      </pre>
    </div>
  );
}
