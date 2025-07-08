import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import { useAuthContext } from "../../context/AuthContext";
import { format } from "date-fns";
import {
  fetchTransactions,
  Transaction,
} from "../../features/transaction/transactionSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";

type ChartDataPoint = {
  date: string;
  income: number;
  expense: number;
};

function transformData(raw: Transaction[]) {
  const grouped: Record<string, { income: number; expense: number }> = {};

  for (const tx of raw) {
    const day = format(new Date(tx.date), "MMM dd");
    if (!grouped[day]) {
      grouped[day] = { income: 0, expense: 0 };
    }
    grouped[day][tx.type] += tx.amount;
  }

  return Object.entries(grouped)
    .map(([date, values]) => ({ date, ...values }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export default function WorkingCapitalChart({
  userId,
}: {
  userId: string | undefined;
}) {
  const [range, setRange] = useState<"7d" | "30d">("7d");
  const [data, setData] = useState<ChartDataPoint[]>([]);

  const { token } = useAuthContext();
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((state) => state.transactions.items);

  useEffect(() => {
    if (!userId || !token) return;

    const period = range === "7d" ? "weekly" : "monthly";

    dispatch(fetchTransactions({ token, userId, filters: { period } }));
  }, [userId, token, range, dispatch]);

  useEffect(() => {
    setData(transformData(transactions));
  }, [transactions]);

  const handleExportCSV = () => {
    const rows = [
      ["Date", "Income", "Expense"],
      ...data.map((row) => [row.date, row.income, row.expense]),
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${range}-trend.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-black p-4 rounded-lg shadow w-full h-auto border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-4">
        <h3 className="text-lg font-semibold text-black dark:text-gray-100">
          {range === "7d" ? "Weekly" : "Monthly"} Income vs Expense
        </h3>
        <div className="flex gap-2">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as "7d" | "30d")}
            className="border px-2 py-1 rounded text-sm bg-white dark:bg-gray-900 text-black dark:text-gray-100 border-gray-300 dark:border-gray-700"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
          <button
            onClick={handleExportCSV}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
          >
            Export CSV
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EAB308" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#EAB308" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
            className="dark:stroke-gray-700"
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#222" }}
            className="dark:text-gray-100"
            stroke="#8884d8"
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#222" }}
            className="dark:text-gray-100"
            domain={[0, "auto"]}
            tickFormatter={(value) => `${value / 1000}K`}
            stroke="#8884d8"
          />
          <Tooltip
            contentStyle={{
              background: "#222",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.875rem",
            }}
            labelStyle={{
              color: "#fff",
            }}
            labelClassName="font-medium text-gray-900 dark:text-gray-100"
            formatter={(value: number) => `$${value.toLocaleString()}`}
          />
          <Legend
            verticalAlign="top"
            align="center"
            iconType="circle"
            iconSize={10}
            wrapperStyle={{ marginBottom: 10, color: "inherit" }}
            formatter={(value: string) => (
              <span className="text-black dark:text-gray-100">{value}</span>
            )}
          />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#10B981"
            fill="url(#incomeGradient)"
            name="Income"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Area
            type="monotone"
            dataKey="expense"
            stroke="#EAB308"
            fill="url(#expenseGradient)"
            name="Expenses"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
