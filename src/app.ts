
import express from "express";
import logger from "./middleware/logger";
import globalErrorHandler from "./middleware/globalErrorHandler";
import authRoutes from "./api/routes/auth.route"
import issueRoutes from "./api/routes/issue.route";;
import { notFound } from "./middleware/notFound";
import cookieParser from "cookie-parser"

const app: express.Application = express();

app.use(logger);
app.use(cookieParser());
app.use(express.json());

app.get("/", (req: express.Request, res: express.Response) => {
    throw new Error("This is a test error");
    res.send("Hello, World!")
})

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;