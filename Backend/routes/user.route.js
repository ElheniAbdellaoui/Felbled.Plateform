import express from "express";
import {
  getAllUsers,
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

// Admin → gérer les utilisateurs
router.get("/all-users", isAuthenticated, authorizeRoles("admin"), getAllUsers);

// Tous → s'inscrire, se connecter, se déconnecter
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// Authentifié → mise à jour du profil
router.put("/profile/update", isAuthenticated, singleUpload, updateProfile);

export default router;
