import express from "express";
import authmiddleware from "../middleware/authmiddleware.js";
import { getProfile, updateProfile } from "../controllers/profileController.js";

const router = express.Router();

router.get("/", authmiddleware, getProfile);
router.put("/update", authmiddleware, updateProfile);

export default router;
