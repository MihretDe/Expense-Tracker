import { Request, Response } from "express";
import Category from "../models/Category.js";
import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, type, userId } = req.body;

    const newCategoryData: any = {
      name,
      type,
      isDefault: !userId,
    };

    if (userId) {
      newCategoryData.userId = new mongoose.Types.ObjectId(userId);
    }

    const category = new Category(newCategoryData);

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.log("CREATE CATEGORY ERROR:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};
export const getCategories = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    const categories = await Category.find({
      $or: [{ isDefault: true }, { userId: userId || null }],
    });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
export const getCategorySummary = async (req: Request, res: Response) => {
  const { userId, period } = req.query;

  if (!userId) {
    res.status(400).json({ message: "userId is required" });
    return;
  }

  const now = new Date();
  let startDate: Date;

  if (period === "monthly") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else {
    // default to 30 days
    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  try {
    const summary = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId as string),
          date: { $gte: startDate, $lte: now },
        },
      },
      {
        $group: {
          _id: { category: "$category", type: "$type" },
          value: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id.category",
          type: "$_id.type",
          value: 1,
        },
      },
      { $sort: { value: -1 } },
    ]);
    

    res.json(summary);
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};


export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
