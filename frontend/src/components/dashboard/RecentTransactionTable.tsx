import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Transaction } from "../../types/transaction";
import { useAuthContext } from "../../context/AuthContext";
import { Category } from "../../types/category";
import TransactionTable from "./TransactionTable";
import EditTransactionModal from "./EditTransactionModal";
import DeleteTransactionDialog from "./DeleteTransactionDialog";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { deleteTransaction, fetchTransactions, updateTransaction } from "../../features/transaction/transactionSlice";

export default function RecentTransactionTable({
  userId,
}: {
  userId?: string;
}) {
  const { token } = useAuthContext();
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.transactions.items);
 

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
    category: "income",
    date: "",
  });

  const apiUrl = process.env.REACT_APP_API_URL;

  

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
      dispatch(fetchTransactions({ token, userId, filters: { limit: 5 } }));
      fetchCategories();
    }
  }, [token, userId, dispatch]);
  

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
    if (!editId || !token) return;

    setLoading(true);
    try {
      await dispatch(
        updateTransaction({
          token,
          id: editId,
          data: {
            ...form,
            amount: Number(form.amount),
            type: form.type as "income" | "expense",
          },
        })
      ).unwrap();

      toast.success("Transaction updated");
      setEditOpen(false);
      setEditId(null);

      // Refresh list after update
      dispatch(
        fetchTransactions({ token, userId: userId!, filters: { limit: 5 } })
      );
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
    if (!deleteId || !token) return;

    setLoading(true);
    try {
      await dispatch(deleteTransaction({ token, id: deleteId })).unwrap();

      toast.success("Transaction deleted");
      setDeleteOpen(false);
      setDeleteId(null);

      // Refresh list after delete
      dispatch(
        fetchTransactions({ token, userId: userId!, filters: { limit: 5 } })
      );
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
