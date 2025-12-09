import { Router } from "express";
import {
  login,
  register,
  refresh,
  logout,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { requireAuth, requireUser } from "../middlewares/auth";
import { me } from "../controllers/user.controller";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

// NEW:
router.get("/me", requireAuth, requireUser, me);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
