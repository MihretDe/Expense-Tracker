import { useMemo, useState, useEffect } from "react";
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
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext";
import TransModal from "./TransModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Category = {
  _id: string;
  name: string;
  // ...other fields if needed
};

export default function TransactionTable() {
  const { user, token } = useAuthContext();
  const [mongoUserId, setMongoUserId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch MongoDB user _id using Auth0 sub
  useEffect(() => {
    const fetchMongoUserId = async () => {
      if (!user?.sub || !token) return;
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const res = await axios.get(`${apiUrl}/users/${user.sub}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMongoUserId(res.data._id);
      } catch (err) {
        setMongoUserId(null);
      }
    };
    fetchMongoUserId();
  }, [user?.sub, token]);

  // Fetch transactions for the user
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!mongoUserId || !token) return;
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        console.log("Fetching transactions for user:", mongoUserId);
        const res = await axios.get(
          `${apiUrl}/transactions?userId=${mongoUserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTransactions(res.data);
        console.log("Fetched transactions:", res.data);
      } catch (err) {
        console.log("Error fetching transactions:", err);
        setTransactions([]);
      }
    };
    fetchTransactions();
  }, [mongoUserId, token]);

  // Fetch categories for modal
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const params = mongoUserId ? { userId: mongoUserId } : {};
        const res = await axios.get(`${apiUrl}/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params,
        });
        setCategories(res.data || []);
      } catch (err) {
        toast.error("Failed to load categories");
        setCategories([]);
      }
    };
    fetchCategories();
  }, [token, mongoUserId]);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Open edit modal and populate form
  const handleEdit = (row: Transaction) => {
    setForm({
      title: row.title,
      amount: row.amount.toString(),
      type: row.type,
      category: row.category,
      date: row.date ? row.date.split("T")[0] : "",
    });
    setEditId(row._id);
    setEditOpen(true);
  };

  // Delete Transaction handler
  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
      await axios.delete(`${apiUrl}/transactions/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDeleteOpen(false);
      setDeleteId(null);
      toast.success("Transaction deleted");
      // Refresh transactions after deleting
      const res = await axios.get(
        `${apiUrl}/transactions?userId=${mongoUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTransactions(res.data);
    } catch (err) {
      toast.error("Failed to delete transaction");
      console.log("Error deleting transaction:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add Transaction dialog state
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "",
    category: "",
    date: "",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Add Transaction handler
  const handleAdd = async () => {
    setLoading(true);
    const apiUrl = process.env.REACT_APP_API_URL;
    if (!apiUrl) {
      toast.error("API URL not set");
      setLoading(false);
      return;
    }
    if (!mongoUserId) {
      toast.error("User not loaded");
      setLoading(false);
      return;
    }
    try {
      await axios.post(
        `${apiUrl}/transactions`,
        {
          ...form,
          amount: Number(form.amount),
          userId: mongoUserId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAddOpen(false);
      setForm({
        title: "",
        amount: "",
        type: "",
        category: "",
        date: "",
      });
      toast.success("Transaction added");
      // Refresh transactions after adding
      const res = await axios.get(
        `${apiUrl}/transactions?userId=${mongoUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTransactions(res.data);
    } catch (err) {
      toast.error("Failed to add transaction");
      console.log("Error adding transaction:", err);
    } finally {
      setLoading(false);
    }
  };

  // Edit Transaction handler
  const handleEditSave = async () => {
    if (!editId) return;
    setLoading(true);
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
      await axios.put(
        `${apiUrl}/transactions/${editId}`,
        {
          ...form,
          amount: Number(form.amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditOpen(false);
      setEditId(null);
      setForm({
        title: "",
        amount: "",
        type: "",
        category: "",
        date: "",
      });
      toast.success("Transaction updated");
      // Refresh transactions after editing
      const res = await axios.get(
        `${apiUrl}/transactions?userId=${mongoUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTransactions(res.data);
    } catch (err) {
      toast.error("Failed to update transaction");
      console.log("Error editing transaction:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filtered data
  const filteredData = transactions.filter((row) => {
    return (
      (!categoryFilter || row.category === categoryFilter) &&
      (!typeFilter || row.type === typeFilter) &&
      (!dateFilter || (row.date && row.date.startsWith(dateFilter)))
    );
  });

  const columns = useMemo(
    () =>
      getTransactionsColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        withTooltip: true, // pass a flag for tooltip support
      }),
    [transactions]
  );

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
          onClick={() => {
            setForm({
              title: "",
              amount: "",
              type: "",
              category: "",
              date: "",
            });
            setAddOpen(true);
          }}
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
            {Array.from(new Set(transactions.map((d) => d.category))).map(
              (cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              )
            )}
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
            placeholder="e.g. 2024-07-04"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </Box>
      </Box>
      {filteredData.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
          No transactions found.
        </Typography>
      ) : (
        <Table data={filteredData} columns={columns} />
      )}

      <TransModal
        open={addOpen}
        loading={loading}
        form={form}
        onChange={(field, value) => setForm((f) => ({ ...f, [field]: value }))}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        isEdit={false}
        categories={categories} // <-- pass categories
      />
      <TransModal
        open={editOpen}
        loading={loading}
        form={form}
        onChange={(field, value) => setForm((f) => ({ ...f, [field]: value }))}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditSave}
        isEdit={true}
        categories={categories} // <-- pass categories
      />
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Transaction</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this transaction?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
