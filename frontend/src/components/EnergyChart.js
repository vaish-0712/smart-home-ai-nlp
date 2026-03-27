import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function EnergyChart({ devices }) {

  const [labels, setLabels] = useState([]);
  const [dataPoints, setDataPoints] = useState([]);

  // ✅ compute total energy
  const getTotalEnergy = () => {
    let total = 0;

    Object.values(devices || {}).forEach(device => {
      total += device.energy || 0;
    });

    return total;
  };

  useEffect(() => {

    const interval = setInterval(() => {

      const now = new Date().toLocaleTimeString();
      const energy = getTotalEnergy();

      setLabels(prev => [...prev.slice(-9), now]); // keep last 10 points
      setDataPoints(prev => [...prev.slice(-9), energy]);

    }, 2000);

    return () => clearInterval(interval);

  }, [devices]);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Energy Usage (kWh)",
        data: dataPoints,
        fill: false,
        tension: 0.3
      }
    ]
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-3 text-gray-700">
        📈 Energy Trend
      </h3>

      <Line data={data} />
    </div>
  );
}

export default EnergyChart;