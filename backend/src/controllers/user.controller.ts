import { Request, Response } from "express";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const createUser = async (req: Request, res: Response) => {
  try {
    console.log("📥 Incoming user:", req.body);
    const { auth0Id, email, name } = req.body;

    if (!auth0Id || !email || !name) {
      console.error("❌ Missing fields in request");
       res.status(400).json({ message: "Missing fields" });
    }

    let user = await User.findOne({ auth0Id });
    console.log("🔍 Existing user:", user);

    if (!user) {
      user = new User({ auth0Id, email, name });
      await user.save();
      console.log("✅ New user created");
    }

     res.status(201).json(user);
  } catch (error) {
    console.error("❌ Error in createUser:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};


export const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { auth0Id } = req.params;
    const { name, lastName, date, mobilePhone } = req.body;

    const user = await User.findOneAndUpdate(
      { auth0Id },
      { name, lastName, date, mobilePhone },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

     res
      .status(200)
      .json({ message: "User profile updated successfully", user });
      return;
  } catch (error) {
     res.status(500).json({ error: (error as Error).message });
     return;
  }
};

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { auth0Id } = req.params;

    const user = await User.findOne({ auth0Id });

    if (!user) {
       res.status(404).json({ message: "User not found" });
       return;
    }

     res.status(200).json(user);
     return
  } catch (error) {
     res.status(500).json({ error: (error as Error).message });
     return;
  }
};

export const getUserBalance = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const transactions = await Transaction.find({ userId });
    console.log("🔍 Transactions for user:", userId, transactions);

    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = income - expenses;

    res.json({ income, expenses, totalBalance });
  } catch (err) {
    res.status(500).json({ message: "Error calculating balance" });
  }
};
