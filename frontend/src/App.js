import React, { useState, useEffect } from "react";
import "./App.css";

import { Routes, Route, Link } from "react-router-dom";

import CommandInput from "./components/CommandInput";
import CommandHistory from "./components/CommandHistory";
import ModeControls from "./components/ModeControls";
import DeviceStatus from "./components/DeviceStatus";
import EnergyDashboard from "./components/EnergyDashboard";
import Login from "./pages/Login";
import RoomPage from "./pages/RoomPage";

function App() {

  const [devices, setDevices] = useState({});
  const [logs, setLogs] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const API = "http://127.0.0.1:8000";

  // ✅ REAL-TIME SSE
  useEffect(() => {

    const eventSource = new EventSource(`${API}/stream`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setDevices(data);
    };

    eventSource.onerror = () => {
      console.error("SSE error");
      eventSource.close();
    };

    return () => eventSource.close();

  }, [API]);

  // logs
  useEffect(() => {
    fetch(`${API}/logs`)
      .then(res => res.json())
      .then(data => setLogs(data));
  }, []);

  if (!loggedIn) {
    return <Login setLoggedIn={setLoggedIn} />;
  }

  return (

    <div className="flex min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">

      {/* SIDEBAR */}
      <div className="w-64 bg-blue-900/40 backdrop-blur-md text-white p-6">

        <h2 className="text-xl font-bold mb-8">🏠 Smart Home</h2>

        <div className="space-y-4 text-sm flex flex-col">

          <Link to="/">Dashboard</Link>
          <Link to="/living">Living Room</Link>
          <Link to="/bedroom">Bedroom</Link>
          <Link to="/kitchen">Kitchen</Link>
          <Link to="/bathroom">Bathroom</Link>
          <Link to="/security">Security</Link>
          <Link to="/history">Command History</Link>
          <Link to="/energy">Energy Dashboard</Link>

        </div>

      </div>

      {/* MAIN */}
      <div className="flex-1 p-10 text-white">

        <div className="flex justify-between mb-10">
          <h1 className="text-4xl font-bold">Smart Home Dashboard</h1>

          <button
            onClick={() => setLoggedIn(false)}
            className="bg-red-500 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        <Routes>

          {/* DASHBOARD */}
          <Route
            path="/"
            element={
              <div className="grid gap-6">

                <div className="bg-white/20 p-6 rounded-xl">
                  <CommandInput />
                </div>

                <div className="bg-white/20 p-6 rounded-xl">
                  <ModeControls />
                </div>

                <div className="bg-white/20 p-6 rounded-xl">
                  <DeviceStatus devices={devices} />
                </div>

                
                

              </div>
            }
          />

          {/* ROOM PAGES */}
          <Route path="/living" element={<RoomPage title="Living Room" devices={devices} deviceList={["lights","tv","speaker"]} />} />
          <Route path="/bedroom" element={<RoomPage title="Bedroom" devices={devices} deviceList={["ac","heater"]} />} />
          <Route path="/kitchen" element={<RoomPage title="Kitchen" devices={devices} deviceList={["lights","exhaust_fan"]} />} />
          <Route path="/bathroom" element={<RoomPage title="Bathroom" devices={devices} deviceList={["water_heater","lights"]} />} />
          <Route path="/security" element={<RoomPage title="Security" devices={devices} deviceList={["cameras","door","alarm"]} />} />
          <Route
  path="/energy"
  element={
    <div className="bg-white/20 p-6 rounded-xl">
      <EnergyDashboard devices={devices} />
    </div>
  }
/>
          <Route path="/history" element={<CommandHistory logs={logs} />} />

        </Routes>

      </div>

    </div>
  );
}

export default App;