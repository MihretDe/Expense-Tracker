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

export const updateUserProfile = async (req: Request, res: Response):Promise<void> => {
  try {
    const { auth0Id } = req.params;
    const { name,lastName, date, mobilePhone } = req.body;

    const user = await User.findOneAndUpdate(
      { auth0Id },
      { name, lastName, date, mobilePhone },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getUserProfile = async (req: Request, res: Response):Promise<void> => {
  try {
    const { auth0Id } = req.params;

    const user = await User.findOne({ auth0Id });

    if (!user) {
       res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
