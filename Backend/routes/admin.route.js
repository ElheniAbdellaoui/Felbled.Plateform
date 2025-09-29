import express from "express";
import { getStats } from "../controllers/admin.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();
router.get("/stats", isAuthenticated, getStats);
export default router;
