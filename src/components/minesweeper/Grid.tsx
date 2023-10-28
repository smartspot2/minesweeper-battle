import 'react';
import { Cell } from './Cell';

interface GridProps {
  numbers: number[][];
  covers: number[][];
  onClick: (r: number, c: number, cover: number) => void;
}

/**
 * Minesweeper grid component.
 */
export const Grid = ({ numbers, covers, onClick }: GridProps) => {
  const handleClick = (r: number, c: number, cover: number) => {
    onClick(r, c, cover);
  };

  return (
    <div className="minesweeper-grid">
      {numbers.map((row, row_idx) => (
        <div className="minesweeper-grid-row" key={row_idx}>
          {row.map((cell, cell_idx) => (
            <Cell
              key={cell_idx}
              value={cell}
              cover={covers[row_idx][cell_idx]}
              onClick={(cover) => handleClick(row_idx, cell_idx, cover)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
