import type { Request, Response } from "express";
import issueService from "../services/issue.service";
import { sendResponse } from "../../utils/sendResponse";
import { HTTP_STATUS } from "../../utils/httpStatus";


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