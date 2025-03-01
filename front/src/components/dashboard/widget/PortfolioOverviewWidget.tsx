import { useMultiVaultPortfolioValue } from "@/utils/hook/vault";
import WidgetLayout from "./WidgetLayout";
import { Address } from "viem";
import { displayFormattedBalance } from "@/utils/tokens/balance";

const PortfolioOverviewWidget = ({vaultAddresses}: {vaultAddresses: Address[]}) => {

  const {totalBalance, isLoading} = useMultiVaultPortfolioValue({vaultAddresses});
  
  // Example data - replace with real data
  const totalValue = "$542,470.00";
  const percentageChange = 22.23;
  const startDate = "12 January 2024";
  const endDate = "12 January 2025";

  // Example chart data points (normalized coordinates)

  const data = [
    { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 500, pv: 2400, amt: 2400 },
  ];

  return (
    <WidgetLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side - Portfolio Value */}
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

        {/* Right Side - Chart */}
        <div className="h-48 md:h-auto">
          <div className="relative h-full w-full">
            {/* <LineChart width={400} height={400} data={data}>
              <Line type="monotone" dataKey="uv" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis />
            </LineChart> */}
          </div>
        </div>
      </div>
    </WidgetLayout>
  );
};

export default PortfolioOverviewWidget;
