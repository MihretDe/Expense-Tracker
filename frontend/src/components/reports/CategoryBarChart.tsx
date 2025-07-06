import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { category: "Food", value: 450 },
  { category: "Rent", value: 800 },
  { category: "Utilities", value: 200 },
  { category: "Transport", value: 150 },
];

export default function CategoryBarChart() {
  return (
    <div className="bg-white p-4 rounded shadow md:h-64">
      <h3 className="text-lg font-semibold mb-4">
        Monthly Spending by Category
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
