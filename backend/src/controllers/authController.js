const bcrypt = require("bcryptjs");
const {
  createAdmin,
  findAdminByEmail,
  findAdminById,
} = require("../models/adminModel");
const { generateToken } = require("../utils/auth");

const registerAdmin = async (req, res) => {
  try {
    const { names, email, phone, nationalId, password } = req.body;

    if (!names || !email || !phone || !nationalId || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingAdmin = await findAdminByEmail(email);

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "An admin with this email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const admin = await createAdmin({
      names,
      email,
      phone,
      nationalId,
      passwordHash,
    });

    const token = generateToken(admin.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Admin account created successfully",
      admin,
    });
  } catch (error) {
    console.error("Admin registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create admin account",
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await findAdminByEmail(email);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      admin.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(admin.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      admin: {
        id: admin.id,
        names: admin.names,
        email: admin.email,
        phone: admin.phone,
        national_id: admin.national_id,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

const getCurrentAdmin = async (req, res) => {
  try {
    const admin = await findAdminById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error("Get current admin error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve admin",
    });
  }
};

const logoutAdmin = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getCurrentAdmin,
  logoutAdmin,
};