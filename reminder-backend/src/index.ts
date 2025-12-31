import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import reminderRouter from "./routes/reminder.js";


dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5200",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/reminder", reminderRouter);


app.get("/api/reminder", (_req, res) => {
  res.json({ ok: true });
});

const port = Number(process.env.PORT) || 4500;
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});