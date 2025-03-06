"use client";

import GroupNavigation from "@/components/common/GroupNavigation";
import WidgetLayout from "@/components/dashboard/widget/WidgetLayout";
import { usePortfolioHistory } from "@/utils/hook/vault";
import { displayFormattedBalance } from "@/utils/tokens/balance";

import { LENDING_TOKENS, DEBT_TOKENS } from "@/utils/tokens/tokens";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Address } from "viem";

interface DataPoint {
  period: string;
  lending: number;
  borrowing: number;
  borrowingAbs: number;
}

const calculateAverageInterest = (
  variations: number[],
  percentileThreshold = 0.8
): number => {
  // Sort variations by absolute value
  const sortedAbs = [...variations].sort((a, b) => Math.abs(a) - Math.abs(b));

  // Remove top 20% (or whatever percentile) of values to eliminate likely deposits/withdrawals
  const cutoffIndex = Math.floor(sortedAbs.length * percentileThreshold);
  const filteredVariations = sortedAbs.slice(0, cutoffIndex);

  // Calculate average of remaining values
  const average =
    filteredVariations.reduce((sum, val) => sum + val, 0) /
    filteredVariations.length;

  return average;
};

export default function VaultRewardLossWidget({
  vaultAddress,
}: {
  vaultAddress: Address;
}) {
  const { variation: lendingVariation, isLoading: isLoadingLendingVariation } =
    usePortfolioHistory({
      vaultAddress,
      tokens: LENDING_TOKENS,
    });

  const {
    variation: borrowingVariation,
    isLoading: isLoadingBorrowingVariation,
  } = usePortfolioHistory({
    vaultAddress,
    tokens: DEBT_TOKENS,
  });

  const [maxLendingValue, setMaxLendingValue] = useState<string>("100");
  const [maxBorrowingValue, setMaxBorrowingValue] = useState<string>("100");

  const [avgIncome, setAvgIncome] = useState<number>(0);
  const [avgExpense, setAvgExpense] = useState<number>(0);

  const [data, setData] = useState<DataPoint[]>([]);

  // Memoize the transformed data and use it directly
  useEffect(() => {
    if (isLoadingLendingVariation || isLoadingBorrowingVariation) return;

    // console.log("lendingVariation:", lendingVariation)
    // console.log("borrowingVariation:", borrowingVariation)

    const transformed = Array.from({ length: 19 }, (_, i) => ({
      // FIXME: see if 20
      period: `Day ${i + 1}`,
      lending: lendingVariation[i] || 0,
      borrowing: borrowingVariation[i] || 0,
      borrowingAbs: Math.abs(borrowingVariation[i] || 0),
    }));

    // Update max values when data changes
    setMaxLendingValue(
      Math.max(...transformed.map((d) => d.lending), 100).toFixed(2)
    );
    setMaxBorrowingValue(
      Math.max(...transformed.map((d) => d.borrowingAbs), 100).toFixed(2)
    );

    setAvgIncome(calculateAverageInterest(transformed.map((d) => d.lending)));
    setAvgExpense(
      calculateAverageInterest(transformed.map((d) => d.borrowingAbs))
    );

    setData(transformed);
  }, [isLoadingLendingVariation, isLoadingBorrowingVariation]);

  const TIMEFRAMES = ["Daily"]; // , "Weekly"
  const [selectedTimeframe, setSelectedTimeframe] = React.useState("Daily");

  return (
    <WidgetLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Vault Performance
          </h2>
          <p className="text-sm text-gray-500">Daily yield analysis</p>
        </div>

        <GroupNavigation
          tabs={TIMEFRAMES}
          activeTab={selectedTimeframe}
          setActiveTab={setSelectedTimeframe}
        />
      </div>

      <div className="grid grid-cols-3 ">
        <div className="col-span-2 h-[300px] flex flex-col">
          {/* Rewards Chart */}
          <div className="h-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 30, left: 30, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <YAxis
                  domain={[0, maxLendingValue]}
                  ticks={[0, maxLendingValue]} // Add this line
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <XAxis
                  dataKey="period"
                  axisLine={false}
                  tickLine={false}
                  tick={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => (
                    <div className="bg-white p-4 rounded-lg shadow-2xl border border-gray-100">
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        {label}
                      </p>
                      <div className="space-y-2">
                        {payload?.map((entry, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-emerald-500" />
                              <span className="text-sm font-medium text-gray-600">
                                Yield
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-emerald-600">
                              +$
                              {displayFormattedBalance(
                                (entry.value as number) || 0
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                />
                <Bar dataKey="lending" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Costs Chart */}
          <div className="h-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 0, right: 30, left: 30, bottom: 15 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <YAxis
                  domain={[0, maxBorrowingValue]}
                  ticks={[0, maxBorrowingValue]} // Add this line
                  reversed={true}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <XAxis
                  dataKey="period"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  interval={3}
                />
                <Tooltip
                  content={({ active, payload, label }) => (
                    <div className="bg-white p-4 rounded-lg shadow-2xl border border-gray-100">
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        {label}
                      </p>
                      <div className="space-y-2">
                        {payload?.map((entry, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-rose-500" />
                              <span className="text-sm font-medium text-gray-600">
                                Cost
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-rose-600">
                              -$
                              {displayFormattedBalance(
                                Math.abs(payload[0].payload.borrowing)
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                />
                <Bar
                  dataKey="borrowingAbs"
                  fill="#ef4444"
                  radius={[0, 0, 4, 4]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="col-span-1 pl-6 border-l-2 border-gray-100">
          <div className="space-y-8">
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <svg
                    className="w-5 h-5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">
                    Average Income
                  </h3>
                  <p className="text-2xl font-bold text-emerald-600">
                    ${displayFormattedBalance(avgIncome)}
                  </p>
                </div>
              </div>
              {/* <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Average Income</span>
                <span className="font-medium text-emerald-600">
                  ${avgIncome}
                </span>
              </div> */}
            </div>

            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-rose-100 rounded-lg">
                  <svg
                    className="w-5 h-5 text-rose-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">
                    Average Expense
                  </h3>
                  <p className="text-2xl font-bold text-rose-600">
                    ${displayFormattedBalance(avgExpense)}
                  </p>
                </div>
              </div>
              {/* <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Average Expense</span>
                <span className="font-medium text-rose-600">${avgExpense}</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </WidgetLayout>
  );
}
