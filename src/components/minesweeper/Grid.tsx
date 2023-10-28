import 'react';
import { Cell } from './Cell';

interface GridProps {
  numRows: number;
  numCols: number;
}

/**
 * Minesweeper grid component.
 */
export const Grid = ({ numRows, numCols }: GridProps) => {
  return (
    <div className="minesweeper-grid">
      {[...Array(numRows)].map(() => (
        <div className="minesweeper-grid-row">
          {[...Array(numCols)].map(() => (
            <Cell />
          ))}
        </div>
      ))}
    </div>
  );
};
