import 'react';
import React from 'react';

interface CellProps {
  value: number;
  cover: number;
  onLeftClick: () => void;
  onRightClick: () => void;
}

/**
 * Cell component in a Minesweeper grid.
 */
export const Cell = ({ value, cover, onLeftClick, onRightClick }: CellProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.button === 0) {
      onLeftClick();
    } else if (e.button === 2) {
      onRightClick();
    }
  };

  let cell_content = null;

  if (cover === 0) {
    cell_content = value;
  } else if (cover === 1) {
    cell_content = null;
  } else {
    cell_content = "F";
  }

  return (
    <div className="minesweeper-cell" onClick={handleClick} onContextMenu={handleClick}>
      {cell_content}
    </div>
  );
};
