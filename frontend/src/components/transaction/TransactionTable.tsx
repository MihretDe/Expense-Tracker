import { useMemo, useState } from "react";
import { getTransactionsColumns } from "../dashboard/TransactionColumns";
import Table from "../Table";
import { Transaction } from "../../types/transaction";
import { Box, Typography, Button, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

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
    amount: 244.2,
    category: "Design Tools",
    date: "02 Apr 2022",
  },
];

interface TransactionTableProps {
  onAddTransaction?: () => void;
}

export default function TransactionTable({
  onAddTransaction,
}: TransactionTableProps) {
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const columns = useMemo(
    () =>
      getTransactionsColumns({
        onEdit: () => {},
        onDelete: () => {},
      }),
    []
  );

  // Filtered data
  const filteredData = data.filter((row) => {
    return (
      (!categoryFilter || row.category === categoryFilter) &&
      (!typeFilter || row.type === typeFilter) &&
      (!dateFilter || row.date.startsWith(dateFilter))
    );
  });

  // Unique categories for filter dropdown
  const categories = Array.from(new Set(data.map((d) => d.category)));

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight="bold">
          Transactions
        </Typography>
        {onAddTransaction && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onAddTransaction}
          >
            Add Transaction
          </Button>
        )}
      </Stack>
      <Box className="flex gap-4 mb-4">
        <Box>
          <label className="block text-sm mb-1" style={{ color: "black" }}>
            Category
          </label>
          <select
            className="border rounded px-2 py-1"
            style={{ color: "black" }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </Box>
        <Box>
          <label className="block text-sm mb-1" style={{ color: "black" }}>
            Type
          </label>
          <select
            className="border rounded px-2 py-1"
            style={{ color: "black" }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </Box>
        <Box>
          <label className="block text-sm mb-1" style={{ color: "black" }}>
            Date
          </label>
          <input
            type="text"
            className="border rounded px-2 py-1"
            style={{ color: "black" }}
            placeholder="e.g. 14 Apr 2022"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </Box>
      </Box>
      <Table data={filteredData} columns={columns} />
    </Box>
  );
}
