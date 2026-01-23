import { Router } from "express";
import { pool } from "../db.js";
import { requireUser } from "./middleware/auth.js"

const router = Router();

// get tasks
router.get("/", requireUser, async(req, res)=>{
  const user_id = req.user!.id;
  try {
    const result = await pool.query("SELECT * FROM tasks WHERE user_id=$1 ORDER BY task_id ASC",[user_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database query failed" });
  }
});

//post task
router.post("/addTask", requireUser, async(req,res)=>{

  const {taskName, taskPriority , taskDeadline} = req.body;
  const user_id = req.user!.id;

   if (!taskName || !taskPriority) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO tasks (user_id, name, priority, deadline)
       VALUES ($1, $2, $3, $4::date)
       RETURNING *`,
      [user_id, taskName, taskPriority, taskDeadline]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Update Task in the Tasklist

router.patch("/update", requireUser, async(req,res)=>{
  const { task_id, name , priority, deadline} = req.body;
  const user_id = req.user!.id;

  const deadlineValue =
  typeof deadline === "string" && deadline.trim() !== "" ? deadline : null;

    try {
        const result = await pool.query(
      `UPDATE tasks
       SET name = $1,
          priority = $2,
          deadline = $3
       WHERE task_id = $4 AND user_id=$5
       RETURNING *`,
      [name, priority, deadlineValue, task_id, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task editet" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }

})


// Mark Task in the Tasklist as completed
router.patch("/completed", requireUser, async (req, res) => {
  const { task_id, completed } = req.body;
  const user_id = req.user!.id;

  const taskIdNum = Number(task_id);
  if (!Number.isFinite(taskIdNum)) {
    return res.status(400).json({ error: "Invalid task_id" });
  }

  if (completed !== "true" && completed !== "false") {
    return res.status(400).json({ error: "completed must be 'true' or 'false'" });
  }

  const completedBool = completed === "true";

  try {
    const result = await pool.query(
      `
      UPDATE tasks
      SET
        completed = $1,
        completed_at = CASE WHEN $1 THEN now() ELSE NULL END
      WHERE task_id = $2 AND user_id = $3
      RETURNING *
      `,
      [completedBool, taskIdNum, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// delete task
router.delete("/:task_id", requireUser, async (req, res) => {

    const {task_id} = req.params;
    const user_id = req.user!.id;

  try {
    const result = await pool.query("DELETE FROM tasks WHERE task_id = $1 AND user_id=$2", [task_id, user_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;