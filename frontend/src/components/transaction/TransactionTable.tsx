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
import { useAuthContext } from "../../context/AuthContext";
import TransModal from "./TransModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../../features/transaction/transactionSlice";
import { fetchCategories } from "../../features/category/categorySlice";
import { format } from "date-fns";

type Category = {
  _id: string;
  name: string;
};

export default function TransactionTable() {
  const { user, token } = useAuthContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useAppDispatch();

  // Redux state
  const transactions = useAppSelector((state) => state.transactions.items);
  const loading = useAppSelector((state) => state.transactions.loading);
  const categories = useAppSelector((state) => state.categories.items);

  const [mongoUserId, setMongoUserId] = useState<string | null>(null);

  // Fetch MongoDB user _id using Auth0 sub
  useEffect(() => {
    const fetchMongoUserId = async () => {
      if (!user?.sub || !token) return;
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const res = await fetch(`${apiUrl}/users/${user.sub}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setMongoUserId(data._id);
      } catch {
        setMongoUserId(null);
      }
    };
    fetchMongoUserId();
  }, [user?.sub, token]);

  // Fetch transactions and categories from Redux
  useEffect(() => {
    if (mongoUserId && token) {
      dispatch(fetchTransactions({ token, userId: mongoUserId }));
      dispatch(fetchCategories({ token, userId: mongoUserId }));
    }
  }, [mongoUserId, token, dispatch]);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Open edit modal and populate form
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

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId || !token) return;
    try {
      await dispatch(deleteTransaction({ token, id: deleteId })).unwrap();
      setDeleteOpen(false);
      setDeleteId(null);
      toast.success("Transaction deleted");
    } catch {
      toast.error("Failed to delete transaction");
    }
  };

  // Add Transaction handler
  const handleAdd = async () => {
    if (!mongoUserId || !token) {
      toast.error("User not loaded");
      return;
    }
    try {
      await dispatch(
        createTransaction({
          token,
          data: {
            ...form,
            amount: Number(form.amount),
            userId: mongoUserId, // always a string, not undefined
            type: form.type === "income" ? "income" : "expense",
            title: form.title,
            category: form.category,
            date: form.date,
          }, // Omit<Transaction, "_id">
        })
      ).unwrap();
      setAddOpen(false);
      setForm({
        title: "",
        amount: "",
        type: "",
        category: "",
        date: "",
      });
      toast.success("Transaction added");
    } catch {
      toast.error("Failed to add transaction");
    }
  };

  // Edit Transaction handler
  const handleEditSave = async () => {
    if (!editId || !token) return;
    try {
      await dispatch(
        updateTransaction({
          token,
          id: editId,
          data: {
            ...form,
            amount: Number(form.amount),
            type: form.type === "income" ? "income" : "expense",
            title: form.title,
            category: form.category,
            date: form.date,
          }, // Partial<Transaction>
        })
      ).unwrap();
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
    } catch {
      toast.error("Failed to update transaction");
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
        withTooltip: true,
      }).map((col: any) =>
        (col.accessorKey || col.id || col.field) === "date"
          ? {
              ...col,
              cell: (info: any) => {
                const dateStr =
                  info.getValue?.() ?? info.value ?? info.row?.original?.date;
                if (!dateStr) return "";
                const date = new Date(dateStr);
                if (isNaN(date.getTime())) return "";
                return (
                  <span
                    className="text-black dark:text-gray-100"
                    style={{ fontSize: 16 }}
                  >
                    {format(date, "yyyy-MM-dd")}
                  </span>
                );
              },
            }
          : col
      ),
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
        direction={isMobile ? "column" : "row"}
        justifyContent="space-between"
        alignItems={isMobile ? "stretch" : "center"}
        mb={3}
        spacing={isMobile ? 2 : 0}
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
          sx={isMobile ? { width: "100%" } : {}}
        >
          Add Transaction
        </Button>
      </Stack>
      <Box
        className="gap-4 mb-4"
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 2,
        }}
      >
        <Box>
          <label className="block text-sm mb-1 text-black dark:text-gray-100">
            Category
          </label>
          <select
            className="border rounded px-2 py-1 bg-white dark:bg-gray-900 text-black dark:text-gray-100 border-gray-300 dark:border-gray-700"
            style={{ width: isMobile ? "100%" : undefined }}
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
          <label className="block text-sm mb-1 text-black dark:text-gray-100">
            Type
          </label>
          <select
            className="border rounded px-2 py-1 bg-white dark:bg-gray-900 text-black dark:text-gray-100 border-gray-300 dark:border-gray-700"
            style={{ width: isMobile ? "100%" : undefined }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </Box>
        <Box>
          <label className="block text-sm mb-1 text-black dark:text-gray-100">
            Date
          </label>
          <input
            type="text"
            className="border rounded px-2 py-1 bg-white dark:bg-gray-900 text-black dark:text-gray-100 border-gray-300 dark:border-gray-700"
            style={{ width: isMobile ? "100%" : undefined }}
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
        categories={categories}
      />
      <TransModal
        open={editOpen}
        loading={loading}
        form={form}
        onChange={(field, value) => setForm((f) => ({ ...f, [field]: value }))}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditSave}
        isEdit={true}
        categories={categories}
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
