var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Category from "../models/Category.js";
import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
export const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, type, userId } = req.body;
        const newCategoryData = {
            name,
            type,
            isDefault: !userId,
        };
        if (userId) {
            newCategoryData.userId = new mongoose.Types.ObjectId(userId);
        }
        const category = new Category(newCategoryData);
        yield category.save();
        res.status(201).json(category);
    }
    catch (error) {
        console.log("CREATE CATEGORY ERROR:", error);
        res.status(500).json({ error: error.message });
    }
});
export const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        const categories = yield Category.find({
            $or: [{ isDefault: true }, { userId: userId || null }],
        });
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export const getCategorySummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, period } = req.query;
    if (!userId) {
        res.status(400).json({ message: "userId is required" });
        return;
    }
    const now = new Date();
    let startDate;
    if (period === "monthly") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    else {
        // default to 30 days
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    try {
        const summary = yield Transaction.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
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
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
export const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield Category.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
