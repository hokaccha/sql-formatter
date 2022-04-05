import * as sqlFormatter from "../src/sqlFormatter";
import behavesLikeMariaDbFormatter from "./behavesLikeMariaDbFormatter";

describe("MariaDbFormatter", () => {
  const format = (query: string, cfg = {}) =>
    sqlFormatter.format(query, { ...cfg, language: "mariadb" });

  behavesLikeMariaDbFormatter(format);
});
