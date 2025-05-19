import express from "express";
import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../controller/categoryController.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const router = express.Router();

router.use(protectedRoute); // Apply the protected route middleware to all routes
router.get("/", getAllCategories);
router.post("/create", addCategory);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

export default router;
