"use client";

import { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function CategoryTab() {
  const [categories, setCategories] = useState<string[]>([]);
  const [addCatOpen, setAddCatOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories((prev) => [...prev, trimmed]);
    }
    setNewCategory("");
    setAddCatOpen(false);
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
        {categories.length === 0 && (
          <Typography
            sx={{ p: 2, color: "text.secondary", textAlign: "center" }}
          >
            No categories yet.
          </Typography>
        )}
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
          <Button
            onClick={handleAddCategory}
            variant="contained"
            disabled={!newCategory.trim()}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
