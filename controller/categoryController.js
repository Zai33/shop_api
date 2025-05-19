import Category from "../model/category.model.js";

// Function to get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    if (categories.length === 0) {
      return res
        .status(200)
        .json({ con: true, message: "No categories found", categories: [] });
    }
    res.status(200).json({
      con: true,
      message: "Categories retrieved successfully",
      count: categories.length,
      categories: categories,
    });
  } catch (error) {
    console.error("Error retrieving categories:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Function to add a new category
// This function handles the addition of a new category to the database.
export const addCategory = async (req, res) => {
  try {
    const { name, color, icon } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Check if the category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        con: false,
        message: "Category already exists",
      });
    }

    const newCategory = new Category({
      name,
      color,
      icon,
    });
    if (newCategory) {
      await newCategory.save();
      res.status(201).json({
        con: true,
        message: "Category added successfully",
        category: newCategory,
      });
    }
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Function to delete a category
// This function handles the deletion of a category from the database.
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, icon } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name,
        color,
        icon,
      },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({
      con: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Function to delete a category
// This function handles the deletion of a category from the database.
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({
      con: true,
      message: "Category deleted successfully",
      category: deletedCategory,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
