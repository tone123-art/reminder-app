import { Router } from "express";
import { pool } from "../db.js";
import { requireUser } from "./middleware/auth.js"


const router = Router();


router.get('/appointments', requireUser, async(req,res)=>{
    const user_id = Number(req.user!.id);
    if (!Number.isFinite(user_id)) {
     return res.status(401).json({ error: "Invalid user id" });
}


try {
    const result = await pool.query("SELECT * FROM appointments WHERE user_id=$1 ORDER BY id ASC;", [user_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database query failed" });
  }
});


router.post('/appointments', requireUser, async(req, res)=> {

    const { title, start_at, end_at} =req.body;
    const user_id = Number(req.user!.id);
    if (!Number.isFinite(user_id)) {
     return res.status(401).json({ error: "Invalid user id" });
        }

    if (typeof title !== "string" || title.trim() === "") {
             return res.status(400).json({ error: "Missing title" });
        }
    if (typeof start_at !== "string" || start_at.trim() === "") {
             return res.status(400).json({ error: "Missing start_at" });
        }
    const endAt =
        typeof end_at === "string" && end_at.trim() !== "" ? end_at : null;

      try {
    const result = await pool.query(
      `INSERT INTO appointments (title, start_at, end_at, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, start_at, endAt, user_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

router.patch("/appointments/:id", requireUser, async(req,res)=>{

  const {id} = req.params;

  
  const {  title, start_at, end_at} = req.body;
  const user_id = Number(req.user!.id);
   
  if (!Number.isFinite(user_id)) {
     return res.status(400).json({ error: "Invalid user id" });
        }

 if (typeof title !== "string" || title.trim() === "") {
             return res.status(400).json({ error: "Missing title" });
        }
    if (typeof start_at !== "string" || start_at.trim() === "") {
             return res.status(400).json({ error: "Missing start_at" });
        }
    const endAt =
        typeof end_at === "string" && end_at.trim() !== "" ? end_at : null;

  
    try {
        const result = await pool.query(
      `UPDATE appointments
       SET title = $1,
          start_at = $2,
          end_at = $3
       WHERE id = $4 AND user_id=$5
       RETURNING *`,
      [title, start_at, endAt, id , user_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json({ message: "Appointment editet" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }

})



router.delete("/appointments/:id", requireUser, async (req, res) => {

    const {id} = req.params;
    const user_id = Number(req.user!.id);
    if (!Number.isFinite(user_id)) {
     return res.status(401).json({ error: "Invalid user id" });
        }

  try {
    const result = await pool.query("DELETE FROM appointments WHERE id = $1 AND user_id=$2", [id, user_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json({ message: "Appointment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
    




export default router;