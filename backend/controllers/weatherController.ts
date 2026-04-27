import { Weather } from "../models/weather.model.js";
import { Request, Response } from "express";

// GET all weather for a user
export const getWeatherList = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const weather = await Weather.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
    res.json(weather);
  } catch (err) {
    res.status(500).json({ message: "Error fetching weather" });
  }
};

// GET single weather entry
export const getWeatherById = async (req: Request, res: Response): Promise<void> => {
  try {
    const weather: any = await Weather.findByPk(req.params.id);
    if (!weather) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    if (weather.userId !== req.user.id) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }
    res.json(weather);
  } catch (err) {
    res.status(500).json({ message: "Error fetching weather" });
  }
};

// POST create weather entry
export const createWeather = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, temp, condition, humidity, windSpeed, description, latitude, longitude } = req.body;

    if (!name || temp === undefined || !condition) {
      res.status(400).json({ message: "Name, temp, and condition are required" });
      return;
    }

    const weather = await Weather.create({
      userId: req.user.id,
      name,
      temp,
      condition,
      humidity,
      windSpeed,
      description,
      latitude,
      longitude,
    } as any);
    res.status(201).json(weather);
  } catch (err) {
    res.status(500).json({ message: "Error creating weather entry" });
  }
};

// PUT update weather entry
export const updateWeather = async (req: Request, res: Response): Promise<void> => {
  try {
    const weather: any = await Weather.findByPk(req.params.id);
    if (!weather) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    if (weather.userId !== req.user.id) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    await weather.update(req.body);
    res.json(weather);
  } catch (err) {
    res.status(500).json({ message: "Error updating weather" });
  }
};

// DELETE weather entry
export const deleteWeather = async (req: Request, res: Response): Promise<void> => {
  try {
    const weather: any = await Weather.findByPk(req.params.id);
    if (!weather) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    if (weather.userId !== req.user.id) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    await weather.destroy();
    res.json({ message: "Weather entry deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting weather" });
  }
};
