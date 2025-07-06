export type Transaction = {
    _id: string;
    title: string;
    type: "income" | "expense";
    amount: number;
    date: string; // ISO date string
    category: string; // Optional category field
    userId?: string; // ID of the user who created the transaction
    createdAt?: string; // ISO date string
    updatedAt?: string; // ISO date string
    __v?: number; // Version key for Mongoose
};