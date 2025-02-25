import React from "react";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

const PortfolioMetric = () => {
  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-lg text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-400">
            Portfolio Value
          </h2>
          <p className="text-3xl font-bold">$120,224.73</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-green-400">+24.21%</p>
          <p className="text-sm text-gray-400">Last 12 Months</p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioMetric;
