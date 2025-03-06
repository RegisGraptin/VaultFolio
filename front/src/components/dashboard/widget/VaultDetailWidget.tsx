import { Address } from "viem";
import WidgetLayout from "./WidgetLayout";
import {
  usePortfolioHistory,
  usePortfolioLending,
  useVault,
} from "@/utils/hook/vault";
import { getMenuColorStyle, getVaultColor } from "@/utils/vault/colors";
import { displayFormattedBalance } from "@/utils/tokens/balance";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { FaChevronRight, FaVault } from "react-icons/fa6";
import { IoWallet } from "react-icons/io5";
import Link from "next/link";
import { LENDING_TOKENS } from "@/utils/tokens/tokens";
import { useEffect, useMemo, useState } from "react";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
};

const VaultDetailWidget = ({
  vaultAddress,
  vaultIndex,
}: {
  vaultAddress: Address;
  vaultIndex?: number;
}) => {
  // Read vault data
  const [data, setData] = useState<{ date: string; balance: number }[]>([]);
  const { data: vaultName } = useVault(vaultAddress, "name");
  const { data: vaultColorIndex } = useVault(vaultAddress, "color");

  // FIXME: balance not on lending be careful here
  const { totalLending, lendingAPY, isLoading } = usePortfolioLending({
    vaultAddress,
  });

  // Daily
  const { balances, isLoading: isLoadingPortfolioVariation } =
    usePortfolioHistory({
      vaultAddress,
      tokens: LENDING_TOKENS,
    });

  // console.log("balances:", balances);

  useEffect(() => {
    if (isLoadingPortfolioVariation) return;

    const currentDate = new Date();
    const daysArray = Array.from({ length: 20 }, (_, i) => {
      const date = new Date();
      date.setDate(currentDate.getDate() - (19 - i));
      return date;
    });

    setData(
      balances.map((balance: number, index: number) => ({
        date: daysArray[index].toISOString().split("T")[0],
        balance: balance,
      }))
    );
  }, [isLoadingPortfolioVariation]);

  const subTitle = vaultName ? `Vault #${vaultIndex}` : "Wallet";
  const title = vaultName ? (vaultName as string) : "My Wallet";

  return (
    <WidgetLayout>
      <div className="mb-6">
        {/* Display vault header */}
        <div className="flex justify-between items-start mt-1">
          <div className="flex">
            <div
              className={`w-12 h-12 mr-4 flex items-center justify-center rounded-md ${getVaultColor(vaultColorIndex as number)}`}
            >
              {vaultName ? (
                <FaVault className={`mx-2 text-2xl`} />
              ) : (
                <IoWallet className={`mx-2 text-2xl`} />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">{subTitle}</p>
              <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
            </div>
          </div>
          <Link title="View detail" href={`/vaults/${vaultAddress}`}>
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-md ${getMenuColorStyle(vaultColorIndex as number)}`}
            >
              <FaChevronRight className={`mx-2 text-2xl`} />
            </div>
          </Link>
        </div>

        {/* Display total value */}
        <div className="pt-5">
          <p className="text-sm text-gray-500 mt-1">Total lending value</p>
          <h2 className="text-xl font-semibold text-gray-700">
            ${displayFormattedBalance(totalLending)}
          </h2>
        </div>

        {/* Display reward rate */}
        <div className="pt-5">
          <p className="text-sm text-gray-500 mt-1">Lending Yield</p>
          <h2 className="text-xl font-semibold text-gray-700">
            {displayFormattedBalance(lendingAPY)}%
          </h2>
        </div>

        {/* Display reward history */}
        <div className="pt-5 w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, left: 10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0,0,0,0.1)"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                tick={{ fill: "currentColor", fontSize: 12 }}
                tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickFormatter={(value) => formatDate(value)}
              />

              <Tooltip
                labelClassName="bg-opacity-90 backdrop-blur-sm text-sm"
                contentStyle={{
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  color: "currentColor",
                }}
                itemStyle={{ padding: 0 }}
                formatter={(value, index) => [
                  <span key={index} className="text-lg font-semibold">
                    ${Number(value).toLocaleString()}
                  </span>,
                  "Balance",
                ]}
                labelFormatter={(label) => formatDate(label)}
              />

              {/* Remove Area from Line children */}
              <Line
                type="monotone"
                dataKey="balance"
                stroke="currentColor"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  fill: "var(--card-background)",
                  stroke: "currentColor",
                }}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </WidgetLayout>
  );
};

export default VaultDetailWidget;
