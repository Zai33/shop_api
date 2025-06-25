import express from "express";
import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../controller/categoryController.js";
import { protectedRoute, adminOnly } from "../middleware/protectedRoute.js";

const router = express.Router();

router.use(protectedRoute); // Apply the protected route middleware to all routes
router.get("/", adminOnly, getAllCategories);
router.post("/create", adminOnly, addCategory);
router.put("/update/:id", adminOnly, updateCategory);
router.delete("/delete/:id", adminOnly, deleteCategory);

export default router;
