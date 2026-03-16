import express from "express";
import { getChatHistory } from "./chatController.js";

const router = express.Router();

router.get("/getchats", getChatHistory);

export default router;
