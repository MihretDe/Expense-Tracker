import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Stack,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Input,
  Typography,
  Divider,
} from "@mui/material";
import { format } from "date-fns";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";

export interface Transaction {
  id: string;
  userId: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

// Dummy Data
const initialRows: Transaction[] = [
  {
    id: "1",
    userId: "abc123",
    title: "Coffee",
    amount: 5.5,
    type: "expense",
    category: "Food",
    date: "2024-07-04T10:30:00.000Z",
  },
  {
    id: "2",
    userId: "abc123",
    title: "Salary",
    amount: 1200,
    type: "income",
    category: "Job",
    date: "2024-07-02T08:00:00.000Z",
  },
];

export default function TransactionTable() {
  const [rows, setRows] = React.useState<Transaction[]>(initialRows);

  // Filters
  const [categoryFilter, setCategoryFilter] = React.useState<string>("");
  const [typeFilter, setTypeFilter] = React.useState<string>("");
  const [dateFilter, setDateFilter] = React.useState<string>("");

  const handleDelete = (id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handleEdit = (id: string) => {
    console.log("Edit transaction:", id);
  };

  const handleAddTransaction = () => {
    console.log("Add Transaction clicked");
  };

  const filteredRows = rows.filter((row) => {
    return (
      (!categoryFilter || row.category === categoryFilter) &&
      (!typeFilter || row.type === typeFilter) &&
      (!dateFilter || row.date.startsWith(dateFilter))
    );
  });

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      width: 200,
      renderCell: (params) => (
        <span style={{ fontSize: 16, color: "black" }}>{params.value}</span>
      ),
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      renderCell: (params) => (
        <span style={{ fontSize: 16, color: "black" }}>{params.value}</span>
      ),
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 130,
      renderCell: (params) => (
        <span
          style={{
            color: params.row.type === "expense" ? "red" : "green",
            fontSize: 16,
          }}
        >
          {params.row.type === "expense" ? "-" : ""}$
          {params.row.amount.toFixed(2)}
        </span>
      ),
    },
    {
      field: "type",
      headerName: "Type",
      width: 120,
      renderCell: (params) => (
        <span style={{ fontSize: 16, color: "black" }}>{params.value}</span>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      width: 180,
      valueFormatter: (params: { value: any }) => {
        const dateStr = params.value;
        if (!dateStr) return ""; // handle null/undefined

        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return ""; // handle invalid dates

        return format(date, "dd MMM yyyy HH:mm");
      },
      renderCell: (params) => (
        <span style={{ fontSize: 16, color: "black" }}>{params.value}</span>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit">
            <Button
              onClick={() => handleEdit(params.row.id)}
              size="small"
              sx={{ minWidth: 0, color: "black" }}
            >
              <EditIcon fontSize="medium" />
            </Button>
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              onClick={() => handleDelete(params.row.id)}
              size="small"
              sx={{ minWidth: 0, color: "black" }}
            >
              <DeleteIcon fontSize="medium" />
            </Button>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  // Tab state
  const [tab, setTab] = React.useState(0);

  // Category management
  const [categories, setCategories] = React.useState<string[]>(["Food", "Job"]);
  const [addCatOpen, setAddCatOpen] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState("");

  // Add Category handlers
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories((prev) => [...prev, newCategory.trim()]);
    }
    setNewCategory("");
    setAddCatOpen(false);
  };

  return (
    <Box sx={{ width: "100%", height: 600 }}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Transactions" />
        <Tab label="Categories" />
      </Tabs>

      {tab === 0 && (
        <Box
          sx={{
            p: 3,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>
              Transactions
            </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Box>
              <TextField
                label="Filter by Category"
                select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                size="small"
                sx={{ mr: 2, width: 180 }}
              >
                <MenuItem value="">All</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Filter by Type"
                select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                size="small"
                sx={{ mr: 2, width: 150 }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </TextField>

              <TextField
                label="Filter by Date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                size="small"
                sx={{ width: 220 }}
                placeholder="e.g. 2024-07-04"
              />
            </Box>

            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddTransaction}
            >
              Add Transaction
            </Button>
          </Stack>

          <DataGrid
            rows={filteredRows}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 20]}
            slots={{
              toolbar: GridToolbar,
            }}
            sx={{
              "& .MuiDataGrid-cell": {
                fontSize: 16,
                color: "black",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontSize: 16,
                color: "black",
              },
            }}
          />
        </Box>
      )}

      {tab === 1 && (
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
              Categories
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddCatOpen(true)}
            >
              Add Category
            </Button>
          </Stack>

          <List sx={{ bgcolor: "background.default", borderRadius: 1 }}>
            {categories.map((cat, index) => (
              <Box key={cat}>
                <ListItem
                  sx={{
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <ListItemText primary={cat} />
                </ListItem>
                {index < categories.length - 1 && <Divider />}
              </Box>
            ))}
          </List>

          <Dialog
            open={addCatOpen}
            onClose={() => setAddCatOpen(false)}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle
              sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}
            >
              Add New Category
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <TextField
                autoFocus
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name"
                fullWidth
                variant="outlined"
              />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setAddCatOpen(false)}>Cancel</Button>
              <Button onClick={handleAddCategory} variant="contained">
                Add
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </Box>
  );
}
