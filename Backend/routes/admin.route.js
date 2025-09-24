import express from "express";
import { getStats } from "../controllers/admin.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();
router.get("/stats", isAuthenticated, authorizeRoles("admin"), getStats);
export default router;
