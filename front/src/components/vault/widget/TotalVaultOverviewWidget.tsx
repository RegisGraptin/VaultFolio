import WidgetLayout from "@/components/dashboard/widget/WidgetLayout";
import { useMultiVaultPortfolioValue } from "@/utils/hook/vault";
import { displayFormattedBalance } from "@/utils/tokens/balance";
import React from "react";
import { Address } from "viem";

const TotalVaultOverviewWidget = ({
  vaultAddresses,
}: {
  vaultAddresses: Address[];
}) => {
  const { totalBalance, isLoading } = useMultiVaultPortfolioValue({
    vaultAddresses,
  });

  return (
    <WidgetLayout>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-400">Total Vault Value</p>
          <h1 className="text-2xl font-bold">
            ${displayFormattedBalance(totalBalance)}
          </h1>
        </div>
        {/* <div className="flex space-x-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            New Vault
          </button>
        </div> */}
      </div>
    </WidgetLayout>
  );
};

export default TotalVaultOverviewWidget;
