import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const getSignedJwtToken = (info) => {
  const { JWT_SECRET, JWT_EXPIRE } = process.env;

  if (!JWT_SECRET || !JWT_EXPIRE) {
    throw new Error("Server Configuration Error.");
  }

  return jwt.sign(info, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists." });
    }

    const user = await User.create({ name, email, password });

    const token = getSignedJwtToken({ id: user._id });

    return res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error while registering a user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid Credentials." });
    }

    const isMatchedPassword = await existingUser.matchPassword(password);
    if (!isMatchedPassword) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid Credentials." });
    }

    const token = getSignedJwtToken({ id: existingUser._id });

    return res.status(200).json({
      success: true,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error while signing in user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
