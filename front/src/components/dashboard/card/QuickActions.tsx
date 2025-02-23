import React from "react";

const QuickActions = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Send
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
          Receive
        </button>
        <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600">
          Exchange
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
          Stake
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
