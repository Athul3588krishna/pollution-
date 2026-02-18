import express from "express";
import Auth from "../middleware/Auth.js";
import { saveHealthProfile } from "../controller/healthController.js";

const router = express.Router();

router.post("/", Auth, saveHealthProfile);

export default router;
