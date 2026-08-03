
import type { ErrorRequestHandler, Response } from "express";

export type TResponse<T> = {
    success: boolean;
    message: string;
    data?: T;
}

export type TSendResponse = <T> (
    res: Response,
    payload: TResponse<T>,
    statusCode: number,

) => Response;

export type TGlobalErrorHandler = ErrorRequestHandler;


export const role = [
    "contributor",
    "maintainer"
] as const


type Role = typeof role[number];


export type TUser = {
    id: number;
    name: string;
    email: string;
    h_password: string;
    role: Role;
    created_at: Date;
    updated_at: Date;
}

export type RUser = Omit<TUser, "id" | "h_password" | "created_at" | "updated_at">

export type SafeUser = Omit<TUser, "h_password">;

export type TokenPayload = {
    id: number;
    name: string;
    role: Role;
};




export type TIssue = {
    id: number;
    title: string;
    description: string;
    type: IssueType;
    status: IssueStatus;
    reporter_id: number;
    created_at: Date;
    updated_at: Date;
}

export type RIssue = Omit<TIssue, "id" | "status" | "reporter_id" | "created_at" | "updated_at">;


export type IssueType = "bug" | "feature_request";
export type IssueStatus = "open" | "in_progress" | "resolved";


import type { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user: JwtPayload
        }
    }
}

export type GetIssueQuery = {
    sort?: "newest" | "oldest";
    type?: IssueType;
    status?: IssueStatus;
}

export type Reporter = {
    id: number;
    name: string;
    role: Role;
}

export type IssueResponse = Omit<TIssue, "reporter_id"> & {
    reporter: Reporter;
}
