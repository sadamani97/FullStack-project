import { Weather } from "../models/weather.model.js";

// GET all weather for a user
export const getWeatherList = async (req, res) => {
  try {
    const userId = req.user.id;
    const weather = await Weather.findAll({ 
      where: { userId },
      order: [["createdAt", "DESC"]]
    });
    res.json(weather);
  } catch (err) {
    res.status(500).json({ message: "Error fetching weather" });
  }
};

// GET single weather entry
export const getWeatherById = async (req, res) => {
  try {
    const weather = await Weather.findByPk(req.params.id);
    if (!weather) return res.status(404).json({ message: "Not found" });
    if (weather.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    res.json(weather);
  } catch (err) {
    res.status(500).json({ message: "Error fetching weather" });
  }
};

// POST create weather entry
export const createWeather = async (req, res) => {
  try {
    const { name, temp, condition, humidity, windSpeed, description, latitude, longitude } = req.body;
    
    if (!name || temp === undefined || !condition) {
      return res.status(400).json({ message: "Name, temp, and condition are required" });
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
    });
    res.status(201).json(weather);
  } catch (err) {
    res.status(500).json({ message: "Error creating weather entry" });
  }
};

// PUT update weather entry
export const updateWeather = async (req, res) => {
  try {
    const weather = await Weather.findByPk(req.params.id);
    if (!weather) return res.status(404).json({ message: "Not found" });
    if (weather.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    await weather.update(req.body);
    res.json(weather);
  } catch (err) {
    res.status(500).json({ message: "Error updating weather" });
  }
};

// DELETE weather entry
export const deleteWeather = async (req, res) => {
  try {
    const weather = await Weather.findByPk(req.params.id);
    if (!weather) return res.status(404).json({ message: "Not found" });
    if (weather.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    await weather.destroy();
    res.json({ message: "Weather entry deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting weather" });
  }
};
