import express from "express";
import { getPendingChats } from "./doctorController.js";

const router = express.Router();

router.get("/getchats", getPendingChats);

export default router;
