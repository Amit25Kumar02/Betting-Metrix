import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    countryCode: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    sports: [{ type: String }],
    profileImage: { type: String, default: null },
    resetOtp: { type: String, default: null },
    resetOtpExpires: { type: Date, default: null },

}, { timestamps: true });

export default mongoose.model("User", userSchema);
