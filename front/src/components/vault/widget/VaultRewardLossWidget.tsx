import WidgetLayout from "@/components/dashboard/widget/WidgetLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const generateData = () => {
  return Array.from({ length: 20 }, (_, i) => {
    const lending = Math.floor(Math.random() * 10000) + 2000;
    const borrowing = -Math.floor(Math.random() * 5000) - 1000;
    return {
      period: `Week ${i + 1}`,
      lending,
      borrowing,
      borrowingAbs: Math.abs(borrowing),
    };
  });
};

const data = generateData();

export default function VaultRewardLossWidget() {
  const totalIncome = data.reduce((sum, item) => sum + item.lending, 0);
  const totalExpense = data.reduce((sum, item) => sum + item.borrowingAbs, 0);
  const apyIncome = 4.8;
  const apyExpense = 9.2;

  const maxLending = Math.max(...data.map((item) => item.lending));
  const maxBorrowing = Math.max(...data.map((item) => item.borrowingAbs));
  const maxValue = Math.max(maxLending, maxBorrowing);

  return (
    <WidgetLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Vault Performance
          </h2>
          <p className="text-sm text-gray-500">Weekly yield analysis</p>
        </div>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button className="px-3 py-1 bg-white rounded-md text-sm font-medium shadow-sm">
            Daily
          </button>
          <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-600 hover:bg-white hover:shadow-sm">
            Weekly
          </button>
        </div>
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
                  domain={[0, maxValue]}
                  ticks={[0, maxValue]} // Add this line
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
                              +${entry.value.toLocaleString()}
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
                  domain={[0, maxValue]}
                  ticks={[0, maxValue]} // Add this line
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
                              {Math.abs(
                                payload[0].payload.borrowing
                              ).toLocaleString()}
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
                    Total Income
                  </h3>
                  <p className="text-2xl font-bold text-emerald-600">
                    ${totalIncome.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Current APY</span>
                <span className="font-medium text-emerald-600">
                  {apyIncome}%
                </span>
              </div>
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
                    Total Expense
                  </h3>
                  <p className="text-2xl font-bold text-rose-600">
                    ${totalExpense.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Current APR</span>
                <span className="font-medium text-rose-600">{apyExpense}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WidgetLayout>
  );
}
