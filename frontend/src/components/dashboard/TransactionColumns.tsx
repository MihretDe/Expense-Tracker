import { ColumnDef } from "@tanstack/react-table";
import { MoveDown, MoveUp } from "lucide-react";
import { Transaction } from "../../types/transaction";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip, IconButton } from "@mui/material";

interface ColumnOptions {
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (employeeId: string) => void;
  withTooltip?: boolean;
}

export function getTransactionsColumns({
  onEdit,
  onDelete,
  withTooltip = false,
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
            {withTooltip ? (
              <>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={() => onEdit?.(emp)}
                    sx={{ color: "black" }}
                  >
                    <EditIcon fontSize="medium" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={() => onDelete?.(emp._id)}
                    sx={{ color: "black" }}
                  >
                    <DeleteIcon fontSize="medium" />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <IconButton
                  size="small"
                  onClick={() => onEdit?.(emp)}
                  sx={{ color: "black" }}
                >
                  <EditIcon fontSize="medium" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onDelete?.(emp._id)}
                  sx={{ color: "black" }}
                >
                  <DeleteIcon fontSize="medium" />
                </IconButton>
              </>
            )}
          </div>
        );
      },
    },
  ];
}
