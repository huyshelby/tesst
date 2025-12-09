import { Router } from "express";
import auth from "./auth.route";
import admin from "./admin.route";

const r = Router();

r.use("/auth", auth);
r.get("/health", (req, res) => res.json({ status: "ok" }));
r.get("/", (req, res) => res.json({ message: "Welcome to the API" }));
r.use("/admin", admin);
// Các route khác có thể được thêm vào đây
// Ví dụ: r.get("/orders", requireAuth, ...)

export default r;
