import express from "express";
import {
  createBlog,
  deleteBlog,
  dislikeBlog,
  getAllBlogs,
  getMyTotalBlogLikes,
  getOwnBlogs,
  getPublishedBlog,
  likeBlog,
  togglePublishBlog,
  updateBlog,
} from "../controllers/blog.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

// Professeur → créer ou mettre à jour un blog pédagogique
router.post("/", isAuthenticated, authorizeRoles("professeur"), createBlog);
router.put(
  "/:blogId",
  isAuthenticated,
  authorizeRoles("professeur"),
  singleUpload,
  updateBlog
);

// Admin → supprimer un blog
router.delete(
  "/delete/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteBlog
);

// User → liker, commenter
router.get(
  "/:id/like",
  isAuthenticated,
  authorizeRoles("user", "professeur", "admin"),
  likeBlog
);
router.get(
  "/:id/dislike",
  isAuthenticated,
  authorizeRoles("user", "professeur", "admin"),
  dislikeBlog
);

router.get("/get-all-blogs", getAllBlogs);
router.get("/get-published-blogs", getPublishedBlog);

export default router;
