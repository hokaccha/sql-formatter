import * as sqlFormatter from "../src/sqlFormatter";
import behavesLikeMariaDbFormatter from "./behavesLikeMariaDbFormatter";

describe("MariaDbFormatter", () => {
  const format = (query: string, config = {}) =>
    sqlFormatter.format(query, { ...config, language: "mariadb" });

  behavesLikeMariaDbFormatter(format);
});
