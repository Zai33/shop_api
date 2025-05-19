import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

export const createDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.EMAIL_HOST;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword) {
      console.error(
        "Admin email or password not set in environment variables."
      );
      return;
    }
    const existingAdmin = await User.findOne({ role: "admin" });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      const admin = new User({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        city: "Admin City",
        country: "Admin Country",
        phone: "1234567890",
        role: "admin",
        isverified: true,
      });
      await admin.save();
      console.log(`Default admin created: ${adminEmail}`);
    } else {
      console.log(`Admin already exists: ${existingAdmin.email}`);
    }
  } catch (error) {
    console.error("Error creating default admin:", error);
  }
};
