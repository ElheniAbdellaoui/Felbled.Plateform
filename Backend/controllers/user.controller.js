import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import getDataUri from "../utils/dataUri.js"; // ✅ importer la fonction

import cloudinary from "cloudinary"; // Assurez-vous que cloudinary est bien configuré
import { sendEmail } from "../utils/sendEmail.js";

// REGISTER
export const register = async (req, res) => {
  console.log("📩 register body:", req.body);

  try {
    const { firstName, lastName, email, password, userRole } = req.body;

    // Validation des champs
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis",
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Cet email est déjà utilisé",
      });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création utilisateur
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: userRole || "User",
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(201).json({
      success: true,
      message: "Inscription réussie",
      user: safeUser,
    });
  } catch (error) {
    console.error("❌ Erreur register:", error.message);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de l'inscription",
    });
  }
};
// LOGIN
export const login = async (req, res) => {
  console.log("🔐 login body:", req.body);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis",
      });
    }

    // Chercher user par email, inclure le mot de passe si select:false dans le schema
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    // Vérifier mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    // Générer JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    const safeUser = user.toObject();
    delete safeUser.password;

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 1 jour
      })
      .json({
        success: true,
        message: `Bienvenue ${user.firstName} ${user.lastName}`,
        user: safeUser,
      });
  } catch (error) {
    console.error("❌ Erreur login:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la connexion",
      error: error.message,
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

    // Vérification cruciale avant le traitement du fichier
    if (file && !file.buffer) {
      return res.status(400).json({
        success: false,
        message: "Invalid file format or missing file data",
      });
    }

    let cloudResponse = null;
    if (file) {
      const fileUri = getDataUri(file);

      // Vérification supplémentaire pour les données de fichier
      if (!fileUri || !fileUri.startsWith("data:")) {
        return res.status(400).json({
          success: false,
          message: "Failed to process file data",
        });
      }

      // Upload vers Cloudinary avec gestion des erreurs
      try {
        cloudResponse = await cloudinary.uploader.upload(fileUri, {
          resource_type: "auto",
          folder: "user-profiles", // Ajoutez un dossier pour mieux organiser
        });
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "File upload failed",
          error: uploadError.message,
        });
      }
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Mise à jour des données
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (occupation) user.occupation = occupation;
    if (instagram) user.instagram = instagram;
    if (facebook) user.facebook = facebook;
    if (linkedin) user.linkedin = linkedin;
    if (github) user.github = github;
    if (bio) user.bio = bio;
    if (cloudResponse) user.photoUrl = cloudResponse.secure_url;

    await user.save();
    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message, // Ajout du message d'erreur pour le débogage
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

export const verifyEmail = async (req, res) => {
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    verifyToken: token,
    verifyTokenExpire: { $gt: Date.now() },
  });
  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });
  user.isVerified = true;
  user.verifyToken = undefined;
  await user.save();
  res.json({ success: true, message: "Email verified" });
};

export const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = user.getResetToken();
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: "Password Reset",
    html: `<a href="${resetUrl}">Reset Password</a>`,
  });

  res.json({ success: true, message: "Reset link sent" });
};

export const resetPassword = async (req, res) => {
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  res.json({ success: true, message: "Password reset success" });
};
