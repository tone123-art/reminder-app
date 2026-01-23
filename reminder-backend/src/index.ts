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


const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5200";

const app = express();
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));




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


const port = Number(process.env.PORT) || 4500;
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});