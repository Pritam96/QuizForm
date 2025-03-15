import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Checking authorization
export const protect = async (req, res, next) => {
  try {
    const { JWT_SECRET } = process.env;
    if (!JWT_SECRET) {
      throw new Error("Server Configuration Error.");
    }

    // Get token
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error while verifying token:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// Checking admin role
export const adminOnly = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "You don't have permission to access this route.",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
