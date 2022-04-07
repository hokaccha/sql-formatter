import dedent from "dedent-js";
import * as sqlFormatter from "../src/sqlFormatter";
import behavesLikeSqlFormatter from "./behavesLikeSqlFormatter";
import supportsAlterTable from "./features/alterTable";
import supportsBetween from "./features/between";
import supportsCreateTable from "./features/createTable";
import supportsJoin from "./features/join";
import supportsOperators from "./features/operators";
import supportsSchema from "./features/schema";
import supportsStrings from "./features/strings";

describe("Db2Formatter", () => {
  const format = (query: string, config = {}) =>
    sqlFormatter.format(query, { ...config, language: "db2" });

  behavesLikeSqlFormatter(format);
  supportsCreateTable(format);
  supportsAlterTable(format);
  supportsStrings(format, ['""', "''", "``"]);
  supportsBetween(format);
  supportsSchema(format);
  supportsOperators(format, ["%", "**", "!=", "!>", "!>", "||"]);
  supportsJoin(format);

  it("formats FETCH FIRST like LIMIT", () => {
    expect(
      format(
        "SELECT col1 FROM tbl ORDER BY col2 DESC FETCH FIRST 20 ROWS ONLY;"
      )
    ).toBe(dedent`
        SELECT
          col1
        FROM
          tbl
        ORDER BY
          col2 DESC
        FETCH FIRST
          20 ROWS ONLY;
      `);
  });

  it("formats only -- as a line comment", () => {
    const result = format(`
      SELECT col FROM
      -- This is a comment
      MyTable;
    `);
    expect(result).toBe(dedent`
      SELECT
        col
      FROM
        -- This is a comment
        MyTable;
    `);
  });

  it("recognizes @ and # as part of identifiers", () => {
    const result = format("SELECT col#1, @col2 FROM tbl");
    expect(result).toBe(dedent`
      SELECT
        col#1,
        @col2
      FROM
        tbl
    `);
  });

  it("recognizes :variables", () => {
    expect(format("SELECT :variable;")).toBe(dedent`
      SELECT
        :variable;
    `);
  });

  it("replaces :variables with param values", () => {
    const result = format("SELECT :variable", {
      params: { variable: '"variable value"' },
    });
    expect(result).toBe(dedent`
      SELECT
        "variable value"
    `);
  });
});
