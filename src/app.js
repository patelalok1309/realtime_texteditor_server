import express from "express";
import cors from "cors";
import documentRoutes from "./routes/document.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/document", documentRoutes);
app.use("/api/v1/user", authRoutes);

export { app };
