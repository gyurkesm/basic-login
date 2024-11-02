import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { AppError } from "../../types/status";

export function writeErrorLog(
    timestamp: string,
    content: string,
    name: string = "-"
) {
    const filename = path.join("logs", "error.log");
    const header = createLog(["Timestamp", "Name", "Content"]);

    const newlog = createLog([timestamp, name, content]);

    writeLog(filename, header, newlog);
}

export function writeUnkownErrorLog(
    timestamp: string,
    content: string,
    stack: string
) {
    const filename = path.join("logs", "errorUnkown.log");
    const header = createLog(["Timestamp", "Content", "Stack"]);

    const newlog = createLog([timestamp, content, stack]);

    writeLog(filename, header, newlog);
}

export async function writeLog(
    filename: string,
    header: string,
    newLog: string
) {
    try {
        if (!existsSync(filename)) {
            await fs.writeFile(filename, header.concat("\n"));
        }
        await fs.writeFile(filename, newLog.concat("\n"), { flag: "a" });
    } catch (err) {
        throw new AppError("Error during log write", "Internal Server Error");
    }
}

export function createLog(logs: string[]) {
    return logs.reduce((previous, current) => previous.concat("\t", current));
}
