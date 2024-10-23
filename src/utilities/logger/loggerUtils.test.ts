import { describe, expect, it } from "@jest/globals";
import { createLog } from "./loggerUtil";

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
