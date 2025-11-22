import { useState } from "react";
import Trap from "./Trap";
import Dashboard from "./Dashboard";

export default function App() {
  const [page, setPage] = useState("trap");

  return (
    <div>
      <div className="p-4 flex gap-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setPage("trap")}>Trap Page</button>

        <button className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => setPage("dashboard")}>Dashboard</button>
      </div>

      {page === "trap" && <Trap />}
      {page === "dashboard" && <Dashboard />}
    </div>
  );
}
