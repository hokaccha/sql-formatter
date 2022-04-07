import type { FormatterConfig } from "./core/Formatter";
import Db2Formatter from "./languages/Db2Formatter";
import MariaDbFormatter from "./languages/MariaDbFormatter";
import MySqlFormatter from "./languages/MySqlFormatter";
import N1qlFormatter from "./languages/N1qlFormatter";
import PlSqlFormatter from "./languages/PlSqlFormatter";
import PostgreSqlFormatter from "./languages/PostgreSqlFormatter";
import RedshiftFormatter from "./languages/RedshiftFormatter";
import SparkSqlFormatter from "./languages/SparkSqlFormatter";
import StandardSqlFormatter from "./languages/StandardSqlFormatter";
import TSqlFormatter from "./languages/TSqlFormatter";

const formatters = {
  db2: Db2Formatter,
  mariadb: MariaDbFormatter,
  mysql: MySqlFormatter,
  n1ql: N1qlFormatter,
  plsql: PlSqlFormatter,
  postgresql: PostgreSqlFormatter,
  redshift: RedshiftFormatter,
  spark: SparkSqlFormatter,
  sql: StandardSqlFormatter,
  tsql: TSqlFormatter,
} as const;

type Language = keyof typeof formatters;

export type FormatConfig = Partial<FormatterConfig> & { language?: Language };

const defaultConfig: FormatterConfig & { language: Language } = {
  language: "sql",
  indent: "  ",
  keywordCase: "preserve",
  linesBetweenQueries: 1,
};

/**
 * Format whitespace in a query to make it easier to read.
 */
export const format = (query: string, config: FormatConfig = {}) => {
  if (typeof query !== "string") {
    throw new Error(
      "Invalid query argument. Expected string, instead got " + typeof query
    );
  }

  const { language, ...formatterConfig } = { ...defaultConfig, ...config };

  const Formatter = formatters[language];
  if (Formatter === undefined) {
    throw Error(`Unsupported SQL dialect: ${language}`);
  }

  return new Formatter(formatterConfig).format(query);
};

export const supportedDialects = Object.keys(formatters);
