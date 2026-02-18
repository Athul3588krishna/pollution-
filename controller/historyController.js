import History from "../models/History.js";
import { calculateRisk } from "../utils/riskCalculator.js";

// Add AQI history
export const addHistory = async (req, res, next) => {
  try {
    const { city, aqi, temperature, humidity } = req.body;

    if (!city || aqi === undefined || aqi === null) {
      return res.status(400).json({ msg: "City and AQI required" });
    }

    const riskLevel = calculateRisk(aqi);

    const data = await History.create({
      user_id: req.user.userId,
      city,
      aqi,
      temperature,
      humidity,
      riskLevel
    });

    res.status(201).json({
      msg: "History saved",
      data
    });

  } catch (error) {
    next(error);
  }
};

// Get user history
export const getHistory = async (req, res, next) => {
  try {
    const history = await History.find({
      user_id: req.user.userId
    }).sort({ createdAt: -1 });

    res.json(history);

  } catch (error) {
    next(error);
  }
};

// Delete history
export const deleteHistory = async (req, res, next) => {
  try {
    const deleted = await History.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.userId
    });

    if (!deleted) {
      return res.status(404).json({ msg: "History not found" });
    }

    res.json({ msg: "History deleted" });

  } catch (error) {
    next(error);
  }
};
