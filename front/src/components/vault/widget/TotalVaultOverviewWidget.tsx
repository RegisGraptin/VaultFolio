import WidgetLayout from "@/components/dashboard/widget/WidgetLayout";
import React from "react";

const TotalVaultOverviewWidget = () => {
  return (
    <WidgetLayout>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-400">Total Vault Value</p>
          <h1 className="text-2xl font-bold">$10.000,00</h1>
        </div>
        <div className="flex space-x-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            New Vault
          </button>
        </div>
      </div>
    </WidgetLayout>
  );
};

export default TotalVaultOverviewWidget;
