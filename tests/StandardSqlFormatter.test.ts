import dedent from "dedent-js";
import * as sqlFormatter from "../src/sqlFormatter";
import behavesLikeSqlFormatter from "./behavesLikeSqlFormatter";
import supportsAlterTable from "./features/alterTable";
import supportsBetween from "./features/between";
import supportsCase from "./features/case";
import supportsCreateTable from "./features/createTable";
import supportsJoin from "./features/join";
import supportsSchema from "./features/schema";
import supportsStrings from "./features/strings";

describe("StandardSqlFormatter", () => {
  const format = (query: string, config = {}) =>
    sqlFormatter.format(query, { ...config, language: "sql" });

  behavesLikeSqlFormatter(format);
  supportsCase(format);
  supportsCreateTable(format);
  supportsAlterTable(format);
  supportsStrings(format, ['""', "''"]);
  supportsBetween(format);
  supportsSchema(format);
  supportsJoin(format);

  it("replaces ? indexed placeholders with param values", () => {
    const result = format("SELECT ?, ?, ?;", {
      params: ["first", "second", "third"],
    });
    expect(result).toBe(dedent`
      SELECT
        first,
        second,
        third;
    `);
  });

  it("formats FETCH FIRST like LIMIT", () => {
    const result = format("SELECT * FETCH FIRST 2 ROWS ONLY;");
    expect(result).toBe(dedent`
      SELECT
        *
      FETCH FIRST
        2 ROWS ONLY;
    `);
  });

  it("formats back quote", () => {
    const result = format("SELECT `col` FROM `tbl` WHERE `col` = 1");
    expect(result).toBe(dedent`
      SELECT
        \`col\`
      FROM
        \`tbl\`
      WHERE
        \`col\` = 1
    `);
  });

  it("formats raw string literal", () => {
    const result = format(
      `SELECT col FROM tbl WHERE col = r'val' and col = r"val" and col = R'val' and col = R"val"`
    );
    expect(result).toBe(dedent`
      SELECT
        col
      FROM
        tbl
      WHERE
        col = r'val'
        and col = r"val"
        and col = R'val'
        and col = R"val"
    `);
  });

  it("formats byte literal", () => {
    const result = format(
      `SELECT col FROM tbl WHERE col = b'val' and col = b"val" and col = B'val' and col = B"val"`
    );
    expect(result).toBe(dedent`
      SELECT
        col
      FROM
        tbl
      WHERE
        col = b'val'
        and col = b"val"
        and col = B'val'
        and col = B"val"
    `);
  });

  it("formats hyphen", () => {
    const result = format("SELECT * FROM schema-name.tbl");
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        schema-name.tbl
    `);
  });

  it("formats operators", () => {
    const result = format(
      "SELECT a << 1, b >> 2, c || d FROM tbl WHERE col != 1"
    );
    expect(result).toBe(dedent`
      SELECT
        a << 1,
        b >> 2,
        c || d
      FROM
        tbl
      WHERE
        col != 1
    `);
  });

  it("formats array", () => {
    const result = format(
      "SELECT * FROM UNNEST(['foo', 'bar', 'baz', 'qux', 'corge', 'garply', 'waldo', 'fred'])"
    );
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        UNNEST(
          [
            'foo',
            'bar',
            'baz',
            'qux',
            'corge',
            'garply',
            'waldo',
            'fred'
          ]
        )
    `);
  });
});
