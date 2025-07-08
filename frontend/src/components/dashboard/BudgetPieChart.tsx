"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { useAuthContext } from "../../context/AuthContext";

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

interface Transaction {
  amount: number;
  category: string;
  type: "income" | "expense";
}

export default function BudgetPieChart({ userId }: { userId?: string }) {
  const { token } = useAuthContext();
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>(
    []
  );

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!token || !userId) return;

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/transactions/`,
          {
            params: { userId },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const transactions: Transaction[] = res.data;

        // Group by category
        const categoryMap: Record<string, number> = {};
        transactions.forEach((tx) => {
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
      } catch (error) {
        console.error("❌ Failed to fetch transaction data", error);
      }
    };

    fetchTransactions();
  }, [token, userId]);

  return (
    <div className="bg-white p-4 rounded-lg shadow w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">Budget Breakdown</h3>
      <div className="w-full h-60">
        {chartData.length === 0 ? (
          <p className="text-center text-gray-400">No data available</p>
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
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
