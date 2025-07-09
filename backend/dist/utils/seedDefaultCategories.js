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
const defaultCategories = [
    { name: "Food", type: "expense" },
    { name: "Rent", type: "expense" },
    { name: "Salary", type: "income" },
    { name: "Entertainment", type: "expense" },
    { name: "Transportation", type: "expense" },
    { name: "Freelance", type: "income" }
];
export const seedDefaultCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const cat of defaultCategories) {
        // Check if this default category already exists
        const exists = yield Category.findOne({
            name: cat.name,
            type: cat.type,
            userId: null,
            isDefault: true,
        });
        if (!exists) {
            yield Category.create({
                name: cat.name,
                type: cat.type,
                userId: null,
                isDefault: true
            });
            console.log(`✅ Default category "${cat.name}" added.`);
        }
    }
});
