import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/config.js";
import authRoutes from "./routes/auth.routes.js";

// configuring environment variables
dotenv.config();

// connecting to database
connectDB();

const port = process.env.PORT || 5000;

// creating express app
const app = express();

// json parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.get("/", (req, res) => res.send("QuizForm server working!"));
app.use("/api/auth", authRoutes);

// starting server
app.listen(port, () => console.log("Server running on port", port));
