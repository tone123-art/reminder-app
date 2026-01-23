import { Router } from "express";
import { pool } from "../db.js";
import { requireUser } from "./middleware/auth.js"


const router = Router();

// Get Shopping Items
router.get("/items", requireUser, async(req, res)=>{
  const user_id = req.user!.id;
  try {
    const result = await pool.query("SELECT * FROM shopping_list WHERE user_id=$1 ORDER BY item_id ASC",[user_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database query failed" });
  }
});


//Post Shopping Item
router.post("/addItem", requireUser, async(req,res)=>{

  const {name, quantity , store_type, notes} = req.body;
  const user_id = Number(req.user!.id);

   if (!name || !store_type) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const qty = quantity == null || quantity === "" ? 1 : Number(quantity);
    if (!Number.isFinite(qty) || qty < 1) {
        return res.status(400).json({ error: "Invalid quantity" });
  }
  const cleanNotes = typeof notes === "string" && notes.trim() === "" ? null : notes ?? null;

  try {
    const result = await pool.query(
      `INSERT INTO shopping_list (name, quantity, store_type, notes, user_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, qty, store_type, cleanNotes, user_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// Update Item on Shpping list
router.patch("/items/update", requireUser, async(req,res)=>{
  const { item_id, name , quantity, notes} = req.body;
  const user_id = req.user!.id;

  try {
    const result = await pool.query(
      `UPDATE shopping_list
       SET name = $1,
           quantity = $2,
           notes = $3
       WHERE item_id = $4 AND user_id=$5
       RETURNING *`,
       [name, quantity, notes, item_id, user_id]
    );
    if (result.rowCount === 0) {
        return res.status(404).json({ error: "Item not found" });
    }
    res.json({ message: "Item updatet" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
})

// Delete Shopping Item
router.delete("/items/:item_id", requireUser, async (req, res) => {
   
  const {item_id} = req.params;
  const user_id = req.user!.id;
  try {
    const result = await pool.query("DELETE FROM shopping_list WHERE item_id = $1 AND user_id=$2", [item_id, user_id]);
  if (result.rowCount === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
  res.json({ message: "Item deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;

