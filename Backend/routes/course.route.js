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
router.post(
  "/course",
  isAuthenticated,
  authorizeRoles("professeur"),
  createCourse
);
router.get("/courses", getCourses);
router.get("/course/:id", getCourse);
router.delete(
  "/course/:id",
  isAuthenticated,
  authorizeRoles("admin", "professeur"),
  deleteCourse
);

export default router;
