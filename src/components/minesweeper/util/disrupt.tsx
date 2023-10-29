import { randint, shuffle } from "../../../util/random";
import { fillValues } from "./values";

const INITIAL_EXPANSION_PROB = 1;
const DECAY_PROB = 0.6;
const ADJACENT = [
  [0, -1],
  [-1, 0],
  [0, 1],
  [1, 0],
];

/**
 * Randomly disrupt the board.
 */
export const disruptBoard = (values: number[][], covers: number[][]) => {
  const numRows = values.length;
  const numCols = values[0].length;

  // select a center location for the disruption; should be a cell that is uncovered or flagged
  const possibleCenters = [];
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      if (covers[r][c] === 0 || covers[r][c] === 2) {
        possibleCenters.push([r, c]);
      }
    }
  }
  
  if (possibleCenters.length === 0) {
    return;
  }

  const centerIdx = randint(0, possibleCenters.length);
  const [centerR, centerC] = possibleCenters[centerIdx];

  /**
   * Expand the disruption about (r, c), updating `currentDisrupts` in the process.
   *
   * `currentDisrupts` should be a set of ints of the form r * numRows + c;
   * this serialization ensures that Set.has checks are correct.
   */
  const expandDisruption = (
    r: number,
    c: number,
    currentDisrupts: Set<number>,
    // chain distance from the center
    chainDistance: number,
  ) => {
    for (const [dr, dc] of ADJACENT) {
      const prob = INITIAL_EXPANSION_PROB * Math.pow(DECAY_PROB, chainDistance);
      if (
        // randomly expand
        Math.random() < prob &&
        // check bounds
        0 <= r + dr &&
        r + dr < numRows &&
        0 <= c + dc &&
        c + dc < numCols &&
        // ensure not disrupted already
        !currentDisrupts.has(encodeRC(numCols, r + dr, c + dc))
      ) {
        currentDisrupts.add(encodeRC(numCols, r + dr, c + dc));
        // recurse
        expandDisruption(r + dr, c + dc, currentDisrupts, chainDistance + 1);
      }
    }
  };

  // compute disrupted cells
  const disruptedCells = new Set<number>();
  disruptedCells.add(encodeRC(numCols, centerR, centerC));
  expandDisruption(centerR, centerC, disruptedCells, 0);

  // convert set to array
  const disruptedCellsArr = Array.from(disruptedCells);

  // compute the number of mines to use
  const numMines = Math.max(Math.floor(disruptedCellsArr.length / 9), 1);

  // shuffle array
  shuffle(disruptedCellsArr);

  // execute disruption; first `numMines` elements are mines
  for (const [idx, encoded] of disruptedCellsArr.entries()) {
    const [r, c] = decodeRC(numCols, encoded);
    values[r][c] = idx < numMines ? 9 : 0;
    covers[r][c] = 1;
  }

  fillValues(values);
};

const encodeRC = (numCols: number, r: number, c: number) => {
  return r * numCols + c;
};

const decodeRC = (numCols: number, encoded: number) => {
  const c = encoded % numCols;
  const r = Math.floor(encoded / numCols);

  return [r, c];
};
