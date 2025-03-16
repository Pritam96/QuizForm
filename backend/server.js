import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db/config.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";

// configuring environment variables
dotenv.config();

// connecting to database
connectDB();

const port = process.env.PORT || 5000;

// creating express app
const app = express();

// cors middleware
app.use(cors());

// json parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.get("/", (req, res) => res.send("QuizForm server working!"));
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

// starting server
app.listen(port, () => console.log("Server running on port", port));
