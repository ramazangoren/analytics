import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import userRoutes from "./routes/user.route.js";
import bookRoutes from "./routes/book.route.js";
import borrowRoutes from "./routes/borrow.route.js";
import { connectSQLServer } from "./database/connectSQLServer.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

app.listen(PORT, async () => {
  try {
    console.log(`Server is running on http://localhost:${PORT}`);
    await connectSQLServer();
  } catch (error) {
    console.error("Failed to start the server:", error.message);
  }
});
