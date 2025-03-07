import WidgetLayout from "@/components/dashboard/widget/WidgetLayout";
import { usePortfolioBorrowing, usePortfolioLending } from "@/utils/hook/vault";
import { displayFormattedBalance } from "@/utils/tokens/balance";
import React from "react";
import { Address } from "viem";

const VaultDetailWidget = ({ vaultAddress }: { vaultAddress: Address }) => {
  const { totalLending, lendingAPY } = usePortfolioLending({ vaultAddress });
  const { totalBorrowing, borrowingAPY } = usePortfolioBorrowing({
    vaultAddress,
  });

  const netApy = totalLending
    ? (totalLending * lendingAPY - totalBorrowing * borrowingAPY) /
      (totalLending - totalBorrowing)
    : 0;

  return (
    <WidgetLayout>
      {/* First Row - Core Metrics */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-1">Net Value</h2>
          <p className="text-3xl font-semibold text-gray-900">
            ${displayFormattedBalance(totalLending - totalBorrowing)}
          </p>
        </div>

        <div className="text-right">
          <div className="flex gap-4">
            {/* Lending Block */}
            {/* <div className="pr-4 border-r border-gray-100"> */}
            {/* <div className="p-2 pl-20 bg-red-50 rounded-xl border border-red-100"> */}
            <div className="p-2 pl-10 bg-green-50 rounded-xl border border-green-100">
              <p className="text-sm text-gray-500 mb-1">Lending</p>
              <p className="text-lg font-semibold text-green-600">
                ${displayFormattedBalance(totalLending)}
              </p>
            </div>

            {/* Borrowing Block */}
            <div className="p-2 pl-10 bg-red-50 rounded-xl border border-red-100">
              <p className="text-sm text-gray-500 mb-1">Borrowing</p>
              <p className="text-lg font-semibold text-red-600">
                ${displayFormattedBalance(totalBorrowing)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row - Performance & Ratios */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-sm text-gray-500">APY</span>
            <p className="text-lg font-semibold text-green-600">
              +{displayFormattedBalance(lendingAPY)}% ($
              {displayFormattedBalance((totalLending * lendingAPY) / 100)})
            </p>
          </div>
          <div className="h-6 w-px bg-gray-100" />
          <div>
            <span className="text-sm text-gray-500">Interest</span>
            <p className="text-lg font-semibold text-red-600">
              -
              {totalLending
                ? `${displayFormattedBalance(
                    (totalBorrowing * borrowingAPY) / totalLending
                  )}%`
                : "0.00%"}{" "}
              ($
              {displayFormattedBalance((totalBorrowing * borrowingAPY) / 100)})
            </p>
          </div>
          <div className="h-6 w-px bg-gray-100" />
          <div>
            <span className="text-sm text-gray-500">Net APY</span>
            <p
              className={`text-lg font-semibold ${netApy >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {netApy >= 0 ? "+" : ""}
              {displayFormattedBalance(netApy)}%
            </p>
          </div>
          <div className="h-6 w-px bg-gray-100" />
          <div>
            <span className="text-sm text-gray-500">LTV</span>
            <p className="text-lg font-semibold">
              {totalLending
                ? `${displayFormattedBalance((totalBorrowing / totalLending) * 100)}%`
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </WidgetLayout>
  );
};

export default VaultDetailWidget;
