import 'react';

import { Grid } from './Grid';
import './Game.css';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface GameProps {
  user: string;
}

/**
 * Main component for the minesweeper game.
 */
export const Game = ({ user }: GameProps) => {
  const grid = useQuery(api.queries.grid.getGrid, { user: user });

  if (grid == null) {
    return <div className="minesweeper-container">Loading...</div>;
  }

  return (
    <div className="minesweeper-container">
      <Grid numbers={grid.state.numbers} covers={grid.state.covers} />
    </div>
  );
};
