import { useMemo } from "react";
import { getTransactionsColumns } from "./TransactionColumns";
import Table from "../Table";
import { Transaction } from "../../types/transaction";

const data: Transaction[] = [
  {
    _id: "1",
    title: "Iphone 13 Pro MAX",
    type: "income",
    amount: 420,
    category: "Electronics",
    date: "14 Apr 2022",
    
  },
  {
    _id: "2",
    title: "Netflix Subscription",
    type: "expense",
    amount: 100,
    category: "Streaming",
    date: "05 Apr 2022",
  },
  {
    _id: "3",
    title: "Figma Subscription",
    type: "expense",
    amount: 244.20,
    category: "Design Tools",
    date: "02 Apr 2022",
  },
];


export default function RecentTransactionTable() {
  const columns = useMemo(
    () =>
      getTransactionsColumns({
        onEdit: () => {},
        onDelete: () => {},
      }),
    []
  );

  

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
     <Table data={data} columns={columns} />
    </div>
  );
}
