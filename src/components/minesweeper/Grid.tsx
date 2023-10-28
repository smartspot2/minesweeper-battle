import 'react';
import { Cell } from './Cell';

interface GridProps {
  numbers: number[][];
  covers: number[][];
}

/**
 * Minesweeper grid component.
 */
export const Grid = ({ numbers, covers }: GridProps) => {
  return (
    <div className="minesweeper-grid">
      {numbers.map((row, row_idx) => (
        <div className="minesweeper-grid-row" key={row_idx}>
          {row.map((cell, cell_idx) => (
            <Cell
              key={cell_idx}
              value={cell}
              cover={covers[row_idx][cell_idx]}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
