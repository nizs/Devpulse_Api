import type { Request, Response } from "express";
import authService from "../services/auth.service";
import { sendResponse } from "../../utils/sendResponse";

export const signup = async (req: Request, res: Response) => {
    const user = await authService.createUser(req.body)

    if (!user) {
        sendResponse(res, { success: false, message: "Failed to create user" }, 400)
        return;
    }
    sendResponse(res, { success: true, message: "User created successfully", data: user }, 201)

}