import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext";

const COLORS = ["#22c55e", "#ff0033"];

export default function IncomeExpensePieChart({
  userId,
}: {
  userId: string | undefined;
}) {
  const { token } = useAuthContext();
  const [data, setData] = useState([
    { name: "Income", value: 0 },
    { name: "Expense", value: 0 },
  ]);

  useEffect(() => {
    const fetchIncomeExpense = async () => {
      if (!token || !userId) return;

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/${userId}/balance`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { income = 0, expenses = 0 } = res.data;

        setData([
          { name: "Income", value: income },
          { name: "Expense", value: expenses },
        ]);
      } catch (error) {
        console.error("❌ Failed to fetch income/expense summary", error);
      }
    };

    fetchIncomeExpense();
  }, [userId, token]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Income vs Expense</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            dataKey="value"
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
