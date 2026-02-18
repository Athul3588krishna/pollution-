import express from "express";
import { addUser, login , getProfile} from "../controller/AuthController.js";
import authMiddleware from "../middleware/Auth.js";  

const router = express.Router();

// register
router.post("/register", addUser);

// login
router.post("/login", login);

router.get("/profile", authMiddleware, getProfile);

export default router;
