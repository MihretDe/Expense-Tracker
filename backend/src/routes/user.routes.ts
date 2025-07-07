import { Router } from "express";
import {
  createUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/", createUser);
router.get("/:auth0Id", getUserProfile);
router.patch("/:auth0Id", updateUserProfile);

export default router;
