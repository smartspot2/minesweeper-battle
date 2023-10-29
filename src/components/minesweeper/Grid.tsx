import 'react';
import { Cell } from './Cell';

interface GridProps {
  values: number[][];
  covers: number[][];
  onClick: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
}

/**
 * Minesweeper grid component
 */
export const Grid = ({ values, covers, onClick, onFlag }: GridProps) => {
  const handleLeftClick = (row: number, col: number) => {
    onClick(row, col);
  };

  const handleRightClick = (row: number, col: number) => {
    onFlag(row, col);
  };

  return (
    <div className="minesweeper-grid">
      {values.map((row, row_index) => (
        <div className="minesweeper-grid-row" key={row_index}>
          {row.map((cell, col_index) => (
            <Cell
              key={col_index}
              value={cell}
              cover={covers[row_index][col_index]}
              onLeftClick={() => handleLeftClick(row_index, col_index)}
              onRightClick={() => handleRightClick(row_index, col_index)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
