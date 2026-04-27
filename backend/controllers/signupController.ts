import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { Request, Response } from "express";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "User already exists with this email" });
      return;
    }
    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
    } as any);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: (user as any).id,
        name: (user as any).name,
        email: (user as any).email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
