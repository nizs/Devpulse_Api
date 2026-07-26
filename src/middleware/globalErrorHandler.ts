import config from "../config";
import type { TGlobalErrorHandler } from "../types";

const globalErrorHandler: TGlobalErrorHandler = (err, req, res, next) => {
    res.status(500).json({
        success: false,
        mesage: err instanceof Error ? err.message : "Internal Server Error",
        stack: config.node_env === "development" && err instanceof Error ? err.stack : undefined
    })
}

export default globalErrorHandler;