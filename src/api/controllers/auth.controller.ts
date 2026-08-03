
import type { Request, Response } from "express";
import authService from "../services/auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { HTTP_STATUS } from "../../utils/httpStatus";
import { signToken, verifyToken } from "../../utils/jwt";
import type { TokenPayload } from "../../types";

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

    const tokenPayload: TokenPayload = {
        id: user.id,
        name: user.name,
        role: user.role,
    };

    const { accesstoken, refreshtoken } = signToken(tokenPayload);

    res.cookie("refreshToken", refreshtoken, {
        sameSite: "lax",
        httpOnly: true,
        secure: false
    })

    const result = {
        Token: accesstoken,
        user
    }

    return sendResponse(res, { success: true, message: "User login Successfull", data: result }, HTTP_STATUS.OK)
}



export const refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        return sendResponse(res, { success: false, message: "Refresh Token not found" }, HTTP_STATUS.UNAUTHORIZED)
    }

    const payload = verifyToken(refreshToken, "refresh");
    if (!payload) {
        return sendResponse(res, { success: false, message: "Invalid Refresh Token" }, HTTP_STATUS.UNAUTHORIZED)
    }
    console.log(payload);

    const user = await authService.getUserById(payload.id.toString())
    if (!user) {
        return sendResponse(res, { success: false, message: "User not found " }, HTTP_STATUS.UNAUTHORIZED)
    }

    const tokenPayload: TokenPayload = {
        id: user.id,
        name: user.name,
        role: user.role,
    };

    const { accesstoken, refreshtoken: newRefreshToken } = signToken(tokenPayload);
    sendResponse(res, {
        success: true,
        message: "Token Refreshed",
        data: {
            accesstoken,
            newRefreshToken
        },
    }, HTTP_STATUS.OK)
}