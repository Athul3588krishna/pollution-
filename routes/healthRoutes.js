import express from "express";
import Auth from "../middleware/Auth.js";
import { saveHealthProfile, getHealthProfile } from "../controller/healthController.js";

const router = express.Router();

router.post("/", Auth, saveHealthProfile);
router.get("/", Auth, getHealthProfile);

export default router;
