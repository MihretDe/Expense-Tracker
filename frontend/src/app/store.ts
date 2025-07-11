import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import transactionReducer from "../features/transaction/transactionSlice";
import categoryReducer from "../features/category/categorySlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    transactions: transactionReducer,
    categories: categoryReducer,
  },
});

// Infer types for usage in app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
