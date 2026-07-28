import type { Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import { HTTP_STATUS } from "../utils/httpStatus";

export const notFound = (req: Request, res: Response) => {
    sendResponse(
        res,
        {
            success: false,
            message: ` Route not found.`,
            data: null

        },
        HTTP_STATUS.NOT_FOUND
    )
}

