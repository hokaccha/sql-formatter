import dedent from "dedent-js";
import * as sqlFormatter from "../src/sqlFormatter";
import behavesLikeSqlFormatter from "./behavesLikeSqlFormatter";
import supportsAlterTable from "./features/alterTable";
import supportsBetween from "./features/between";
import supportsCase from "./features/case";
import supportsCreateTable from "./features/createTable";
import supportsJoin from "./features/join";
import supportsOperators from "./features/operators";
import supportsSchema from "./features/schema";
import supportsStrings from "./features/strings";

describe("SparkSqlFormatter", () => {
  const format = (query: string, config = {}) =>
    sqlFormatter.format(query, { ...config, language: "spark" });

  behavesLikeSqlFormatter(format);
  supportsCase(format);
  supportsCreateTable(format);
  supportsAlterTable(format);
  supportsStrings(format, ['""', "''", "``"]);
  supportsBetween(format);
  supportsSchema(format);
  supportsOperators(format, [
    "!=",
    "%",
    "|",
    "&",
    "^",
    "~",
    "!",
    "<=>",
    "%",
    "&&",
    "||",
    "==",
  ]);
  supportsJoin(format, {
    additionally: [
      "ANTI JOIN",
      "SEMI JOIN",
      "LEFT ANTI JOIN",
      "LEFT SEMI JOIN",
      "RIGHT OUTER JOIN",
      "RIGHT SEMI JOIN",
      "NATURAL ANTI JOIN",
      "NATURAL FULL OUTER JOIN",
      "NATURAL INNER JOIN",
      "NATURAL LEFT ANTI JOIN",
      "NATURAL LEFT OUTER JOIN",
      "NATURAL LEFT SEMI JOIN",
      "NATURAL OUTER JOIN",
      "NATURAL RIGHT OUTER JOIN",
      "NATURAL RIGHT SEMI JOIN",
      "NATURAL SEMI JOIN",
    ],
  });

  it("formats WINDOW specification as top level", () => {
    const result = format(
      "SELECT *, LAG(value) OVER wnd AS next_value FROM tbl WINDOW wnd as (PARTITION BY id ORDER BY time);"
    );
    expect(result).toBe(dedent`
      SELECT
        *,
        LAG(value) OVER wnd AS next_value
      FROM
        tbl
      WINDOW
        wnd as (
          PARTITION BY
            id
          ORDER BY
            time
        );
    `);
  });

  it("formats window function and end as inline", () => {
    const result = format(
      'SELECT window(time, "1 hour").start AS window_start, window(time, "1 hour").end AS window_end FROM tbl;'
    );
    expect(result).toBe(dedent`
      SELECT
        window(time, "1 hour").start AS window_start,
        window(time, "1 hour").end AS window_end
      FROM
        tbl;
    `);
  });

  // eslint-disable-next-line no-template-curly-in-string
  it("does not add spaces around ${value} params", () => {
    // eslint-disable-next-line no-template-curly-in-string
    const result = format("SELECT ${var_name};");
    expect(result).toBe(dedent`
      SELECT
        \${var_name};
    `);
  });

  // eslint-disable-next-line no-template-curly-in-string
  it("replaces $variables and ${variables} with param values", () => {
    // eslint-disable-next-line no-template-curly-in-string
    const result = format("SELECT $var1, ${var2};", {
      params: {
        var1: "'var one'",
        var2: "'var two'",
      },
    });
    expect(result).toBe(dedent`
      SELECT
        'var one',
        'var two';
    `);
  });
});
