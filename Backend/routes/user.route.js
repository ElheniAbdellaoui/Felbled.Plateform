import express from "express";
import {
  forgotPassword,
  getAllUsers,
  login,
  logout,
  register,
  resetPassword,
  updateProfile,
  verifyEmail,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import singleUpload from "../middleware/multer.js";

const router = express.Router();

// Tous → s'inscrire, se connecter, se déconnecter
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// Authentifié → mise à jour du profil
router.put("/profile/update", isAuthenticated, singleUpload, updateProfile);
router.get("/all-users", getAllUsers);
// Route pour vérifier l'email (SANS authentification)
router.get("/verify-email/:token", verifyEmail);

// Route pour mot de passe oublié
router.post("/forgot-password", forgotPassword);

// Route pour réinitialiser le mot de passe
router.put("/reset-password/:token", resetPassword);
export default router;
