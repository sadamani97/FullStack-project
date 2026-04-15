import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import sequelize from "./config/db.js";


const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    Credentials: true
}));
app.use(express.json());

const PORT = 5000;

app.get("/", (req, res) => {
    res.send("Hello World");
});
console.log("Registering auth routes...");
app.use("/api/auth", authRoutes);

app.use((req, res) => {
    console.log("404 HIT:", req.method, req.url); // tells you exactly what URL is being hit
    res.status(404).json({ message: `Route not found: ${req.method} ${req.url}` });
});

app.use("/api/auth", authRoutes);

sequelize.sync({ alter: true }).then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Unable to connect to the database:", error);
});