import { Router } from "express";
import { pool } from "../db.js";
import argon2 from "argon2";
import crypto from "crypto";


const router = Router();

const COOKIE_NAME = "session";

const cookieOptions = {
  httpOnly: true,
  secure: true,              
  sameSite: "lax" as const,
  domain: ".reminderapp.org",
  path: "/",
  maxAge: 1000 * 60 * 60 * 24 * 14,
};


// login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // 1. Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  // 2. Load user
  const userResult = await pool.query(
    "SELECT id, password_hash, role FROM users WHERE email = $1",
    [email.toLowerCase()]
  );

  if (userResult.rowCount === 0) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const user = userResult.rows[0];

  // 3. Verify password
  const ok = await argon2.verify(user.password_hash, password);
  if (!ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // 4. Create session
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);

  await pool.query(
    "INSERT INTO sessions (session_id, user_id, expires_at) VALUES ($1, $2, $3)",
    [sessionId, user.id, expiresAt]
  );

  // 5. Set cookie
res.cookie(COOKIE_NAME, sessionId, cookieOptions);

  return res.json({ ok: true });
});

// Check if logged in
router.get("/me", async (req, res) => {
  const sessionId = req.cookies.session;
  if (!sessionId) return res.status(401).json({});

  const result = await pool.query(
    `
    SELECT users.id, users.username, users.email, users.role
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.session_id = $1
      AND sessions.expires_at > now()
    `,
    [sessionId]
  );

  if (result.rowCount === 0) {
    return res.status(401).json({});
  }

  return res.json({ user: result.rows[0] });
});


// logout
router.post("/logout", async (req, res) => {
  const sessionId = req.cookies.session;
  if (sessionId) {
    await pool.query("DELETE FROM sessions WHERE session_id = $1", [sessionId]);
  }

res.clearCookie(COOKIE_NAME, { domain: ".reminderapp.org", path: "/" });



  res.json({ ok: true });
});



// new user:
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const cleanEmail = String(email).trim().toLowerCase();

  // Optional: basic password length check
  if (String(password).length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  try {
    // Check if email already exists
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [cleanEmail]);
    if (existing.rowCount && existing.rowCount > 0) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Hash password
    const passwordHash = await argon2.hash(password);

    // Create user (default role 'user' comes from DB default)
    const created = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, role, username`,
      [String(name).trim(), cleanEmail, passwordHash]
    );

    const user = created.rows[0];

    // Auto-login: create session + cookie
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);

    await pool.query(
      "INSERT INTO sessions (session_id, user_id, expires_at) VALUES ($1, $2, $3)",
      [sessionId, user.id, expiresAt]
    );

   res.cookie(COOKIE_NAME, sessionId, cookieOptions);


    return res.status(201).json({ ok: true, user });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});






export default router;