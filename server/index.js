import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import socialRoutes from "./routes/socialRoutes.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || origin === FRONTEND_ORIGIN) {
        return callback(null, true);
      }
      return callback(new Error("CORS blocked: origin not allowed"));
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "social-backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/social", socialRoutes);

app.use((err, _req, res, _next) => {
  if (err?.message?.startsWith("CORS blocked")) {
    return res.status(403).json({ error: "Origin not allowed by CORS." });
  }
  return res.status(500).json({ error: "Internal server error." });
});

const startServer = async () => {
  try {
    try {
      await connectDB();
    } catch (mongoError) {
      console.warn("MongoDB connection skipped:", mongoError.message);
      console.warn("Running with temporary in-memory posts data.");
    }

    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
      console.log(`CORS origin: ${FRONTEND_ORIGIN}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
  }
};

startServer();
