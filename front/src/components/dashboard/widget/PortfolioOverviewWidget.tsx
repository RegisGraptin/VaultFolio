import { useMultiVaultPortfolioValue } from "@/utils/hook/vault";
import WidgetLayout from "./WidgetLayout";
import { Address } from "viem";
import { displayFormattedBalance } from "@/utils/tokens/balance";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
};

const PortfolioOverviewWidget = ({
  vaultAddresses,
}: {
  vaultAddresses: Address[];
}) => {
  const { totalBalance, isLoading } = useMultiVaultPortfolioValue({
    vaultAddresses,
  });

  // Example data - replace with real data
  const totalValue = "$542,470.00";
  const percentageChange = 22.23;
  const startDate = "12 January 2024";
  const endDate = "12 January 2025";

  // Example chart data points (normalized coordinates)

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

  return (
    <WidgetLayout>
      <div className="grid grid-cols-1 gap-6">
        {/* Portfolio Value */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700">
            Total Portfolio Value
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {startDate} - {endDate}
          </p>

          <div className="mt-6">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-gray-900">
                ${displayFormattedBalance(totalBalance)}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <span className="text-green-500 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1 text-sm font-medium">
                {/* <ArrowUpIcon className="w-4 h-4" /> */}
                {percentageChange}%
              </span>
              <span className="text-sm text-gray-500">Total return</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-48 md:h-auto">
          <div className="relative h-full w-full">
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
      </div>
    </WidgetLayout>
  );
};

export default PortfolioOverviewWidget;
