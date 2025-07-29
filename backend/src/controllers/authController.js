import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../db/prisma.js";

export const register = async (req, res) => {
  const { email, username, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ success:false, message: "Email already registered" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, username, password: hashed } });

  res.status(201).json({ success:true,message: "User created", user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ success:false, message: "Invalid credentials" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).json({ success:false, message: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  res.json({ success:true, token });
};
