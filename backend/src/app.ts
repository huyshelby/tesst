import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import "express-async-errors";
import cookieParser from "cookie-parser";
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

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api", routes);

app.use(errorHandler);

export default app;
