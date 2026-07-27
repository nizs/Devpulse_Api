
import type { TSendResponse } from "../types";

export const sendResponse: TSendResponse = (res, payload, statusCode) => {
    return res.status(statusCode).json(payload);
}