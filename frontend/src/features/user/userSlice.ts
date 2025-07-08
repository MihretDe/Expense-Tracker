import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface User {
  _id?: string; // Optional for new users
  auth0Id: string;
  name: string;
  email: string;
  picture?: string;
  mobilePhone?: string;
  date?: string;
}

export interface BalanceData {
  income: number;
  expenses: number;
  totalBalance: number;
}

interface UserState {
  user: User | null;
  userLoading: boolean;
  balanceLoading: boolean;
  error: string | null;
  balance: BalanceData;
}


const initialState: UserState = {
  user: null,
  userLoading: false,
  balanceLoading: false,
  error: null,
  balance: {
    income: 0,
    expenses: 0,
    totalBalance: 0,
  },
};



// Create or fetch existing user from backend
export const createOrGetUser = createAsyncThunk(
    "user/createOrGetUser",
    async ({ token, userPayload }: { token: string; userPayload: User }, thunkAPI) => {
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/users`, userPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
      } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || "Create/Get user failed");
      }
    }
  );
  
  // Update user profile
  export const updateUserProfile = createAsyncThunk(
    "user/updateProfile",
    async (
      {
        token,
        userId,
        data,
      }: { token: string; userId: string; data: Partial<User> },
      thunkAPI
    ) => {
      try {
        const res = await axios.patch(
          `${process.env.REACT_APP_API_URL}/users/${userId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return res.data;
      } catch (error: any) {
        return thunkAPI.rejectWithValue("Failed to update user profile");
      }
    }
  );
  
  
  // Get user by Auth0 ID
  export const fetchUser = createAsyncThunk(
    "user/fetchUser",
    async ({ token, auth0Id }: { token: string; auth0Id: string }, thunkAPI) => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/${auth0Id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
      } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || "Fetch user failed");
      }
    }
  );

  export const fetchUserBalance = createAsyncThunk(
    "user/fetchBalance",
    async ({ token, userId }: { token: string; userId: string }, thunkAPI) => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/${userId}/balance`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return res.data; // { income, expenses, totalBalance }
      } catch (err: any) {
        return thunkAPI.rejectWithValue("Failed to fetch balance");
      }
    }
  );
  

  const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      clearUser: (state) => {
        state.user = null;
        state.error = null;
        state.userLoading = false;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(createOrGetUser.pending, (state) => {
          state.userLoading = true;
          state.error = null;
        })
        .addCase(
          createOrGetUser.fulfilled,
          (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.userLoading = false;
          }
        )
        .addCase(createOrGetUser.rejected, (state, action) => {
          state.userLoading = false;
          state.error = action.payload as string;
        })

        .addCase(updateUserProfile.pending, (state) => {
          state.userLoading = true;
          state.error = null;
        })
        .addCase(
          updateUserProfile.fulfilled,
          (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.userLoading = false;
          }
        )
        .addCase(updateUserProfile.rejected, (state, action) => {
          state.userLoading = false;
          state.error = action.payload as string;
        })
        .addCase(fetchUser.pending, (state) => {
          if (!state.user) {
            state.userLoading = true;
          }
        })
        .addCase(fetchUser.fulfilled, (state, action) => {
          state.user = action.payload;
          state.userLoading = false;
        })
        .addCase(fetchUser.rejected, (state, action) => {
          state.userLoading = false;
          state.error = action.payload as string;
        });
builder
.addCase(fetchUserBalance.pending, (state) => {
  state.balanceLoading = true;
})
.addCase(fetchUserBalance.fulfilled, (state, action) => {
  state.balance = action.payload;
  state.balanceLoading = false;
})
.addCase(fetchUserBalance.rejected, (state, action) => {
  state.balanceLoading = false;
  state.error = action.payload as string;
});
    },
  });
  
  export const { clearUser } = userSlice.actions;
  export default userSlice.reducer;

  
