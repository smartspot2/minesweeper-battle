import 'react';

import { Grid } from './Grid';
import './Game.css';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface GameProps {
  user: string;
}

/**
 * Main component for the minesweeper game.
 */
export const Game = ({ user }: GameProps) => {
  const grid = useQuery(api.queries.grid.getGrid, { user: user });
  const updateGrid = useMutation(api.mutations.grid.mutateGrid);

  if (grid == null) {
    return <div className="minesweeper-container">Loading...</div>;
  }

  const handleClick = (r: number, c: number, cover: number) => {
    const updated_covers = grid.state.covers.map((row, row_idx) =>
      row.map((cell, cell_idx) => {
        if (row_idx == r && cell_idx == c) {
          return cover;
        } else {
          return cell;
        }
      }),
    );
    updateGrid({
      grid_id: grid._id,
      state: {
        numbers: grid.state.numbers,
        covers: updated_covers,
      },
    });
  };

  return (
    <div className="minesweeper-container">
      <Grid
        numbers={grid.state.numbers}
        covers={grid.state.covers}
        onClick={handleClick}
      />
    </div>
  );
};
