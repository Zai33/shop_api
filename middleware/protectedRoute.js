import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

export const protectedRoute = async (req, res, next) => {
  try {
    // Check if the request has a JWT token
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        con: false,
        message: "Unauthorized access, token not found",
      });
    }
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        con: false,
        message: "Unauthorized access, invalid token",
      });
    }

    // Find the user associated with the token
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        con: false,
        message: "Unauthorized access, user not found",
      });
    }

    req.user = user; // Attach the user to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in protected route:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Function to check if the user is an admin
export const adminOnly = (req, res, next) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        con: false,
        message: "Forbidden, admin access only",
      });
    }
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in admin only route:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
