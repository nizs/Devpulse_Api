import { sql } from "../../db";
import type { GetIssueQuery, IssueResponse, Reporter, RIssue, TIssue } from "../../types";

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

    async getAllIssues(
        query: GetIssueQuery
    ): Promise<IssueResponse[]> {

        const { sort = "newest", type, status } = query;
        const issues = await sql`
            SELECT id, title, description, type, status, reporter_id, created_at, updated_at 
            
            FROM issues WHERE
            (${type}::text IS NULL OR type=${type}) 
            AND
            (${status}::text IS NULL OR status=${status})
            ORDER BY created_at DESC
        ` as TIssue[];



        if (sort === "oldest") {
            issues.reverse();
        }

        if (!issues.length) {
            return [];
        }



        const reporterIds = [
            ...new Set(issues.map(issue => issue.reporter_id))
        ]

        const reporters = await sql`
            SELECT id, name, role FROM users WHERE id = ANY(${reporterIds})
        ` as Reporter[];

        const reporterMap = new Map(
            reporters.map(reporter => [reporter.id, reporter])
        )

        return issues.map((issue) => {

            const reporter = reporterMap.get(issue.reporter_id);

            if (!reporter) {
                throw new Error(`Reporter ${issue.reporter_id} not found`);
            }

            return {
                id: issue.id,
                title: issue.title,
                description: issue.description,
                type: issue.type,
                status: issue.status,

                reporter,

                created_at: issue.created_at,
                updated_at: issue.updated_at,
            };

        });

    }
}

export default new IssueService();