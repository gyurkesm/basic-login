import { ResultSetHeader, RowDataPacket, QueryError } from "mysql2";
import { connectionPool } from "../config/db";
import { v4 as uuidv4 } from "uuid";

export interface IUser extends RowDataPacket {
    id: string;
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    updateAt: string;
}

export const UserSchema = {
    getUserByName: async (username: string) => {
        try {
            const [row] = await connectionPool.query<IUser[]>(
                "SELECT * FROM users WHERE LOWER(username) = ?",
                [username]
            );
            return row[0];
        } catch (err) {
            throw new Error("Username not found");
        }
    },
    getUserById: async (id: string) => {
        try {
            const [row] = await connectionPool.query<IUser[]>(
                "SELECT * FROM users WHERE id = ?",
                [id]
            );
            return row[0];
        } catch (err) {
            throw new Error("User not found");
        }
    },
    createUser: async (user: Omit<IUser, "id" | "createdAt" | "updatedAt">) => {
        const id = uuidv4();
        const newUser = { id, ...user };
        try {
            const [result] = await connectionPool.query<ResultSetHeader>(
                `INSERT INTO users (id, username, password, email, firstName, lastName)
                VALUES (?,?,?,?,?,?);`,
                Object.values(newUser)
            );
            return [result.affectedRows === 1, false];
        } catch (err) {
            if (isMysqlError(err) && err.code === "ER_DUP_ENTRY") {
                return [false, "Username or Email is in use"];
            }
            console.error(err);
            return [false, false];
        }
    },
    changePassword: async (user: Pick<IUser, "username" | "password">) => {
        try {
            const [result] = await connectionPool.query<ResultSetHeader>(
                `UPDATE users
                SET password = ?
                WHERE LOWER(username) = ?`,
                [user.password, user.username]
            );
            return result.affectedRows === 1;
        } catch (err) {
            console.error(err);
            return false;
        }
    },
};

function isMysqlError(err: any): err is QueryError {
    return err && typeof err === "object" && "code" in err;
}
