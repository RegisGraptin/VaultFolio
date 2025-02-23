import React from "react";

const BalanceOverview = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Balance Overview</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-gray-500">Total Balance</p>
          <p className="text-2xl font-bold">$12,345.67</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">Available</p>
          <p className="text-2xl font-bold">$10,000.00</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">In Use</p>
          <p className="text-2xl font-bold">$2,345.67</p>
        </div>
      </div>
    </div>
  );
};

export default BalanceOverview;
