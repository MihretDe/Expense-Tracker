import { useMemo, useState } from "react";
import { getTransactionsColumns } from "../dashboard/TransactionColumns";
import Table from "../Table";
import { Transaction } from "../../types/transaction";
import {
  Box,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

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

  // Add Transaction dialog state
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "",
    category: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);

  // Add Transaction handler
  const handleAdd = async () => {
    setLoading(true);
    try {
      // Adjust API URL as needed
      await axios.post(`${process.env.REACT_APP_API_URL}/transactions`, {
        ...form,
        amount: Number(form.amount),
      });
      setAddOpen(false);
      setForm({
        title: "",
        amount: "",
        type: "",
        category: "",
        date: "",
      });
      // Optionally: refresh table data here
    } catch (err) {
      // Handle error (show toast, etc.)
    } finally {
      setLoading(false);
    }
  };

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
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setAddOpen(true)}
        >
          Add Transaction
        </Button>
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

      <Dialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Transaction</DialogTitle>
        <DialogContent
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            label="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Amount"
            type="number"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Type"
            select
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            fullWidth
          >
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </TextField>
          <TextField
            label="Category"
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
            fullWidth
          />
          <TextField
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained" disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
