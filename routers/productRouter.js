import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controller/productController.js";
import { protectedRoute, adminOnly } from "../middleware/protectedRoute.js";

const router = express.Router();
router.use(protectedRoute); // Apply the protected route middleware to all routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/create", adminOnly, createProduct);
router.delete("/delete/:id", adminOnly, deleteProduct);
router.put("/update/:id", adminOnly, updateProduct);

export default router;
