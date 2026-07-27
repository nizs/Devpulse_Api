
import express from "express";
import logger from "./middleware/logger";
import globalErrorHandler from "./middleware/globalErrorHandler";
import authRoutes from "./api/routes/auth.route";

const app: express.Application = express();

app.use(logger);
app.use(express.json());

app.get("/", (req: express.Request, res: express.Response) => {
    throw new Error("This is a test error");
    res.send("Hello, World!")
})

app.use("/auth", authRoutes);
app.use(globalErrorHandler);

export default app;