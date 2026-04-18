import cors from "cors";
import express from "express";
import bcrypt from "bcryptjs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.AUTH_PORT || 3001);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const USERS_FILE_PATH = path.join(__dirname, "data", "users.json");

const app = express();

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

const normalizeEmail = (email = "") => String(email).trim().toLowerCase();

const toPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

const readUsers = async () => {
  try {
    const raw = await fs.readFile(USERS_FILE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveUsers = async (users) => {
  await fs.writeFile(USERS_FILE_PATH, JSON.stringify(users, null, 2), "utf8");
};

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "auth-api" });
});

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Nom, correu i contrasenya son obligatoris." });
  }

  if (String(password).length < 6) {
    return res.status(400).json({ error: "La contrasenya ha de tenir almenys 6 caracters." });
  }

  const normalizedEmail = normalizeEmail(email);
  const users = await readUsers();

  if (users.some((user) => user.email === normalizedEmail)) {
    return res.status(409).json({ error: "Aquest correu ja esta registrat." });
  }

  const passwordHash = await bcrypt.hash(String(password), 10);
  const user = {
    id: Date.now(),
    name: String(name).trim(),
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await saveUsers(users);

  return res.status(201).json({ user: toPublicUser(user) });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Correu i contrasenya son obligatoris." });
  }

  const normalizedEmail = normalizeEmail(email);
  const users = await readUsers();
  const user = users.find((item) => item.email === normalizedEmail);

  if (!user) {
    return res.status(401).json({ error: "Credencials incorrectes." });
  }

  const passwordMatches = await bcrypt.compare(String(password), user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ error: "Credencials incorrectes." });
  }

  return res.json({ user: toPublicUser(user) });
});

app.post("/api/auth/logout", (_req, res) => {
  return res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Auth API running on http://localhost:${PORT}`);
  console.log(`CORS origin: ${FRONTEND_ORIGIN}`);
});
