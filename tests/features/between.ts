import type { Format } from "../helpers/types";

/**
 * Tests support for BETWEEN _ AND _ syntax
 * @param {Function} format
 */
export default function supportsBetween(format: Format) {
  it("formats BETWEEN _ AND _ on single line", () => {
    expect(format("foo BETWEEN bar AND baz")).toBe("foo BETWEEN bar AND baz");
  });
}
