import React, { useState, useCallback, useEffect } from "react";
import "./App.css";

import { Routes, Route, Link } from "react-router-dom";

import CommandInput from "./components/CommandInput";
import CommandHistory from "./components/CommandHistory";
import ModeControls from "./components/ModeControls";
import Login from "./pages/Login";
import RoomPage from "./pages/RoomPage";

function App() {

  const [devices, setDevices] = useState({});
  const [logs, setLogs] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const refreshDevices = useCallback(async () => {

    try {
      const response = await fetch("http://127.0.0.1:8000/devices");
      const data = await response.json();
      setDevices(data);
    } catch (error) {
      console.error("Device fetch failed:", error);
    }

  }, []);

  const refreshLogs = useCallback(async () => {

    try {
      const response = await fetch("http://127.0.0.1:8000/logs");
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error("Logs fetch failed:", error);
    }

  }, []);

  useEffect(() => {
    refreshDevices();
    refreshLogs();
  }, [refreshDevices, refreshLogs]);

  if (!loggedIn) {
    return <Login setLoggedIn={setLoggedIn} />;
  }

  return (

    <div className="flex min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">

      {/* SIDEBAR */}

      <div className="w-64 bg-blue-900/40 backdrop-blur-md text-white p-6">

        <h2 className="text-xl font-bold mb-8">
          🏠 Smart Home
        </h2>

        <div className="space-y-4 text-sm">

          <Link to="/" className="block hover:text-blue-200">
            Dashboard
          </Link>

          <Link to="/living" className="block hover:text-blue-200">
            Living Room
          </Link>

          <Link to="/bedroom" className="block hover:text-blue-200">
            Bedroom
          </Link>

          <Link to="/kitchen" className="block hover:text-blue-200">
            Kitchen
          </Link>

          <Link to="/bathroom" className="block hover:text-blue-200">
            Bathroom
          </Link>

          <Link to="/security" className="block hover:text-blue-200">
            Security
          </Link>

          <Link to="/history" className="block hover:text-blue-200">
            Command History
          </Link>

        </div>

      </div>

      {/* MAIN CONTENT */}

      <div className="flex-1 p-10 text-white">

        <div className="flex justify-between items-center mb-10">

          <h1 className="text-4xl font-bold">
            Smart Home Dashboard
          </h1>

          <button
            onClick={() => setLoggedIn(false)}
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
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

                <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-lg">
                  <CommandInput
                    refreshDevices={refreshDevices}
                    refreshLogs={refreshLogs}
                  />
                </div>

                <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-lg">
                  <ModeControls />
                </div>

              </div>
            }
          />

          {/* ROOM PAGES */}

          <Route
            path="/living"
            element={
              <RoomPage
                title="Living Room"
                devices={devices}
                deviceList={["lights","tv","speaker"]}
                refreshDevices={refreshDevices}
              />
            }
          />

          <Route
            path="/bedroom"
            element={
              <RoomPage
                title="Bedroom"
                devices={devices}
                deviceList={["ac","heater"]}
                refreshDevices={refreshDevices}
              />
            }
          />

          <Route
            path="/kitchen"
            element={
              <RoomPage
                title="Kitchen"
                devices={devices}
                deviceList={["lights","exhaust_fan"]}
                refreshDevices={refreshDevices}
              />
            }
          />

          <Route
            path="/bathroom"
            element={
              <RoomPage
                title="Bathroom"
                devices={devices}
                deviceList={["water_heater","lights"]}
                refreshDevices={refreshDevices}
              />
            }
          />

          <Route
            path="/security"
            element={
              <RoomPage
                title="Security"
                devices={devices}
                deviceList={["cameras","door","alarm"]}
                refreshDevices={refreshDevices}
              />
            }
          />

          {/* COMMAND HISTORY */}

          <Route
            path="/history"
            element={
              <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-lg">
                <CommandHistory
                  logs={logs}
                  refreshLogs={refreshLogs}
                />
              </div>
            }
          />

        </Routes>

      </div>

    </div>

  );

}

export default App;