import { escapeRegExp } from "../utils";
import * as regexFactory from "./regexFactory";
import type { Token } from "./token";
import type { TokenTypes } from "./tokenTypes";
import { tokenTypes } from "./tokenTypes";

type ProcessingToken = Omit<Token, "whitespaceBefore"> | null;

type TokenizerConfig = {
  reservedWords?: string[];
  reservedTopLevelWords?: string[];
  reservedNewlineWords?: string[];
  reservedTopLevelWordsNoIndent?: string[];
  stringTypes?: string[];
  openParens?: string[];
  closeParens?: string[];
  indexedPlaceholderTypes?: string[];
  namedPlaceholderTypes?: string[];
  lineCommentTypes?: string[];
  specialWordChars?: string[];
  operators?: string[];
};

export default class Tokenizer {
  WHITESPACE_REGEX: RegExp;
  NUMBER_REGEX: RegExp;
  OPERATOR_REGEX: RegExp;
  BLOCK_COMMENT_REGEX: RegExp;
  LINE_COMMENT_REGEX: RegExp;
  RESERVED_TOP_LEVEL_REGEX: RegExp;
  RESERVED_TOP_LEVEL_NO_INDENT_REGEX: RegExp;
  RESERVED_NEWLINE_REGEX: RegExp;
  RESERVED_PLAIN_REGEX: RegExp;
  WORD_REGEX: RegExp;
  STRING_REGEX: RegExp;
  OPEN_PAREN_REGEX: RegExp;
  CLOSE_PAREN_REGEX: RegExp;
  INDEXED_PLACEHOLDER_REGEX: RegExp | null;
  IDENT_NAMED_PLACEHOLDER_REGEX: RegExp | null;
  STRING_NAMED_PLACEHOLDER_REGEX: RegExp | null;

  constructor(config: TokenizerConfig) {
    this.WHITESPACE_REGEX = /^(\s+)/u;
    this.NUMBER_REGEX =
      /^((-\s*)?[0-9]+(\.[0-9]+)?([eE]-?[0-9]+(\.[0-9]+)?)?|0x[0-9a-fA-F]+|0b[01]+)\b/u;

    this.OPERATOR_REGEX = regexFactory.createOperatorRegex([
      "<>",
      "<=",
      ">=",
      ...(config.operators || []),
    ]);

    this.BLOCK_COMMENT_REGEX = /^(\/\*[^]*?(?:\*\/|$))/u;
    this.LINE_COMMENT_REGEX = regexFactory.createLineCommentRegex(
      config.lineCommentTypes || []
    );

    this.RESERVED_TOP_LEVEL_REGEX = regexFactory.createReservedWordRegex(
      config.reservedTopLevelWords || []
    );
    this.RESERVED_TOP_LEVEL_NO_INDENT_REGEX =
      regexFactory.createReservedWordRegex(
        config.reservedTopLevelWordsNoIndent || []
      );
    this.RESERVED_NEWLINE_REGEX = regexFactory.createReservedWordRegex(
      config.reservedNewlineWords || []
    );
    this.RESERVED_PLAIN_REGEX = regexFactory.createReservedWordRegex(
      config.reservedWords || []
    );

    this.WORD_REGEX = regexFactory.createWordRegex(config.specialWordChars);
    this.STRING_REGEX = regexFactory.createStringRegex(
      config.stringTypes || []
    );

    this.OPEN_PAREN_REGEX = regexFactory.createParenRegex(
      config.openParens || []
    );
    this.CLOSE_PAREN_REGEX = regexFactory.createParenRegex(
      config.closeParens || []
    );

    this.INDEXED_PLACEHOLDER_REGEX = regexFactory.createPlaceholderRegex(
      config.indexedPlaceholderTypes || [],
      "[0-9]*"
    );
    this.IDENT_NAMED_PLACEHOLDER_REGEX = regexFactory.createPlaceholderRegex(
      config.namedPlaceholderTypes || [],
      "[a-zA-Z0-9._$]+"
    );
    this.STRING_NAMED_PLACEHOLDER_REGEX = regexFactory.createPlaceholderRegex(
      config.namedPlaceholderTypes || [],
      regexFactory.createStringPattern(config.stringTypes || [])
    );
  }

  /**
   * Takes a SQL string and breaks it into tokens.
   * Each token is an object with type and value.
   *
   * @param {String} input The SQL string
   * @return {Object[]} tokens An array of tokens.
   *  @return {String} token.type
   *  @return {String} token.value
   *  @return {String} token.whitespaceBefore Preceding whitespace
   */
  tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    let token: ProcessingToken = null;

    // Keep processing the string until it is empty
    while (input.length) {
      // grab any preceding whitespace
      const whitespaceBefore = this.getWhitespace(input);
      input = input.substring(whitespaceBefore.length);

      if (input.length) {
        // Get the next token and the token type
        token = this.getNextToken(input, token);
        if (token == null) continue;

        // Advance the string
        input = input.substring(token.value.length);

        tokens.push({ ...token, whitespaceBefore });
      }
    }
    return tokens;
  }

  getWhitespace(input: string): string {
    const matches = input.match(this.WHITESPACE_REGEX);
    return matches ? matches[1] : "";
  }

  getNextToken(input: string, previousToken: ProcessingToken): ProcessingToken {
    return (
      this.getCommentToken(input) ||
      this.getStringToken(input) ||
      this.getOpenParenToken(input) ||
      this.getCloseParenToken(input) ||
      this.getPlaceholderToken(input) ||
      this.getNumberToken(input) ||
      this.getReservedWordToken(input, previousToken) ||
      this.getWordToken(input) ||
      this.getOperatorToken(input)
    );
  }

  getCommentToken(input: string): ProcessingToken {
    return this.getLineCommentToken(input) || this.getBlockCommentToken(input);
  }

  getLineCommentToken(input: string): ProcessingToken {
    return this.getTokenOnFirstMatch({
      input,
      type: tokenTypes.LINE_COMMENT,
      regex: this.LINE_COMMENT_REGEX,
    });
  }

  getBlockCommentToken(input: string): ProcessingToken {
    return this.getTokenOnFirstMatch({
      input,
      type: tokenTypes.BLOCK_COMMENT,
      regex: this.BLOCK_COMMENT_REGEX,
    });
  }

  getStringToken(input: string): ProcessingToken {
    return this.getTokenOnFirstMatch({
      input,
      type: tokenTypes.STRING,
      regex: this.STRING_REGEX,
    });
  }

  getOpenParenToken(input: string): ProcessingToken {
    return this.getTokenOnFirstMatch({
      input,
      type: tokenTypes.OPEN_PAREN,
      regex: this.OPEN_PAREN_REGEX,
    });
  }

  getCloseParenToken(input: string): ProcessingToken {
    return this.getTokenOnFirstMatch({
      input,
      type: tokenTypes.CLOSE_PAREN,
      regex: this.CLOSE_PAREN_REGEX,
    });
  }

  getPlaceholderToken(input: string): ProcessingToken {
    return (
      this.getIdentNamedPlaceholderToken(input) ||
      this.getStringNamedPlaceholderToken(input) ||
      this.getIndexedPlaceholderToken(input)
    );
  }

  getIdentNamedPlaceholderToken(input: string): ProcessingToken {
    return this.getPlaceholderTokenWithKey({
      input,
      regex: this.IDENT_NAMED_PLACEHOLDER_REGEX,
      parseKey: (v) => v.slice(1),
    });
  }

  getStringNamedPlaceholderToken(input: string): ProcessingToken {
    return this.getPlaceholderTokenWithKey({
      input,
      regex: this.STRING_NAMED_PLACEHOLDER_REGEX,
      parseKey: (v) =>
        this.getEscapedPlaceholderKey({
          key: v.slice(2, -1),
          quoteChar: v.slice(-1),
        }),
    });
  }

  getIndexedPlaceholderToken(input: string): ProcessingToken {
    return this.getPlaceholderTokenWithKey({
      input,
      regex: this.INDEXED_PLACEHOLDER_REGEX,
      parseKey: (v) => v.slice(1),
    });
  }

  getPlaceholderTokenWithKey({
    input,
    regex,
    parseKey,
  }: {
    input: string;
    regex: RegExp | null;
    parseKey: (v: string) => string;
  }): ProcessingToken {
    const token = this.getTokenOnFirstMatch({
      input,
      regex,
      type: tokenTypes.PLACEHOLDER,
    });
    if (token) {
      token.key = parseKey(token.value);
    }
    return token;
  }

  getEscapedPlaceholderKey({
    key,
    quoteChar,
  }: {
    key: string;
    quoteChar: string;
  }): string {
    return key.replace(
      new RegExp(escapeRegExp("\\" + quoteChar), "gu"),
      quoteChar
    );
  }

  // Decimal, binary, or hex numbers
  getNumberToken(input: string): ProcessingToken {
    return this.getTokenOnFirstMatch({
      input,
      type: tokenTypes.NUMBER,
      regex: this.NUMBER_REGEX,
    });
  }

  // Punctuation and symbols
  getOperatorToken(input: string): ProcessingToken {
    return this.getTokenOnFirstMatch({
      input,
      type: tokenTypes.OPERATOR,
      regex: this.OPERATOR_REGEX,
    });
  }

  getReservedWordToken(
    input: string,
    previousToken: ProcessingToken
  ): ProcessingToken {
    // A reserved word cannot be preceded by a "."
    // this makes it so in "mytable.from", "from" is not considered a reserved word
    if (previousToken && previousToken.value && previousToken.value === ".") {
      return null;
    }
    return (
      this.getTopLevelReservedToken(input) ||
      this.getNewlineReservedToken(input) ||
      this.getTopLevelReservedTokenNoIndent(input) ||
      this.getPlainReservedToken(input)
    );
  }

  getTopLevelReservedToken(input: string): ProcessingToken {
    return this.getTokenOnFirstMatch({
      input,
      type: tokenTypes.RESERVED_TOP_LEVEL,
      regex: this.RESERVED_TOP_LEVEL_REGEX,
    });
  }

  getNewlineReservedToken(input: string): ProcessingToken {
    return this.getTokenOnFirstMatch({
      input,
      type: tokenTypes.RESERVED_NEWLINE,
      regex: this.RESERVED_NEWLINE_REGEX,
    });
  }

  getTopLevelReservedTokenNoIndent(input: string): ProcessingToken {
    return this.getTokenOnFirstMatch({
      input,
      type: tokenTypes.RESERVED_TOP_LEVEL_NO_INDENT,
      regex: this.RESERVED_TOP_LEVEL_NO_INDENT_REGEX,
    });
  }

  getPlainReservedToken(input: string): ProcessingToken {
    return this.getTokenOnFirstMatch({
      input,
      type: tokenTypes.RESERVED,
      regex: this.RESERVED_PLAIN_REGEX,
    });
  }

  getWordToken(input: string): ProcessingToken {
    return this.getTokenOnFirstMatch({
      input,
      type: tokenTypes.WORD,
      regex: this.WORD_REGEX,
    });
  }

  getTokenOnFirstMatch({
    input,
    type,
    regex,
  }: {
    input: string;
    type: TokenTypes;
    regex: RegExp | null;
  }): ProcessingToken {
    if (regex === null) return null;

    const matches = input.match(regex);

    return matches ? { type, value: matches[1] } : null;
  }
}
