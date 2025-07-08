import { useEffect, useState } from "react";
import BalanceOverviewCard from "../components/reports/BalanceOverviewCard";
import CategoryBarChart from "../components/reports/CategoryBarChart";
import IncomeExpensePieChart from "../components/reports/IncomeExpensePieChart";
import WeeklyMonthlyTrendChart from "../components/reports/WeeklyMonthlyTrendChart";
import { useAuthContext } from "../context/AuthContext";

import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { fetchUser } from "../features/user/userSlice";
import { CircularProgress } from "@mui/material";




export default function Reports() {
  const { user: auth0User, token } = useAuthContext();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.user);
    const userLoading = useAppSelector((state) => state.user.userLoading);
  useEffect(() => {
      if (auth0User?.sub && token) {
        dispatch(fetchUser({ token, auth0Id: auth0User.sub }));
      }
    }, [auth0User, token, dispatch]);
    if (userLoading || !user) {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <CircularProgress />
          </div>
        );
      }
  return (
    <div className="space-y-6">
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <CategoryBarChart userId={user?._id}/>
        </div>
        <div className="md:col-span-1 hidden md:block">
         <BalanceOverviewCard userId={user?._id} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className=" md:col-span-2">

      <WeeklyMonthlyTrendChart userId={user?._id} />
        </div>
        <div className=" md:col-span-1">
       <IncomeExpensePieChart/>
        </div>
      </div>
    </div>
  );
}
