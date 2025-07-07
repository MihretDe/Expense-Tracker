import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext";

type BarData = { category: string; value: number };

export default function CategoryBarChart({
  userId,
}: {
  userId: string | undefined;
}) {
  const [data, setData] = useState<BarData[]>([]);
  const { token } = useAuthContext();

  useEffect(() => {
    const fetchCategorySummary = async () => {
      if (!userId || !token) return;

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/categories/summary`,
          {
            params: { userId, period: "monthly" },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Category Summary Data:", res.data);
        setData(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch category summary", err);
      }
    };

    fetchCategorySummary();
  }, [userId, token]);

  return (
    <div className="bg-white p-4 rounded shadow md:h-64">
      <h3 className="text-lg font-semibold mb-4">
        Monthly Transaction by Category
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#2196f3" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
