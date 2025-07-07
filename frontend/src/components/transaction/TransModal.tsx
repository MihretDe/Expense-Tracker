import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";

// Add Category type
type Category = {
  _id: string;
  name: string;
};

interface TransModalProps {
  open: boolean;
  loading: boolean;
  form: {
    title: string;
    amount: string | number;
    type: string;
    category: string;
    date: string;
  };
  onChange: (field: string, value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  isEdit?: boolean;
  categories: Category[]; // <-- add categories prop
}

export default function TransModal({
  open,
  loading,
  form,
  onChange,
  onClose,
  onSubmit,
  isEdit = false,
  categories,
}: TransModalProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEdit ? "Edit Transaction" : "Add Transaction"}
      </DialogTitle>
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
          onChange={(e) => onChange("title", e.target.value)}
          fullWidth
        />
        <TextField
          label="Amount"
          type="number"
          value={form.amount}
          onChange={(e) => onChange("amount", e.target.value)}
          fullWidth
        />
        <TextField
          label="Type"
          select
          value={form.type}
          onChange={(e) => onChange("type", e.target.value)}
          fullWidth
        >
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </TextField>
        <TextField
          label="Category"
          select
          value={form.category}
          onChange={(e) => onChange("category", e.target.value)}
          fullWidth
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: {
                  maxHeight: 100, // set max height for dropdown
                  overflowY: "auto",
                },
              },
            },
          }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat._id} value={cat.name}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Date"
          type="date"
          value={form.date}
          onChange={(e) => onChange("date", e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained" disabled={loading}>
          {loading
            ? isEdit
              ? "Saving..."
              : "Adding..."
            : isEdit
            ? "Save"
            : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
