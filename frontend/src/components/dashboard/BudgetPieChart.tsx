"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { useAuthContext } from "../../context/AuthContext";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import {
  fetchTransactions,
  Transaction,
} from "../../features/transaction/transactionSlice";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#8dd1e1",
  "#d0ed57",
  "#a4de6c",
  "#ffbb28",
];

export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white p-2 rounded shadow text-sm">
        <p className="font-medium">
          {payload[0].name} : ${payload[0].value}
        </p>
      </div>
    );
  }

  return null;
};

export default function BudgetPieChart({ userId }: { userId?: string }) {
  const { token } = useAuthContext();
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((state) => state.transactions.items);

  const [chartData, setChartData] = useState<{ name: string; value: number }[]>(
    []
  );

  // Fetch all transactions
  useEffect(() => {
    if (!token || !userId) return;

    dispatch(fetchTransactions({ token, userId }));
  }, [token, userId, dispatch]);

  // Transform data for chart
  useEffect(() => {
    if (!transactions.length) return;

    const categoryMap: Record<string, number> = {};
    transactions.forEach((tx: Transaction) => {
      if (!categoryMap[tx.category]) {
        categoryMap[tx.category] = 0;
      }
      categoryMap[tx.category] += tx.amount;
    });

    const formatted = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
    }));

    setChartData(formatted);
  }, [transactions]);

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto ">
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-gray-100">
        Budget Breakdown
      </h3>
      <div className="w-full h-60">
        {chartData.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-gray-500">
            No data available
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name }) => (
                  <span className="text-xs text-black dark:text-gray-100">
                    {name}
                  </span>
                )}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
