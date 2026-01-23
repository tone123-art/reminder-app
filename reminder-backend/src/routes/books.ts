import { Router } from "express";
import { pool } from "../db.js";
import { requireUser } from "./middleware/auth.js"


const router = Router();

// Get Books
router.get("/", requireUser, async(req, res)=>{
  const user_id = req.user!.id;
  try {
    const result = await pool.query("SELECT * FROM books WHERE user_id=$1 ORDER BY book_id ASC",[user_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database query failed" });
  }
});


//Post Books
router.post("/addBook", requireUser, async(req,res)=>{

  const {name, author, category ,  notes} = req.body;
  const user_id = Number(req.user!.id);

   if (!name || !category) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const cleanNotes = typeof notes === "string" && notes.trim() === "" ? null : notes ?? null;

  try {
    const result = await pool.query(
      `INSERT INTO books (name, author, category, notes, user_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, author, category, cleanNotes, user_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// Update Book
router.patch("/update", requireUser, async(req,res)=>{
  const { book_id, name , author, category, notes} = req.body;
  const user_id = Number(req.user!.id);

const cleanNotes = typeof notes === "string" && notes.trim() === "" ? null : notes ?? null;


  try {
    const result = await pool.query(
      `UPDATE books
       SET name = $1,
           author = $2,
           category=$3,
           notes = $4
       WHERE book_id = $5 AND user_id=$6
       RETURNING *`,
       [name, author, category, cleanNotes, book_id, user_id]
    );
    if (result.rowCount === 0) {
        return res.status(404).json({ error: "Book not found" });
    }
    res.json({ message: "Book updatet" });
  } catch (err: any) {
  console.error("UPDATE /books error:", err?.message, err);
  res.status(500).json({
    error: "Server error",
    detail: err?.message,
    code: err?.code, });
  }
})

// Delete Book
router.delete("/:book_id", requireUser, async (req, res) => {
   
  const {book_id} = req.params;
  const user_id = req.user!.id;
  try {
    const result = await pool.query("DELETE FROM books WHERE book_id = $1 AND user_id=$2", [book_id, user_id]);
  if (result.rowCount === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
  res.json({ message: "Book deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;

