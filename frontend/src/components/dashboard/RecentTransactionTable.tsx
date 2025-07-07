import { useMemo, useEffect, useState } from "react";
import { getTransactionsColumns } from "./TransactionColumns";
import Table from "../Table";
import { Transaction } from "../../types/transaction";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext";
import TransModal from "../transaction/TransModal";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { toast } from "react-toastify";

export default function RecentTransactionTable({
  userId,
}: {
  userId?: string;
}) {
  const { token } = useAuthContext();
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
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
      const res = await axios.get(`${apiUrl}/transactions?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data);
    } catch (err) {
      toast.error("Failed to delete transaction");
      console.log("Error deleting transaction:", err);
    } finally {
      setLoading(false);
    }
  };
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
      const res = await axios.get(`${apiUrl}/transactions?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data);
    } catch (err) {
      toast.error("Failed to update transaction");
      console.log("Error editing transaction:", err);
    } finally {
      setLoading(false);
    }
  };
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

  const columns = useMemo(
    () =>
      getTransactionsColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        withTooltip: true, // pass a flag for tooltip support
      }),
    [data]
  );

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      if (!token || !userId) return;

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/transactions/recent`,
          {
            params: {
              userId,
              limit: 5,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Recent Transactions:", res.data);
        setData(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch recent transactions", error);
      }
    };

    fetchRecentTransactions();
  }, [token, userId]);

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <Table data={data} columns={columns} />
      </div>
      <TransModal
        open={editOpen}
        loading={loading}
        form={form}
        onChange={(field, value) => setForm((f) => ({ ...f, [field]: value }))}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditSave}
        isEdit={true}
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
    </>
  );
}
