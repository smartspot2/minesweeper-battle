import 'react';
import { Game } from './minesweeper/Game';
import { fillValues, generateMines } from './minesweeper/util/values';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useState } from 'react';

const NUM_ROWS = 15;
const NUM_COLS = 15;
const NUM_MINES = 50;
const USERNAME = 'user';

export const App = () => {
  const curGrid = useQuery(api.queries.grid.getGrid, { user: USERNAME });
  const curGame = useQuery(api.queries.game.getGameFromId, {
    id: curGrid != null ? curGrid.game : null,
  });

  const initialValues = generateMines(NUM_ROWS, NUM_COLS, NUM_MINES);
  fillValues(initialValues);
  const initialCovers = [...Array(NUM_ROWS)].map(() => Array(NUM_COLS).fill(1));

  return (
    <>
      <Game initialValues={initialValues} initialCovers={initialCovers} />
    </>
  );
};
