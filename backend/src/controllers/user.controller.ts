import { Request, Response } from "express";
import User from "../models/User.js";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { auth0Id, email, name } = req.body;

    let user = await User.findOne({ auth0Id });

    if (!user) {
      user = new User({
        auth0Id,
        email,
        name,
      });
      await user.save();
    }

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.params;

    const user = await User.findOne({ auth0Id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
