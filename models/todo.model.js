import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  Title: { type: String, required: true, uppercase: true },
  Description: { type: String, default: "" },
  Priority: { type: String, default: "Normal" },
  Date: { type: Date, default: Date.now() },
  Reapeat: { type: String, default: "No" },
  Status: { type: String, default: "Pending" },
});

export default mongoose.model("todo", todoSchema);
