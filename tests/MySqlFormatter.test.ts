import * as sqlFormatter from "../src/sqlFormatter";
import behavesLikeMariaDbFormatter from "./behavesLikeMariaDbFormatter";
import supportsOperators from "./features/operators";

describe("MySqlFormatter", () => {
  const format = (query: string, config = {}) =>
    sqlFormatter.format(query, { ...config, language: "mysql" });

  behavesLikeMariaDbFormatter(format);

  describe("additional MySQL operators", () => {
    supportsOperators(format, ["->", "->>"]);
  });
});
