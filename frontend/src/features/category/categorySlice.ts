import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Category, CategorySummary } from "../../types/category";


interface CategoryState {
  items: Category[];
  summary: CategorySummary[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  items: [],
  summary: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async ({ token, userId }: { token: string; userId?: string }, thunkAPI) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/categories`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: userId ? { userId } : {},
        }
      );
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Failed to fetch categories");
    }
  }
);
  
export const createCategory = createAsyncThunk(
  "categories/create",
  async (
    { token, data }: { token: string; data: Partial<Category> },
    thunkAPI
  ) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/categories`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Failed to create category");
    }
  }
);
  

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async ({ token, id }: { token: string; id: string }, thunkAPI) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Failed to delete category");
    }
  }
);
  
export const fetchCategorySummary = createAsyncThunk(
  "categories/fetchSummary",
  async (
    {
      token,
      userId,
      period = "monthly",
    }: { token: string; userId: string; period?: string },
    thunkAPI
  ) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/categories/summary`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId, period },
        }
      );
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Failed to fetch category summary");
    }
  }
);
  

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearCategories(state) {
      state.items = [];
      state.summary = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(
        createCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.items.push(action.payload);
        }
      )

      .addCase(
        deleteCategory.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.items = state.items.filter((cat) => cat._id !== action.payload);
        }
      )

      .addCase(
        fetchCategorySummary.fulfilled,
        (state, action: PayloadAction<CategorySummary[]>) => {
          state.summary = action.payload;
        }
      );
  },
});
  
export const { clearCategories } = categorySlice.actions;
export default categorySlice.reducer;
