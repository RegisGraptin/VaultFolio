import WidgetLayout from "@/components/dashboard/widget/WidgetLayout";
import React from "react";

const VaultDetailWidget = () => {
  return (
    <>
      <WidgetLayout>
        {/* Persistent Portfolio Value Section */}
        <div className="flex justify-between items-center mb-8">
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

        {/* Tab-Specific Content */}
      </WidgetLayout>
    </>
  );
};

export default VaultDetailWidget;
