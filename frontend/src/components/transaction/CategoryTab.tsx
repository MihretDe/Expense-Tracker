"use client";

import { useState, useEffect } from "react";
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
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import {
  fetchCategories,
  createCategory,
} from "../../features/category/categorySlice";
type Category = {
  _id: string;
  name: string;
  userId?: string;
  type?: string;
  isDefault?: boolean;
  __v?: number;
};

export default function CategoryTab() {
  const { user, token } = useAuthContext();
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.items);
  const loading = useAppSelector((state) => state.categories.loading);
  const [addCatOpen, setAddCatOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [mongoUserId, setMongoUserId] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  // Fetch categories from Redux store
  useEffect(() => {
    if (token && mongoUserId) {
      dispatch(fetchCategories({ token, userId: mongoUserId }));
    }
  }, [token, mongoUserId, dispatch]);

  // Add category handler
  const handleAddCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed || categories.some((cat) => cat.name === trimmed)) return;
    try {
      await dispatch(
        createCategory({
          token: token!,
          data: {
            name: trimmed,
            userId: mongoUserId ?? undefined, // ensure no null, only string or undefined
          },
        })
      ).unwrap();
      toast.success("Category added");
    } catch (err) {
      toast.error("Failed to add category");
    } finally {
      setNewCategory("");
      setAddCatOpen(false);
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
        direction={isMobile ? "column" : "row"}
        justifyContent="space-between"
        alignItems={isMobile ? "stretch" : "center"}
        mb={3}
        spacing={isMobile ? 2 : 0}
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
          <Box key={cat._id || cat.name}>
            <ListItem
              sx={{
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <ListItemText primary={cat.name} />
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
          <Button onClick={() => setAddCatOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleAddCategory}
            variant="contained"
            disabled={!newCategory.trim() || loading}
          >
            {loading ? "Adding..." : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
