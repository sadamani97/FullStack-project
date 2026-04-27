import express from "express";
import { getWeatherList, getWeatherById, createWeather, updateWeather, deleteWeather, } from "../controllers/weatherController.js";
import authmiddleware from "../middleware/authmiddleware.js";
const router = express.Router();
router.get("/", authmiddleware, getWeatherList);
router.get("/:id", authmiddleware, getWeatherById);
router.post("/", authmiddleware, createWeather);
router.put("/:id", authmiddleware, updateWeather);
router.delete("/:id", authmiddleware, deleteWeather);
export default router;
//# sourceMappingURL=weather.routes.js.map