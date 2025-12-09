import { Router } from "express";
import { requireAuth, requireUser } from "../middlewares/auth";
import { me } from "../controllers/user.controller";

const router = Router();

// User endpoints - cần authentication và role USER hoặc ADMIN
router.get("/me", requireAuth, requireUser, me);

export default router;
