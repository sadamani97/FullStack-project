import { User } from "../models/user.model.js";
import { Request, Response } from "express";

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "profilePic"],
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const { name, email, profilePic } = req.body;

    const user: any = await User.findByPk(req.user.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (profilePic) user.profilePic = profilePic;

    await user.save();

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Error updating profile: " + (error as Error).message });
  }
};
