import React, { useState } from "react";

function ModeControls() {

  const [modeResult, setModeResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runMode = async (mode) => {

    try {

      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: mode })
      });

      const data = await response.json();

      setModeResult(data);

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

      {/* MODE BUTTONS */}

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


      {/* LOADING STATE */}

      {loading && (

        <div className="mt-4 text-gray-500">
          Executing mode...
        </div>

      )}


      {/* DEVICE STATUS AFTER MODE */}

      {modeResult && modeResult.devices && (

        <div className="mt-4 p-4 bg-white rounded-lg shadow">

          <h3 className="font-bold mb-3 text-gray-700">
            Devices After Mode Execution
          </h3>

          {Object.entries(modeResult.devices).map(([device, value]) => (

            <div key={device} className="flex justify-between border-b py-2 text-gray-800">

              <span className="capitalize">
                {device.replace("_", " ")}
              </span>

              <span
className={
value.state === "on" || value.state === "unlocked"
? "text-green-600 font-semibold"
: "text-gray-600 font-semibold"
}
>
{value.state}
</span>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default ModeControls;