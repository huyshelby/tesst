import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import "express-async-errors";
import cookieParser from "cookie-parser";
import path from "path";
import routes from "./routes/index.route";
import { errorHandler } from "./middlewares/error";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // Phone App + Admin Dashboard
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(compression());
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 60_000, max: 100 }));

// Allow cross-origin embedding of resources (for images)
const corsp = (_req: any, res: any, next: any) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
};

// Static files with aggressive caching
const staticOptions = {
  maxAge: "1y", // Cache for 1 year
  etag: true,
  lastModified: true,
  setHeaders: (res: any, filepath: string) => {
    // Cache images aggressively
    if (filepath.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    }
  },
};

// Serve uploaded files statically
app.use("/uploads", corsp, express.static(path.join(__dirname, "../uploads"), staticOptions));
// Serve product images statically
app.use(
  "/pictures",
  corsp,
  express.static(path.join(__dirname, "../public/pictures"), staticOptions)
);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api", routes);

app.use(errorHandler);

export default app;
