import 'react';

interface CellProps {
  value: number;
  cover: number;
  onClick: (cover: number) => void;
}

/**
 * Cell component in a Minesweeper grid.
 */
export const Cell = ({ value, cover, onClick }: CellProps) => {
  let cell_content = null;
  if (cover) {
    cell_content = value;
  }

  const handleClick = () => {
    onClick(cover ^ 1);
  };

  return (
    <div className="minesweeper-cell" onClick={handleClick}>
      {cell_content}
    </div>
  );
};
