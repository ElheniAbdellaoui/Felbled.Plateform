import express from "express";
import {
  getAllUsers,
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";
const app = express();

const router = express.Router();

// Tous → s'inscrire, se connecter, se déconnecter
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// Authentifié → mise à jour du profil
app.get("/profile", isAuthenticated, (req, res) => {
  console.log(req.user.id); // Ici ça fonctionne
  res.json({ userId: req.user.id });
});
router.put("/profile/update", isAuthenticated, singleUpload, updateProfile);
router.get("/all-users", getAllUsers);

export default router;
