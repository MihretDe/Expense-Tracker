import { Router } from "express";
import { createTransaction, getTransactions, updateTransaction, deleteTransaction, getTransactionsByFillter, getRecentTransactions, } from "../controllers/transaction.controller.js";
const router = Router();
router.post("/", createTransaction);
router.get("/", getTransactions);
router.get("/filter", getTransactionsByFillter);
router.get("/recent", getRecentTransactions);
router.put("/:id", updateTransaction);
router.patch("/:id", updateTransaction); // <-- add this line
router.delete("/:id", deleteTransaction);
export default router;
