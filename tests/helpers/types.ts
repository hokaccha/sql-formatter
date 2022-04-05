import type { FormatConfig } from "src/sqlFormatter";
export type Format = (query: string, config?: FormatConfig) => string;
