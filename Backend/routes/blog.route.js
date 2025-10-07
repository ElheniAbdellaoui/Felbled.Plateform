import express from "express";

import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";
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
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, createBlog, authorizeRoles("admin", "professeur"));
router
  .route("/:blogId")
  .put(
    isAuthenticated,
    singleUpload,
    updateBlog,
    authorizeRoles("admin", "professeur")
  );
router.route("/get-own-blogs").get(isAuthenticated, getOwnBlogs);
router
  .route("/delete/:id")
  .delete(isAuthenticated, deleteBlog, authorizeRoles("admin", "professeur"));
router.get("/:id/like", isAuthenticated, likeBlog);
router.get("/:id/dislike", isAuthenticated, dislikeBlog);
router.get("/my-blogs/likes", isAuthenticated, getMyTotalBlogLikes);
router.route("/:blogId").patch(togglePublishBlog);
router.route("/get-all-blogs").get(getAllBlogs);
router
  .route("/get-published-blogs")
  .get(
    getPublishedBlog,
    isAuthenticated,
    authorizeRoles("admin", "professeur")
  );

export default router;
