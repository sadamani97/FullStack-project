import sequelize from "../config/db.js";
import { Country } from "../models/contry.model.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to find countries.json in multiple locations
const paths = [
  resolve(__dirname, "../countries.json"),
  resolve(__dirname, "../../frontend/public/countries.json")
];

let data;
for (const path of paths) {
  try {
    data = JSON.parse(readFileSync(path, "utf-8"));
    console.log(`Loaded countries.json from: ${path}`);
    break;
  } catch (e) {
    // Continue to next path
  }
}

if (!data) {
  console.error("Could not find countries.json");
  process.exit(1);
}

await sequelize.sync({ alter: true });
await Country.bulkCreate(data, { ignoreDuplicates: true });
console.log("Seeded countries!");
process.exit(0);