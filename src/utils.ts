// Only removes spaces, not newlines
export const trimSpacesEnd = (str: string): string =>
  str.replace(/[ \t]+$/u, "");

// Last element from array
export const last = (arr: Array<unknown>) => arr[arr.length - 1];

// True array is empty, or it's not an array at all
export const isEmpty = (arr: Array<unknown>) =>
  !Array.isArray(arr) || arr.length === 0;

// Escapes regex special chars
export const escapeRegExp = (str: string): string =>
  str.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");

// Sorts strings by length, so that longer ones are first
// Also sorts alphabetically after sorting by length.
export const sortByLengthDesc = (strings: string[]): string[] =>
  strings.sort((a, b) => {
    return b.length - a.length || a.localeCompare(b);
  });
