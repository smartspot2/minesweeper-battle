import { shuffle } from '../../../util/random';

const ADJACENT = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

/**
 * Fill all non-mine values with the correct numbers.
 *
 * Modifies `values` in-place.
 */
export const fillValues = (values: number[][]) => {
  const numRows = values.length;
  const numCols = values[0].length;
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      if (values[r][c] === 9) {
        continue;
      }

      let mineCount = 0;
      for (const [dr, dc] of ADJACENT) {
        if (
          0 <= r + dr &&
          r + dr < numRows &&
          0 <= c + dc &&
          c + dc < numCols &&
          values[r + dr][c + dc] === 9
        ) {
          mineCount++;
        }
      }

      values[r][c] = mineCount;
    }
  }
};

/**
 * Generate mines, returning a board filled only with mines.
 */
export const generateMines = (
  numRows: number,
  numCols: number,
  numMines: number,
): number[][] => {
  const possibilities = [];
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      possibilities.push([r, c]);
    }
  }

  // shuffle possibilities
  shuffle(possibilities);

  // first `numMines` values are mines
  const board = Array(numRows).map(() => Array(numCols).fill(0));
  for (let i = 0; i < numMines; i++) {
    const [r, c] = possibilities[i];
    board[r][c] = 9;
  }
  return board;
};
