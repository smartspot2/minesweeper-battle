import 'react';
import React from 'react';

const CELL_COLOR = [
  '#C0C0C0',
  '#0100FE',
  '#017F01',
  '#FE0000',
  '#010080',
  '#810102',
  '#008081',
  '#000000',
  '#808080',
  '#FE0000',
];

interface CellProps {
  value: number;
  cover: number;
  onLeftClick: () => void;
  onRightClick: () => void;
}

/**
 * Cell component in a Minesweeper grid.
 */
export const Cell = ({
  value,
  cover,
  onLeftClick,
  onRightClick,
}: CellProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.button === 0) {
      onLeftClick();
    } else if (e.button === 2) {
      onRightClick();
    }
  };

  let cell_content = null;
  let cellClass = 'minesweeper-cell';

  if (cover === 0) {
    if (value === 9) {
      cell_content = '💣';
      cellClass += ' ' + 'minesweeper-cell-bomb';
    } else {
      if (value != 0) {
        cell_content = value;
      }
      cellClass += ' ' + 'minesweeper-cell-uncovered';
    }
  } else if (cover === 1) {
    cell_content = null;
    cellClass += ' ' + 'minesweeper-cell-covered';
  } else {
    cell_content = '🚩';
    cellClass += ' ' + 'minesweeper-cell-flag';
  }

  return (
    <div
      className={cellClass}
      onClick={handleClick}
      onContextMenu={handleClick}
      style={{
        color: CELL_COLOR[value],
      }}
    >
      {cell_content}
    </div>
  );
};
