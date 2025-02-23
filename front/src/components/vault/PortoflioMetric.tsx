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
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Portfolio Value",
        data: [120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175],
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

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
      <div className="mb-6">{/* <Line data={data} options={options} /> */}</div>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-400">Avg. Monthly</p>
          <p className="text-lg font-bold">$2,933</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">Resilience Score</p>
          <p className="text-lg font-bold">75</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">Accuracy Index</p>
          <p className="text-lg font-bold">0.46</p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioMetric;
