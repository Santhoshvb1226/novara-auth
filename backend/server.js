import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const frontendDist = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../frontend/dist",
);

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in the environment.");
}

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.static(frontendDist));

// Mock "database": the password is stored hashed, like a real app
const users = [
  {
    id: 1,
    name: "Sandy",
    email: "demo@novara.app",
    passwordHash: bcrypt.hashSync("Demo@1234", 10),
  },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Max 10 login attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again in 15 minutes." },
});

// Middleware: checks the Bearer token
function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Not authenticated." });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Session expired. Please sign in again." });
  }
}

app.post("/api/login", loginLimiter, async (req, res) => {
  const { email, password, remember } = req.body || {};

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required." });
  if (!emailRegex.test(email))
    return res.status(400).json({ message: "Please enter a valid email address." });

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  const valid = user && (await bcrypt.compare(password, user.passwordHash));

  // Same message for both cases, so attackers can't tell which part was wrong
  if (!valid) return res.status(401).json({ message: "Invalid email or password." });

  const token = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: remember ? "7d" : "1h",
  });

  res.json({
    message: "Login successful",
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// Protected route used by the dashboard
app.get("/api/me", auth, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: "User not found." });
  res.json({ id: user.id, name: user.name, email: user.email });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/{*path}", (req, res, next) => {
  if (req.path === "/api" || req.path.startsWith("/api/")) {
    return res.status(404).json({ message: "Not found." });
  }
  res.sendFile(path.join(frontendDist, "index.html"), (error) => {
    if (error) next(error);
  });
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));