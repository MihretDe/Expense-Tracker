import BudgetPieChart from "../components/dashboard/BudgetPieChart";
import RecentTransactionTable from "../components/dashboard/RecentTransactionTable";
import SummaryCard from "../components/dashboard/SummaryCard";
import WorkingCapitalChart from "../components/dashboard/WorkingCapitalChart";


export default function Dashboard() {
  return (
    <div className="space-y-6 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:w-2/3">
        <SummaryCard
          label="Total balance"
          value="$5240.21"
          icon="wallet"
          active
        />
        <SummaryCard
          label="Total spending"
          value="$250.80"
          icon="credit-card"
        />
        <SummaryCard label="Total saved" value="$550.25" icon="piggy-bank" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4">
        <div className="md:col-span-2">
          <WorkingCapitalChart />
        </div>
        <div className="md:col-span-1">
          <BudgetPieChart />
        </div>
      </div>

      <RecentTransactionTable />
    </div>
  );
}
