import { ColumnDef } from "@tanstack/react-table";
import { MoveDown, MoveUp, Pencil, Trash2 } from "lucide-react";
import { Transaction } from "../../types/transaction";


interface ColumnOptions {
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (employeeId: string) => void;
}

export function getTransactionsColumns({
  onEdit,
  onDelete,
}: ColumnOptions): ColumnDef<Transaction>[] {
  return [
    {
      header: "",
      accessorKey: "type",
      cell: (info) => (
        <div className="text-center w-auto">
          {String(info.getValue()) == "income" ? (
            <MoveUp className="w-5 h-5 text-green-500" />
          ) : (
            <MoveDown className="w-5 h-5 text-red-500" />
          )}
        </div>
      ),
    },
    {
      header: "Title",
      accessorKey: "title",
      cell: (info) => (
        <div className="text-center">{String(info.getValue())}</div>
      ),
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (info) => (
        <div className="text-center">{String(info.getValue())}</div>
      ),
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (info) => (
        <div className="text-center">{String(info.getValue())}</div>
      ),
    },
    {
      header: "date",
      accessorKey: "date",
      cell: (info) => (
        <div className="text-center">{String(info.getValue())}</div>
      ),
    },

    {
      header: "Actions",
      id: "actions",
      cell: ({
        row,
      }: {
        row: import("@tanstack/react-table").Row<Transaction>;
      }) => {
        const emp = row.original;
        return (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => onEdit?.(emp)}
              className="text-blue-600 hover:text-blue-800"
              title="Edit"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => onDelete?.(emp._id)}
              className="text-red-600 hover:text-red-800"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        );
      },
    },
  ];
}
