
import express from "express";
import logger from "./middleware/logger";
import globalErrorHandler from "./middleware/globalErrorHandler";
import authRoutes from "./api/routes/auth.route";
import { notFound } from "./middleware/notFound";

const app: express.Application = express();

app.use(logger);
app.use(express.json());

app.get("/", (req: express.Request, res: express.Response) => {
    throw new Error("This is a test error");
    res.send("Hello, World!")
})

app.use("/api/auth", authRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;