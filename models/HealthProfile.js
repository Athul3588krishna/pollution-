import mongoose from "mongoose";

const healthProfileSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  healthConditions: {
    asthma: { type: Boolean, default: false },
    allergy: { type: Boolean, default: false },
    heart: { type: Boolean, default: false }
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("HealthProfile", healthProfileSchema);
