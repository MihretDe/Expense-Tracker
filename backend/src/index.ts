import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import categoryRoutes from "./routes/category.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import userRoutes from "./routes/user.routes.js";
// import { seedDefaultCategories } from "./utils/seedDefaultCategories.js";

import path from "path";

dotenv.config();
console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
console.log("NODE_ENV:", process.env.NODE_ENV);

// register API routes first
console.log("Registering category routes...");
app.use("/api/categories", categoryRoutes);

console.log("Registering transaction routes...");
app.use("/api/transactions", transactionRoutes);

console.log("Registering user routes...");
app.use("/api/users", userRoutes);

// serve frontend last
const frontendPath = path.join(__dirname, "../../frontend/build");
console.log("Serving frontend from:", frontendPath);
app.use(express.static(frontendPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const startServer = async () => {
  try {
    await connectDB();
    // await seedDefaultCategories();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
startServer();
