import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import {
  createComment,
  deleteComment,
  editComment,
  getAllCommentsOnMyBlogs,
  getCommentsOfPost,
  likeComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

// ✅ User & Professeur peuvent commenter
router.post(
  "/:id/create",
  isAuthenticated,
  authorizeRoles("user", "professeur"),
  createComment
);

// ✅ Admin peut supprimer n’importe quel commentaire
router.delete(
  "/:id/delete",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteComment
);

// ✅ User & Professeur peuvent éditer leur propre commentaire
router.put(
  "/:id/edit",
  isAuthenticated,
  authorizeRoles("user", "professeur"),
  editComment
);

// ✅ Tous (même sans login) peuvent consulter les commentaires
router.get("/:id/comment/all", getCommentsOfPost);

// ✅ User & Professeur peuvent liker
router.get(
  "/:id/like",
  isAuthenticated,
  authorizeRoles("user", "professeur"),
  likeComment
);

// ✅ Professeur voit tous les commentaires sur ses blogs
router.get(
  "/my-blogs/comments",
  isAuthenticated,
  authorizeRoles("professeur"),
  getAllCommentsOnMyBlogs
);

export default router;
