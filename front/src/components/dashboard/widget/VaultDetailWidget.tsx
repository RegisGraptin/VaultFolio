import { Address } from "viem";
import WidgetLayout from "./WidgetLayout";
import { usePortfolioValue, useVault } from "@/utils/hook/vault";
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
  const { data: vaultName } = useVault(vaultAddress, "name");
  const { data: vaultColorIndex } = useVault(vaultAddress, "color");

  const { totalBalance, isLoading } = usePortfolioValue({ vaultAddress });

  const data = [
    {
      date: "2023-05-01",
      balance: 25000.5,
      apy: 5.2, // Optional for extended functionality
    },
    {
      date: "2023-05-05",
      balance: 26543.75,
      apy: 5.5,
    },
    {
      date: "2023-05-10",
      balance: 27320.9,
      apy: 5.8,
    },
    {
      date: "2023-05-15",
      balance: 28567.3,
      apy: 6.1,
    },
    {
      date: "2023-05-20",
      balance: 27654.2, // Dip showing market fluctuation
      apy: 5.9,
    },
    {
      date: "2023-05-25",
      balance: 29210.45,
      apy: 6.3,
    },
    {
      date: "2023-05-30",
      balance: 30500.0,
      apy: 6.5,
    },
  ];

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
          <p className="text-sm text-gray-500 mt-1">Total value</p>
          <h2 className="text-xl font-semibold text-gray-700">
            ${displayFormattedBalance(totalBalance)}
          </h2>
        </div>

        {/* Display reward rate */}
        <div className="pt-5">
          <p className="text-sm text-gray-500 mt-1">Lending Yield</p>
          <h2 className="text-xl font-semibold text-gray-700">10.22%</h2>
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
                formatter={(value) => [
                  <span className="text-lg font-semibold">
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
