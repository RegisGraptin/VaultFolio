import React from "react";

const DashboardCardHeader = () => {
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Wallet Dashboard</h1>
          <p className="text-gray-400">Welcome back, User</p>
        </div>
        <div className="flex space-x-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Deposit
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardCardHeader;
