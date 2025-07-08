import { Request, Response } from "express";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";

export const createTransaction = async (req: Request, res: Response) => {
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

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    console.log("userId from query:", userId);

    const filter: any = {};

    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId as string)) {
        res.status(400).json({ message: "Invalid userId format" });
      }

      filter.userId = new mongoose.Types.ObjectId(userId as string);
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getTransactionsByFillter = async (req: Request, res: Response) => {
  try {
    const { userId, period, from, to } = req.query;

    const filter: any = {};

    // Validate userId
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId as string)) {
         res.status(400).json({ message: "Invalid userId format" });
         return;
      }
      filter.userId = new mongoose.Types.ObjectId(userId as string);
    }

    // Apply time-based filters
    const now = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    if (period === "weekly") {
      endDate = now;
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
    } else if (period === "monthly") {
      endDate = now;
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 1);
    } else if (from && to) {
      startDate = new Date(from as string);
      endDate = new Date(to as string);
    }

    if (startDate && endDate) {
      filter.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.status(200).json(transactions);
    return;
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getRecentTransactions = async (req: Request, res: Response) => {
  try {
    const { userId, limit = 5 } = req.query;

    // Validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId as string)) {
       res.status(400).json({ message: "Invalid or missing userId" });
       return;
    }

    const transactions = await Transaction.find({
      userId: new mongoose.Types.ObjectId(userId as string),
    })
      .sort({ date: -1 }) // most recent first
      .limit(Number(limit));

    res.status(200).json(transactions);
    return;
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};



export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Prevent userId from being changed
    if ("userId" in updateData) {
      delete updateData.userId;
    }

    const transaction = await Transaction.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!transaction) {
      res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // <-- get transaction id from URL

    const deleted = await Transaction.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
