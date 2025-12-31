import mongoose from "mongoose";

const SportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    icon: { type: String, default: null }  
  },
  { timestamps: true }
);

export default mongoose.model("Sport", SportSchema);
