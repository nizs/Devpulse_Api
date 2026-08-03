import type { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../utils/httpStatus";
import { sendResponse } from "../utils/sendResponse";
import { verifyToken } from "../utils/jwt";

export const auth = (...roles: ("contributor" | "maintainer")[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;

        if (!token) {
            return sendResponse(
                res,
                {
                    success: false,
                    message: "Unauthorized, Token not found"
                },
                HTTP_STATUS.UNAUTHORIZED

            )
        }

        const payload = verifyToken(token, "access");

        if (!payload) {
            return sendResponse(
                res,
                {
                    success: false,
                    message: "Unauthorized, Invalid Token"
                },
                HTTP_STATUS.UNAUTHORIZED
            )
        }

        if (roles.length && !roles.includes(payload.role)) {
            return sendResponse(
                res,
                {
                    success: false,
                    message: "Forbidden Access"
                },
                HTTP_STATUS.FORBIDDEN
            )
        }
        req.user = payload;
        next();
    }
}