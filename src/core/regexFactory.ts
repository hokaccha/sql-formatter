import { escapeRegExp, isEmpty, sortByLengthDesc } from "../utils";

export function createOperatorRegex(multiLetterOperators: string[]): RegExp {
  return new RegExp(
    `^(${sortByLengthDesc(multiLetterOperators)
      .map(escapeRegExp)
      .join("|")}|.)`,
    "u"
  );
}

export function createLineCommentRegex(lineCommentTypes: string[]): RegExp {
  return new RegExp(
    `^((?:${lineCommentTypes
      .map((c) => escapeRegExp(c))
      .join("|")}).*?)(?:\r\n|\r|\n|$)`,
    "u"
  );
}

export function createReservedWordRegex(reservedWords: string[]): RegExp {
  if (reservedWords.length === 0) {
    return new RegExp(`^\b$`, "u");
  }
  const reservedWordsPattern = sortByLengthDesc(reservedWords)
    .join("|")
    .replace(/ /gu, "\\s+");
  return new RegExp(`^(${reservedWordsPattern})\\b`, "iu");
}

export function createWordRegex(specialChars: string[] = []): RegExp {
  return new RegExp(
    `^([\\p{Alphabetic}\\p{Mark}\\p{Decimal_Number}\\p{Connector_Punctuation}\\p{Join_Control}${specialChars.join(
      ""
    )}]+)`,
    "u"
  );
}

export function createStringRegex(stringTypes: string[]): RegExp {
  return new RegExp("^(" + createStringPattern(stringTypes) + ")", "u");
}

// This enables the following string patterns:
// 1. backtick quoted string using `` to escape
// 2. square bracket quoted string (SQL Server) using ]] to escape
// 3. double quoted string using "" or \" to escape
// 4. single quoted string using '' or \' to escape
// 5. national character quoted string using N'' or N\' to escape
// 6. Unicode single-quoted string using \' to escape
// 7. Unicode double-quoted string using \" to escape
// 8. PostgreSQL dollar-quoted strings
export function createStringPattern(stringTypes: string[]): string {
  const patterns: Record<string, string> = {
    "``": "((`[^`]*($|`))+)",
    "{}": "((\\{[^\\}]*($|\\}))+)",
    "[]": "((\\[[^\\]]*($|\\]))(\\][^\\]]*($|\\]))*)",
    '""': '(("[^"\\\\]*(?:\\\\.[^"\\\\]*)*("|$))+)',
    "''": "(('[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+)",
    "N''": "((N'[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+)",
    "U&''": "((U&'[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+)",
    'U&""': '((U&"[^"\\\\]*(?:\\\\.[^"\\\\]*)*("|$))+)',
    $$: "((?<tag>\\$\\w*\\$)[\\s\\S]*?(?:\\k<tag>|$))",
  };

  return stringTypes.map((t) => patterns[t]).join("|");
}

export function createParenRegex(parens: string[]): RegExp {
  return new RegExp("^(" + parens.map(escapeParen).join("|") + ")", "iu");
}

function escapeParen(paren: string): string {
  if (paren.length === 1) {
    // A single punctuation character
    return escapeRegExp(paren);
  } else {
    // longer word
    return "\\b" + paren + "\\b";
  }
}

export function createPlaceholderRegex(
  types: string[],
  pattern: string
): RegExp | null {
  if (isEmpty(types)) {
    return null;
  }
  const typesRegex = types.map(escapeRegExp).join("|");

  return new RegExp(`^((?:${typesRegex})(?:${pattern}))`, "u");
}
