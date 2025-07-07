import { useEffect, useState } from "react";
import axios from "axios";

import BudgetPieChart from "../components/dashboard/BudgetPieChart";
import RecentTransactionTable from "../components/dashboard/RecentTransactionTable";
import SummaryCard from "../components/dashboard/SummaryCard";
import WorkingCapitalChart from "../components/dashboard/WorkingCapitalChart";
import { useAuthContext } from "../context/AuthContext";


export default function Dashboard() {
  const { user, token } = useAuthContext();
  const [userId, setUserId] = useState<string | undefined>(undefined);

  const [balanceData, setBalanceData] = useState({
    income: 0,
    expenses: 0,
    totalBalance: 0,
  });

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (!user || !token) return;

        const userRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/${user.sub}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fetchedUserId = userRes.data._id;
        setUserId(fetchedUserId);
        console.log(fetchedUserId)

        const balanceRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/${fetchedUserId}/balance`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBalanceData(balanceRes.data);
      } catch (error) {
        console.error("❌ Failed to fetch balance", error);
      }
    };

    fetchBalance();
  }, [user, token]);

  const { income, expenses, totalBalance } = balanceData;

  return (
    <div className="space-y-6 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:w-2/3">
        <SummaryCard
          label="Total balance"
          value={`$${totalBalance.toFixed(2)}`}
          icon="wallet"
          active
        />
        <SummaryCard
          label="Total spending"
          value={`$${expenses.toFixed(2)}`}
          icon="credit-card"
        />
        <SummaryCard
          label="Total income"
          value={`$${income.toFixed(2)}`}
          icon="piggy-bank"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4">
        <div className="md:col-span-2">
          <WorkingCapitalChart userId={userId} />
        </div>
        <div className="md:col-span-1">
          <BudgetPieChart  userId={userId}/>
        </div>
      </div>

      <RecentTransactionTable userId={userId} />
    </div>
  );
}
