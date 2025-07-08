import { useEffect } from "react";
import BudgetPieChart from "../components/dashboard/BudgetPieChart";
import RecentTransactionTable from "../components/dashboard/RecentTransactionTable";
import SummaryCard from "../components/dashboard/SummaryCard";
import WorkingCapitalChart from "../components/dashboard/WorkingCapitalChart";

import { useAuthContext } from "../context/AuthContext";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { fetchUser, fetchUserBalance } from "../features/user/userSlice";
import { CircularProgress } from "@mui/material";

export default function Dashboard() {
  const { user: auth0User, token } = useAuthContext();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const userLoading = useAppSelector((state) => state.user.userLoading);
  const { income, expenses, totalBalance } = useAppSelector(
    (state) => state.user.balance
  );

  useEffect(() => {
    if (auth0User?.sub && token) {
      dispatch(fetchUser({ token, auth0Id: auth0User.sub }));
    }
  }, [auth0User, token, dispatch]);

  useEffect(() => {
    if (user && token && typeof user._id === "string") {
      dispatch(fetchUserBalance({ token, userId: user._id }));
    }
  }, [user, token, dispatch]);

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
          <WorkingCapitalChart userId={user._id} />
        </div>
        <div className="md:col-span-1">
          <BudgetPieChart userId={user._id} />
        </div>
      </div>

      <RecentTransactionTable userId={user._id} />
    </div>
  );
}
