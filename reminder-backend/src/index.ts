import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import taskRouter from "./routes/task.js";
import authRouter from "./routes/auth.js";
import calendarRouter from "./routes/calendar.js"
import userRouter from "./routes/user.js"
import shoppingRouter from "./routes/shopping.js"
import moviesRouter from "./routes/movies.js"
import booksRouter from "./routes/books.js"



const app = express();

app.set("trust proxy", 1);

const allowedOrigins = new Set([
  "https://app.reminderapp.org",
  // Optional: keep old Vercel domain during migration/debug
  "https://reminder-app-eight-mauve.vercel.app",
]);



app.use(
  cors({
    origin: (origin, cb) => {
      // SSR / curl / server-to-server often has no Origin header
      if (!origin) return cb(null, true);

      if (allowedOrigins.has(origin)) return cb(null, true);

      console.log("CORS blocked origin:", origin);
      return cb(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// handles preflight in Express 5
app.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});




app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/shopping", shoppingRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/books", booksRouter);
app.use("/api/calendar", calendarRouter);


app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});


const port = Number(process.env.PORT) || 4500;
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});