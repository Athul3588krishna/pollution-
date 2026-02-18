import express from "express";
import Auth from "../middleware/Auth.js";

const router = express.Router();

router.get("/protected", Auth, (req, res) => {
  res.json({
    msg: "Protected route accessed",
    user: req.user
  });
});

export default router;
