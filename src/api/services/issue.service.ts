import { sql } from "../../db";
import type { GetIssueQuery, IssueResponse, Reporter, RIssue, TIssue, TokenPayload } from "../../types";

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

    async getSingleIssue(
        id: number
    ): Promise<IssueResponse> {
        const issue = await sql`
            SELECT id, title, description, type, status, reporter_id, created_at, updated_at
            FROM issues WHERE id=${id}
        `as TIssue[];

        if (!issue.length) {
            throw new Error("Issue not found");
        }

        const currentIssue = issue[0];
        if (!currentIssue) {
            throw new Error("Issue not found");
        }
        const reporter = await sql`
            SELECT id, name, role From users WHERE id=${currentIssue.reporter_id}
        `as Reporter[];

        if (!reporter.length) {
            throw new Error(`Reporter not found`);
        }

        return {
            id: currentIssue.id,
            title: currentIssue.title,
            description: currentIssue.description,
            type: currentIssue.type,
            status: currentIssue.status,

            reporter: reporter[0]!,

            created_at: currentIssue.created_at,
            updated_at: currentIssue.updated_at,
        }
    }

    async updateIssue(
        id: number,
        payload: RIssue,
        user: TokenPayload
    ): Promise<TIssue> {
        const issues = await sql`
            SELECT * FROM issues WHERE id=${id}
        `as TIssue[];


        const currentIssue = issues[0];
        if (!currentIssue) {
            throw new Error("Issue not found");
        }


        if (user.role !== "maintainer") {
            if (currentIssue.reporter_id !== user.id) {
                throw new Error("You are not authorized to update this issue");
            }
            if (currentIssue.status !== "open") {
                throw new Error("Only open issues can be updated");
            }
        }

        const { title, description, type } = payload;
        const result = await sql`
            UPDATE issues SET 
            title=COALESCE(${title},title),
            description=COALESCE(${description},description),
            type=COALESCE(${type},type),
            updated_at=NOW()

            WHERE id=${id}

            RETURNING id, title, description, type, status, reporter_id, created_at, updated_at;
        ` as TIssue[];


        const updatedIssue = result[0];
        if (!updatedIssue) {
            throw new Error("Failed to update issue");
        }
        return updatedIssue;
    }
}

export default new IssueService();