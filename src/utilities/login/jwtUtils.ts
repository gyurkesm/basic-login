import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { AppError } from "../../types/status";

export async function verifyUser(id: string) {
    const payload = {
        id,
    };
    try {
        const token = await signToken(payload);
        return token;
    } catch (err) {
        throw new AppError("Error at token sign", "Internal Server Error");
    }
}

async function signToken(payload: { id: string }) {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.PRIVATE_KEY!.replace(/\\n/g, "\n") as string,
            { expiresIn: "1h", algorithm: "RS256" },
            (err, token) => {
                if (err) {
                    console.error(err);
                    reject("Error at token sign");
                }
                resolve("Bearer " + token);
            }
        );
    });
}

export function validateToken(token: string) {
    const payload = jwt.verify(
        token,
        process.env.PUBLIC_KEY!.replace(/\\n/g, "\n") as string
    );
    return payload;
}
