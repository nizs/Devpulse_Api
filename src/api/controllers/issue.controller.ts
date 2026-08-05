import type { Request, Response } from "express";
import issueService from "../services/issue.service";
import { sendResponse } from "../../utils/sendResponse";
import { HTTP_STATUS } from "../../utils/httpStatus";
import type { TokenPayload } from "../../types";


export const createIssue = async (req: Request, res: Response) => {
    const reporterId = req.user?.id;

    const issue = await issueService.createIssue(req.body, reporterId);

    return sendResponse(
        res,
        {
            success: true,
            message: "Issue created successfully",
            data: issue
        },
        HTTP_STATUS.CREATED
    )
}

export const getAllIssues = async (req: Request, res: Response) => {

    const { sort, type, status } = req.query;

    const issues = await issueService.getAllIssues({
        sort: sort as "newest" | "oldest",
        type: type as "bug" | "feature_request",
        status: status as "open" | "in_progress" | "resolved",
    });

    return sendResponse(
        res,
        {
            success: true,
            message: "Issues retrieved successfully",
            data: issues,
        },
        HTTP_STATUS.OK
    );
};

export const getSingleIssue = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const issue = await issueService.getSingleIssue(id);

    return sendResponse(
        res,
        {
            success: true,
            message: "Issue retrieved successfully", data: issue
        },
        HTTP_STATUS.OK
    )
}

export const updateIssue = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const issue = await issueService.updateIssue(
        id,
        req.body,
        req.user as TokenPayload
    );

    return sendResponse(
        res,
        {
            success: true,
            message: "Issue updated successfully",
            data: issue
        },
        HTTP_STATUS.OK
    );
}