import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    name: { type: String, required: true },
    type: { type: String, enum: ["income", "expense"], default: null },
    isDefault: { type: Boolean, default: false },
});
export default mongoose.model("Category", categorySchema);
