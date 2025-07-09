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
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import {
  fetchTransactions,
  Transaction,
} from "../../features/transaction/transactionSlice";

type ChartData = {
  date: string;
  income: number;
  expense: number;
};

export default function WorkingCapitalChart({ userId }: { userId?: string }) {
  const { token } = useAuthContext();
  const [data, setData] = useState<ChartData[]>([]);
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((state) => state.transactions.items);

  useEffect(() => {
    if (!token || !userId) return;
    dispatch(
      fetchTransactions({ token, userId, filters: { period: "weekly" } })
    );
  }, [token, userId]);

  useEffect(() => {
    const groupedMap = new Map<string, ChartData>();

    transactions.forEach((tx: Transaction) => {
      const dateKey = new Date(tx.date).toISOString().split("T")[0];

      if (!groupedMap.has(dateKey)) {
        groupedMap.set(dateKey, { date: dateKey, income: 0, expense: 0 });
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
  }, [transactions]);

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md h-auto ">
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-gray-100">
        Weekly Working Capital
      </h3>
      <div className="w-full h-60">
        {data.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-gray-500 mt-10">
            No data available
          </p>
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
              <XAxis
                dataKey="date"
                stroke="#8884d8"
                className="dark:text-gray-100"
              />
              <YAxis stroke="#8884d8" className="dark:text-gray-100" />
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                className="dark:stroke-gray-700"
              />
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
