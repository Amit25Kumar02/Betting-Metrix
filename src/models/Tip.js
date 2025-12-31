import mongoose from "mongoose";

const TipSchema = new mongoose.Schema(
    {
        sport: { type: String, required: true },
        homeTeam: { type: String, required: true },
        awayTeam: { type: String, required: true },
        homeLogo: { type: String },
        awayLogo: { type: String },
        winPercent: { type: Number, required: true },
        risk: {
            type: String,
            enum: ["High", "Medium", "Low"],
            default: "Low"
        },
        tip: { type: String, required: true },
        matchTime: { type: Date, required: true },

        isFavorite: { type: Boolean, default: false }
    },
    { timestamps: true }
);

export default mongoose.model("Tip", TipSchema);
