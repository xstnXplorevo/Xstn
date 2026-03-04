import express from "express";
import { globalRateLimit } from "./middleware/rateLimit.middleware.js";
import errorHandler from "./middleware/errorHandler.js";
import router from "./routes/userRouter.js";
import cors from "cors";

const app = express();

//middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["POST", "PUT", "GET", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(globalRateLimit);

//routes
app.use("/api/v1/user", router);

//errorHandler
app.use(errorHandler);

export default app;
