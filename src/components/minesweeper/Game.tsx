import 'react';

import { Grid } from './Grid';
import './Game.css';

/**
 * Main component for the minesweeper game.
 */
export const Game = () => {
  return (
    <div className="minesweeper-container">
      <Grid numCols={10} numRows={10} />
    </div>
  );
};
