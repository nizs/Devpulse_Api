import { sql } from "../../db";
import type { RUser } from "../../types";
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
            RETURNING id, name, email, role
        `
        return res[0];
    }
}

export default new AuthService();