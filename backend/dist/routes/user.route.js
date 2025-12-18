"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
// User endpoints - cần authentication và role USER hoặc ADMIN
router.get("/me", auth_1.requireAuth, auth_1.requireUser, user_controller_1.me);
exports.default = router;
