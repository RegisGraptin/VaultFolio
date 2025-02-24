import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import WidgetLayout from "./WidgetLayout";

const AllocationWidget = () => {
  // Sample data - replace with real data
  const data = [
    { name: "Stocks", value: 45, color: "#3B82F6" },
    { name: "Bonds", value: 25, color: "#10B981" },
    { name: "Cash", value: 15, color: "#6366F1" },
    { name: "Real Estate", value: 10, color: "#F59E0B" },
    { name: "Commodities", value: 5, color: "#EF4444" },
  ];

  return (
    <WidgetLayout>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-700">
            Portfolio Allocation
          </h2>
          <p className="text-sm text-gray-500 mt-1">As of 12 January 2024</p>
        </div>
        {/* <InformationCircleIcon className="w-5 h-5 text-gray-400 hover:text-gray-500 cursor-pointer" /> */}
      </div>

      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                border: "none",
              }}
              formatter={(value, name) => [
                `${value}%`,
                <span key={name} className="text-gray-600">
                  {name}
                </span>,
              ]}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: "20px" }}
              content={({ payload }) => (
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {payload?.map((entry, index) => (
                    <div
                      key={`legend-${index}`}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-gray-600">{entry.value}</span>
                    </div>
                  ))}
                </div>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </WidgetLayout>
  );
};

export default AllocationWidget;
