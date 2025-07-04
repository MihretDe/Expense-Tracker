import { Router } from "express";
import {
  createUser,
  getUserProfile,
} from "../controllers/user.controller";

const router = Router();

router.post("/", createUser);
// router.get("/:auth0Id", getUserProfile);

export default router;
