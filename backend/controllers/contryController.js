import { Country } from "../models/contry.model.js";

// GET all countries (with optional region filter + search)
export const getCountries = async (req, res) => {
  try {
    const { region, search } = req.query;
    const { Op } = await import("sequelize");

    const where = {};
    if (region) where.region = region;
    if (search) where.name = { [Op.like]: `%${search}%` };

    const countries = await Country.findAll({ where });
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: "Error fetching countries" });
  }
};

// GET single country
export const getCountry = async (req, res) => {
  try {
    const country = await Country.findByPk(req.params.id);
    if (!country) return res.status(404).json({ message: "Not found" });
    res.json(country);
  } catch (err) {
    res.status(500).json({ message: "Error fetching country" });
  }
};

// POST create country
export const createCountry = async (req, res) => {
  try {
    const country = await Country.create(req.body);
    res.status(201).json(country);
  } catch (err) {
    res.status(500).json({ message: "Error creating country" });
  }
};

// PUT update country
export const updateCountry = async (req, res) => {
  try {
    const country = await Country.findByPk(req.params.id);
    if (!country) return res.status(404).json({ message: "Not found" });
    await country.update(req.body);
    res.json(country);
  } catch (err) {
    res.status(500).json({ message: "Error updating country" });
  }
};

// DELETE country
export const deleteCountry = async (req, res) => {
  try {
    const country = await Country.findByPk(req.params.id);
    if (!country) return res.status(404).json({ message: "Not found" });
    await country.destroy();
    res.json({ message: "Country deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting country" });
  }
};


