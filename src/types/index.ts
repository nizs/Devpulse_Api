import type { ErrorRequestHandler, Response } from "express";

export type TResponse<T> = {
    success: boolean;
    message: string;
    data?: T;
}

export type TSendResponse = <T> (
    res: Response,
    statusCode: number,
    payload: TResponse<T>

) => Response;

export type TGlobalErrorHandler = ErrorRequestHandler;