import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import sequelize from "./config/db.js";
import profileRoutes from "./routes/profile.routes.js";
import countryRoutes from "./routes/country.routse.js";
import weatherRoutes from "./routes/weather.routes.js";
import "./models/weather.model.js";
import "./models/contry.model.js";
import "./models/user.model.js";
dotenv.config();
const app = express();
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({
    origin: ["http://localhost", "http://localhost:5173"],
    credentials: true,
}));
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/weather", weatherRoutes);
// port
const PORT = process.env.PORT || 5000;
console.log("Registering auth routes...");
app.use((req, res) => {
    console.log("404 HIT:", req.method, req.url);
    res.status(404).json({ message: `Route not found: ${req.method} ${req.url}` });
});
sequelize.sync({ alter: true }).then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Unable to connect to the database:", error);
});
//# sourceMappingURL=server.js.map