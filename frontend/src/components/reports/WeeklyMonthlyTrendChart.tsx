import { useState } from "react";
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

const dataSets = {
  "7d": [
    { date: "Apr 14", income: 5000, expense: 4800 },
    { date: "Apr 15", income: 7200, expense: 6300 },
    { date: "Apr 16", income: 6500, expense: 7500 },
    { date: "Apr 17", income: 5500, expense: 7000 },
    { date: "Apr 18", income: 4000, expense: 5600 },
    { date: "Apr 19", income: 5800, expense: 4300 },
    { date: "Apr 20", income: 6700, expense: 5100 },
  ],
  "30d": Array.from({ length: 30 }, (_, i) => {
    const day = `Jun ${i + 1}`;
    return {
      date: day,
      income: Math.floor(Math.random() * 5000 + 4000),
      expense: Math.floor(Math.random() * 4000 + 3000),
    };
  }),
};

export default function WorkingCapitalChart() {
  const [range, setRange] = useState<"7d" | "30d">("7d");
  const data = dataSets[range];

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
