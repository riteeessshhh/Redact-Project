import { useState } from "react";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const sendToServer = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/demo", {
        text: input,
      });

      setResult(JSON.stringify(response.data, null, 2));
    } catch (err) {
      setResult("Error connecting to backend");
    }
  };

  return (
    <div className="p-10 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Hackathon App Demo</h1>

      <textarea
        rows="5"
        placeholder="Enter some text..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-80 p-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <br /><br />

      <button
        onClick={sendToServer}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Send to Backend
      </button>

      <pre className="mt-6 w-96 bg-white border border-gray-200 rounded p-4 shadow-sm overflow-auto">
        {result}
      </pre>
    </div>
  );
}

export default App;
