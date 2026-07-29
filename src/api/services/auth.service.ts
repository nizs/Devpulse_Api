import { sql } from "../../db";
import type { RUser, SafeUser, TUser } from "../../types";
import bcrypt from "bcrypt";

class AuthService {
    async createUser(user: RUser & { password: string }) {
        const { name, email, role, password } = user;

        const hash = await bcrypt.hash(password, 10);

        const res = await sql`
                INSERT INTO users (name, email, role, h_password)
                VALUES (
                ${name}, 
                ${email},
                COALESCE(${role},'contributor'),
                ${hash}
                )
                RETURNING id,name, email, role
            `
        return res[0];
    }

    async validateUser(email: string, password: string): Promise<SafeUser | null> {
        const res = await sql`
            SELECT * FROM users WHERE email = ${email}

        `
        const dbUser = res[0] as TUser | undefined;

        if (!dbUser) {
            return null;
        }

        const { h_password, ...user } = dbUser;

        const isValid = await bcrypt.compare(password, h_password);
        return isValid ? user : null;
    }

    async getUserById(id: string) {
        const res = await sql`
            SELECT id,name,email,role From users WHERE id=${id}
        `
        return res[0] as RUser & { id: number }
    }
}

export default new AuthService();