import express from "express";
import {
  getCountries, getCountry,
  createCountry, updateCountry, deleteCountry
} from "../controllers/contryController.js";
import authmiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", authmiddleware, getCountries);
router.get("/:id", authmiddleware, getCountry);
router.post("/", authmiddleware, createCountry);
router.put("/:id", authmiddleware, updateCountry);
router.delete("/:id", authmiddleware, deleteCountry);

export default router;