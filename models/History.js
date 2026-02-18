import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    city: {
      type: String,
      required: true
    },

    aqi: {
      type: Number,
      required: true
    },

    temperature: Number,
    humidity: Number,

    riskLevel: {
      type: String,
      enum: ["Low", "Moderate", "High"],
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("History", historySchema);
