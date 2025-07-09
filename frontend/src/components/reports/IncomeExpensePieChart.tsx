import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAppSelector } from "../../hooks/useRedux";

const COLORS = ["#22c55e", "#ff0033"];

export default function IncomeExpensePieChart() {
  const { income, expenses } = useAppSelector((state) => state.user.balance);

  const data = [
    { name: "Income", value: income },
    { name: "Expense", value: expenses },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded shadow ">
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
          <Tooltip
            contentStyle={{
              backgroundColor: "#222",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
            }}
            labelStyle={{
              color: "#fff",
            }}
          />
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
