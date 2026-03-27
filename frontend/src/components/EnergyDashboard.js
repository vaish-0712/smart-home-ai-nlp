import React, { useMemo } from "react";
import EnergyChart from "./EnergyChart";

function EnergyDashboard({ devices }) {

  const cost_per_unit = 6;

  const totalEnergy = useMemo(() => {
    let total = 0;

    Object.values(devices || {}).forEach(device => {
      total += device.energy || 0;
    });

    return Number(total.toFixed(3)); // ✅ keep as number
  }, [devices]);

  const bill = useMemo(() => {
    return (totalEnergy * cost_per_unit).toFixed(2);
  }, [totalEnergy]);

  const suggestions = useMemo(() => {

    const list = [];

    if (devices?.ac?.state === "on") {
      list.push("Set AC to 24°C to save energy");
    }

    if (devices?.lights?.state === "on") {
      list.push("Turn off lights in unused rooms");
    }

    if (devices?.water_heater?.state === "on") {
      list.push("Turn off water heater when not needed");
    }

    if (devices?.heater?.state === "on") {
      list.push("Reduce heater usage to save power");
    }

    return list;

  }, [devices]);

  return (

    <div className="text-gray-900">

      <h2 className="text-xl font-bold mb-4 text-white">
        ⚡ Energy Dashboard
      </h2>

      {/* ✅ ENERGY CARDS */}
      <div className="grid grid-cols-2 gap-4 mb-6">

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Total Energy</h3>
          <p className="text-2xl font-bold">
            {totalEnergy} kWh
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Estimated Bill</h3>
          <p className="text-2xl font-bold text-green-600">
            ₹ {bill}
          </p>
        </div>

      </div>

      {/* ✅ CHART (FULL WIDTH 🔥) */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <EnergyChart devices={devices} />
      </div>

      {/* DEVICE BREAKDOWN */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">

        <h3 className="font-semibold mb-3 text-gray-700">
          📊 Device Usage
        </h3>

        {Object.entries(devices || {}).map(([device, data]) => (
          <div key={device} className="flex justify-between border-b py-2 text-sm">

            <span className="capitalize">
              {device.replace("_", " ")}
            </span>

            <span>
              {(data.energy || 0).toFixed(3)} kWh
            </span>

          </div>
        ))}

      </div>

      {/* SUGGESTIONS */}
      <div className="bg-white p-4 rounded-lg shadow">

        <h3 className="font-semibold mb-3 text-gray-700">
          💡 Smart Suggestions
        </h3>

        {suggestions.length === 0 ? (
          <p className="text-gray-500 text-sm">
            Energy usage looks optimal 👍
          </p>
        ) : (
          suggestions.map((s, i) => (
            <div key={i} className="text-sm border-b py-2">
              • {s}
            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default EnergyDashboard;