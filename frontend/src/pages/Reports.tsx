import { useEffect, useState } from "react";
import BalanceOverviewCard from "../components/reports/BalanceOverviewCard";
import CategoryBarChart from "../components/reports/CategoryBarChart";
import IncomeExpensePieChart from "../components/reports/IncomeExpensePieChart";
import WeeklyMonthlyTrendChart from "../components/reports/WeeklyMonthlyTrendChart";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";




export default function Reports() {
  const {user,token} = useAuthContext();
  const [userId, setUserId] = useState<string | undefined>(undefined);
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
        } catch (error) {
          console.error("❌ Failed to fetch balance", error);
        }
      };
  
      fetchBalance();
    }, [user, token]);
  return (
    <div className="space-y-6">
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <CategoryBarChart userId={userId}/>
        </div>
        <div className="md:col-span-1 hidden md:block">
         <BalanceOverviewCard userId={userId} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className=" md:col-span-2">

      <WeeklyMonthlyTrendChart userId={userId} />
        </div>
        <div className=" md:col-span-1">
       <IncomeExpensePieChart userId={userId} />
        </div>
      </div>
    </div>
  );
}
