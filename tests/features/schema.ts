import dedent from "dedent-js";
import type { Format } from "../helpers/types";

/**
 * Tests support for SET SCHEMA syntax
 * @param {Function} format
 */
export default function supportsSchema(format: Format) {
  it("formats simple SET SCHEMA statements", () => {
    const result = format("SET SCHEMA schema1;");
    expect(result).toBe(dedent`
      SET SCHEMA
        schema1;
    `);
  });
}
