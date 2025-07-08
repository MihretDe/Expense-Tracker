import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";

export default function BalanceOverviewCard({userId}: {userId: string | undefined}) {
  const { token } = useAuthContext();
  const [total, setTotal] = useState(0);
  useEffect(() => {
    const fetchIncomeExpense = async () => {
      if (!userId) return;

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/${userId}/balance`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { totalBalance } = res.data;
        setTotal(totalBalance || 0);
      } catch (error) {
        console.error("❌ Failed to fetch income/expense summary", error);
      }
    };

    fetchIncomeExpense();
  }, [userId, token]);
  return (
    <div
      className="rounded-2xl text-white shadow-lg relative overflow-hidden p-5 h-64 "
      style={{
        background:
          "linear-gradient(160deg, #1f2937 0%, #111827 60%, #10b981 130%)",
      }}
    >
      <div className="flex justify-between items-start mb-5">
        <div>
          <p className="text-sm text-gray-200">Balance overview</p>
          <h2 className="text-2xl font-bold mt-2 tracking-tight">${total}</h2>
          
          <p className="text-xs text-gray-400">Combination of bank accounts</p>
        </div>

       
      </div>

      {/* Logos row */}
      <div className="absolute bottom-4 left-4 flex gap-3">
        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-black text-xs font-bold">
          🏦
        </div>
        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-black text-xs font-bold">
          💳
        </div>
        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-black text-xs font-bold">
          📈
        </div>
      </div>
    </div>
  );
}
