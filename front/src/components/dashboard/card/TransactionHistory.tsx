import React from "react";

const TransactionHistory = () => {
  const transactions = [
    { id: 1, type: "Deposit", amount: "$1,000.00", date: "2023-10-01" },
    { id: 2, type: "Withdrawal", amount: "$500.00", date: "2023-10-02" },
    { id: 3, type: "Transfer", amount: "$200.00", date: "2023-10-03" },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex justify-between items-center p-4 border-b"
          >
            <div>
              <p className="font-semibold">{transaction.type}</p>
              <p className="text-gray-500">{transaction.date}</p>
            </div>
            <p className="text-lg">{transaction.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
