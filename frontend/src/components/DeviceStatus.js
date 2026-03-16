import React, { useEffect } from "react";

function DeviceStatus({ devices, refreshDevices }) {

  useEffect(() => {
    refreshDevices();
  }, [refreshDevices]);

  const sendCommand = async (device, action) => {

  const text =
    action === "lock" || action === "unlock"
      ? `${action} ${device}`
      : `${action} ${device}`;

  await fetch("https://web-production-b9b1b.up.railway.app/command/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  refreshDevices();
};
  const getIcon = (device) => {

    switch (device) {
      case "lights": return "💡";
      case "tv": return "📺";
      case "ac": return "❄️";
      case "speaker": return "🔊";
      case "heater": return "🔥";
      case "exhaust_fan": return "🌪";
      case "water_heater": return "🚿";
      case "cameras": return "🎥";
      case "alarm": return "🚨";
      case "door": return "🔐";
      default: return "⚙️";
    }

  };

  const rooms = {
    "Living Room": ["lights", "tv", "speaker"],
    "Bedroom": ["ac", "heater"],
    "Kitchen": ["lights", "exhaust_fan"],
    "Bathroom": ["water_heater", "lights"],
    "Security": ["cameras", "door", "alarm"]
  };

  return (

    <div className="mt-10 animate-fadeIn">

      <h2 className="text-xl font-bold mb-6 text-white">
        Home Devices
      </h2>

      {/* ROOM GRID */}

      <div className="grid md:grid-cols-2 gap-6">

        {Object.keys(rooms).map((room) => (

          <div
            key={room}
            className="bg-white/20 backdrop-blur-md p-5 rounded-xl shadow-lg 
hover:shadow-2xl hover:-translate-y-1 transition duration-300"
          >

            <h3 className="text-lg font-semibold mb-4 text-white">
              {room}
            </h3>

            <div className="space-y-3">

              {rooms[room].map((device) => {

                if (!devices[device]) return null;

                return (

                  <div
                    key={device}
                    className="flex justify-between items-center p-4 bg-white/40 rounded-lg 
hover:scale-[1.02] hover:bg-white/50 transition duration-200"
                  >

                    <div>

                      <div className="font-semibold text-gray-900">

                        {getIcon(device)}{" "}
                        {device.replace("_", " ").toUpperCase()}

                      </div>

                      <div className="text-sm text-gray-700">
                        State: {devices[device].state}
                      </div>

                    </div>

                    <div className="flex gap-2">

                      {device === "door" ? (

                        <>

                          <button
                            className="bg-green-500 text-white px-3 py-1 rounded-lg 
hover:bg-green-600 active:scale-95 transition"
                            onClick={() => sendCommand(device, "lock")}
                          >
                            LOCK
                          </button>

                          <button
                           className="bg-red-500 text-white px-3 py-1 rounded-lg 
hover:bg-red-600 active:scale-95 transition"
                            onClick={() => sendCommand(device, "unlock")}
                          >
                            UNLOCK
                          </button>

                        </>

                      ) : (

                        <>

                          <button
                            className="bg-green-500 text-white px-3 py-1 rounded-lg 
hover:bg-green-600 active:scale-95 transition"
                            onClick={() => sendCommand(device, "turn on")}
                          >
                            ON
                          </button>

                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded-lg 
hover:bg-red-600 active:scale-95 transition"
                            onClick={() => sendCommand(device, "turn off")}
                          >
                            OFF
                          </button>

                        </>

                      )}

                    </div>

                  </div>

                );

              })}

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default DeviceStatus;