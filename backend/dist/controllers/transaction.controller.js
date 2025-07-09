var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";
export const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, amount, type, category, userId, date } = req.body;
        const transaction = new Transaction({
            title,
            amount,
            type,
            category,
            userId: new mongoose.Types.ObjectId(userId), // ensure ObjectId
            date: date ? new Date(date) : undefined, // <-- use provided date if present
        });
        yield transaction.save();
        res.status(201).json(transaction);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export const getTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        console.log("userId from query:", userId);
        const filter = {};
        if (userId) {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                res.status(400).json({ message: "Invalid userId format" });
            }
            filter.userId = new mongoose.Types.ObjectId(userId);
        }
        const transactions = yield Transaction.find(filter).sort({ date: -1 });
        res.status(200).json(transactions);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export const getTransactionsByFillter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, period, from, to } = req.query;
        const filter = {};
        // Validate userId
        if (userId) {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                res.status(400).json({ message: "Invalid userId format" });
                return;
            }
            filter.userId = new mongoose.Types.ObjectId(userId);
        }
        // Apply time-based filters
        const now = new Date();
        let startDate = null;
        let endDate = null;
        if (period === "weekly") {
            endDate = now;
            startDate = new Date();
            startDate.setDate(now.getDate() - 7);
        }
        else if (period === "monthly") {
            endDate = now;
            startDate = new Date();
            startDate.setMonth(now.getMonth() - 1);
        }
        else if (from && to) {
            startDate = new Date(from);
            endDate = new Date(to);
        }
        if (startDate && endDate) {
            filter.date = {
                $gte: startDate,
                $lte: endDate,
            };
        }
        const transactions = yield Transaction.find(filter).sort({ date: -1 });
        res.status(200).json(transactions);
        return;
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export const getRecentTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, limit = 5 } = req.query;
        // Validate userId
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: "Invalid or missing userId" });
            return;
        }
        const transactions = yield Transaction.find({
            userId: new mongoose.Types.ObjectId(userId),
        })
            .sort({ date: -1 }) // most recent first
            .limit(Number(limit));
        res.status(200).json(transactions);
        return;
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export const updateTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // Prevent userId from being changed
        if ("userId" in updateData) {
            delete updateData.userId;
        }
        const transaction = yield Transaction.findByIdAndUpdate(id, updateData, {
            new: true,
        });
        if (!transaction) {
            res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json(transaction);
    }
    catch (error) {
        console.error("Error updating transaction:", error);
        res.status(500).json({ error: error.message });
    }
});
export const deleteTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // <-- get transaction id from URL
        const deleted = yield Transaction.findByIdAndDelete(id);
        if (!deleted) {
            res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json({ message: "Transaction deleted" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
