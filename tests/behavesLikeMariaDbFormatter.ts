import dedent from "dedent-js";
import behavesLikeSqlFormatter from "./behavesLikeSqlFormatter";
import supportsAlterTable from "./features/alterTable";
import supportsBetween from "./features/between";
import supportsCase from "./features/case";
import supportsCreateTable from "./features/createTable";
import supportsJoin from "./features/join";
import supportsOperators from "./features/operators";
import supportsStrings from "./features/strings";
import type { Format } from "./helpers/types";

/**
 * Shared tests for MySQL and MariaDB
 * @param {Function} format
 */
export default function behavesLikeMariaDbFormatter(format: Format) {
  behavesLikeSqlFormatter(format);
  supportsCase(format);
  supportsCreateTable(format);
  supportsAlterTable(format);
  supportsStrings(format, ['""', "''", "``"]);
  supportsBetween(format);
  supportsOperators(format, [
    "%",
    "&",
    "|",
    "^",
    "~",
    "!=",
    "!",
    "<=>",
    "<<",
    ">>",
    "&&",
    "||",
    ":=",
  ]);
  supportsJoin(format, {
    without: ["FULL"],
    additionally: [
      "STRAIGHT_JOIN",
      "NATURAL LEFT JOIN",
      "NATURAL LEFT OUTER JOIN",
      "NATURAL RIGHT JOIN",
      "NATURAL RIGHT OUTER JOIN",
    ],
  });

  it("supports # comments", () => {
    expect(format("SELECT a # comment\nFROM b # comment")).toBe(dedent`
      SELECT
        a # comment
      FROM
        b # comment
    `);
  });

  it("supports @variables", () => {
    expect(format("SELECT @foo, @bar")).toBe(dedent`
      SELECT
        @foo,
        @bar
    `);
  });

  it("supports setting variables: @var :=", () => {
    expect(format("SET @foo := (SELECT * FROM tbl);")).toBe(dedent`
      SET
        @foo := (
          SELECT
            *
          FROM
            tbl
        );
    `);
  });
}
