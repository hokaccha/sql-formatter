import dedent from "dedent-js";
import type { Format } from "../helpers/types";

/**
 * Tests for all the config options
 * @param {Function} format
 */
export default function supportsConfigOptions(format: Format) {
  it("supports indent option", () => {
    const result = format("SELECT count(*),Column1 FROM Table1;", {
      indent: "    ",
    });

    expect(result).toBe(dedent`
      SELECT
          count(*),
          Column1
      FROM
          Table1;
    `);
  });

  it("supports linesBetweenQueries option", () => {
    const result = format("SELECT * FROM foo; SELECT * FROM bar;", {
      linesBetweenQueries: 2,
    });
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        foo;

      SELECT
        *
      FROM
        bar;
    `);
  });

  it("supports keywordCase option (upper)", () => {
    const result = format(
      "select distinct * frOM foo left join bar WHERe cola > 1 and colb = 3",
      {
        keywordCase: "upper",
      }
    );
    expect(result).toBe(dedent`
      SELECT
        DISTINCT *
      FROM
        foo
        LEFT JOIN bar
      WHERE
        cola > 1
        AND colb = 3
    `);
  });

  it("supports keywordCase option (lower)", () => {
    const result = format(
      "select distinct * frOM foo left join bar WHERe cola > 1 and colb = 3",
      {
        keywordCase: "lower",
      }
    );
    expect(result).toBe(dedent`
      select
        distinct *
      from
        foo
        left join bar
      where
        cola > 1
        and colb = 3
    `);
  });

  it("supports keywordCase option (preserve)", () => {
    const result = format(
      "select distinct * frOM foo left join bar WHERe cola > 1 and colb = 3",
      {
        keywordCase: "preserve",
      }
    );
    expect(result).toBe(dedent`
      select
        distinct *
      frOM
        foo
        left join bar
      WHERe
        cola > 1
        and colb = 3
    `);
  });
}
