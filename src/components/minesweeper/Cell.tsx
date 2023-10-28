import 'react';

interface CellProps {
  value: number;
  cover: number;
}

/**
 * Cell component in a Minesweeper grid.
 */
export const Cell = ({ value, cover }: CellProps) => {
  if (cover) {
    return <div className="minesweeper-cell"></div>;
  } else {
    return <div className="minesweeper-cell">{value}</div>;
  }
};
