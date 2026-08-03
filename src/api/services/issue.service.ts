import { sql } from "../../db";
import type { RIssue, TIssue } from "../../types";

class IssueService {
    async createIssue(
        issue: RIssue,
        reporterId: number
    ): Promise<TIssue> {
        const { title, description, type } = issue;

        const res = await sql`
            INSERT INTO issues (title,description,type,reporter_id)
            VALUES(${title},${description},${type},${reporterId})
            RETURNING  
            id, title, description, type, status, reporter_id, created_at, updated_at;
        `
        return res[0] as TIssue;

    }
}

export default new IssueService();