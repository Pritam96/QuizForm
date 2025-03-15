import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/config.js";

// configuring environment variables
dotenv.config();

// connecting to database
connectDB();

const port = process.env.PORT || 5000;

// creating express app
const app = express();

// routes
app.get("/", (req, res) => res.send("QuizForm server working!"));

// starting server
app.listen(port, () => console.log("Server running on port", port));
