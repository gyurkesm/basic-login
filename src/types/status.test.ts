import { describe, it, expect } from "@jest/globals";
import { AppError } from "./status";

describe("AppError", () => {
    it("default statuscode should be 500", () => {
        const err = new AppError("Basic Error");
        expect(err).toHaveProperty("statusCode");
        expect(err.statusCode).toBe(500);
        expect(err.message).toBe("Basic Error");
        expect(err.username).toBeUndefined();
    });
    it("should map through statusMap", () => {
        const err = new AppError("Basic Error", "Not Found");
        expect(err.statusCode).toBe(404);
    });
    it("should assign username, if provided", () => {
        const err = new AppError("Basic Error", "Not Found", "Béla");
        expect(err.username).toBe("Béla");
    });
});
