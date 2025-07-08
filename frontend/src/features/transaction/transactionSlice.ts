import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


export interface Transaction {
  _id: string;
  userId: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

interface TransactionState {
  items: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  items: [],
  loading: false,
  error: null,
};

export const createTransaction = createAsyncThunk(
  "transactions/create",
  async (
    { token, data }: { token: string; data: Omit<Transaction, "_id"> },
    thunkAPI
  ) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/transactions`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Create failed"
      );
    }
  }
);
  
export const fetchTransactions = createAsyncThunk(
  "transactions/fetch",
  async (
    {
      token,
      userId,
      filters,
    }: { token: string; userId: string; filters?: any },
    thunkAPI
  ) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/transactions`,
        {
          params: { userId, ...filters },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Fetch failed"
      );
    }
  }
);
  

export const updateTransaction = createAsyncThunk(
  "transactions/update",
  async (
    {
      token,
      id,
      data,
    }: { token: string; id: string; data: Partial<Transaction> },
    thunkAPI
  ) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/transactions/${id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Update failed"
      );
    }
  }
);
  

export const deleteTransaction = createAsyncThunk(
  "transactions/delete",
  async ({ token, id }: { token: string; id: string }, thunkAPI) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/transactions/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Delete failed"
      );
    }
  }
);
  
const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    clearTransactions(state) {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchTransactions.fulfilled,
        (state, action: PayloadAction<Transaction[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(
        createTransaction.fulfilled,
        (state, action: PayloadAction<Transaction>) => {
          state.items.unshift(action.payload);
        }
      )

      .addCase(
        updateTransaction.fulfilled,
        (state, action: PayloadAction<Transaction>) => {
          const idx = state.items.findIndex(
            (t) => t._id === action.payload._id
          );
          if (idx !== -1) state.items[idx] = action.payload;
        }
      )

      .addCase(
        deleteTransaction.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.items = state.items.filter((t) => t._id !== action.payload);
        }
      );
  },
});
  

export const { clearTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;
