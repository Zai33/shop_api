import Category from "../model/category.model.js";
import Product from "../model/product.model.js";

// Function to get all products
// This function handles the retrieval of all products from the database.
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");

    if (products.length === 0) {
      return res
        .status(200)
        .json({ con: true, message: "No products found", products: [] });
    }

    res.status(200).json({
      con: true,
      message: "Products retrieved successfully",
      total: products.length,
      products: products,
    });
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Function to add a new product
// This function handles the creation of a new product in the database.
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("category");
    if (!product) {
      return res.status(404).json({
        con: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      con: true,
      message: "Product retrieved successfully",
      product: product,
    });
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Function to add a new product
// This function handles the creation of a new product in the database.
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      richDescription,
      image,
      images,
      brand,
      price,
      category,
      countInStock,
      rating,
      numReviews,
      isFeatured,
    } = req.body;

    if (!name || !description || !price || !category || !countInStock) {
      return res.status(400).json({
        con: false,
        message: "Please fill all required fields",
      });
    }

    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({
        con: false,
        message: "Product already exists",
      });
    }

    // Check if the category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(400).json({
        con: false,
        message: "Category not found",
      });
    }

    const newProduct = new Product({
      name,
      description,
      richDescription,
      image,
      images,
      brand,
      price,
      category,
      countInStock,
      rating,
      numReviews,
      isFeatured,
    });
    if (newProduct) {
      await newProduct.save();
      const saveProduct = await Product.findById(newProduct._id).populate(
        "category"
      );
      res.status(201).json({
        con: true,
        message: "Product created successfully",
        product: saveProduct,
      });
    }
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Function to update a product
// This function handles the update of an existing product in the database.
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({
        con: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      con: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      richDescription,
      image,
      images,
      brand,
      price,
      category,
      countInStock,
      rating,
      numReviews,
      isFeatured,
    } = req.body;
    // Validate required fields
    if (!name || !description || !price || !category || !countInStock) {
      return res.status(400).json({
        con: false,
        message: "Please fill all required fields",
      });
    }
    // Find the product by ID and update it
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        richDescription,
        image,
        images,
        brand,
        price,
        category,
        countInStock,
        rating,
        numReviews,
        isFeatured,
      },
      { new: true }
    ).populate("category");
    // Check if the product was found and updated
    if (!updatedProduct) {
      return res.status(404).json({
        con: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      con: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
