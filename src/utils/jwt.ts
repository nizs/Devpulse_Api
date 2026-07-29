
import config from "../config";
import type { RUser, TokenPayload } from "../types";
import jwt, { type JwtPayload } from "jsonwebtoken"



export const verifyToken = (token: string, type: "access" | "refresh") => {
    const secret = type === "access" ? config.access_secret : config.refresh_secret;
    const decode = jwt.verify(token, secret);
    return decode as JwtPayload & TokenPayload;
}

export const signToken = (payload: TokenPayload) => {
    const accesstoken = jwt.sign(payload, config.access_secret, { expiresIn: "1d" })
    const refreshtoken = jwt.sign(payload, config.refresh_secret, { expiresIn: "7d" })

    return { accesstoken, refreshtoken }
}

