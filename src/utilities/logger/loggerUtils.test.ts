import { describe, expect, it } from "@jest/globals";
import { createLog, writeErrorLog, writeLog } from "./loggerUtil";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

describe("create log", () => {
    it("should return content", () => {
        expect(createLog(["first"])).toBe("first");
    });
    it("should return content concatenated with tabs", () => {
        expect(createLog(["first", "second"])).toBe("first\tsecond");
    });
    it("should return content concatenated with tabs", () => {
        expect(createLog(["first", "second", "third"])).toBe(
            "first\tsecond\tthird"
        );
    });
});

jest.mock("path", () => ({
    join: jest.fn(),
}));

describe("writeErrorLog", () => {
    const timestamp = "2023-10-01T00:00:00Z";
    const content = "An error occurred";
    const name = "TestName";
    const expectedFilename = "logs/error.log";
    beforeEach(() => {
        jest.clearAllMocks();
        (path.join as jest.Mock).mockReturnValue(expectedFilename);
    });

    it("should call writeLog once, with the proper contents", () => {
        const expectedHeader = "Timestamp,Name,Content\n";
        const expectedNewLog = `${timestamp},${name},${content}\n`;

        const createLog = jest
            .fn()
            .mockReturnValueOnce(expectedHeader) // Mock header
            .mockReturnValueOnce(expectedNewLog); // Mock log content
        writeErrorLog(timestamp, content, name);
        expect(path.join).toHaveBeenCalledWith("logs", "error.log");
        expect(createLog).toHaveBeenCalledWith(1, [
            "Timestamp",
            "Name",
            "Content",
        ]);
        expect(createLog).toHaveBeenCalledWith(2, [timestamp, name, content]);
    });
});
