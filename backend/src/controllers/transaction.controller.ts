import { Request, Response } from "express";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
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
