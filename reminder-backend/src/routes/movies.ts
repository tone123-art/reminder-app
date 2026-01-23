import { Router } from "express";
import { pool } from "../db.js";
import { requireUser } from "./middleware/auth.js"


const router = Router();

// Get Movies
router.get("/", requireUser, async(req, res)=>{
  const user_id = req.user!.id;
  try {
    const result = await pool.query("SELECT * FROM movies WHERE user_id=$1 ORDER BY movie_id ASC",[user_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database query failed" });
  }
});


//Post Movies
router.post("/addMovie", requireUser, async(req,res)=>{

  const {name, availability ,  notes} = req.body;
  const user_id = Number(req.user!.id);

   if (!name || !availability) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const cleanNotes = typeof notes === "string" && notes.trim() === "" ? null : notes ?? null;

  try {
    const result = await pool.query(
      `INSERT INTO movies (name, availability, notes, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, availability, cleanNotes, user_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// Update Movie
router.patch("/update", requireUser, async(req,res)=>{
  const { movie_id, name , availability, notes} = req.body;
  const user_id = req.user!.id;

  try {
    const result = await pool.query(
      `UPDATE movies
       SET name = $1,
           availability = $2,
           notes = $3
       WHERE movie_id = $4 AND user_id=$5
       RETURNING *`,
       [name, availability, notes, movie_id, user_id]
    );
    if (result.rowCount === 0) {
        return res.status(404).json({ error: "Movie not found" });
    }
    res.json({ message: "Movie updatet" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
})

// Delete Movie
router.delete("/:movie_id", requireUser, async (req, res) => {
   
  const {movie_id} = req.params;
  const user_id = req.user!.id;
  try {
    const result = await pool.query("DELETE FROM movies WHERE movie_id = $1 AND user_id=$2", [movie_id, user_id]);
  if (result.rowCount === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }
  res.json({ message: "Movie deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;

