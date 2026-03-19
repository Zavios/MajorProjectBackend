import express from "express";
import {
  addDoctorNote,
  createDoctor,
  doctorLogin,
  getApprovedChats,
  getPendingChats,
  requestRecord,
} from "./doctorController.js";
import {
  authenticate,
  authorizedCreate,
  authorizedDoctor,
} from "../authentication/authMiddleware.js";

const router = express.Router();

router.get("/getchats", getPendingChats);
router.get("/getapprovedchats", authenticate, getApprovedChats);
router.post("/requestrecord", authenticate, getPendingChats);
router.post("/addnote", authenticate, addDoctorNote);
router.post("/signup", authorizedCreate, createDoctor);
router.post("/login", authorizedDoctor, doctorLogin);

export default router;
