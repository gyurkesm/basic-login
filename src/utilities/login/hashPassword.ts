import bcrypt from "bcrypt";
import { AppError } from "../../types/status";

export default async function hashPassword(password: string) {
    try {
        const securePassword = await bcrypt.hash(password, 10);
        return securePassword;
    } catch (err) {
        throw new Error("Error during hash");
    }
}

export async function comparePassword(password: string, passwordDB: string) {
    try {
        const compared = await bcrypt.compare(password, passwordDB);
        return compared;
    } catch (err) {
        throw new AppError(
            "Error during password validation",
            "Internal Server Error"
        );
    }
}
