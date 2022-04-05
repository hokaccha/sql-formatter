import * as sqlFormatter from "../src/sqlFormatter";

describe("sqlFormatter", () => {
  it("throws error when unsupported language parameter specified", () => {
    expect(() => {
      // @ts-expect-error for testing
      sqlFormatter.format("SELECT *", { language: "blah" });
    }).toThrow("Unsupported SQL dialect: blah");
  });
});
