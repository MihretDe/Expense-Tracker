import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext";

type ChartData = {
  date: string;
  income: number;
  expense: number;
};

export default function WorkingCapitalChart({ userId }: { userId?: string }) {
  const { token } = useAuthContext();
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!token || !userId) return;

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/transactions/filter`,
          {
            params: {
              userId,
              period: "weekly",
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const rawTransactions = res.data;

        // Group by date and sum income/expense
        const groupedMap = new Map<string, ChartData>();

        rawTransactions.forEach((tx: any) => {
          const dateKey = new Date(tx.date).toISOString().split("T")[0]; // "YYYY-MM-DD"

          if (!groupedMap.has(dateKey)) {
            groupedMap.set(dateKey, {
              date: dateKey,
              income: 0,
              expense: 0,
            });
          }

          const group = groupedMap.get(dateKey)!;
          if (tx.type === "income") {
            group.income += tx.amount;
          } else if (tx.type === "expense") {
            group.expense += tx.amount;
          }
        });

        const formatted = Array.from(groupedMap.values()).sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        setData(formatted);
        console.log("📊 Formatted Chart Data:", formatted);
      } catch (err) {
        console.error("❌ Failed to fetch working capital data", err);
      }
    };

    fetchChartData();
  }, [token, userId]);

  return (
    <div className="bg-white p-4 rounded-lg shadow h-auto">
      <h3 className="text-lg font-semibold mb-4">Working Capital</h3>
      <div className="w-full h-60">
        {data.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorIncome)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#EF4444"
                fillOpacity={1}
                fill="url(#colorExpense)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
