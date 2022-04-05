import dedent from "dedent-js";
import type { Format } from "../helpers/types";

/**
 * Tests support for ALTER TABLE syntax
 * @param {Function} format
 */
export default function supportsAlterTable(format: Format) {
  it("formats ALTER TABLE ... ALTER COLUMN query", () => {
    const result = format(
      "ALTER TABLE supplier ALTER COLUMN supplier_name VARCHAR(100) NOT NULL;"
    );
    expect(result).toBe(dedent`
      ALTER TABLE
        supplier
      ALTER COLUMN
        supplier_name VARCHAR(100) NOT NULL;
    `);
  });
}
