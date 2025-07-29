import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../db/prisma.js";

// Register route
export const register = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, username, password: hashed },
    });

    return res.status(201).json({
      success: true,
      message: "User created",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server problem",
      error: error.message,
    });
  }
};

// Login Route
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    return res.status(200).json({
      success: true,
      message: `${user.username} logged in successfully`,
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
