import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";
import { sendEmail } from "../utils/sendEmail.js";

// ===================== REGISTER =====================
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Vérif si email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Création user (password sera hashé dans pre("save"))
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || "user",
    });

    // Génération JWT
    const token = user.getJWT();

    // Tentative d'envoi mail (facultatif)
    try {
      await sendEmail({
        to: user.email,
        subject: "Bienvenue sur Felbled Platform 🎉",
        html: `<h2>Bonjour ${user.firstName},</h2>
               <p>Merci de vous être inscrit sur <b>Felbled Platform</b>.</p>`,
      });
    } catch (mailErr) {
      console.warn("⚠️ Envoi email échoué:", mailErr.message);
    }

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erreur register:", error);
    res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
  }
};

// ===================== LOGIN =====================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérif user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe invalide." });
    }

    // Vérif password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe invalide." });
    }

    // ✅ Générer JWT directement
    const token = jwt.sign(
      { id: user._id }, // userId pour correspondre au middleware
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({ message: "Erreur serveur lors de la connexion." });
  }
};
// ===================== LOGOUT =====================
export const logout = async (_, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Déconnexion réussie",
      success: true,
    });
  } catch (error) {
    console.log("Erreur logout:", error);
    res.status(500).json({ message: "Erreur serveur lors de la déconnexion." });
  }
};

// ===================== UPDATE PROFILE =====================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur non trouvé" });
    }

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

    // si fichier uploadé
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const uploadRes = await cloudinary.v2.uploader.upload(fileUri, {
        folder: "user-profiles",
        resource_type: "auto",
      });
      user.photoUrl = uploadRes.secure_url;
    }

    // Mettre à jour les champs
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (occupation) user.occupation = occupation;
    if (bio) user.bio = bio;
    if (instagram) user.instagram = instagram;
    if (facebook) user.facebook = facebook;
    if (linkedin) user.linkedin = linkedin;
    if (github) user.github = github;

    await user.save();
    return res.status(200).json({
      success: true,
      message: "Profil mis à jour",
      user,
    });
  } catch (error) {
    console.error("Error updateProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur mise à jour profil",
      error: error.message,
    });
  }
};

// ===================== GET ALL USERS =====================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclure mot de passe
    res.status(200).json({
      success: true,
      message: "Liste des utilisateurs récupérée",
      total: users.length,
      users,
    });
  } catch (error) {
    console.error("Error fetching user list:", error);
    res.status(500).json({
      success: false,
      message: "Échec récupération utilisateurs",
    });
  }
};

// ===================== VERIFY EMAIL =====================
export const verifyEmail = async (req, res) => {
  try {
    const token = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token invalide ou expiré" });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    await user.save();

    res.json({ success: true, message: "Email vérifié" });
  } catch (error) {
    console.error("Erreur verifyEmail:", error);
    res.status(500).json({ message: "Erreur serveur vérification email" });
  }
};

// ===================== FORGOT PASSWORD =====================
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    const resetToken = user.getResetToken();
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    try {
      await sendEmail({
        to: user.email,
        subject: "Réinitialisation du mot de passe",
        html: `<a href="${resetUrl}">Cliquez ici pour réinitialiser votre mot de passe</a>`,
      });
    } catch (mailErr) {
      console.warn("⚠️ Email reset non envoyé:", mailErr.message);
    }

    res.json({ success: true, message: "Lien de réinitialisation envoyé" });
  } catch (error) {
    console.error("Erreur forgotPassword:", error);
    res.status(500).json({ message: "Erreur serveur forgot password" });
  }
};

// ===================== RESET PASSWORD =====================
export const resetPassword = async (req, res) => {
  try {
    const token = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token invalide ou expiré" });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Mot de passe réinitialisé avec succès",
    });
  } catch (error) {
    console.error("Erreur resetPassword:", error);
    res.status(500).json({ message: "Erreur serveur reset password" });
  }
};
