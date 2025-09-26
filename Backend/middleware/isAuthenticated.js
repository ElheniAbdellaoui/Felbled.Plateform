import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    let token;

    // Vérifier d'abord le header Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // Sinon vérifier les cookies
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);

    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    // ✅ Utilisez decode.id au lieu de decode.userId
    const user = await User.findById(decode.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }

    req.id = decode.id; // ✅ Changez aussi ici
    req.user = user;
    next();
  } catch (error) {
    console.log("Auth error:", error);
    return res.status(401).json({
      message: "Invalid token",
      success: false,
    });
  }
};
