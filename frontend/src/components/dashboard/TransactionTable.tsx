import { useMemo } from "react";
import Table from "../Table";
import { getTransactionsColumns } from "./TransactionColumns";
import { Transaction } from "../../types/transaction";

interface TransactionTableProps {
  data: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function TransactionTable({
  data,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  const columns = useMemo(
    () =>
      getTransactionsColumns({
        onEdit,
        onDelete,
        withTooltip: true,
      }),
    [data]
  );

  return <Table data={data} columns={columns} />;
}
