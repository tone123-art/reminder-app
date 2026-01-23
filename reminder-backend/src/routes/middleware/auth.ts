import type { Request, Response, NextFunction } from "express";
import { pool } from "../../db.js";

export type AuthedUser = {
  id: string;
  email: string;
  role: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthedUser;
    }
  }
}

export async function requireUser(req: Request, res: Response, next: NextFunction) {
  try {
        console.log("requireUser HIT:", req.method, req.originalUrl);
    console.log("cookies:", req.cookies);

    const sessionId = req.cookies?.session;
    if (!sessionId) return res.status(401).json({ error: "Not authenticated" });

    const result = await pool.query(
      `
      SELECT users.id, users.email, users.role
      FROM sessions
      JOIN users ON users.id = sessions.user_id
      WHERE sessions.session_id = $1
        AND sessions.expires_at > now()
      `,
      [sessionId]
    );


    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    req.user = result.rows[0];
    return next();
  } catch (err) {
    console.error("requireUser error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  return next();
}