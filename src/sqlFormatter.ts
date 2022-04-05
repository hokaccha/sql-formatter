import type { PlaceholderParams } from "./core/Params";
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

const DEFAULT_LANGUAGE = "sql";

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

export type FormatConfig = {
  language?: keyof typeof formatters;
  indent?: string;
  uppercase?: boolean;
  linesBetweenQueries?: number;
  params?: PlaceholderParams;
};

/**
 * Format whitespace in a query to make it easier to read.
 *
 * @param {String} query
 * @param {Object} cfg
 *  @param {String} cfg.language Query language, default is Standard SQL
 *  @param {String} cfg.indent Characters used for indentation, default is "  " (2 spaces)
 *  @param {Boolean} cfg.uppercase Converts keywords to uppercase
 *  @param {Integer} cfg.linesBetweenQueries How many line breaks between queries
 *  @param {Object} cfg.params Collection of params for placeholder replacement
 * @return {String}
 */
export const format = (query: string, config: FormatConfig = {}) => {
  if (typeof query !== "string") {
    throw new Error(
      "Invalid query argument. Expected string, instead got " + typeof query
    );
  }

  const { language, ...formatterConfig } = config;
  const Formatter = formatters[language || DEFAULT_LANGUAGE];
  if (Formatter === undefined) {
    throw Error(`Unsupported SQL dialect: ${language}`);
  }
  return new Formatter(formatterConfig).format(query);
};

export const supportedDialects = Object.keys(formatters);
