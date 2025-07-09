var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
export const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("📥 Incoming user:", req.body);
        const { auth0Id, email, name } = req.body;
        if (!auth0Id || !email || !name) {
            console.error("❌ Missing fields in request");
            res.status(400).json({ message: "Missing fields" });
        }
        let user = yield User.findOne({ auth0Id });
        console.log("🔍 Existing user:", user);
        if (!user) {
            user = new User({ auth0Id, email, name });
            yield user.save();
            console.log("✅ New user created");
        }
        res.status(201).json(user);
    }
    catch (error) {
        console.error("❌ Error in createUser:", error);
        res.status(500).json({ error: error.message });
    }
});
export const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updates = req.body;
        const user = yield User.findByIdAndUpdate(id, updates, {
            new: true,
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res
            .status(200)
            .json({ message: "User profile updated successfully", user });
        return;
    }
    catch (error) {
        res.status(500).json({ error: error.message });
        return;
    }
});
export const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { auth0Id } = req.params;
        const user = yield User.findOne({ auth0Id });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
        return;
    }
    catch (error) {
        res.status(500).json({ error: error.message });
        return;
    }
});
export const getUserBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const transactions = yield Transaction.find({ userId });
        const income = transactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);
        const totalBalance = income - expenses;
        res.json({ income, expenses, totalBalance });
    }
    catch (err) {
        res.status(500).json({ message: "Error calculating balance" });
    }
});
