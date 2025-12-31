import { Router } from "express";
import { pool } from "../../src/db.js";

const router = Router();

    console.log('hhh');

// get users

router.get("/users", async(req, res)=>{
    console.log('GGG');
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id ASC;");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database query failed" });
  }
});


export default router;