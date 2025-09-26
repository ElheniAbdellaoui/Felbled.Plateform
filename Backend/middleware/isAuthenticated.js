import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Vérifier le header Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // 2️⃣ Vérifier les cookies si pas de header
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // ⚠️ Pas de token
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    // Vérifier le token
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decode.id || decode.userId; // fallback si tu changes la clé

    // Vérifier que l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }

    // ✅ Ajouter info à la requête
    req.id = userId;
    req.user = user;
    next();
  } catch (error) {
    console.log("Auth error:", error.message);
    return res.status(401).json({
      message: "Invalid token",
      success: false,
    });
  }
};
