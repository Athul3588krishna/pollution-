export function calculateRisk(aqi) {
  // OpenWeather AQI scale is 1-5.
  if (aqi <= 1) return "Low";
  if (aqi <= 3) return "Moderate";
  return "High";
}
