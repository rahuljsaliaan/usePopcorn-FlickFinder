export const average = (arr) =>
  arr.reduce((acc, cur, _, arr) => acc + cur / arr.length, 0);
