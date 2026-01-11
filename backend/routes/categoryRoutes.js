import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import { uploadCategoryImage } from '../utils/multer.js';

const router = express.Router();

router.post("/create", uploadCategoryImage.single("image"), createCategory);
router.get("/getall", getAllCategories);
router.get("/:slug", getCategoryBySlug);
router.put("/:slug", uploadCategoryImage.single("image"), updateCategory);
router.delete("/:slug", deleteCategory);

export default router;
