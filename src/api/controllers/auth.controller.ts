import type { Request, Response } from "express";
import authService from "../services/auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { HTTP_STATUS } from "../../utils/httpStatus";
import { signToken } from "../../utils/jwt";

export const signup = async (req: Request, res: Response) => {
    const user = await authService.createUser(req.body)

    if (!user) {
        sendResponse(res, { success: false, message: "Failed to create user" }, HTTP_STATUS.BAD_REQUEST)
        return;
    }
    sendResponse(res, { success: true, message: "User created successfully", data: user }, HTTP_STATUS.CREATED)

}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await authService.validateUser(email, password);

    if (!user) {
        sendResponse(res, { success: false, message: "Invalid Email or User" }, HTTP_STATUS.UNAUTHORIZED)
        return;
    }

    const { accesstoken, refreshtoken } = signToken(user);

    const result = {
        user: user,
        accesstoken,
        refreshtoken
    }

    return sendResponse(res, { success: true, message: "User login Successfull", data: result }, HTTP_STATUS.OK)


}