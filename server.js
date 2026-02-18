import express from "express";
import dotenv from "dotenv";
import connectDB from "./connection.js";
import cors from "cors";

import AuthRoutes from "./routes/AuthRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import HistoryRoutes from "./routes/historyRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import analysisRoutes from "./routes/analysisRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// auth routes
app.use("/api/auth", AuthRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/test", testRoutes);
app.use("/api/history", HistoryRoutes);

app.use("/api/analysis", analysisRoutes);

app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`server created at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
