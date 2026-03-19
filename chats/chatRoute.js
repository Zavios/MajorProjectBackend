import express from "express";
import multer from "multer";
import {
  editTitle,
  getChatById,
  getChatHistory,
  uploadXrayImage,
} from "./chatController.js";
import { authenticate } from "../authentication/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/getchats", authenticate, getChatHistory);
router.get("/getchat/:chat_id", authenticate, getChatById);
router.post(
  "/upload-xray",
  authenticate,
  upload.single("image"),
  uploadXrayImage,
);
router.post("/edit-title", authenticate, editTitle);

export default router;
