import express from "express";
import {
  createCourse,
  getCourses,
  getCourse,
  deleteCourse,
} from "../controllers/course.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();
router.post("/", isAuthenticated, authorizeRoles("professeur"), createCourse);
router.get("/", getCourses);
router.get("/:id", getCourse);
router.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin", "professeur"),
  deleteCourse
);

export default router;
