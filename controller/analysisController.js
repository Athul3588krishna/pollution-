import axios from "axios";
import History from "../models/History.js";
import { calculateRisk } from "../utils/riskCalculator.js";

export const checkPollution = async (req, res, next) => {
  try {
    const { city } = req.body;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!city) {
      return res.status(400).json({ msg: "City is required" });
    }
    if (!apiKey) {
      return res.status(500).json({ msg: "OpenWeather API key is not configured" });
    }

    // 1️⃣ Get latitude & longitude
    const geoRes = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    );

    if (geoRes.data.length === 0) {
      return res.status(404).json({ msg: "City not found" });
    }

    const { lat, lon } = geoRes.data[0];

    // 2️⃣ Get Air Pollution Data
    const pollutionRes = await axios.get(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    const aqi = pollutionRes.data.list[0].main.aqi;

    const riskLevel = calculateRisk(aqi);

    // 3️⃣ Save to history
    await History.create({
      user_id: req.user.userId,
      city,
      aqi,
      riskLevel
    });

    res.json({
      city,
      aqi,
      riskLevel
    });

  } catch (error) {
    if (error?.response?.status) {
      return res.status(502).json({ msg: "Failed to fetch data from weather service" });
    }
    next(error);
  }
};
