import { Router } from "express";
import {
  createCategory,
  getCategories,
  deleteCategory,
  getCategorySummary,
} from "../controllers/category.controller.js"

const router = Router();

router.post("/", createCategory);
router.get("/", getCategories);
// router.delete("/:id", deleteCategory);
router.get("/summary", getCategorySummary);


export default router;
