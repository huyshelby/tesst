import { Router } from "express";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/password.controller";
import { validate } from "../middlewares/validate";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schemas/password.schema";

const router = Router();

// POST /password/forgot - Gửi yêu cầu reset password
router.post("/forgot", validate(forgotPasswordSchema), forgotPassword);

// POST /password/reset - Reset password với token
router.post("/reset", validate(resetPasswordSchema), resetPassword);

export default router;

