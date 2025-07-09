import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAppSelector } from "../../hooks/useRedux";
import { CustomTooltip } from "../dashboard/BudgetPieChart";

const COLORS = ["#22c55e", "#ff0033"];

export default function IncomeExpensePieChart() {
  const { income, expenses } = useAppSelector((state) => state.user.balance);

  const data = [
    { name: "Income", value: income },
    { name: "Expense", value: expenses },
  ];

  return (
    <div className="bg-white dark:bg-black p-4 rounded shadow border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-gray-100">
        Income vs Expense
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            dataKey="value"
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ name }) => (
              <span className="text-xs text-black dark:text-gray-100">
                {name}
              </span>
            )}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />

          <Legend
            wrapperStyle={{
              color: "inherit",
            }}
            formatter={(value: string) => (
              <span className="text-black dark:text-gray-100">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
