import { Router } from "express";
import auth from "./auth.route";
import admin from "./admin.route";
import product from "./product.route";
import category from "./category.route";
import cart from "./cart.route";
import order from "./order.route";
import user from "./user.route";
import dashboard from "./dashboard.route";

const r = Router();

r.use("/auth", auth);
r.use("/categories", category);
r.use("/products", product);
r.use("/cart", cart);
r.use("/orders", order);
r.use("/users", user);
r.use("/dashboard", dashboard); // Must be before /admin
r.use("/admin", admin);

r.get("/health", (req, res) => res.json({ status: "ok" }));
r.get("/", (req, res) => res.json({ message: "Welcome to E-Commerce API" }));

export default r;
