import 'react';

import { Grid } from './Grid';
import './Game.css';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useState } from 'react';


interface GameProps {
  initial_values: number[][];
  initial_covers: number[][];
}

/**
 * Main component for the minesweeper game.
 */
export const Game = ({initial_values, initial_covers}: GameProps) => {
  const [values, setValues] = useState(initial_values);
  const [covers, setCovers] = useState(initial_covers);

  const onClick = (row: number, col: number) => {
    let new_covers = covers.map((row) => [...row]);

    const cover = covers[row][col];
    if (cover === 0) {
      // todo -- middle mouse click
      return;
    } else if (cover === 1) {
      expand(values, new_covers, row, col);
      if (values[row][col] === 9) {
        // hit mine -- death

      }
    } else if (cover === 2) {
      // flag -- no change
      return;
    }

    setCovers(new_covers);
  };

  const onFlag = (row: number, col: number) => {
    const cover = covers[row][col];
    let new_covers = covers.map((row) => [...row]);
    if (cover === 1) {
      new_covers[row][col] = 2;
    } else if (cover === 2) {
      new_covers[row][col] = 1;
    }
    setCovers(new_covers);
  };

  const onDisrupt = () => {

  };

  return (
    <div className="minesweeper-container">
      <Grid
        values={values}
        covers={covers}
        onClick={onClick}
        onFlag={onFlag}
      />
    </div>
  );
};


const expand = (values: number[][], covers: number[][], row: number, col: number) : void => {
  const N = values.length;
  const M = values[0].length;

  if (row < 0 || row >= N || col < 0 || col >= M) {
    return; // out of bounds
  }

  const cover = covers[row][col];
  const value = values[row][col];

  if (cover === 1) {
    covers[row][col] = 0;

    if (value === 0) {
      expand(values, covers, row - 1, col);
      expand(values, covers, row + 1, col);
      expand(values, covers, row, col + 1);
      expand(values, covers, row, col - 1);
    }
  }
};