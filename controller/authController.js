import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateToken } from "../utils/generateToken.js";
import { generateOpt, sendOptEmail } from "../utils/optService.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, comfirmPassword } = req.body;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Validate email format
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        con: false,
        message: "Invalid email format",
      });
    }

    // Validate required fields
    if (!email || !password || !comfirmPassword || !name) {
      return res.status(400).json({
        con: false,
        message: "Please fill all required fields",
      });
    }
    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        con: false,
        message: "Email already exists",
      });
    }

    //check if user name already exists
    const existingUserName = await User.findOne({ name });
    if (existingUserName) {
      return res.status(400).json({
        con: false,
        message: "User name already exists",
      });
    }

    // Check if password and confirm password match
    if (password !== comfirmPassword) {
      return res.status(400).json({
        con: false,
        message: "Passwords do not match",
      });
    }

    //check password length
    if (password.length < 6) {
      return res.status(400).json({
        con: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //opt seding
    const plainOtp = generateOpt();
    const hashedOtp = crypto
      .createHash("sha256")
      .update(plainOtp)
      .digest("hex");

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      otp: hashedOtp,
      otpExpire: Date.now() + 60 * 1000,
      isverified: false,
    });

    await sendOptEmail(email, plainOtp);
    res.status(201).json({
      con: true,
      message:
        "Registration initiated. An OTP has been sent to your e-mail and is valid for 1 minute.",
      userId: newUser._id,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
      return res.status(400).json({
        con: false,
        message: "Please provide userId and otp",
      });
    }

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        con: false,
        message: "User not found",
      });
    }
    if (user.isverified) {
      return res.status(400).json({
        con: false,
        message: "User already verified",
      });
    }

    if (!user.otp || !user.otpExpire) {
      return res.status(400).json({
        con: false,
        message: "OTP not found or expired",
      });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({
        con: false,
        message: "OTP expired",
      });
    }

    // Hash the provided OTP and compare with the stored OTP
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    if (hashedOtp !== user.otp) {
      return res.status(400).json({
        con: false,
        message: "Invalid OTP",
      });
    }

    user.isverified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();
    const token = generateToken(user._id, res);
    res.status(200).json({
      con: true,
      message: "User verified successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        country: user.country,
        isAdmin: user.isAdmin,
        token: token,
      },
    });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// resend otp
export const resendOpt = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        con: false,
        message: "Please provide userId",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        con: false,
        message: "User not found",
      });
    }
    if (user.isverified) {
      return res.status(400).json({
        con: false,
        message: "User already verified",
      });
    }

    const plainOtp = generateOpt();
    const hashedOtp = crypto
      .createHash("sha256")
      .update(plainOtp)
      .digest("hex");
    user.otp = hashedOtp;
    user.otpExpire = Date.now() + 60 * 1000;
    await user.save();
    await sendOptEmail(user.email, plainOtp);
    res.status(200).json({
      con: true,
      message: "An OTP has been sent to your e-mail and is valid for 1 minute.",
    });
  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        con: false,
        message: "Please fill all required fields",
      });
    }
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        con: false,
        message: "User not found",
      });
    }

    // Check if user is verified
    if (!user.isverified) {
      return res.status(400).json({
        con: false,
        message: "User not verified",
      });
    }
    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user?.password || "");
    if (!isMatch) {
      return res.status(400).json({
        con: false,
        message: "Invalid credentials",
      });
    }
    // Generate token
    const token = generateToken(user._id, res);
    res.status(200).json({
      con: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        country: user.country,
        isAdmin: user.isAdmin,
        token: token,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// logout user
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      con: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// get user profile
export const getUserProfile = async (req, res) => {
  try {
    // Find the user by userId
    const user = await User.findById(req.user._id).select(
      "-password -otp -otpExpire"
    );
    res.status(200).json({
      con: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        country: user.country,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Error getting user profile:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
