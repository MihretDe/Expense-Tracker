import { Request, Response } from "express";
import Category from "../models/Category.js";
import mongoose from "mongoose";

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
