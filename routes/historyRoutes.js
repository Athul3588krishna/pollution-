import express from "express";
import Auth from "../middleware/Auth.js";
import { addHistory, getHistory, deleteHistory } from "../controller/historyController.js";

const router = express.Router();

router.post("/", Auth, addHistory);
router.get("/", Auth, getHistory);
router.delete("/:id", Auth, deleteHistory);

export default router;
