import 'react';
import { Game } from './minesweeper/Game';
import { fillValues, generateMines } from './minesweeper/util/values';

const NUM_ROWS = 15;
const NUM_COLS = 15;
const NUM_MINES = 50;

export const App = () => {
  const initialValues = generateMines(NUM_ROWS, NUM_COLS, NUM_MINES);
  fillValues(initialValues);
  const initialCovers = [...Array(NUM_ROWS)].map(() => Array(NUM_COLS).fill(1));

  return (
    <>
      <Game initialValues={initialValues} initialCovers={initialCovers} />
    </>
  );
};
