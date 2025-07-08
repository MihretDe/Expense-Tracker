import { useState, useEffect } from "react";
import axios from "axios";
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

type Transaction = {
  date: string;
  type: "income" | "expense";
  amount: number;
};

function transformData(raw: Transaction[]) {
  const grouped: Record<string, { income: number; expense: number }> = {};

  for (const tx of raw) {
    const day = format(new Date(tx.date), "MMM dd"); // e.g., "Jul 07"
    if (!grouped[day]) {
      grouped[day] = { income: 0, expense: 0 };
    }
    grouped[day][tx.type] += tx.amount;
  }

  // Convert to array sorted by date
  return Object.entries(grouped)
    .map(([date, values]) => ({ date, ...values }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}


export default function WorkingCapitalChart({userId}: {userId: string | undefined}) {
  const [range, setRange] = useState<"7d" | "30d">("7d");
  type ChartDataPoint = {
    date: string;
    income: number;
    expense: number;
  };

  const [data, setData] = useState<ChartDataPoint[]>([]);
  
  const { user, token } = useAuthContext();

  useEffect(() => {
    const fetchChartData = async () => {
      if (!user || !token) return;

      const period = range === "7d" ? "weekly" : "monthly";

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/transactions/filter`,
          {
            params: { userId, period },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Chart data response:", res.data);
        const transformed = transformData(res.data);
        setData(transformed);
      } catch (err) {
        console.error("❌ Failed to fetch chart data", err);
      }
    };

    fetchChartData();
  }, [range, user, token]);

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
    <div className="bg-white p-4 rounded-lg shadow w-full h-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-4">
        <h3 className="text-lg font-semibold">
          {range === "7d" ? "Weekly" : "Monthly"} Income vs Expense
        </h3>

        <div className="flex gap-2">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as "7d" | "30d")}
            className="border px-2 py-1 rounded text-sm"
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

          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            domain={[0, "auto"]}
            tickFormatter={(value) => `${value / 1000}K`}
          />
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "0.875rem",
            }}
            labelClassName="font-medium text-gray-900"
            formatter={(value: number) => `$${value.toLocaleString()}`}
          />
          <Legend
            verticalAlign="top"
            align="center"
            iconType="circle"
            iconSize={10}
            wrapperStyle={{ marginBottom: 10 }}
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
