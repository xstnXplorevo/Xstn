import express from "express";
import { globalRateLimit } from "./middleware/rateLimit.middleware.js";
import errorHandler from "./middleware/errorHandler.js";
import router from "./routes/userRouter.js";

const app = express();

//middleware
app.use(express.json());
app.use(globalRateLimit);

//routes
app.use("/api/v1/user", router);

//errorHandler
app.use(errorHandler);

export default app;
