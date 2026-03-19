import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyUser,
} from "./authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/verify", verifyUser);

export default router;
