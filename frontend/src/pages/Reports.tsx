import BalanceOverviewCard from "../components/reports/BalanceOverviewCard";
import CategoryBarChart from "../components/reports/CategoryBarChart";
import IncomeExpensePieChart from "../components/reports/IncomeExpensePieChart";
import WeeklyMonthlyTrendChart from "../components/reports/WeeklyMonthlyTrendChart";


export default function Reports() {
  return (
    <div className="space-y-6">
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <CategoryBarChart />
        </div>
        <div className="md:col-span-1 hidden md:block">
         <BalanceOverviewCard />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className=" md:col-span-2">

      <WeeklyMonthlyTrendChart />
        </div>
        <div className=" md:col-span-1">
       <IncomeExpensePieChart />
        </div>
      </div>
    </div>
  );
}
