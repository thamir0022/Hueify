import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const port = 3000;

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});

mongoose
  .connect(
    process.env.MONGO
  )
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((err) => {
    console.log("MongoDB  Error",err.message);
});

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);