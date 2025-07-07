import Category from "../models/Category.js";

const defaultCategories = [
  { name: "Food", type: "expense" },
  { name: "Rent", type: "expense" },
  { name: "Salary", type: "income" },
  { name: "Entertainment", type: "expense" },
  { name: "Transportation", type: "expense" },
  { name: "Freelance", type: "income" }
];

export const seedDefaultCategories = async () => {
  for (const cat of defaultCategories) {
    // Check if this default category already exists
    const exists = await Category.findOne({
      name: cat.name,
      type: cat.type,
      userId: null,
      isDefault: true,
    });

    if (!exists) {
      await Category.create({
        name: cat.name,
        type: cat.type,
        userId: null,
        isDefault: true
      });
      console.log(`✅ Default category "${cat.name}" added.`);
    }
  }
};
