import { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuthContext } from "../../context/AuthContext";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { fetchCategorySummary } from "../../features/category/categorySlice";

export default function CategoryBarChart({
  userId,
}: {
  userId: string | undefined;
}) {
  const { token } = useAuthContext();
  const dispatch = useAppDispatch();

  const data = useAppSelector((state) => state.categories.summary);

  useEffect(() => {
    if (!userId || !token) return;

    dispatch(fetchCategorySummary({ token, userId, period: "monthly" }));
  }, [userId, token, dispatch]);

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded shadow md:h-64 ">
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-gray-100">
        Monthly Transaction by Category
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis
            dataKey="category"
            stroke="#8884d8"
            tick={{ fill: "#222" }}
            tickLine={{ stroke: "#8884d8" }}
            className="dark:text-gray-100"
          />
          <YAxis
            stroke="#8884d8"
            tick={{ fill: "#222" }}
            tickLine={{ stroke: "#8884d8" }}
            className="dark:text-gray-100"
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
          <Bar dataKey="value" fill="#2196f3" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
