import HealthProfile from "../models/HealthProfile.js";

// Create / Update Health Profile
export const saveHealthProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { asthma = false, allergy = false, heart = false } = req.body || {};

    if (typeof asthma !== "boolean" || typeof allergy !== "boolean" || typeof heart !== "boolean") {
      return res.status(400).json({ msg: "Health data required" });
    }

    const profile = await HealthProfile.findOneAndUpdate(
      { user_id: userId },
      {
        user_id: userId,
        healthConditions: { asthma, allergy, heart }
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      msg: "Health profile saved",
      profile
    });

  } catch (error) {
    next(error);
  }
};

// Get Health Profile
export const getHealthProfile = async (req, res, next) => {
  try {
    const profile = await HealthProfile.findOne({
      user_id: req.user.userId
    });

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    res.json(profile);

  } catch (error) {
    next(error);
  }
};
