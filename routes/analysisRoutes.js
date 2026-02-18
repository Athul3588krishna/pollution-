import express from "express";
import Auth from "../middleware/Auth.js";
import { checkPollution } from "../controller/analysisController.js";

const router = express.Router();

router.post("/check", Auth, checkPollution);

export default router;
