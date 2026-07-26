
import type { TSendResponse } from "../types";

const sendResponse: TSendResponse = (res, statusCode, payload) => {
    return res.status(statusCode).json(payload);
}

export default sendResponse;