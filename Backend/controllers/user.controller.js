import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import getDataUri from "../utils/dataUri.js"; // ✅ importer la fonction

import cloudinary from "cloudinary"; // Assurez-vous que cloudinary est bien configuré

export const register = async (req, res) => {
  console.log("📦 Body reçu :", req.body);
  try {
    const { firstName, lastName, email, password, role } = req.body; // ✅ Ajouter role

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUserByEmail = await User.findOne({ email: email });
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // ✅ Validation du rôle (optionnel mais recommandé)
    const validRoles = ["user", "admin"];
    const userRole = role && validRoles.includes(role) ? role : "user";

    const hashPassword = await bcrypt.hash(password, 10);

    // ✅ Créer l'utilisateur avec le rôle
    await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
      role: userRole, // ✅ Ajouter le rôle
    });

    return res.status(201).json({
      success: true,
      message: "Account Created Successfully",
    });
  } catch (error) {
    console.error("❌ REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to register",
    });
  }
};

export const login = async (req, res) => {
  console.log("🔐 Login function called", req.body);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    console.log("SECRET_KEY:", process.env.SECRET_KEY);

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000, // 1 jour
        httpOnly: true, // CORRECT
        sameSite: "strict",
        secure: false, // mettre true si HTTPS
      })
      .json({
        success: true,
        message: `Welcome back ${user.firstName}`,
        user,
      });
  } catch (error) {
    console.error("LOGIN ERROR:", error); // pour afficher le vrai message d’erreur
    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

export const logout = async (_, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "logout successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const {
      firstName,
      lastName,
      occupation,
      bio,
      instagram,
      facebook,
      linkedin,
      github,
    } = req.body;
    const file = req.file;

    const fileUri = getDataUri(file);
    let cloudResponse = await cloudinary.uploader.upload(fileUri);

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // updating data
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (occupation) user.occupation = occupation;
    if (instagram) user.instagram = instagram;
    if (facebook) user.facebook = facebook;
    if (linkedin) user.linkedin = linkedin;
    if (github) user.github = github;
    if (bio) user.bio = bio;
    if (file) user.photoUrl = cloudResponse.secure_url;

    await user.save();
    return res.status(200).json({
      message: "profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password field
    res.status(200).json({
      success: true,
      message: "User list fetched successfully",
      total: users.length,
      users,
    });
  } catch (error) {
    console.error("Error fetching user list:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};
