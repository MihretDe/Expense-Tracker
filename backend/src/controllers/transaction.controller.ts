import { Request, Response } from "express";
import Transaction from "../models/Transaction.js";

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { title, amount, type, category, userId } = req.body;

    const transaction = new Transaction({
      title,
      amount,
      type,
      category,
      userId,
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth?.payload?.sub;

    const transactions = await Transaction.find({
      userId: userId,
    });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } =(req as any).auth?.payload?.sub;
    const updateData = req.body;

    const transaction = await Transaction.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = (req as any).auth?.payload?.sub;

    const deleted = await Transaction.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
