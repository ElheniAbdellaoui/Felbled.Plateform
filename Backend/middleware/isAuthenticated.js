import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    // 🔍 Chercher token soit dans cookie soit dans header
    const token =
      req.cookies?.token ||
      (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer") &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Accès refusé : token manquant",
      });
    }

    // ✅ Vérifier le token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // ✅ Récupérer l’utilisateur sans le mot de passe
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur introuvable",
      });
    }

    // Injecter les infos dans req
    req.user = user;
    req.id = user._id; // pour updateProfile

    next();
  } catch (error) {
    console.error("❌ Auth error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Token invalide ou expiré",
    });
  }
};
