import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    auth0Id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String },
    date: { type: Date },
    mobilePhone: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
