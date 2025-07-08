import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Transaction } from "../../types/transaction";
import { useAuthContext } from "../../context/AuthContext";
import { Category } from "../../types/category";
import TransactionTable from "./TransactionTable";
import EditTransactionModal from "./EditTransactionModal";
import DeleteTransactionDialog from "./DeleteTransactionDialog";

export default function RecentTransactionTable({
  userId,
}: {
  userId?: string;
}) {
  const { token } = useAuthContext();
  const [data, setData] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "",
    category: "",
    date: "",
  });

  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${apiUrl}/transactions/recent`, {
        params: { userId, limit: 5 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      toast.error("Failed to load transactions");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${apiUrl}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
        params: userId ? { userId } : {},
      });
      setCategories(res.data || []);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchTransactions();
      fetchCategories();
    }
  }, [token, userId]);

  const handleEdit = (tx: Transaction) => {
    setForm({
      title: tx.title,
      amount: tx.amount.toString(),
      type: tx.type,
      category: tx.category,
      date: tx.date?.split("T")[0] || "",
    });
    setEditId(tx._id);
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!editId) return;
    setLoading(true);
    try {
      await axios.put(
        `${apiUrl}/transactions/${editId}`,
        {
          ...form,
          amount: Number(form.amount),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Transaction updated");
      setEditOpen(false);
      setEditId(null);
      await fetchTransactions();
    } catch {
      toast.error("Failed to update transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await axios.delete(`${apiUrl}/transactions/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Transaction deleted");
      setDeleteOpen(false);
      setDeleteId(null);
      await fetchTransactions();
    } catch {
      toast.error("Failed to delete transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <TransactionTable
          data={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <EditTransactionModal
        open={editOpen}
        loading={loading}
        form={form}
        categories={categories}
        onChange={(field, value) => setForm((f) => ({ ...f, [field]: value }))}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditSave}
      />

      <DeleteTransactionDialog
        open={deleteOpen}
        loading={loading}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
