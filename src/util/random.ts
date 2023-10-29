/**
 * In-place shuffle of an array.
 */
export const shuffle = <T>(arr: Array<T>) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // swap elements
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
};

/**
 * Random integer in range (inclusive start, exclusive end).
 */
export const randint = (start: number, end: number) => {
  return Math.floor(Math.random() * (end - start)) + start;
};
