import React, { useState } from "react";

function ModeControls() {

  const [loading, setLoading] = useState(false);

  const API = "http://127.0.0.1:8000";

  const runMode = async (mode) => {

    try {
      setLoading(true);

      await fetch(`${API}/command`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: mode })
      });

      // ❌ No need to store result
      // SSE will update UI automatically

    } catch (error) {
      console.error("Mode execution failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (

    <div>

      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Smart Modes
      </h2>

      <div className="flex gap-4 flex-wrap">

        <button
          onClick={() => runMode("morning mode")}
          className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition"
        >
          ☀️ Morning Mode
        </button>

        <button
          onClick={() => runMode("movie mode")}
          className="bg-purple-500 text-white px-5 py-2 rounded-full hover:bg-purple-600 transition"
        >
          🎬 Movie Mode
        </button>

        <button
          onClick={() => runMode("good night")}
          className="bg-gray-800 text-white px-5 py-2 rounded-full hover:bg-gray-900 transition"
        >
          🌙 Good Night
        </button>

        <button
          onClick={() => runMode("away mode")}
          className="bg-pink-500 text-white px-5 py-2 rounded-full hover:bg-pink-600 transition"
        >
          🏃 Away Mode
        </button>

      </div>

      {loading && (
        <div className="mt-4 text-gray-500">
          Executing mode...
        </div>
      )}

    </div>

  );

}

export default ModeControls;