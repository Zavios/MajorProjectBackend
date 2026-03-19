import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./authentication/authRoute.js";
import chatRouter from "./chats/chatRoute.js";
import doctorRouter from "./doctors/doctorRoute.js";
import morgan from "morgan";
dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://yourdomain.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
  }),
);

app.use(express.json());

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/doctor", doctorRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
