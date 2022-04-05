import type { Token } from "./token";

export type PlaceholderParams = Record<string, string> | Array<string>;
/**
 * Handles placeholder replacement with given params.
 */
export default class Params {
  params?: PlaceholderParams;
  index: number;

  /**
   * @param {Object} params
   */
  constructor(params?: PlaceholderParams) {
    this.params = params;
    this.index = 0;
  }

  /**
   * Returns param value that matches given placeholder with param key.
   * @param {Object} token
   *   @param {String} token.key Placeholder key
   *   @param {String} token.value Placeholder value
   * @return {String} param or token.value when params are missing
   */
  get(token: Token): string {
    if (!this.params) {
      return token.value;
    }

    if (Array.isArray(this.params)) {
      return this.params[this.index++];
    }

    if (token.key) {
      return this.params[token.key];
    }

    throw new Error("Invalid params");
  }
}
