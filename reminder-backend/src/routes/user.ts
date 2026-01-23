import { Router } from "express";
import { pool } from "../db.js";
import { requireUser } from "./middleware/auth.js"

const router = Router();

// Get Users
router.get("/",  async(req, res)=>{  
  try {
     const result = await pool.query(
    "SELECT id, email, username, role, created_at FROM users ORDER BY id ASC;"
  );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database query failed" });
  }
});

// Accept new Users
router.post("/accept", requireUser, async (req, res) => {
  if (req.user!.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  const { userId } = req.body;

  await pool.query(
    "UPDATE users SET role = 'user' WHERE id = $1 AND role = 'applicant'",
    [userId]
  );

  res.json({ ok: true });
});

// Delete Users
router.delete("/delete" , requireUser, async (req, res)=> {
   if (req.user!.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

    const { userId } = req.body;

    try {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }

})



export default router;